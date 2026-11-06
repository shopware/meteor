import { existsSync } from "node:fs";
import fsp from "node:fs/promises";
import { join } from "node:path";
import { defineNuxtModule } from "@nuxt/kit";
import { kebabCase } from "scule";

interface ExampleComponent {
  pascalName: string;
  filePath: string;
  /** A component example, or a block (a page template) from the Blocks section. */
  kind: "example" | "block";
  /** Owning component slug, or the group of a block, derived from the
   *  examples/<group>/ or blocks/<group>/ folder. */
  component?: string;
  code?: string;
}

/**
 * Collects the example SFCs under app/components/content/examples and the block
 * SFCs under app/components/content/blocks, and makes
 * their source code available at build and runtime: as JSON files in the
 * build dir, and as the `#component-example/nitro` virtual module used by
 * the API route and the raw-markdown transform. Adapted from Nuxt UI's
 * component-example module.
 */
export default defineNuxtModule({
  meta: {
    name: "component-examples",
  },
  setup(_options, nuxt) {
    let components: Record<string, ExampleComponent> = {};
    const outputDir = join(nuxt.options.buildDir, "component-examples");

    async function ensureOutputDir() {
      if (!existsSync(outputDir)) {
        await fsp.mkdir(outputDir, { recursive: true });
      }
    }

    async function readComponentCode(component: ExampleComponent) {
      component.code = await fsp.readFile(component.filePath, "utf-8");
    }

    async function writeComponentFile(component: ExampleComponent) {
      if (!component.code) return;
      await fsp.writeFile(
        join(outputDir, `${component.pascalName}.json`),
        JSON.stringify({
          code: component.code,
          pascalName: component.pascalName,
        }),
        "utf-8",
      );
    }

    // A single enumerable index of every example, used by the examples MCP
    // resource. The per-example JSON files are read by name only
    // (getComponentExample), so they cannot be listed at runtime on their own.
    // `name` round-trips with exampleKey(): kebabCase(pascalName).
    async function writeIndexFile() {
      const index = Object.values(components).map((component) => ({
        name: kebabCase(component.pascalName),
        pascalName: component.pascalName,
        kind: component.kind,
        component: component.component,
      }));
      await fsp.writeFile(
        join(outputDir, "index.json"),
        JSON.stringify(index),
        "utf-8",
      );
    }

    async function writeOutput() {
      await ensureOutputDir();
      await Promise.all(
        Object.values(components).map(async (component) => {
          await readComponentCode(component);
          await writeComponentFile(component);
        }),
      );
      await writeIndexFile();
    }

    nuxt.hook("components:extend", async (allComponents) => {
      components = allComponents.reduce<Record<string, ExampleComponent>>(
        (acc, component) => {
          const match = component.shortPath.match(
            /components\/content\/(examples|blocks)\/([^/]+)\//,
          );
          if (!match) return acc;

          acc[component.pascalName] = {
            pascalName: component.pascalName,
            filePath: component.filePath,
            kind: match[1] === "blocks" ? "block" : "example",
            component: match[2],
          };
          return acc;
        },
        {},
      );
      await writeOutput();
    });

    // Refresh the JSON cache when an example file changes during dev.
    nuxt.hook("builder:watch", async (_event, path) => {
      const component = Object.values(components).find((candidate) =>
        candidate.filePath.endsWith(path),
      );
      if (component) {
        await readComponentCode(component);
        await writeComponentFile(component);
      }
    });

    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {};
      nitroConfig.virtual["#component-example/nitro"] = () => {
        return `import { readFileSync } from 'node:fs'

const basePath = ${JSON.stringify(outputDir)}
const cache = Object.create(null)

export function getComponentExample(name) {
  if (!(name in cache)) {
    try {
      cache[name] = JSON.parse(readFileSync(basePath + '/' + name + '.json', 'utf-8'))
    } catch {
      cache[name] = null
    }
  }
  return cache[name]
}

export function listComponentExamples() {
  try {
    return JSON.parse(readFileSync(basePath + '/index.json', 'utf-8'))
  } catch {
    return []
  }
}
`;
      };
    });
  },
});
