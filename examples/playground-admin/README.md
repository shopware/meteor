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
