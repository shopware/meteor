[![npm version](https://badge.fury.io/js/@shopware-ag%2Fmeteor-icon-kit.svg)](https://badge.fury.io/js/@shopware-ag%2Fmeteor-icon-kit)

# meteor-icon-kit

> An icon library and toolkit that follows a minimal, yet highly expressive style perfectly aligned with Shopware's product language

## Prerequisites

This project requires `npm` or `yarn`.
[npm](http://npmjs.org/) and [yarn](https://yarnpkg.com/) are really easy to install.
To make sure you have one of them available on your machine,
try running the following command. This project itself was created with `npm`.

```sh
$ npm -v
8.1.0

$ yarn -v
1.22.15
```

## Table of contents

- [meteor-icon-kit](#meteor-icon-kit)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Vite example](#example)
  - [Built With](#built-with)
  - [Figma library](#figma-library)
  - [License](#license)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

To install the meteor-icon-kit, run:

```sh
$ npm install @shopware-ag/meteor-icon-kit
```

Or if you prefer using Yarn:

```sh
$ yarn add @shopware-ag/meteor-icon-kit
```

## Usage

Start by importing/using the provided styling.
Either utilizing sass/scss:

```scss
@import "@shopware-ag/meteor-icon-kit/icons/meteor-icon-kit.scss";
```

Or classic via the css file:

```html
<link
  rel="stylesheet"
  href="your-asset-folder/meteor-icon-kit-8e350007463127dbe9f66c60cd6896ca.css"
/>
```

Then, you can use the icons:

```js
import wallet from "@shopware-ag/meteor-icon-kit/icons/regular/wallet.svg";
```

### Dynamic colors

Take this pseudo html:

```html
<span class="icon-example">
  <wallet />
</span>
```

By defining the following class structure in `CSS` you can change the color of the svg dynamically:

```CSS
.icon-example {
  display: block;
  color: green;

  svg {
    fill: currentColor;

    path,
    use {
      fill: currentColor;
    }
  }
}
```

## Example

Following is an example for a Vue3 project using Vite as a bundler.
We are using the `vite-svg-loader` to load the svg files.

In your `vite.config.js` add the following:

```js
//...
import svgLoader from "vite-svg-loader";

export default {
  plugins: [
    //...
    svgLoader(),
  ],
};
```

This way you can import your svg files as components:

```vue
<template>
  <ActivityIcon />
</template>

<script setup>
import ActivityIcon from "@shopware-ag/meteor-icon-kit/icons/regular/activity.svg";
</script>
```

You can find this example as a CodeSandbox template [here](https://codesandbox.io/p/sandbox/meteor-icon-kit-example-revdlr).

## Built With

- Typescript
- Figma API
- VS-Code
- Love :blue_heart: :blue_heart: :blue_heart:

## Figma library

Meteor Icon Kit is available as a [Figma library](https://www.figma.com/community/file/1032564947404478461/Meteor-Icon-Kit-%E2%80%93-Shopware) through the Figma Community. To use the icons, log in to your Figma account and duplicate the file to your drafts.

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

2024 © shopware AG
