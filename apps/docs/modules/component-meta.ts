import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { addTemplate, defineNuxtModule, updateTemplates } from "@nuxt/kit";
import { createChecker } from "vue-component-meta";

/**
 * Extracts props, events, and slots of meteor components at build time via
 * vue-component-meta and exposes them as `#meteor-component-meta`
 * for the PropsTable content component.
 *
 * Add components to the allowlist as their docs pages get migrated.
 */
const COMPONENT_ALLOWLIST: Record<string, string> = {
  MtButton: "src/components/form/mt-button/mt-button.vue",
  MtBanner: "src/components/feedback-indicator/mt-banner/mt-banner.vue",
  MtCard: "src/components/layout/mt-card/mt-card.vue",
};

interface PropMeta {
  name: string;
  description: string;
  type: string;
  required: boolean;
  default?: string;
  deprecated?: string;
}

interface EventMeta {
  name: string;
  description: string;
  type: string;
}

interface SlotMeta {
  name: string;
  description: string;
}

interface ComponentDescriptionOverrides {
  props?: Record<string, string>;
  events?: Record<string, string>;
  slots?: Record<string, string>;
}

const COMPONENT_DESCRIPTION_OVERRIDES: Record<
  string,
  ComponentDescriptionOverrides
> = {
  MtButton: {
    props: {
      block: "Expands the button to fill the available inline space.",
      disabled: "Disables the button and prevents user interaction.",
      ghost: "Renders supported variants with a transparent background.",
      is: "Sets the rendered HTML element or Vue component.",
      isLoading: "Shows a loading indicator and hides the button content.",
      link: "Deprecated link target for rendering the button as an anchor.",
      size: "Controls the button height, padding, and icon slot size.",
      square: "Renders the button as an icon-only square control.",
      variant: "Controls the visual style and semantic emphasis of the button.",
    },
    slots: {
      default: "Button label or custom button content.",
      iconFront: "Icon rendered before the button label.",
      iconBack: "Icon rendered after the button label.",
    },
  },
  MtBanner: {
    props: {
      bannerIndex: "Optional identifier emitted with the close event.",
      closable: "Shows a close button and enables the close event.",
      hideIcon: "Hides the leading banner icon.",
      icon: "Overrides the default icon for the selected variant.",
      title: "Optional title shown above the banner message.",
      variant: "Controls the banner color, icon, and semantic meaning.",
    },
    events: {
      close: "Emitted when the close button is clicked.",
    },
    slots: {
      customIcon: "Custom leading icon content.",
      default: "Banner message content.",
    },
  },
  MtCard: {
    props: {
      inheritance: "Controls the inheritance toggle state when provided.",
      isLoading: "Shows a loader over the card content.",
      large: "Deprecated larger card width.",
      subtitle: "Subtitle text shown in the card header.",
      title: "Title text shown in the card header and used as aria-label.",
    },
    events: {
      "update:inheritance": "Emitted when the inheritance toggle is clicked.",
    },
    slots: {
      "after-card": "Internal content rendered after the card.",
      avatar: "Avatar or logo content shown in the card header.",
      "before-card": "Internal content rendered before the card.",
      "context-actions": "Context menu items rendered in the card header.",
      default: "Main card content.",
      footer: "Footer content rendered below the main content.",
      grid: "Data grid content rendered inside the card body.",
      headerRight: "Additional content on the right side of the header.",
      subtitle: "Custom subtitle content replacing the subtitle prop.",
      tabs: "Tab bar content rendered below the header.",
      title: "Custom title content replacing the title prop.",
      toolbar: "Toolbar content such as search fields or actions.",
    },
  },
};

