<template>
  <ClientOnly>
    <GoHeaderBar>
      <div slot="actions">
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
    <div class="container">
      <Calculator />
    </div>

    <GoDialog ref="settingsDialog" persistent heading="Settings">
      <SettingsForm @close="closeSettingsDialog" />
    </GoDialog>

    <GoDialog ref="bolusParamsDialog" persistent heading="Bolus Parameters">
      <BolusParamsForm @close="closeBolusParamsDialog" />
    </GoDialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import { GoButton, GoDialog, GoHeaderBar, GoIcon } from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";

const settingsStore = useSettingsStore();

const { settings } = storeToRefs(settingsStore);

const settingsDialog = ref(null);
const bolusParamsDialog = ref(null);

const openSettingsDialog = () => {
  (settingsDialog.value as any).$el.open();
};
const openBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.open();
};

const closeSettingsDialog = () => {
  (settingsDialog.value as any).$el.close();
};
const closeBolusParamsDialog = () => {
  (bolusParamsDialog.value as any).$el.close();
};

onMounted(async () => {
  const settings = await settingsStore.getSettings();
  if (!settings && settingsDialog.value) {
    (settingsDialog.value as any).$el.open();
  }
});
</script>
