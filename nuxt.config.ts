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
    devOptions: {
      enabled: true,
      navigateFallback: "index.html",
      suppressWarnings: true,
      type: "module",
    },
    registerType: "prompt",
    includeAssets: ["**/*.{js,json,woff2,ttf,css,html,png,svg,ico}"],
    workbox: {
      globPatterns: ["**/*.{js,json,woff2,ttf,css,html,png,svg,ico}"],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },
  },
  googleFonts: {
    families: {
      Oswald: true,
      Montserrat: true,
    },
  },
});
