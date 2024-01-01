<template>
  <div>
    <p class="mb-2">
      Data last synced at
      <strong>
        {{ syncStore.lastSyncTs || "N/A" }}
      </strong>
    </p>
    <div>
      <GoSwitch
        v-model="syncStore.alwaysSync"
        label="Automatic sync data"
        show-on-off
      />
    </div>
    <div class="mt-2 mb-2">
      <GoButton variant="primary" block="all" @click="syncStore.syncData">
        Back up my data
      </GoButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoButton, GoSwitch } from "@go-ui/vue";
const syncStore = useSyncStore();
</script>
