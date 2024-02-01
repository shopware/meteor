import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import dts from 'vite-plugin-dts';
import svg from 'vite-plugin-svgstring';

export default defineConfig({
    envPrefix: 'APP_',
    publicDir: false,
    plugins: [
        vue(),
        svg(),
        dts({
            outDir: ['dist/esm', 'dist/common'],
            cleanVueFileName: true,
        }),
    ],
    resolve: {
        alias: {
            // storybooks webpack needs '~'
            '~inter-ui': 'inter-ui',
        },
    },
    build: {
      sourcemap: true,
      cssMinify: false,
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) =>
          `${{ es: 'esm', cjs: 'common' }[format]}/${entryName}.js`,
      },
      rollupOptions: {
        external: ['vue'],
      },
    },
});