<template>
  <ClientOnly>
    <GoHeaderBar>
      <div slot="actions">
        <GoButton
          @click="openSettingsDialog"
          icon
          outline-fill
          round
          variant="secondary"
          aria-label="Settings"
        >
          <GoIcon name="settings" decorative />
        </GoButton>
      </div>
    </GoHeaderBar>
    <div class="container">
      <pre>{{ settings }}</pre>
    </div>

    <GoDialog ref="settingsDialog" heading="Settings">
      <SettingsForm />
    </GoDialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import { GoButton, GoDialog, GoHeaderBar, GoIcon } from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";

const settingsStore = useSettingsStore();

const { settings } = storeToRefs(settingsStore);

const settingsDialog = ref(null);

const openSettingsDialog = () => {
  (settingsDialog.value as any).$el.open();
};

onMounted(async () => {
  const settings = await settingsStore.getSettings();
  if (!settings && settingsDialog.value) {
    (settingsDialog.value as any).$el.open();
  }
});
</script>
