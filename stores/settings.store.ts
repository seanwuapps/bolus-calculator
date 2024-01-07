import { defineStore } from "pinia";
import { Settings } from "~/types/settings";
import localforage from "localforage";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      isLoading: false,
      settings: null as Settings | null,
      lastSync: null as Date | null,
    };
  },
  actions: {
    /**
     * Save settings into indexedDb
     * @param settings - settings
     */
    async saveSettings(settings: Settings) {
      await localforage.setItem("settings", JSON.stringify(settings));
    },
    async loadSettings() {
      this.isLoading = true;
      try {
        const settings = await localforage.getItem<string>("settings");
        this.settings = settings ? (JSON.parse(settings) as Settings) : null;
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
    async sync() {
      const user = useSupabaseUser();
      if (!user.value) {
        return;
      }
      console.log(user.value.id);

      this.lastSync = new Date();
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
