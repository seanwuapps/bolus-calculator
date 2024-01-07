<template>
  <div>
    <div class="mb-2">
      <GoSwitch label="Automatic sync data" show-on-off />
    </div>

    <!-- <div class="mb-2">
      <GoButton variant="primary" @click="syncStore.syncData">
        Sync all now
      </GoButton>
    </div> -->
    <div class="mb-2">
      <GoButton variant="secondary"> Sync settings </GoButton>
      <Timestamp :ts="settingsStore.lastSync" />
    </div>

    <div class="mb-2">
      <GoButton variant="success"> Sync bolus parameters </GoButton>
    </div>

    <div class="mb-2">
      <GoButton variant="primary"> Sync bolus records </GoButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoButton, GoSwitch } from "@go-ui/vue";
const settingsStore = useSettingsStore();
</script>
