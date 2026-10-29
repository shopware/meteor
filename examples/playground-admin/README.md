# Playground: admin

A Vue 3 + Vite + TypeScript application that rebuilds views of the Shopware Administration with Meteor,
on the `<mt-app>` application shell and `<mt-page>`, set up the way a production app would use it:

- a dashboard, products (list, detail, create), nested categories, and orders (list, detail), on mock
  data;
- navigation and sidebar, which become drawers on small screens;
- lazy-loaded routes with a page title each, which the shell announces to screen readers, plus the
  optional loading bar;
- a full-screen route that hides the shell's regions with `meta.mtAppRegions`;
- a confirmation before leaving a page with unsaved changes, delete confirmations and snackbars;
- a not-found page and the theme and language settings.

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
shared/              the entity types of the mock Admin API
server/              the mock Admin API: seeded data and an in-memory repository
src/
  components/
    AppConfirmModal.vue  the confirm modal of useConfirm()
    AppNav.vue           the navigation
    AppSidebar.vue       the sidebar
    OrderStatus.vue      an order, payment or delivery state
  composables/       requests, repositories, list state, breadcrumbs, confirmations, formatting
  views/             the route views
  router/            routes and page titles
  i18n/              translations and the remembered language
  assets/main.css    the layout classes: stack, cluster, grid, actions
```

The mock server answers after a short delay, so loading states and the shell's loading bar show as they
would with the real API. Its data is generated from a fixed seed, and changes last until the page
reloads.
