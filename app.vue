<template>
  <VitePwaManifest />
  <ClientOnly>
    <GoDarkMode />
  </ClientOnly>
  <NuxtPage />
</template>
<script lang="ts" setup>
import { GoDarkMode } from "@go-ui/vue";
</script>
