<template>
  <NuxtPwaManifest />
  <!-- <VitePwaManifest /> -->
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
  --go-heading-font-family: "Oswald", sans-serif;
  --go-body-font-family: "Montserrat", sans-serif;
}
h1,
h2 {
  text-transform: uppercase;
  font-weight: 700 !important;
}
</style>
