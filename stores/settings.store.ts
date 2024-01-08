import { defineStore } from "pinia";
import { Settings } from "~/types/settings";
import localforage from "localforage";
import dayjs from "dayjs";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      isLoading: false,
      settings: null as Settings | null,
      lastSync: null as Date | null,
      isSyncing: false,
    };
  },
  actions: {
    /**
     * Save settings into indexedDb
     * @param settings - settings
     */
    async saveSettings(settings: Settings) {
      await localforage.setItem("settings", JSON.stringify(settings));
      const user = useSupabaseUser();
      if (user.value) {
        await this.sync();
      }
    },
    async loadSettings() {
      this.isLoading = true;
      try {
        const user = useSupabaseUser();

        const data = await localforage.getItem<string>("settings");
        let settings = data ? (JSON.parse(data) as Settings) : null;

        if (user.value) {
          // logged in, fetch from supabase
          const data = await this.fetchSettings();
          console.log({ data });
          if (data) {
            settings = data?.data;
          }
        }
        this.settings = settings;
        return this.settings;
      } finally {
        this.isLoading = false;
      }
    },
    initialiseSettings() {
      this.settings = {
        minBG: "",
        maxBolus: "",
        insulinDuration: "",
      };
    },
    async fetchSettings(): Promise<any> {
      const user = useSupabaseUser();
      if (!user.value) {
        return null;
      }
      const client = useSupabaseClient();
      // fetch user settings from settings table
      const { data, error } = await client
        .from("settings")
        .select()
        .eq("user_id", user.value.id)
        .order("id")
        .limit(1)
        .single();
      return data;
    },
    async sync() {
      this.isSyncing = true;

      const user = useSupabaseUser();
      if (!user.value) {
        return;
      }
      try {
        console.log(user.value.id);
        const supabase = useSupabaseClient();
        const settings = await this.fetchSettings();
        console.log(settings);
        //@ts-ignore
        const { data, error } = await supabase
          .from("settings")
          .upsert({
            id: settings?.id ? settings.id : undefined,
            user_id: user.value.id,
            data: this.settings,
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
        this.lastSync = dayjs(data.last_sync_at).toDate();
      } catch (e) {
        console.log(e);
      } finally {
        this.isSyncing = false;
      }
    },
  },
});
