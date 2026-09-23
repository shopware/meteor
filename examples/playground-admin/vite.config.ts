import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-expect-error - the plugin ships no usable type declarations
import svg from "vite-plugin-svgstring";

// The playground consumes the component library from its sources, so changes to the
// library show up immediately and no library build is needed to run it.
const librarySource = fileURLToPath(
  new URL("../../packages/component-library/src", import.meta.url),
);

/** `MtSegmentedControl` → `<src>/components/mt-segmented-control/mt-segmented-control.vue` */
function componentSourcePath(name: string) {
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return path.join(librarySource, "components", kebab, `${kebab}.vue`);
}

export default defineConfig({
  plugins: [
    vue(),
    // mt-icon imports SVG files as markup strings; the library's own Vite config registers this plugin too
    svg(),
  ],
  server: {
    port: 3002,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  define: {
    // convert-units (used by mt-unit-field) references Node's `global`
    global: "globalThis",
  },
  resolve: {
    // one runtime for the app and the library: the library would otherwise resolve
    // vue-i18n from its own node_modules (a different major version)
    dedupe: ["vue", "vue-i18n"],
    alias: [
      {
        find: /^@shopware-ag\/meteor-component-library$/,
        replacement: path.join(librarySource, "index.ts"),
      },
      {
        find: /^@shopware-ag\/meteor-component-library\/styles\.css$/,
        replacement: path.join(librarySource, "assets/css/all.css"),
      },
      {
        find: /^@shopware-ag\/meteor-component-library\/font\.css$/,
        replacement: path.join(
          librarySource,
          "assets/css/fonts/inter.font.css",
        ),
      },
      {
        // per-component imports, e.g. `@shopware-ag/meteor-component-library/MtSegmentedControl`
        find: /^@shopware-ag\/meteor-component-library\/(Mt\w+)$/,
        replacement: "$1",
        customResolver: (name) => componentSourcePath(name),
      },
      // the library sources use these aliases internally
      { find: "@", replacement: librarySource },
      { find: /^~(.*)$/, replacement: "$1" },
    ],
  },
});
