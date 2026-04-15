import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        iframeRuntime: fileURLToPath(new URL('./iframe-runtime.html', import.meta.url)),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shopware-ag/meteor-admin-sdk': fileURLToPath(
        new URL('../admin-sdk/src/index.ts', import.meta.url),
      ),
      '#admin-sdk-channel': fileURLToPath(
        new URL('../admin-sdk/src/channel.ts', import.meta.url),
      ),
    },
  },
});
