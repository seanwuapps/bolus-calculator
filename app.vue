<template>
  <VitePwaManifest />
  <NuxtPage />
</template>
<script setup lang="ts">
useSeoMeta({
  title: "Bolus calculator",
  ogTitle: "Bolus calculator",
  description: "A simple bolus calculator app",
  ogDescription: "A simple bolus calculator app",
  themeColor: "#5c5adc",
});
</script>
<style lang="scss">
:root {
  --go-heading-font-family: "Raleway", sans-serif;
}
</style>
