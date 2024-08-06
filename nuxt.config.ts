// https://nuxt.com/docs/api/configuration/nuxt-config

const sw = process.env.SW === "true";
export default defineNuxtConfig({
  devServer: {
    https: {
      key: "./localhost-key.pem",
      cert: "./localhost.pem",
    },
  },
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "Bolus calculator",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
      ],
    },
  },
  css: [
    "@go-ui/vue/dist/go-ui.css",
    "material-design-icons-iconfont/dist/material-design-icons.css",
  ],
  typescript: {
    typeCheck: true,
  },
  modules: [
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@nuxtjs/supabase",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
  ],
  supabase: {
    redirect: false,
  },
  pwa: {
    manifest: {
      name: "Bolus Calculator",
      short_name: "Bolus Calculator",
      theme_color: "#23219d",
      display: "standalone",
      start_url: "/",
      scope: "/",
      id: "/",
      description: "Bolus calculator",
      orientation: "natural",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,json,woff2,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,json,woff2,css,html,png,svg,ico}"],
    },
    strategies: sw ? "injectManifest" : "generateSW",
    srcDir: sw ? "service-worker" : undefined,
    filename: sw ? "sw.ts" : undefined,
    registerType: "autoUpdate",
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
  googleFonts: {
    families: {
      Oswald: true,
      Montserrat: true,
    },
  },
});
