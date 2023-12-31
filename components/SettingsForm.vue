<template>
  <div>
    <GoDarkMode
      ref="themer"
      @themechange="(e) => (currentTheme = e.detail.theme)"
    />
    <GoSwitch
      :checked="currentTheme === 'dark'"
      label="Dark Mode"
      @change="onThemeChange"
      full-width
      show-on-off
      slot="logo"
    ></GoSwitch>

    <!-- settings form -->
    <form v-if="settings">
      <GoInput
        label="Min. glucose for calculation"
        hint="Minimum glucose level to be considered for calculation"
        type="number"
        v-model="settings.minBG"
        step="0.1"
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
  </div>
</template>

<script setup lang="ts">
import {
  GoButton,
  GoButtonGroup,
  GoInput,
  GoSwitch,
  GoDarkMode,
} from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";
const emit = defineEmits(["close"]);
const settingsStore = useSettingsStore();

const { settings } = storeToRefs(settingsStore);
onMounted(async () => {
  if (!settings.value) {
    settingsStore.initialiseSettings();
  }
});

const saveSettings = () => {
  if (settings.value) {
    settingsStore.saveSettings(settings.value);
    emit("close");
  }
};

const currentTheme = ref("light");

const themer = ref(null);

const onThemeChange = (e: Event) => {
  const isDark = (e.target as HTMLInputElement).checked;
  (themer.value as any).$el.setTheme(isDark ? "dark" : "light");
};
</script>
