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
      label="Insulin to Carbohydrate Ratio (ICR)"
      hint="The number of grams of carbohydrates that is covered by 1 unit of insulin"
      type="number"
      v-model="settings.icr"
    >
      <div slot="prefix">1 unit for</div>

      <div slot="suffix">g</div>
    </GoInput>

    <GoInput
      label="Insulin Sensitivity Factor (ISF)"
      hint="How powerful 1 unit of insulin is in your body"
      type="number"
      v-model="settings.isf"
    >
      <div slot="prefix">1 unit for</div>
      <div slot="suffix">mmol/L</div>
    </GoInput>

    <GoInput
      label="Target glucose level"
      v-model="settings.targetBG"
      type="number"
      step="0.1"
    >
      <div slot="suffix">mmol/L</div>
    </GoInput>

    <GoInput
      label="Insulin duration"
      hint="How long does insulin last"
      v-model="settings.insulineDuration"
      type="number"
      step="0.1"
    >
      <div slot="suffix">hours</div>
    </GoInput>

    <GoButton variant="primary" block="all" @click="saveSettings">
      Save
    </GoButton>
  </form>
</template>

<script setup lang="ts">
import { GoButton, GoInput } from "@go-ui/vue";
import { Settings } from "@/types/settings";
import { useSettingsStore } from "@/stores/settings.store";

const settingsStore = useSettingsStore();

const { settings } = storeToRefs(settingsStore);
onMounted(async () => {
  await settingsStore.getSettings();

  if (!settings.value) {
    settings.value = {
      minBG: "",
      maxBolus: "",
      targetBG: "",
      icr: "",
      isf: "",
      insulineDuration: "",
    };
  }
});

const saveSettings = () => {
  if (settings.value) {
    settingsStore.saveSettings(settings.value);
  }
};
</script>
