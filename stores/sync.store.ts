import { defineStore } from "pinia";

export const useSyncStore = defineStore("sync", {
  state: () => {
    return {
      alwaysSync: false,
      lastSyncTs: null as Date | null,
    };
  },
  actions: {
    syncData() {
      this.lastSyncTs = new Date();
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
