import { fileURLToPath } from "node:url";

// The meteor components import vue-i18n@9 (their nested copy) and call
// useI18n() at setup. The docs app must install an i18n instance from the
// SAME copy, so alias vue-i18n to the component library's version for both
// the app plugin and the bundled components.
const vueI18nPath = fileURLToPath(
  new URL(
    "../../packages/component-library/node_modules/vue-i18n",
    import.meta.url,
  ),
);

// The meteor component library barrel (its index.js) imports a global CSS
// reset (dist/index.css) that retargets bare elements (*, body, button,
// h1-h6) and leaks onto the docs typography. The docs deliberately do not
// load it (see app/assets/css/main.css). Some examples must import from the
// barrel (e.g. the action-menu dropdown primitives have no subpath), so drop
// that one stylesheet by redirecting it to an empty file.
const meteorResetNoopPath = fileURLToPath(
  new URL("./app/assets/css/meteor-reset-noop.css", import.meta.url),
);

const dropMeteorGlobalReset = {
  name: "drop-meteor-global-reset",
  enforce: "pre" as const,
  resolveId(source: string, importer?: string) {
    if (
      source.endsWith("index.css") &&
      importer &&
      importer.replace(/\\/g, "/").includes("component-library/dist/")
    ) {
      return meteorResetNoopPath;
    }
    return null;
  },
};

const shikiTheme = {
  light: "github-light",
  default: "github-dark-default",
  dark: "github-dark-default",
} as const;

export default defineNuxtConfig({
  extends: ["docus"],
  // modules/ is auto-scanned, so meteor-components and component-examples load
  // automatically. meteor-components registers its work via the
  // `component-meta:extend` hook (fired during the build), so module order
  // relative to nuxt-component-meta does not matter; only the third-party
  // module needs listing here.
  modules: ["nuxt-component-meta"],
  // Token dictionaries (the source of truth for the foundation token tables).
  // A Nuxt alias is added to both Vite and the tsconfig paths.
  alias: {
    "@tokens-dict": fileURLToPath(
      new URL("../../packages/tokens/dictionaries", import.meta.url),
    ),
    "@icon-kit": fileURLToPath(
      new URL("../../packages/icon-kit", import.meta.url),
    ),
  },
  componentMeta: {
    // Only analyze the meteor component library, not docus/Nuxt UI internals.
    exclude: [
      (component: { filePath?: string }) =>
        !component.filePath?.includes("packages/component-library"),
    ],
    metaFields: {
      type: false,
      props: true,
      slots: true,
      events: true,
      exposed: true,
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
    renderer: {
      alias: {
        tabs: "ResponsiveTabs",
      },
    },
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
    plugins: [dropMeteorGlobalReset],
    css: {
      // The component library's built mt-datepicker.css carries a stale
      // `/*# sourceMappingURL=main.css.map */` comment (inherited from the
      // bundled @vuepic/vue-datepicker vendor CSS), but no .css.map files are
      // emitted to its dist. The dev server otherwise chases that dangling
      // reference and logs an ENOENT "Failed to load source map" warning.
      devSourcemap: false,
    },
    resolve: {
      alias: {
        "vue-i18n": vueI18nPath,
      },
    },
    optimizeDeps: {
      // Exclude the component library so its barrel import is processed by
      // Vite (and the dropMeteorGlobalReset plugin) rather than esbuild's dep
      // pre-bundler, which would inline the global reset and bypass the plugin.
      exclude: ["@shopware-ag/meteor-component-library"],
      include: [
        // vue-i18n (aliased above to the component library's nested copy) and
        // apexcharts (pulled in by mt-chart) are otherwise discovered at
        // runtime, which triggers a re-optimize and full page reload.
        "vue-i18n",
        "apexcharts",
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
