# Playground: template

The starting point for new playground apps: Vue 3, Vite, TypeScript and the Meteor component library,
set up the way the Meteor docs recommend.

- the `mt-app` application shell with a navigation, and one `mt-page` per route
- Vue Router, mounted after the first route resolves, with a 404 page
- vue-i18n in English and German, remembered per browser and set on `<html lang>`
- the page title in the browser tab, announced to screen readers by the shell
- the theme, light, dark or system, shared with the shell
- ESLint, Prettier and Vitest as [create-vue](https://github.com/vuejs/create-vue) sets them up, and
  instructions plus the Meteor MCP server for coding agents

The app uses the component library from its sources, so library changes show up right away.

## Start a new playground

1. Copy this folder to `examples/playground-<name>`.
2. Rename the package `name` in `package.json`, the dev and preview ports in `vite.config.ts`, the
   locale storage key in `src/i18n/index.ts`, and `app.title` in `src/i18n/en.ts` and `de.ts`.
3. Run `pnpm install` at the repository root.
4. Replace the home page with what the playground is about.

## Commands

```sh
pnpm --filter playground-template dev         # http://localhost:3003
pnpm --filter playground-template type-check  # needs a library build first
pnpm --filter playground-template lint
pnpm --filter playground-template format
pnpm --filter playground-template test        # watch mode; add --run for a single run
pnpm --filter playground-template build
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
  components/          # parts of the shell, such as the navigation
  views/               # one view per route, each an mt-page
  router/index.ts      # routes, their titles and the page title in the browser tab
  i18n/                # vue-i18n and the app's strings
```

Specs go next to their file as `*.spec.ts`. `vitest.setup.ts` installs the app's i18n, which Meteor
components need.

## Production

Already handled:

- **Accessibility:** the shell brings the landmarks, a skip link, focus handling and the
  announcement of each new page. Every page has an `<h1>` from its breadcrumb, `<html lang>` follows
  the language, and the browser tab shows the page title.
- **Missing pages:** unknown paths show the 404 page.
- **Deploys:** when a deploy removes the chunks of the previous build, the app reloads instead of
  failing to load a page.
- **No JavaScript:** a `<noscript>` notice explains that the app needs it.

When deploying, serve `index.html` for every path that isn't a file, because the router uses the
HTML5 history mode. Most static hosts call this a SPA fallback or rewrite.

For search engines, the app sets a title per page and a description in `index.html`. A public app
also needs a `robots.txt` and a sitemap; an admin-like app usually adds
`<meta name="robots" content="noindex">` instead.
