<template>
  <ClientOnly>
    <GoHeaderBar>
      <div slot="actions">
        <GoButton
          class="mr-2"
          @click="openCalculatorDialog"
          round
          variant="primary"
          aria-label="Open Bolus Calculator"
        >
          <GoIcon name="calculate" decorative />
          Calculator
        </GoButton>
        <GoButton
          class="mr-2"
          @click="openSettingsDialog"
          icon
          outline-fill
          round
          variant="secondary"
          aria-label="Settings"
        >
          <GoIcon name="settings" decorative />
        </GoButton>
        <GoButton
          @click="openBolusParamsDialog"
          icon
          outline-fill
          round
          variant="success"
          aria-label="Bolus Parameters"
        >
          <GoIcon name="tune" decorative />
        </GoButton>
      </div>
    </GoHeaderBar>

    <Dashboard v-if="settingsStore.settings?.insulinDuration" />

    <GoDialog ref="settingsDialog" persistent heading="Settings">
      <SettingsForm @close="closeSettingsDialog" />
    </GoDialog>

    <GoDialog ref="bolusParamsDialog" persistent heading="Bolus Parameters">
      <BolusParamsForm @close="closeBolusParamsDialog" />
    </GoDialog>

    <GoDialog ref="calculatorDialog" persistent heading="Bolus Calculator">
      <Calculator @close="closeCalculatorDialog" />
    </GoDialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import { GoButton, GoDialog, GoHeaderBar, GoIcon } from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";

useHead({
  htmlAttrs: {
    lang: "en",
    "data-theme": "light",
  },
});

const settingsStore = useSettingsStore();

const settingsDialog = ref(null);
const bolusParamsDialog = ref(null);
const calculatorDialog = ref(null);

const openSettingsDialog = () => {
  (settingsDialog.value as any).$el.open();
};
const openBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.open();
};
const openCalculatorDialog = () => {
  (calculatorDialog.value as any).$el.open();
};

const closeSettingsDialog = () => {
  (settingsDialog.value as any).$el.close();
};
const closeBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.close();
};
const closeCalculatorDialog = () => {
  (calculatorDialog.value as any).$el.close();
};

onMounted(async () => {
  const settings = await settingsStore.getSettings();
  if (!settings && settingsDialog.value) {
    (settingsDialog.value as any).$el.open();
  }
});
</script>
