import { readdir } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import { defineNuxtModule } from "@nuxt/kit";
import { kebabCase, pascalCase } from "scule";

/**
 * Feeds the meteor component library SFCs from their workspace sources into
 * nuxt-component-meta so it can extract props (incl. JSDoc descriptions and
 * defaults) directly from the source files.
 *
 * The components are deliberately injected via the `component-meta:extend`
 * hook instead of `addComponent`: registering them in the Nuxt app would
 * pull all library sources into the docs app's typecheck (vue-tsc), which
 * uses a stricter tsconfig than the library itself.
 */
export default defineNuxtModule({
  meta: {
    name: "meteor-components",
  },
  async setup(_options, nuxt) {
    const componentsRoot = join(
      nuxt.options.rootDir,
      "../../packages/component-library/src/components",
    );

    const entries = await readdir(componentsRoot, { recursive: true });
    // _internal components are excluded from the API docs, except
    // mt-floating-ui which is publicly exported and has its own page.
    const componentFiles = entries.filter(
      (file) =>
        /(^|\/)mt-[\w-]+\.vue$/.test(file) &&
        (!file.includes("_internal") || file.includes("mt-floating-ui")),
    );

    interface MetaParserOptions {
      componentDirs: unknown[];
      components: unknown[];
    }

    // Expose a slug -> repo-relative source folder map so the docs page header
    // can link each component page to its source directory on GitHub. Keyed by
    // the component folder name without the mt- prefix (e.g. .../mt-button ->
    // "button"). Linking the folder rather than a single file covers compound
    // components whose parts share one directory (e.g. radio-group).
    const repoRoot = join(nuxt.options.rootDir, "../..");
    const sourcePaths: Record<string, string> = {};
    for (const file of componentFiles) {
      const dir = dirname(file);
      const slug = kebabCase(basename(dir)).replace(/^mt-/, "");
      sourcePaths[slug] = relative(repoRoot, join(componentsRoot, dir));
    }
    // Cast the target: Nuxt generates a literal type for this key from the
    // value at prepare time, which a freshly-built Record would not satisfy.
    (
      nuxt.options.runtimeConfig.public as Record<string, unknown>
    ).componentSourcePaths = sourcePaths;

    // The hook is provided by nuxt-component-meta and not part of Nuxt's
    // typed hook map, hence the cast.
    const hook = nuxt.hook as unknown as (
      name: string,
      callback: (parserOptions: MetaParserOptions) => void,
    ) => void;

    hook("component-meta:extend", (parserOptions) => {
      parserOptions.componentDirs.push(componentsRoot);
      for (const file of componentFiles) {
        const name = basename(file, ".vue");
        parserOptions.components.push({
          pascalName: pascalCase(name),
          kebabName: kebabCase(name),
          filePath: join(componentsRoot, file),
          export: "default",
        });
      }
    });
  },
});
