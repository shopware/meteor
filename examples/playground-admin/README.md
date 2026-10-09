# Playground: admin

A minimal Vue 3 + Vite + TypeScript application built on the `<mt-app>` application shell, set up the way a
production app would use it:

- navigation and sidebar, which become drawers on small screens;
- lazy-loaded routes with a page title each, which the shell announces to screen readers, plus the
  optional loading bar;
- a full-screen route that hides the shell's regions with `meta.mtAppRegions`;
- a not-found page, the theme and language settings, a confirmation modal and a snackbar.

The app consumes the component library from its sources, so library changes show up immediately and no
library build is needed.

```sh
pnpm --filter playground-admin dev        # http://localhost:3002
pnpm --filter playground-admin lint:types # type check (uses the library's built types)
```

## Structure

The app follows the [`create-vue`](https://github.com/vuejs/create-vue) layout, and the names follow the
[Vue style guide](https://vuejs.org/style-guide/).

```
src/
  components/
    AppNav.vue       the navigation
    AppSidebar.vue   the sidebar
  views/             one view per route
  router/            routes and page titles
  i18n/              translations and the remembered language
  assets/main.css    the shared page layout
```
