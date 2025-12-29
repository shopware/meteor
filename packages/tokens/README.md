This repository contains the Design Tokens for the Meteor Design System at shopware.

## Installation

```sh
npm install @shopware-ag/meteor-tokens
```

## Usage

This packages exposes a handful of files to consume:

- Primitive tokens
- Tokens for the Shopware 6 Administration (light & dark)

As an example we'll show you how to make use of the tokens
for the Shopware 6 Administration.

Import the CSS files that contain the corresponding tokens.

```js
import '@shopware-ag/meteor-tokens/administration/light.css';

// If you want to support dark mode
import '@shopware-ag/meteor-tokens/administration/dark.css';
```

Now, you're able to make use of the Design Tokens trough
CSS custom properties, like this:

```css
.sw-button {
  background-color: var(--color-interaction-primary-default);
}
```

To switch to the dark mode add the attribute `data-theme="dark"` to
a DOM element as far up in the DOM tree as possible.

```html
<body data-theme="dark">
  <!-- Your application -->
</body>
```

## Usage with Tailwind CSS v4

Tailwind CSS v4 uses a CSS-first configuration. Meteor Tokens provides pre-configured CSS files that use the new `@theme` block to automatically register utility classes.

### Configuration

In your main CSS entry point, import the Tailwind-ready CSS files after the `@import "tailwindcss";` directive:

```css
@import "tailwindcss";
@import "@shopware-ag/meteor-tokens/tailwind";
@import "@shopware-ag/meteor-tokens/tailwind/administration";
```

### Usage

Once imported, the tokens are automatically available as utility classes. For example:

```html
<button class="bg-interaction-primary-default text-text-primary-inverse px-scale-size-16 py-scale-size-8 rounded-border-radius-button">
  Click me
</button>
```

### Source Detection

Tailwind v4 automatically scans your project for class names but ignores `node_modules` by default. If you are using these tokens in an external library or a monorepo setup, you may need to [explicitly register the package as a source](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources) to ensure all utility classes are detected:

```css
@import "tailwindcss";
@source "../node_modules/@shopware-ag/meteor-tokens";
```

## License

Shopware 6 is completely free and released under the [MIT License](./LICENSE.md).
