# AGENTS.md

Instructions for coding agents in this app. `CLAUDE.md` imports this file; Cursor and VS Code read it
directly.

## What this is

A Vue 3 + Vite + TypeScript app on the Shopware Meteor design system, set up the way the Meteor docs
recommend: the `mt-app` shell, one `mt-page` per route, Vue Router mounted after `router.isReady()`,
vue-i18n, page titles and the theme. `examples/playground-template` is the starting point that new
playgrounds copy; in a copy, replace the placeholder pages with what the playground is about.

- Build what the task asks for. Don't scaffold ahead: no empty folders and no abstraction with one
  caller.
- Keep the infrastructure: `vite.config.ts` (the library-source aliases and `dedupe`), the router
  setup with the 404 route, the page titles in `src/router/index.ts`, and `src/i18n`.

## Commands

Run from the repository root:

| Purpose        | Command                                             |
| -------------- | --------------------------------------------------- |
| Develop        | `pnpm --filter playground-template dev` (port 3003) |
| Type check     | `pnpm --filter playground-template type-check`      |
| Lint (and fix) | `pnpm --filter playground-template lint`            |
| Format         | `pnpm --filter playground-template format`          |
| Test once      | `pnpm --filter playground-template test --run`      |
| Build          | `pnpm --filter playground-template build`           |

`type-check` reads the component library's built types, so build the library first:
`pnpm --filter @shopware-ag/meteor-component-library build`. Dev, build and tests use its sources.

## Meteor

- Look up components, tokens and icons through the Meteor MCP server (`meteor`,
  `https://meteor.shopware.com/mcp`, configured in `.mcp.json`, `.cursor/mcp.json` and
  `.vscode/mcp.json`): read `meteor://components`, then `get-page` for each component you use.
  Never guess a component API; if you can't verify it, say so.
- Build the interface from Meteor components. Text goes through `mt-text`, icons through `mt-icon`
  from the Meteor icon kit, and styles use Meteor tokens such as `var(--scale-size-16)` and
  `var(--color-text-secondary-default)`, so dark mode keeps working.
- Import from the package root: `import { MtButton } from "@shopware-ag/meteor-component-library"`.
- `@` is the library's own alias, so app code uses relative imports.
- Meteor components bring English and German strings. Add the app's strings to `src/i18n/en.ts` and
  `src/i18n/de.ts`.

## Vue conventions

- Composition API with `<script setup lang="ts">`, typed props and emits.
- The [create-vue](https://github.com/vuejs/create-vue) layout and the
  [Vue style guide](https://vuejs.org/style-guide/) names: `views/` for routes, `components/`,
  `composables/` when something is shared.
- Every route has a `meta.title` i18n key; the router shows it in the browser tab.

## Tests

The setup is ready, the specs are up to each playground:

- Put a spec next to its file as `*.spec.ts`.
- Use `@testing-library/vue` with `@testing-library/user-event`, queries by role and label, and the
  arrange-act-assert pattern. Name tests after what the user sees, without "should".
- `vitest.setup.ts` installs the app's i18n for every mounted component and adds the jest-dom
  matchers. Mount routes with a router created per test.

## Before you finish

Run `type-check`, `lint`, `test --run` and `build` for this app, and say which of them you ran.
