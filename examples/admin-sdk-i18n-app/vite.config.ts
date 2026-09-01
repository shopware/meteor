import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    // Top-level await in src/main.ts (awaiting the initial admin locale before mount).
    target: "esnext",
  },
});
