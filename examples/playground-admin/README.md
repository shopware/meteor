# Playground: admin

A minimal Vue 3 + Vite + TypeScript application that exercises the `<mt-app>` application
shell: header, both sidebars, off-canvas drawers below the breakpoint, the snackbar host,
a modal and route changes. The regions hold only minimal content. The
settings page toggles the regions and sets theme and language; everything else uses the
shell's defaults.

The app consumes the component library from its sources, so library changes show up
immediately and no library build is needed.

```sh
pnpm --filter playground-admin dev        # http://localhost:3002
pnpm --filter playground-admin lint:types # type check (uses the library's built types)
```

Theme and language are set on the settings page and remembered in `localStorage`.

## Structure

The app follows the [`create-vue`](https://github.com/vuejs/create-vue) layout, and the names follow
the [Vue style guide](https://vuejs.org/style-guide/). `shared/` holds data that isn't tied to the
browser app, such as the mocked catalog.

```
shared/
  products.ts             the mocked catalog
src/
  components/
    AppHeader.vue
    AppNav.vue
    AppSidebar.vue        the end sidebar
  views/                  one view per route
  router/  stores/  i18n/  assets/
```
