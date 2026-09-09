import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      // Playwright writes reports/traces into the project dir DURING test runs;
      // without this, every write triggers a full page reload under the tests.
      ignored: ["**/playwright-report/**", "**/test-results/**"],
    },
  },
});
