import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shopware-ag/meteor-admin-sdk": fileURLToPath(new URL("../admin-sdk/es/index.js", import.meta.url)),
    },
  },
});
