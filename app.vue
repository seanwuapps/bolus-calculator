<template>
  <div class="d-flex justify-content-center" v-if="$pwa && $pwa.needRefresh">
    <button @click="$pwa?.updateServiceWorker()">Update</button>
  </div>
  <VitePwaManifest />
  <NuxtPage />
</template>
<script setup lang="ts">
// If you want to use it in setup, import from the nuxtApp.
const { $pwa } = useNuxtApp();

onMounted(() => {
  if ($pwa.offlineReady) {
    console.log("[sw] App ready to work offline");
  }
});
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
