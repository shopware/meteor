export default defineNuxtConfig({
  extends: ["docus"],
  css: [
    "@shopware-ag/meteor-component-library/font.css",
    "~/assets/css/main.css",
  ],
  colorMode: {
    dataValue: "theme",
  },
  components: [
    { path: "~/components/examples", global: true, pathPrefix: false },
    "~/components",
  ],
  devtools: { enabled: false },
});
