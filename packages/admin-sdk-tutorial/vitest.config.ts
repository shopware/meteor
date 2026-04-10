import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "tests/e2e/**"],
      globals: true,
      root: fileURLToPath(new URL("./", import.meta.url)),
      setupFiles: ["./vitest.setup.ts"],
    },
  }),
);
