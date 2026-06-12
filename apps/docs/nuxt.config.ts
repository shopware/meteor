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
  content: {
    build: {
      markdown: {
        highlight: {
          theme: shikiTheme,
        },
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
  vite: {
    optimizeDeps: {
      include: [
        "@vueuse/core",
        "remark-emoji",
        "remark-mdc",
        "@shikijs/core",
        "@shikijs/engine-javascript",
        "@shikijs/transformers",
        "@shikijs/langs/css",
        "@shikijs/langs/diff",
        "@shikijs/langs/html",
        "@shikijs/langs/javascript",
        "@shikijs/langs/json",
        "@shikijs/langs/markdown",
        "@shikijs/langs/mdc",
        "@shikijs/langs/shellscript",
        "@shikijs/langs/typescript",
        "@shikijs/langs/vue",
        "@shikijs/langs/yaml",
        "@shikijs/themes/github-dark-default",
        "@shikijs/themes/github-light",
      ],
    },
  },
  devtools: { enabled: false },
});
