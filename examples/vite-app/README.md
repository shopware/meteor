# Meteor Standalone Vite Example

A plain Vite + Vue 3 + TypeScript app using Meteor **without any Shopware connection**. It
demonstrates the standalone i18n setup: the app translates its own texts with vue-i18n, and
the **same catalog** supplies French for Meteor's snippets (a language Meteor doesn't bundle)
via `createVueI18nAdapter` — see [src/main.ts](src/main.ts) and
[src/i18n/messages.ts](src/i18n/messages.ts). English and German come from Meteor's bundled
snippets with no configuration.

## Run it

1. Build the component library once: `pnpm --filter @shopware-ag/meteor-component-library build`
2. `pnpm --filter meteor-vite-app dev` — then open http://localhost:5180 and switch the language.
3. `pnpm --filter meteor-vite-app test:e2e` runs the Playwright tests (starts its own server).

More on the setup options: the ["Configure i18n" section of the installation docs](https://meteor.shopware.com/documentation/getting-started/installation).
