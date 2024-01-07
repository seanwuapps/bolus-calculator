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
<style lang="scss">
:root {
  --go-heading-font-family: "Raleway", sans-serif;
}
</style>
