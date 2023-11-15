<template>
  <!-- settings form -->
  <form v-if="settings">
    <GoInput
      label="Min. glucose for calculation"
      hint="Minimum glucose level to be considered for calculation"
      type="number"
      v-model="settings.minBG"
    >
      <div slot="suffix">mmol/L</div>
    </GoInput>

    <GoInput
      label="Max. bolus suggestion"
      hint="Maximum bolus can be suggested"
      type="number"
      v-model="settings.maxBolus"
    >
      <div slot="suffix">U</div>
    </GoInput>

    <GoInput
      label="Insulin duration"
      hint="How long does insulin last"
      v-model="settings.insulinDuration"
      type="number"
      step="0.1"
    >
      <div slot="suffix">hours</div>
    </GoInput>
    <hr />
    <GoButtonGroup>
      <GoButton variant="primary" @click="saveSettings"> Save </GoButton>
      <GoButton variant="text" flat @click="$emit('close')"> Close </GoButton>
    </GoButtonGroup>
  </form>
</template>

<script setup lang="ts">
import { GoButton, GoButtonGroup, GoInput } from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";
const emit = defineEmits(["close"]);
const settingsStore = useSettingsStore();

const { settings } = storeToRefs(settingsStore);
onMounted(async () => {
  await settingsStore.getSettings();

  if (!settings.value) {
    settings.value = {
      minBG: "",
      maxBolus: "",
      insulinDuration: "",
    };
  }
});

const saveSettings = () => {
  if (settings.value) {
    settingsStore.saveSettings(settings.value);
    emit("close");
  }
};
</script>
