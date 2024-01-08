<template>
  <ClientOnly>
    <AppHeader
      @openCalculatorDialog="openCalculatorDialog"
      @openSettingsDialog="openSettingsDialog"
      @openBolusParamsDialog="openBolusParamsDialog"
    />
    <GoOverlay v-if="globalLoading">
      <GoSpinner></GoSpinner>
    </GoOverlay>

    <Dashboard
      v-else
      @open-params-dialog="openBolusParamsDialog"
      @open-settings="openSettingsDialog"
      @openCalculatorDialog="openCalculatorDialog"
    />

    <GoDialog ref="bolusParamsDialog" heading="Bolus Parameters">
      <BolusParamsForm @close="closeBolusParamsDialog" />
    </GoDialog>

    <GoDialog ref="calculatorDialog" persistent heading="Bolus Calculator">
      <Calculator @close="closeCalculatorDialog" />
    </GoDialog>

    <GoDialog ref="settingsDialog" persistent heading="Settings">
      <SettingsForm @close="closeSettingsDialog" />
    </GoDialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import { GoDialog, GoSpinner, GoOverlay } from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";
import { defaultParams, useBolusStore } from "@/stores/bolus.store";
import { isEqual } from "lodash-es";

useSeoMeta({
  title: "Bolus calculator",
  ogTitle: "Bolus calculator",
  description: "A simple bolus calculator app",
  ogDescription: "A simple bolus calculator app",
  themeColor: "#5c5adc",
});

const user = useSupabaseUser();

// If you want to use it in setup, import from the nuxtApp.
const settingsStore = useSettingsStore();
const bolusStore = useBolusStore();
const globalLoading = ref(true);

const { settings } = storeToRefs(settingsStore);
const { params } = storeToRefs(bolusStore);

const load = async () => {
  globalLoading.value = true;
  try {
    await settingsStore.loadSettings();
    await bolusStore.loadParams();
    await bolusStore.loadBolusHistory();
  } finally {
    globalLoading.value = false;
  }
};
onMounted(async () => {
  await load();
});

watchEffect(() => {
  if (!globalLoading.value) {
    if (!settings.value) {
      settingsStore.initialiseSettings();
      openSettingsDialog();
      return;
    }

    if (isEqual(params.value, defaultParams())) {
      openBolusParamsDialog();
      return;
    }
  }
});

const bolusParamsDialog = ref(null);
const calculatorDialog = ref(null);
const settingsDialog = ref(null);

const openBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.open();
};
const openCalculatorDialog = () => {
  (calculatorDialog.value as any).$el.open();
};

const closeBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.close();
};
const closeCalculatorDialog = async () => {
  (calculatorDialog.value as any).$el.close();
  await load();
};

const openSettingsDialog = () => {
  (settingsDialog.value as any).$el.open();
};
const closeSettingsDialog = () => {
  (settingsDialog.value as any).$el.close();
};
</script>
