# Meteor component library

The meteor component library is a Vue component library developed by Shopware. It is based on the [Meteor Design System](https://shopware.design/).

- Perfect suitable for Shopware Apps
- Matches the Shopware administration look and feel
- Small bundle sizes with tree-shaking
- Tested and previewed with Storybook, [documented](https://meteor.shopware.com) on meteor.shopware.com

## Requirements

You only need a working **Vue 3 application**. Meteor is **translation-solution agnostic**: it ships its own internal i18n layer with the main English and German translations bundled in. It does **not** depend on `vue-i18n` (or any other i18n library), so there is no version to keep in sync.

## Installation

Add the package to your project:

```cli
npm i @shopware-ag/meteor-component-library
```

Import the `style.css` for general styling and `font.css` for the Inter font in the root file of your application or in you root styling file.

```js
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
```

That's it — components render their bundled English snippets out of the box, with no setup.

### Translations (optional)

To switch language reactively, or to let your app provide/override translations, install the Meteor i18n plugin with an optional **host adapter**.

```js
import { createMeteorI18nPlugin } from "@shopware-ag/meteor-component-library";

// Bundled snippets only (English by default):
app.use(createMeteorI18nPlugin());
```

Already using `vue-i18n`? Connect it with the bundled adapter — Meteor reuses your instance's locale and lets it override any snippet, falling back to its own snippets on a miss:

```js
import { createI18n } from "vue-i18n";
import {
  createMeteorI18nPlugin,
  createVueI18nAdapter,
} from "@shopware-ag/meteor-component-library";

const i18n = createI18n({ legacy: false /* ... */ });

app.use(i18n);
app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
```

Any other solution works too — just provide an adapter (`{ locale, t, n? }`) whose `t` returns `undefined` on a miss and reads a reactive locale inside the call.

Iframe apps in the Shopware Admin that don't need vue-i18n can follow the host admin's language directly:

```js
import {
  createMeteorI18nPlugin,
  createAdminSdkAdapter,
} from "@shopware-ag/meteor-component-library";

app.use(createMeteorI18nPlugin({ adapter: await createAdminSdkAdapter() }));
```

To **override** Meteor's wording or **add a language**, target the public snippet keys (`mt.<component>.<key>`, e.g. `mt.pagination.nextPage`) — either through your host translations (host-first wins) or via `createMeteorI18nPlugin({ messages })`. See the developer docs for details.

**Migrating an app from 5.x?** One line is required, or Meteor components silently stay English while the rest of your app switches language: install the plugin with an adapter (`createVueI18nAdapter(i18n)` next to your existing `app.use(i18n)` — `legacy: false` required — or `createAdminSdkAdapter()`). If you imported `vue-i18n` without declaring it, add it to your own dependencies; it is no longer shipped transitively.

Each component works independently and can be imported directly from the root like this:

```html
<script>
  import { MtButton } from "@shopware-ag/meteor-component-library";

  export default {
    components: {
      "mt-button": MtButton,
    },
  };
</script>
```

## Development

These guides are useful if you want to contribute this component library.

### Project setup

```shell
pnpm install
```

#### Compiles and hot-reloads for development

```shell
pnpm run storybook
```

To run Storybook and the documentation site together, use `pnpm dev` from the repository root instead. See the [contribution guidelines](../../CONTRIBUTING.md#running-storybook-and-the-documentation) for details.

#### Compiles and minifies for production

```shell
pnpm run build:storybook
```

#### Run your interaction tests (running Storybook instance is needed)

```shell
pnpm run test:storybook
```

#### Lints and fixes files

```shell
pnpm run lint:all
```

#### Build the bundled component library

```shell
pnpm run build
```

### Writing interaction tests

All interaction tests are written in `component-name.interactive.stories.js` files. The title needs to be prefixed with `Interaction Tests/`. These interaction tests are hidden in the final build but are visible in the Storybook development watcher.

Example:

```js
import meta from "./mt-button.stories";

export default {
  ...meta,
  title: "Interaction Tests/base/mt-button",
  component: MtButton,
};
```

### Writing visual tests

Stories for visual tests need to start with `VisualTest`.

Example:

```js
export const VisualTestPrimaryVariant = {
  name: "Render the primary variant",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // your interaction test ...
  },
};
```

The screenshot will be generated at the end of the Play function. If no Play function is defined then it will be created immediately.

For reduced flakiness all animations are automatically disabled from Playwright.
