import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only our hand-written specs; never scan generated output (.nuxt/.output).
    include: ["test/**/*.spec.ts"],
    // The @nuxt/test-utils e2e `setup()` builds the whole Nuxt app inside a
    // beforeAll hook, which takes well over a minute on a cold cache.
    hookTimeout: 300_000,
    testTimeout: 60_000,
  },
});
