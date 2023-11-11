import { defineStore } from "pinia";
import { Settings } from "~/types/settings";
import localforage from "localforage";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      isLoading: false,
      settings: null as Settings | null,
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
    async getSettings() {
      this.isLoading = true;
      try {
        const settings = await localforage.getItem<string>("settings");
        this.settings = settings ? (JSON.parse(settings) as Settings) : null;
        return this.settings;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
