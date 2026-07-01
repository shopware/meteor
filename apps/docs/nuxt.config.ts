import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Docus enables its AI assistant whenever AI_GATEWAY_API_KEY / VERCEL_OIDC_TOKEN
// exist at build time. Vercel always injects VERCEL_OIDC_TOKEN and offers no way to
// turn it off (only a Team/Global toggle) — https://vercel.com/docs/oidc
delete process.env.AI_GATEWAY_API_KEY;
delete process.env.VERCEL_OIDC_TOKEN;

// Absolute path to vue's ESM server-renderer shim (vue/server-renderer/index.mjs).
// Used by the nitro.alias below to fix an ERR_MODULE_NOT_FOUND on Vercel — see
// the comment there.
const vueServerRendererEntry = join(
  dirname(createRequire(import.meta.url).resolve("vue/package.json")),
  "server-renderer/index.mjs",
);

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

// vue-i18n@9 (aliased above) imports @intlify internals. Alias those to the
// SAME nested v9 copies, otherwise the docs build mixes them with the root v11
// @intlify (which removed `compileToFunction`) → SyntaxError at runtime on Vercel.
const meteorIntlifyPath = (pkg: string) =>
  fileURLToPath(
    new URL(
      `../../packages/component-library/node_modules/@intlify/${pkg}`,
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
  // Drives the page-title suffix (Docus' default titleTemplate `%s - <site.name>`),
  // the OG site name, and the sitemap. Without this it falls back to the
  // package.json name ("meteor-docs").
  site: {
    name: "Shopware Meteor",
    // Absolute base for generated og:image URLs (and sitemap entries). Override
    // per environment with NUXT_SITE_URL.
    url: "https://meteor.shopware.com",
  },
  // Section roots have no index page, so permanently redirect each to its first
  // child instead of 404ing.
  routeRules: {
    "/documentation": {
      redirect: {
        to: "/documentation/getting-started/installation",
        statusCode: 301,
      },
    },
    "/documentation/getting-started": {
      redirect: {
        to: "/documentation/getting-started/installation",
        statusCode: 301,
      },
    },
    "/documentation/guidelines": {
      redirect: {
        to: "/documentation/guidelines/design-principles",
        statusCode: 301,
      },
    },
    "/documentation/design": {
      redirect: { to: "/documentation/design/tokens", statusCode: 301 },
    },
    "/documentation/content": {
      redirect: { to: "/documentation/content/wording", statusCode: 301 },
    },
    "/components": {
      redirect: { to: "/components/action-menu", statusCode: 301 },
    },
    "/utilities": {
      redirect: {
        to: "/utilities/components/theme-provider",
        statusCode: 301,
      },
    },
    "/utilities/composables": {
      redirect: {
        to: "/utilities/composables/use-snackbar",
        statusCode: 301,
      },
    },
    "/utilities/components": {
      redirect: {
        to: "/utilities/components/theme-provider",
        statusCode: 301,
      },
    },
    "/utilities/directives": {
      redirect: { to: "/utilities/directives/tooltip", statusCode: 301 },
    },
    "/utilities/plugins": {
      redirect: { to: "/utilities/plugins/device-helper", statusCode: 301 },
    },
  },
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
  fonts: {
    families: [
      // Inter is already self-hosted via @shopware-ag/meteor-component-library/font.css
      // (loaded above). Stop @nuxt/fonts (inherited from the docus layer) from
      // re-resolving it from a remote provider, which otherwise fetches
      // fonts.bunny.net at dev/build/test time and injects a duplicate @font-face.
      { name: "Inter", provider: "none" },
    ],
  },
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
  nitro: {
    // Nitro inlines `vue` but leaves a bare `import "vue/server-renderer"` in the
    // server bundle that resolves to a non-existent node_modules/vue on Vercel
    // → ERR_MODULE_NOT_FOUND. Alias the subpath to vue's real ESM shim so Nitro
    // resolves and inlines it instead of emitting a dangling external import.
    alias: {
      "vue/server-renderer": vueServerRendererEntry,
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
        "@intlify/core-base": meteorIntlifyPath("core-base"),
        "@intlify/message-compiler": meteorIntlifyPath("message-compiler"),
        "@intlify/shared": meteorIntlifyPath("shared"),
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
