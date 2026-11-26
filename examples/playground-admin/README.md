# Playground: admin

A Vue 3 + Vite + TypeScript application that rebuilds the Shopware Administration with Meteor, on the
`<mt-app>` application shell and `<mt-page>`. It is made for demos: it looks like the real product, with
its menu, pages and labels, and works just enough to click through. It shows:

- the full menu of the Administration, and help and notifications in every page header;
- the dashboard, products (list, detail with all tabs, create), categories with their tree, orders (list,
  detail with General, Details and Documents), customers (list, detail), the Shopping Experiences layouts
  and editor, the settings and the profile, on mock data;
- the other modules of the menu, such as reviews, properties, promotions and the Rule Builder, as lists
  of mock rows, and the media, themes and store as empty pages;
- tables in the shape of the Administration's data grid, with skeleton rows instead of content and
  without `mt-data-table`;
- navigation and sidebar, which become drawers on small screens;
- lazy-loaded routes with a page title each, which the shell announces to screen readers, plus the
  optional loading bar;
- a full-screen route that hides the shell's regions with `meta.mtAppRegions`;
- a confirmation before leaving a page with unsaved changes, and snackbars;
- a not-found page, and the theme and language in the profile.

The app consumes the component library from its sources, so library changes show up immediately and no
library build is needed.

```sh
pnpm --filter playground-admin dev        # http://localhost:3002
pnpm --filter playground-admin lint:types # type check (uses the library's built types)
```

The type check reads the library's built types, so run `pnpm --filter @shopware-ag/meteor-component-library build-only`
first when the library has new components.

## Structure

The app follows the [`create-vue`](https://github.com/vuejs/create-vue) layout, and the names follow the
[Vue style guide](https://vuejs.org/style-guide/).

```
shared/              the entity types of the mock Admin API
server/              the mock Admin API: seeded data and an in-memory repository
src/
  components/
    AppGrid.vue          the table, with skeleton rows, in the shape of the data grid
    AppHeaderActions.vue the help and notification buttons of the page headers
    AppNav.vue           the navigation
    AppPagination.vue    the page numbers and page size below a table
    AppSidebar.vue       the sidebar
    CategoryTree.vue     the category tree
    MediaThumbnail.vue   the empty image preview
  composables/       requests, repositories, list state, breadcrumbs, formatting
  views/             the route views; ModuleListView shows the modules of src/modules.ts
  modules.ts         the columns and mock rows of the modules shown as plain lists
  cmsLayouts.ts      the Shopping Experiences layouts
  router/            routes and page titles
  i18n/              translations and the remembered language
  assets/main.css    the layout classes: stack, cluster, grid, listing, form rows
```

The mock server answers after a short delay, so loading states and the shell's loading bar show as they
would with the real API. Its data is generated from a fixed seed, and changes last until the page
reloads.
