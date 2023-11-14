import { defineStore } from "pinia";
import { Settings } from "~/types/settings";
import localforage from "localforage";
import { BolusParams } from "~/types/bolus";
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
    };
  },
  actions: {
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
  },
});
