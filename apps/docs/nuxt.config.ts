const shikiTheme = {
  light: "github-light",
  default: "github-dark-default",
  dark: "github-dark-default",
} as const;

export default defineNuxtConfig({
  extends: ["docus"],
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/shopware-signet.svg",
        },
      ],
    },
  },
  css: [
    "@shopware-ag/meteor-component-library/font.css",
    "~/assets/css/main.css",
  ],
  colorMode: {
    dataValue: "theme",
  },
  llms: {
    domain: "/",
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: shikiTheme,
        },
      },
    },
  },
  routeRules: {
    "/favicon.ico": {
      redirect: {
        to: "/shopware-signet.svg",
        statusCode: 301,
      },
    },
    "/getting-started/introduction": {
      redirect: {
        to: "/",
        statusCode: 301,
      },
    },
    "/raw/getting-started/introduction.md": {
      redirect: {
        to: "/raw/index.md",
        statusCode: 301,
      },
    },
    "/foundations/content/wording": {
      redirect: {
        to: "/foundations/content/voice-and-tone",
        statusCode: 301,
      },
    },
    "/raw/foundations/content/wording.md": {
      redirect: {
        to: "/raw/foundations/content/voice-and-tone.md",
        statusCode: 301,
      },
    },
  },
  mdc: {
    highlight: {
      noApiRoute: false,
      shikiEngine: "javascript",
      theme: shikiTheme,
    },
  },
  components: [
    { path: "~/components/examples", global: true, pathPrefix: false },
    "~/components",
  ],
  vite: {
    optimizeDeps: {
      include: ["@vueuse/core", "vue-i18n"],
    },
  },
  devtools: { enabled: false },
});
