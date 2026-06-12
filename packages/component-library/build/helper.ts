import path from "path";
import fs from "fs";
import { createRequire } from "node:module";
import type { Plugin } from "vite";

const requireFromHelper = createRequire(path.join(__dirname, "helper.ts"));

const interFontAssets = [
  {
    source: "Inter (web)/Inter-roman.var.woff2",
    output: "Inter-roman.woff2",
  },
  {
    source: "Inter (web)/Inter-italic.var.woff2",
    output: "Inter-italic.woff2",
  },
];

const interFontOutputDirectory = "assets/fonts";

// Helper to convert kebab-case to PascalCase
export function toPascalCase(str: string): string {
  return str
    .replace(/([-_][a-z])/gi, (group) => group.toUpperCase().replace("-", "").replace("_", ""))
    .replace(/^[a-z]/, (firstChar) => firstChar.toUpperCase());
}

/**
 * This method searches for all .vue components
 * in the src directory recursively and returns them as an
 * object containing the component name as the key
 * and the component path as the value.
 *
 * The component name is the PascalCase version of the file name.
 * The component path is the absolute path to the file.
 */
export function getAllComponents() {
  const componentsDir = path.resolve(__dirname, "../src");
  const components: Record<string, string> = {};

  function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith(".vue")) {
        // Get component name without extension and convert to PascalCase
        const compNameRaw = path.basename(file, ".vue");
        const compName = toPascalCase(compNameRaw);
        components[compName] = filePath;
      }
    }
  }

  walk(componentsDir);

  return components;
}

function toRelativeImportPath(fromFileName: string, toFileName: string): string {
  let relativePath = path.posix.relative(path.posix.dirname(fromFileName), toFileName);

  if (!relativePath.startsWith(".")) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

function getInterUiPackageDirectory(): string {
  return path.dirname(requireFromHelper.resolve("inter-ui/package.json"));
}

function getInterFontCss(): string {
  const cssPath = path.resolve(__dirname, "../src/components/assets/css/fonts/inter.font.css");
  let css = fs.readFileSync(cssPath, "utf-8");

  for (const fontAsset of interFontAssets) {
    css = css.replaceAll(
      `~inter-ui/${fontAsset.source}?v=3.19`,
      `./${interFontOutputDirectory}/${fontAsset.output}`,
    );
  }

  if (css.includes("~inter-ui")) {
    throw new Error("The generated font CSS still contains unresolved inter-ui asset references.");
  }

  return css;
}

function readFileAsUint8Array(filePath: string): Uint8Array<ArrayBuffer> {
  const buffer = fs.readFileSync(filePath);
  const bytes = new Uint8Array(buffer.byteLength);
  bytes.set(buffer);

  return bytes;
}

/**
 * Emits the public font.css stylesheet and its WOFF2 files without passing
 * font URLs through Vite library mode, where assets are always inlined.
 */
export function emitInterFontAssets(): Plugin {
  return {
    name: "emit-inter-font-assets",
    apply: (config, { command }) => {
      return command === "build" && !!config.build?.lib;
    },
    generateBundle(_options, bundle) {
      const fontCssFileName = "fonts.css";
      const interUiPackageDirectory = getInterUiPackageDirectory();

      this.emitFile({
        type: "asset",
        fileName: fontCssFileName,
        source: getInterFontCss(),
      });

      for (const fontAsset of interFontAssets) {
        this.emitFile({
          type: "asset",
          fileName: `${interFontOutputDirectory}/${fontAsset.output}`,
          source: readFileAsUint8Array(path.join(interUiPackageDirectory, fontAsset.source)),
        });
      }

      this.emitFile({
        type: "asset",
        fileName: `${interFontOutputDirectory}/LICENSE.txt`,
        source: fs.readFileSync(path.join(interUiPackageDirectory, "LICENSE.txt"), "utf-8"),
      });

      for (const key in bundle) {
        const chunk = bundle[key];

        if (chunk.type !== "chunk" || path.basename(chunk.fileName) !== "fonts.js") {
          continue;
        }

        const relativePath = toRelativeImportPath(chunk.fileName, fontCssFileName);
        const importStatement = `import '${relativePath}';`;

        if (!chunk.code.includes(importStatement)) {
          chunk.code = `${importStatement}\n${chunk.code}`;
        }
      }
    },
  };
}

/**
 * Vite/Rollup plugin to inject CSS imports into JS chunks during build.
 * Ensures that any CSS imported by a chunk is also imported at runtime.
 */
export function libInjectCss(): Plugin {
  return {
    name: "lib-inject-css",
    apply: (config, { command }) => {
      return command === "build" && !!config.build?.lib;
    },
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const key in bundle) {
        const chunk = bundle[key];

        // Only process JS chunks
        if (chunk.type === "chunk") {
          const jsFileName = chunk.fileName; // e.g., "esm/MtButton.js"
          let cssFileName = "";

          // 1. Try to get the CSS filename from Vite's metadata
          if (chunk.viteMetadata?.importedCss.size) {
            cssFileName = Array.from(chunk.viteMetadata.importedCss)[0];
          }

          // 2. Fallback: Predict the CSS name based on your file structure
          if (!cssFileName) {
            // Get base name: "MtButton"
            const baseName = path.basename(jsFileName, path.extname(jsFileName));

            // Convert PascalCase to kebab-case: "MtButton" -> "mt-button"
            const kebabName = baseName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

            // Expected CSS file at root: "mt-button.css"
            const expectedCss = `${kebabName}.css`;

            // Check if this file actually exists in the bundle
            if (bundle[expectedCss]) {
              cssFileName = expectedCss;
            }
          }

          // 3. Inject the import if a matching CSS file was found
          if (cssFileName) {
            const relativePath = toRelativeImportPath(jsFileName, cssFileName);
            const importStatement = `import '${relativePath}';`;

            if (!chunk.code.includes(importStatement)) {
              chunk.code = `${importStatement}\n${chunk.code}`;
            }
          }
        }
      }
    },
  };
}
