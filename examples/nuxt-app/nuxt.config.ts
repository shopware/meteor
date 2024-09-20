// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    host: "127.0.0.1",
    port: 3000,
  },
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://rsms.me",
        },
        {
          rel: "stylesheet",
          href: "https://rsms.me/inter/inter.css",
        },
      ],
    },
  },
});
