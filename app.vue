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

    <Dashboard />

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

const bolusParamsDialog = ref(null);
const calculatorDialog = ref(null);

const openBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.open();
};
const openCalculatorDialog = () => {
  (calculatorDialog.value as any).$el.open();
};

const closeBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.close();
};
const closeCalculatorDialog = () => {
  (calculatorDialog.value as any).$el.close();
};
</script>
