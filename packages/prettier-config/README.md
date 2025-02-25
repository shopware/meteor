# @shopware-ag/meteor-prettier-config

A shared prettier config for shopware projects.

## Installation

With npm:

```bash
npm i -D @shopware-ag/meteor-prettier-config
```

With pnpm:

```bash
pnpm i -D @shopware-ag/meteor-prettier-config
```

# Usage

There are two ways to use this new config:

1. By configuring prettier inside your `package.json` file:

```jsonc
{
  "name": "my-package",
  "devDependencies": {
    "prettier": "^3.0.0",
  },
  // ↓ This is the important part ↓
  "prettier": "@shopware-ag/meteor-prettier-config",
}
```

2. Or you can use a `.prettierrc.js` file:

```js
import meteorPrettierConfig from "@shopware-ag/meteor-prettier-config";

export default meteorPrettierConfig;
```

For a full guide you can read the [prettier configuration](https://prettier.io/docs/sharing-configurations#extending-a-sharable-config).

## Using single quotes

We strongly advise to keep the configuration as is. The pre-defined config, aswell as prettier exist to avoid unnecessary discussions about things that do not matter.

However, if you _really_ dislike using double quotes, you can override
that setting like so:

```js
// filename: .prettierrc.js
import meteorPrettierConfig from "@shopware-ag/meteor-prettier-config";

export default {
  ...meteorPrettierConfig,
  singleQuote: true,
};
```
