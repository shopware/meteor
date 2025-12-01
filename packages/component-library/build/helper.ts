import path from "path";
import fs from "fs";
import type { Plugin } from "vite";

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
    const componentsDir = path.resolve(__dirname, '../src');
    const components: Record<string, string> = {};

    // Helper to convert string to PascalCase
    function toPascalCase(str: string): string {
        return str
            .replace(/([-_][a-z])/gi, (group) =>
                group
                    .toUpperCase()
                    .replace('-', '')
                    .replace('_', '')
            )
            .replace(/^[a-z]/, (firstChar) => firstChar.toUpperCase());
    }

    function walk(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walk(filePath);
            } else if (file.endsWith('.vue')) {
                // Get component name without extension and convert to PascalCase
                const compNameRaw = path.basename(file, '.vue');
                const compName = toPascalCase(compNameRaw);
                components[compName] = filePath;
            }
        }
    }

    walk(componentsDir);

    return components;
}

/**
 * Vite/Rollup plugin to inject CSS imports into JS chunks during build.
 * Ensures that any CSS imported by a chunk is also imported at runtime.
 */
export function libInjectCss(): Plugin {
    return {
        name: 'lib-inject-css',
        apply: "build",
        enforce: "post",
        generateBundle(options, bundle) {
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
                    const kebabName = baseName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
                    
                    // Expected CSS file at root: "mt-button.css"
                    const expectedCss = `${kebabName}.css`;
                    
                    // Check if this file actually exists in the bundle
                    if (bundle[expectedCss]) {
                    cssFileName = expectedCss;
                    }
                }

                // 3. Inject the import if a matching CSS file was found
                if (cssFileName) {
                    // Calculate relative path from JS to CSS
                    // From "esm/MtButton.js" (dir: "esm") to "mt-button.css" -> "../mt-button.css"
                    let relativePath = path.posix.relative(
                    path.posix.dirname(jsFileName),
                    cssFileName
                    );

                    // Ensure path starts with ./ or ../
                    if (!relativePath.startsWith(".")) {
                    relativePath = `./${relativePath}`;
                    }

                    // Inject import at the top
                    chunk.code = `import '${relativePath}';\n${chunk.code}`;
                }
            }
        }
    }
    // return {
    //   name: 'lib-inject-css',
    //   apply: 'build',
    //   renderChunk(code, chunk) {
    //     // Check if this chunk has any CSS files associated with it
    //     if (!chunk.viteMetadata || !chunk.viteMetadata.importedCss.size) {
    //       return null;
    //     }
  
    //     // Get the CSS filenames
    //     const cssFiles = Array.from(chunk.viteMetadata.importedCss);
  
    //     // Create the import statements
    //     // We assume the CSS file is in the same directory as the JS file
    //     const imports = cssFiles
    //       .map(cssFile => `import './${path.basename(cssFile)}';`)
    //       .join('\n');
  
    //     // Inject imports at the top of the file
    //     return {
    //       code: `${imports}\n${code}`,
    //       map: null // sourcemap handling if needed
    //     };
    //   }
    // };
  };
}
