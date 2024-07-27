import { defineStore } from "pinia";
import localforage from "localforage";
import { BolusParams, BolusRecord, CurrentBolusParams } from "~/types/bolus";
import dayjs from "dayjs";

/**
 * Get active insulin ratio from a single bolus record
 */
const getActiveInsulinRatio = (
  initialDurationSetting: number,
  bolusRecord: BolusRecord
): number => {
  const { ts } = bolusRecord;

  const durationMinutes = initialDurationSetting * 60; // convert hrs to minutes

  const timeSinceLastBolus = dayjs().diff(dayjs(ts), "minute");

  if (timeSinceLastBolus > durationMinutes) {
    return 0;
  }
  return Number((durationMinutes - timeSinceLastBolus) / durationMinutes);
};

const isCurrent = (
  item: { start: string; end: string; value: string },
  now: dayjs.Dayjs,
  currentDate: string
) => {
  const start = dayjs(`${currentDate} ${item.start}`);
  const end = dayjs(`${currentDate} ${item.end}`);
  return (
    start.isSame(now, "minute") || (start.isBefore(now) && end.isAfter(now))
  );
};

export const defaultParams = () => ({
  targetBGs: [],
  icrs: [],
  isfs: [],
});
export const useBolusStore = defineStore("bolus", {
  state: () => {
    return {
      isLoading: false,
      params: { ...defaultParams() } as BolusParams,
      currentBG: undefined as string | undefined,
      currentCarbs: undefined as string | undefined,
      suggestedBolus: undefined as number | undefined,
      actualBolus: undefined as number | undefined,
      bolusHistory: undefined as BolusRecord[] | undefined,
      paramOverrides: undefined as CurrentBolusParams | undefined,
      isSyncing: false,
      lastParamsSync: null as Date | null,
    };
  },
  getters: {
    lastBolus(state): BolusRecord | undefined {
      return state.bolusHistory?.length
        ? state.bolusHistory[state.bolusHistory.length - 1]
        : undefined;
    },

    affectiveBoluses(state): BolusRecord[] {
      const settingStore = useSettingsStore();
      if (
        !settingStore.settings?.insulinDuration ||
        !this.bolusHistory?.length
      ) {
        return [];
      }

      const affectiveTime = dayjs().subtract(
        Number(settingStore.settings.insulinDuration),
        "hours"
      );

      return (
        state.bolusHistory?.filter((record) => {
          return dayjs(record.ts).isAfter(affectiveTime);
        }) || []
      );
    },

    /**
     * Get sum of all active insulin from previous bolus records
     */
    activeInsulinRecords(): Record<string, unknown>[] {
      const settingStore = useSettingsStore();
      if (!settingStore.settings?.insulinDuration) {
        return [];
      }

      const insulinDurationSetting = Number(
        settingStore.settings.insulinDuration
      );
      /**
       * all records are too old, no active inculin
       */
      if (!this.affectiveBoluses) {
        return [];
      }

      return this.affectiveBoluses.map((bolus) => {
        const activeInsulinRatio = getActiveInsulinRatio(
          insulinDurationSetting,
          bolus
        );

        const insulinOnBoard = Number(
          (activeInsulinRatio * bolus.actualBolus).toFixed(2)
        );

        return {
          ...bolus,
          activeInsulinRatio,
          insulinOnBoard,
        };
      });
    },

    /**
     * sum of all active insulins
     */
    currentInsulinOnBoard(): number {
      const insulinOnBoard = this.activeInsulinRecords.reduce(
        (accumulator, currentValue) => {
          return accumulator + Number(currentValue.insulinOnBoard);
        },
        0
      );
      return Number(insulinOnBoard.toFixed(2));
    },
    lastBolusTimeDisplay(): string | undefined {
      return this.lastBolus?.ts
        ? dayjs(this.lastBolus.ts).format("hh:mm A, DD MMM")
        : undefined;
    },
  },
  actions: {
    getCurrentParams(): CurrentBolusParams {
      const now = dayjs();
      const currentDate = now.format("YYYY-MM-DD");
      // find the current targetBG
      const currentTargetBG = this.params.targetBGs?.find((item) =>
        isCurrent(item, now, currentDate)
      );
      const currentICR = this.params.icrs?.find((item) =>
        isCurrent(item, now, currentDate)
      );
      const currentISF = this.params.isfs?.find((item) =>
        isCurrent(item, now, currentDate)
      );
      return {
        targetBG: currentTargetBG,
        icr: currentICR,
        isf: currentISF,
      };
    },
    async saveBolus(targetBG: any, icr: any, isf: any) {
      if (
        !this.currentBG ||
        !this.currentCarbs ||
        !this.suggestedBolus ||
        !this.actualBolus
      ) {
        return;
      }

      const record: BolusRecord = {
        ts: new Date(),
        targetBG,
        icr,
        isf,
        bg: Number(this.currentBG),
        carbs: Number(this.currentCarbs),
        suggestedBolus: this.suggestedBolus,
        actualBolus: this.actualBolus,
      };

      if (!this.bolusHistory) {
        this.bolusHistory = [];
      }

      this.bolusHistory.push(record);

      await localforage.setItem(
        "bolus-history",
        JSON.stringify(this.bolusHistory)
      );
    },
    async loadBolusHistory() {
      this.isLoading = true;
      try {
        const history = await localforage.getItem<string>("bolus-history");
        this.bolusHistory = history
          ? (JSON.parse(history) as BolusRecord[])
          : [];
        return this.bolusHistory;
      } finally {
        this.isLoading = false;
      }
    },
    resetCalculation() {
      this.currentBG = undefined;
      this.suggestedBolus = undefined;
      this.actualBolus = undefined;
    },
    async quickSaveParams() {
      if (!this.paramOverrides) {
        return;
      }

      let params = { ...this.params };
      Object.entries(this.paramOverrides).forEach(([type, override]) => {
        params[`${type as keyof CurrentBolusParams}s`] = params[
          `${type as keyof CurrentBolusParams}s`
        ].map((item) => {
          if (item.start === override.start) {
            return override;
          }
          return item;
        });
      });
      console.log({ params });
      await this.saveParams(params);

      await this.loadParams();
    },
    async saveParams(params?: BolusParams) {
      const value = params ? params : this.params;
      this.params = value;

      await localforage.setItem("bolus-params", JSON.stringify(value));
      const user = useSupabaseUser();
      if (user.value) {
        await this.syncParams();
      }
    },
    async loadParams() {
      this.isLoading = true;
      try {
        const localParams = await localforage.getItem<string>("bolus-params");
        let temp = localParams
          ? (JSON.parse(localParams) as BolusParams)
          : null;
        const user = useSupabaseUser();

        if (user.value) {
          const params = await this.fetchParams();
          temp = params?.data ? params.data : temp;
        }

        if (!temp) {
          temp = defaultParams();
        }
        this.params = temp;
        return this.params;
      } finally {
        this.isLoading = false;
      }
    },

    async exportParams() {
      const filename = "bolus-params.json";
      const jsonStr = JSON.stringify(this.params);
      downloadFile(filename, jsonStr);
    },

    async fetchParams(): Promise<any> {
      const user = useSupabaseUser();
      if (!user.value) {
        return null;
      }
      const client = useSupabaseClient();
      // fetch user settings from settings table
      const { data, error } = await client
        .from("bolus_params")
        .select()
        .eq("user_id", user.value.id)
        .order("id")
        .limit(1)
        .single();
      return data;
    },
    async syncParams() {
      this.isSyncing = true;

      const user = useSupabaseUser();
      if (!user.value) {
        return;
      }
      try {
        console.log(user.value.id);
        const supabase = useSupabaseClient();
        const params = await this.fetchParams();
        console.log(params);
        //@ts-ignore
        const { data, error } = await supabase
          .from("bolus_params")
          .upsert({
            id: params?.id ? params.id : undefined,
            user_id: user.value.id,
            data: this.params,
            last_sync_at: new Date(),
          })
          .select()
          .limit(1)
          .single();
        console.log(data);
        if (error) {
          throw new Error(error.message);
          return;
        }

        //@ts-ignore
        this.lastParamsSync = dayjs(data.last_sync_at).toDate();
      } catch (e) {
        console.log(e);
      } finally {
        this.isSyncing = false;
      }
    },
  },
});
