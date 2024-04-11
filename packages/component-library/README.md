# Meteor component library

The meteor component library is a Vue component library developed by Shopware. It is based on the [Meteor Design System](https://shopware.design/).

- Perfect suitable for Shopware Apps
- Matches the Shopware administration look and feel
- Small bundle sizes with tree-shaking
- Completely tested and [documented](https://meteor-component-library.vercel.app/) with Storybook

## Requirements

You need a working **Vue 3 application** with the **i18n plugin** for the translations. The main translations (English and German) are bundled in the components. For other languages you need to add the snippets for the correct paths.

## Installation

Add this package to your project:

```
npm i @shopware-ag/meteor-component-library
```

Import the `style.css` for general styling like fonts, etc. in the root file of your application or in you root styling file.

```js
import "@shopware-ag/meteor-component-library/dist/style.css";
```

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

```
pnpm install
```

#### Compiles and hot-reloads for development

```
pnpm run storybook
```

#### Compiles and minifies for production

```
pnpm run build:storybook
```

#### Run your interaction tests (running Storybook instance is needed)

```
pnpm run test:storybook
```

#### Lints and fixes files

```
pnpm run lint:all
```

#### Build the bundled component library

```
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

The screenshot will be generated at the end of the Play function. If no Play function is defined then it will be created immediatly.

For reduced flakiness all animations are automatically disabled from Playwright.
