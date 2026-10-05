// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  // The component library's dist is prebuilt and needs no auto-imports. Its
  // bundled dependencies keep minified names such as `h`, which the auto-import
  // scanner mistakes for Vue's `h` and imports a second time.
  imports: {
    transform: {
      exclude: [/[\\/]packages[\\/]component-library[\\/]dist[\\/]/],
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
});
