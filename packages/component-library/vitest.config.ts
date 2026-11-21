import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
      // The default of one second is short for a busy CI machine. Only a failing check waits
      // this long.
      expect: { poll: { timeout: 2500 } },
    },
  }),
);
