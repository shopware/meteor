import { existsSync } from "node:fs";
import fsp from "node:fs/promises";
import { join } from "node:path";
import { defineNuxtModule } from "@nuxt/kit";

interface ExampleComponent {
  pascalName: string;
  filePath: string;
  code?: string;
}

/**
 * Collects the example SFCs under app/components/content/examples and makes
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

    async function writeOutput() {
      await ensureOutputDir();
      await Promise.all(
        Object.values(components).map(async (component) => {
          await readComponentCode(component);
          await writeComponentFile(component);
        }),
      );
    }

    nuxt.hook("components:extend", async (allComponents) => {
      components = allComponents
        .filter((component) =>
          component.shortPath.includes("components/content/examples/"),
        )
        .reduce<Record<string, ExampleComponent>>((acc, component) => {
          acc[component.pascalName] = {
            pascalName: component.pascalName,
            filePath: component.filePath,
          };
          return acc;
        }, {});
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
`;
      };
    });
  },
});
