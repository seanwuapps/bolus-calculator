<template>
  <div>
    <div v-if="bolusStore.paramOverrides">
      <template v-for="(override, type) in bolusStore.paramOverrides">
        <div class="change-group" v-if="override">
          <h3>{{ OVERRIDE_TYPE_LABELS[type] }}</h3>
          <p>Time slot: {{ override.start }} - {{ override.end }}</p>

          <h4 class="h6">Value change</h4>
          <p class="h2">
            <span class="visually-hidden">From</span>
            {{ currentParams[type]?.value || "N/A" }}
            <span class="visually-hidden">to</span>
            <GoIcon name="trending_flat" decorative /> {{ override.value }}
          </p>
        </div>
      </template>
    </div>

    <hr />

    <GoButtonGroup>
      <GoButton variant="primary" @click="handleSave">Confirm</GoButton>
      <GoButton variant="text" flat @click="emit('close')">Close</GoButton>
    </GoButtonGroup>
  </div>
</template>

<script setup lang="ts">
import { GoButton, GoButtonGroup, GoIcon, GoInput } from "@go-ui/vue";
import { useSettingsStore } from "@/stores/settings.store";
const emit = defineEmits(["close"]);

const settingsStore = useSettingsStore();
const bolusStore = useBolusStore();

const { currentParams } = storeToRefs(bolusStore);
const OVERRIDE_TYPE_LABELS = {
  targetBG: "Target BG",
  icr: "ICR",
  isf: "ISF",
};

const handleSave = () => {
  bolusStore.quickSaveParams();
  emit("close");
};
</script>

<style lang="scss" scoped>
.change-group {
  margin-bottom: 2rem;
  text-align: center;
}
</style>
