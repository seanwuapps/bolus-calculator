<template>
  <div>
    <!-- <div class="mb-2">
      <GoButton variant="primary" @click="syncStore.syncData">
        Sync all now
      </GoButton>
    </div> -->
    <div class="d-flex gap-2 mb-2">
      <GoButton
        @click="settingsStore.sync"
        :loading="settingsStore.isSyncing"
        variant="secondary"
      >
        Sync settings
      </GoButton>
      <Timestamp :ts="settingsStore.lastSync" />
    </div>

    <div class="d-flex gap-2 mb-2">
      <GoButton
        @click="bolusStore.syncParams"
        :loading="bolusStore.isSyncing"
        variant="success"
      >
        Sync bolus parameters
      </GoButton>
      <Timestamp :ts="bolusStore.lastParamsSync" />
    </div>

    <div class="d-flex gap-2 mb-2">
      <GoButton variant="primary"> Sync bolus records </GoButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoButton, GoSwitch } from "@go-ui/vue";
const settingsStore = useSettingsStore();
const bolusStore = useBolusStore();
</script>
