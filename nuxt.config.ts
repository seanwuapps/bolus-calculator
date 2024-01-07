// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
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
    registerType: "autoUpdate",
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
  },
  googleFonts: {
    families: {
      Raleway: true,
    },
  },
});
