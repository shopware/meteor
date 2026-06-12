const shikiTheme = {
  light: "github-light",
  default: "github-dark-default",
  dark: "github-dark-default",
} as const;

export default defineNuxtConfig({
  extends: ["docus"],
  // meteor-components must run before nuxt-component-meta so the Mt
  // components are registered when the meta parser snapshots the list.
  modules: ["./modules/meteor-components", "nuxt-component-meta"],
  componentMeta: {
    // Only analyze the meteor component library, not docus/Nuxt UI internals.
    exclude: [
      (component: { filePath?: string }) =>
        !component.filePath?.includes("packages/component-library"),
    ],
    metaFields: {
      type: false,
      props: true,
      slots: false,
      events: false,
      exposed: false,
    },
  },
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
    domain: "https://meteor.shopware.com",
    // Disable @nuxt/content's built-in /raw/*.md route so our own route in
    // server/routes/raw takes over (it converts dynamic MDC components like
    // :component-props into plain markdown). Link rewriting to /raw/*.md is
    // re-added in server/plugins/llms.ts.
    contentRawMarkdown: false,
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
