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
  css: ["@go-ui/vue/dist/go-ui.css"],
  typescript: {
    typeCheck: true,
  },
  modules: ["@pinia/nuxt"],
});
