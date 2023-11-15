import { defineStore } from "pinia";
import { Settings } from "~/types/settings";
import localforage from "localforage";
import { BolusParams, BolusRecord } from "~/types/bolus";
import dayjs from "dayjs";
const defaultParams = () => ({
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
    };
  },
  getters: {
    lastBolus(state): BolusRecord | undefined {
      return state.bolusHistory?.length
        ? state.bolusHistory[state.bolusHistory.length - 1]
        : undefined;
    },
    lastBolusTimeDisplay(): string | undefined {
      return this.lastBolus?.ts
        ? dayjs(this.lastBolus.ts).format("hh:mm A, DD MMM")
        : undefined;
    },
  },
  actions: {
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
    async saveParams(params?: BolusParams) {
      const value = params ? params : this.params;
      await localforage.setItem("bolus-params", JSON.stringify(value));
    },
    async loadParams() {
      this.isLoading = true;
      try {
        const params = await localforage.getItem<string>("bolus-params");
        this.params = params
          ? (JSON.parse(params) as BolusParams)
          : defaultParams();
        return this.params;
      } finally {
        this.isLoading = false;
      }
    },
    async getInsulinOnBoardRatio() {
      const settingStore = useSettingsStore();
      const settings = await settingStore.getSettings();
      if (!settings?.insulinDuration || !this.lastBolus) {
        return 0;
      }
      const { ts } = this.lastBolus;
      if (!ts) {
        return 0;
      }
      const insulinDurationInHours = Number(settings.insulinDuration); // hrs
      const insulinDuration = insulinDurationInHours * 60;

      const timeSinceLastBolus = dayjs().diff(dayjs(ts), "minute");

      if (timeSinceLastBolus > insulinDuration) {
        return 0;
      }
      return Number((insulinDuration - timeSinceLastBolus) / insulinDuration);
    },

    async getInsulinOnBoard() {
      if (!this.lastBolus?.actualBolus) {
        return 0;
      }
      const insulinOnBoardRatio = await this.getInsulinOnBoardRatio();
      //  inculin onboard / total insulin = time left / insulin duration
      const result = insulinOnBoardRatio * this.lastBolus.actualBolus;
      return Number(result.toFixed(4));
    },
  },
});