function collectExampleSources(dir: string) {
  const sources: Record<string, { code: string }> = {};

  if (!existsSync(dir)) {
    console.warn(`[meteor-component-meta] examples dir not found: ${dir}`);
    return sources;
  }

  const walk = (currentDir: string) => {
    for (const entry of readdirSync(currentDir)) {
      const fullPath = join(currentDir, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (stats.isFile() && entry.endsWith(".vue")) {
        sources[basename(entry, ".vue")] = {
          code: stripLibraryImports(readFileSync(fullPath, "utf8")),
        };
      }
    }
  };

  walk(dir);
  return sources;
}

/**
 * The displayed example code intentionally hides the library import
 * statements; everything else is shown exactly as authored.
 */
function stripLibraryImports(code: string) {
  return code
    .replace(
      /<script setup([^>]*)>([\s\S]*?)<\/script>\n?/g,
      (_match, attrs: string, script: string) => {
        const cleanedScript = removeLibraryImportStatements(script).trim();

        return cleanedScript
          ? `<script setup${attrs}>\n${cleanedScript}\n</script>\n`
          : "";
      },
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function removeLibraryImportStatements(script: string) {
  const lines = script.split("\n");
  const cleanedLines: string[] = [];
  let importLines: string[] | null = null;

  const flush = () => {
    if (importLines && !isLibraryImport(importLines.join("\n"))) {
      cleanedLines.push(...importLines);
    }
    importLines = null;
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (importLines) {
      importLines.push(line);
      if (/;\s*$/.test(trimmedLine)) flush();
      continue;
    }

    if (trimmedLine.startsWith("import ")) {
      importLines = [line];
      if (/;\s*$/.test(trimmedLine)) flush();
      continue;
    }

    cleanedLines.push(line);
  }

  flush();
  return cleanedLines.join("\n");
}

function isLibraryImport(statement: string) {
  return /from\s+["']@shopware-ag\/meteor-component-library(?:\/[^"']*)?["']/.test(
    statement,
  );
}

export default defineNuxtModule({
  meta: {
    name: "meteor-component-meta",
  },
  setup(_options, nuxt) {
    const libraryRoot = resolve(
      nuxt.options.rootDir,
      "../../packages/component-library",
    );
    const tsconfigPath = resolve(libraryRoot, "tsconfig.app.json");

    const result: Record<
      string,
      { props: PropMeta[]; events: EventMeta[]; slots: SlotMeta[] }
    > = {};

    if (!existsSync(tsconfigPath)) {
      console.warn(
        `[meteor-component-meta] tsconfig not found at ${tsconfigPath}, skipping`,
      );
    } else {
      const checker = createChecker(tsconfigPath, {
        forceUseTs: true,
        printer: { newLine: 1 },
      });

      for (const [componentName, relativePath] of Object.entries(
        COMPONENT_ALLOWLIST,
      )) {
        const componentPath = resolve(libraryRoot, relativePath);
        if (!existsSync(componentPath)) {
          console.warn(
            `[meteor-component-meta] component not found: ${componentPath}`,
          );
          continue;
        }

        try {
          const meta = checker.getComponentMeta(componentPath);
          const descriptions =
            COMPONENT_DESCRIPTION_OVERRIDES[componentName] ?? {};

          const props: PropMeta[] = meta.props
            .filter((prop) => !prop.global)
            .map((prop) => ({
              name: prop.name,
              description:
                prop.description || descriptions.props?.[prop.name] || "",
              type: prop.type,
              required: prop.required,
              default: prop.default,
              deprecated:
                prop.tags?.find((tag) => tag.name === "deprecated")?.text ??
                undefined,
            }))
            .sort(
              (a, b) =>
                Number(b.required) - Number(a.required) ||
                a.name.localeCompare(b.name),
            );

          const events: EventMeta[] = meta.events.map((event) => ({
            name: event.name,
            description:
              event.description || descriptions.events?.[event.name] || "",
            type: event.type,
          }));

          const slots: SlotMeta[] = meta.slots.map((slot) => ({
            name: slot.name,
            description:
              slot.description || descriptions.slots?.[slot.name] || "",
          }));

          result[componentName] = { props, events, slots };
        } catch (error) {
          console.warn(
            `[meteor-component-meta] failed to extract ${componentName}:`,
            error,
          );
        }
      }
    }

    const examplesDir = resolve(nuxt.options.srcDir, "components/examples");

    const componentMetaTemplate = addTemplate({
      filename: "meteor-component-meta.mjs",
      write: true,
      getContents: () => `export default ${JSON.stringify(result, null, 2)};`,
    });

    const exampleSourcesTemplate = addTemplate({
      filename: "meteor-example-sources.mjs",
      write: true,
      getContents: () =>
        `export default ${JSON.stringify(collectExampleSources(examplesDir), null, 2)};`,
    });

    // The nitro dev server bundles the alias import once, so server code
    // reads this JSON copy from disk in dev to pick up example edits.
    const exampleSourcesJsonTemplate = addTemplate({
      filename: "meteor-example-sources.json",
      write: true,
      getContents: () =>
        JSON.stringify(collectExampleSources(examplesDir), null, 2),
    });

    nuxt.options.runtimeConfig.meteorExampleSourcesPath = nuxt.options.dev
      ? exampleSourcesJsonTemplate.dst
      : "";

    nuxt.hook("builder:watch", async (_event, path) => {
      if (path.includes("components/examples/")) {
        await updateTemplates({
          filter: (template) =>
            template.filename === "meteor-example-sources.mjs" ||
            template.filename === "meteor-example-sources.json",
        });
      }
    });

    nuxt.options.alias["#meteor-component-meta"] = componentMetaTemplate.dst;
    nuxt.options.alias["#meteor-example-sources"] = exampleSourcesTemplate.dst;
  },
});
