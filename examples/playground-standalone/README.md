# Playground: standalone

A playground app built from `examples/playground-template`: Vue 3, Vite, TypeScript and the Meteor
component library, set up the way the Meteor docs recommend.

- the `mt-app` application shell with `mt-app-header`: a company switcher that looks like
  `mt-brand` with the Nexus logo and switches between two example companies, the navigation,
  buttons for search, notifications and help, and the user menu with a theme switch (light, dark
  or system, shared with the shell)
- pages for the overview (the start page), the marketplace and settings, each framed by `mt-page`;
  the marketplace groups integrations and templates under `/marketplace` and opens them from a
  dropdown in the header navigation:
  the overview shows an `mt-content-header` for workflows with its actions, a toolbar with search,
  filters and sorting, a table of example workflows built on a plain `<table>`, and `mt-card`s with
  workflow templates; the integrations show a catalog of `mt-card`s by category, filtered from a
  search and an `mt-nav` in the start column of `mt-layout`; the settings switch between their
  sections, each a child route, from an `mt-nav` in the start column of `mt-layout`, and show
  headlines and cards with switches, `mt-avatar`, `mt-progress-bar` and placeholders; the
  templates page is empty
- a full-screen workflow editor at `/workflows/:id`, opened from a workflow or a template: the
  shell hides its header for the route, and `mt-page` shows the breadcrumb, a close button, the
  actions, a searchable list of connectors in its start panel and a mocked canvas with the steps
- Vue Router, mounted after the first route resolves, with a 404 page
- vue-i18n in English and German, following the browser language and set on `<html lang>`
- the page title in the browser tab, announced to screen readers by the shell
- ESLint, Prettier and Vitest as [create-vue](https://github.com/vuejs/create-vue) sets them up, and
  instructions plus the Meteor MCP server for coding agents

The app uses the component library from its sources, so library changes show up right away.

## Commands

```sh
pnpm --filter playground-standalone dev         # http://localhost:3004
pnpm --filter playground-standalone type-check  # needs a library build first
pnpm --filter playground-standalone lint
pnpm --filter playground-standalone format
pnpm --filter playground-standalone test        # watch mode; add --run for a single run
pnpm --filter playground-standalone build
```

`type-check` uses the library's built types, so build it first with
`pnpm --filter @shopware-ag/meteor-component-library build`.

## Structure

The app follows the create-vue layout, and the names follow the
[Vue style guide](https://vuejs.org/style-guide/).

```
src/
  main.ts              # i18n, router and the mount after the first route
  App.vue              # the mt-app shell
  components/          # parts of the shell and the views, such as the company switcher
  data/                # example data that several views share
  views/               # one view per route, each an mt-page
  router/index.ts      # routes, their titles and the page title in the browser tab
  i18n/                # vue-i18n and the app's strings
```

Specs go next to their file as `*.spec.ts`. `vitest.setup.ts` installs the app's i18n, which Meteor
components need.

## Production

Already handled:

- **Accessibility:** the shell brings the landmarks, a skip link, focus handling and the
  announcement of each new page. `<html lang>` follows the language, and the browser tab shows the
  page title.
- **Missing pages:** unknown paths show the 404 page.
- **Deploys:** when a deploy removes the chunks of the previous build, the app reloads instead of
  failing to load a page.
- **No JavaScript:** a `<noscript>` notice explains that the app needs it.

When deploying, serve `index.html` for every path that isn't a file, because the router uses the
HTML5 history mode. Most static hosts call this a SPA fallback or rewrite.

For search engines, the app sets a title per page and a description in `index.html`. A public app
also needs a `robots.txt` and a sitemap; an admin-like app usually adds
`<meta name="robots" content="noindex">` instead.
