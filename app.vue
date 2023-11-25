<template>
  <VitePwaManifest />
  <ClientOnly>
    <GoHeaderBar>
      <div slot="actions">
        <GoButtonGroup>
          <GoButton
            @click="openCalculatorDialog"
            variant="primary"
            aria-label="Open Bolus Calculator"
            icon
          >
            <GoIcon name="calculate" decorative />
          </GoButton>
          <GoButton
            @click="openBolusParamsDialog"
            variant="success"
            aria-label="Bolus Parameters"
            icon
          >
            <GoIcon name="tune" decorative />
          </GoButton>
        </GoButtonGroup>
      </div>
    </GoHeaderBar>

    <Dashboard @open-params-dialog="openBolusParamsDialog" />

    <GoDialog ref="bolusParamsDialog" heading="Bolus Parameters">
      <BolusParamsForm @close="closeBolusParamsDialog" />
    </GoDialog>

    <GoDialog ref="calculatorDialog" persistent heading="Bolus Calculator">
      <Calculator @close="closeCalculatorDialog" />
    </GoDialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import {
  GoButton,
  GoDialog,
  GoHeaderBar,
  GoIcon,
  GoButtonGroup,
} from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";

useHead({
  htmlAttrs: {
    lang: "en",
    "data-theme": "light",
  },
});
// If you want to use it in setup, import from the nuxtApp.
const settingsStore = useSettingsStore();
const bolusStore = useBolusStore();

const load = async () => {
  await settingsStore.loadSettings();
  await bolusStore.loadParams();
  await bolusStore.loadBolusHistory();
};
onMounted(async () => {
  await load();

  setInterval(async () => {
    await load();
  }, 5000);
});

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
