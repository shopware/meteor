import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { addTemplate, defineNuxtModule } from "@nuxt/kit";
import { createChecker } from "vue-component-meta";

/**
 * Extracts props, events, and slots of meteor components at build time via
 * vue-component-meta and exposes them as `#build/meteor-component-meta.mjs`
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

    if (!existsSync(tsconfigPath)) {
      console.warn(
        `[meteor-component-meta] tsconfig not found at ${tsconfigPath}, skipping`,
      );
      return;
    }

    const checker = createChecker(tsconfigPath, {
      forceUseTs: true,
      printer: { newLine: 1 },
    });

    const result: Record<
      string,
      { props: PropMeta[]; events: EventMeta[]; slots: SlotMeta[] }
    > = {};

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

        const props: PropMeta[] = meta.props
          .filter((prop) => !prop.global)
          .map((prop) => ({
            name: prop.name,
            description: prop.description ?? "",
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
          description: event.description ?? "",
          type: event.type,
        }));

        const slots: SlotMeta[] = meta.slots.map((slot) => ({
          name: slot.name,
          description: slot.description ?? "",
        }));

        result[componentName] = { props, events, slots };
      } catch (error) {
        console.warn(
          `[meteor-component-meta] failed to extract ${componentName}:`,
          error,
        );
      }
    }

    addTemplate({
      filename: "meteor-component-meta.mjs",
      write: true,
      getContents: () => `export default ${JSON.stringify(result, null, 2)};`,
    });
  },
});
