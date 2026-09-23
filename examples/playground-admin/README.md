# Playground: admin

A minimal Vue 3 + Vite + TypeScript application that exercises the `<mt-app>` application
shell: header, both sidebars, off-canvas drawers below the breakpoint, theme, future
flags, the snackbar host, overlays inside drawers and route changes. Every region
shows its slot name; the settings page toggles the shell options.

The app consumes the component library from its sources, so library changes show up
immediately and no library build is needed.

```sh
pnpm --filter playground-admin dev        # http://localhost:3002
pnpm --filter playground-admin test:e2e   # builds the app and runs the browser tests
pnpm --filter playground-admin lint:types # type check (uses the library's built types)
```

The initial shell configuration can be set through the query string, for example
`/?header=0&breakpoint=99999` (see `src/store/settings.ts` for all keys). Theme and language
are set on the settings page and remembered in `localStorage`.
