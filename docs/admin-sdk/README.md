# Shopware release notes

*This repository is embedded into [developer-portal](https://github.com/shopware/developer-portal) under the [/resources/admin-extension-sdk/](https://developer.shopware.com/resources/admin-extension-sdk). This repository is also connected to the Shopware Dev Docs connector GitHub app which manages commit status checks in PRs and triggers production deployments.*

## Development

1. Clone this repository

```
cd /www/
git clone git@github.com:shopware/meteor.git
cd meteor/packages/admin-sdk
```

2. Make sure you have your local copy of the `developer-portal` repository in the same parent directory.

```
pnpm docs:env
```

3. Link articles from your local copy of the `meteor` into the `developer-portal`.

```
pnpm docs:link
```

4. Start the development server.

```
pnpm docs:preview
```