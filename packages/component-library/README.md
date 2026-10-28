# Meteor component library

The meteor component library is a Vue component library developed by Shopware. It is based on the [Meteor Design System](https://shopware.design/).

- Perfect suitable for Shopware Apps
- Matches the Shopware administration look and feel
- Small bundle sizes with tree-shaking
- Tested and previewed with Storybook, [documented](https://meteor.shopware.com) on meteor.shopware.com

## Requirements

You only need a working **Vue 3 application**. Meteor brings its own English and German texts and doesn't depend on `vue-i18n` or any other i18n library.

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

Without any further setup, components show English.

### Translations

- **Shopware plugins:** nothing to set up. Meteor components show the language the user picked in the Administration. To change one of Meteor's texts, add its `mt.*` key (e.g. `mt.pagination.nextPage`) to your plugin's snippet files.
- **Shopware apps & services and standalone applications:** if your app translates its own texts with vue-i18n, connect it to Meteor once. Meteor components then switch language together with your app:

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

Apps without vue-i18n, other translation libraries and changing Meteor's texts are covered in the [Internationalization docs](https://meteor.shopware.com/documentation/getting-started/internationalization).

**Upgrading from Meteor 5?** Add the plugin as shown above, otherwise Meteor components stay English while your app switches language. If you import `vue-i18n` without declaring it in your `package.json`, add it there: Meteor no longer installs it.

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
