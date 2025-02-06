# Docs

An instance of the `shopware/developer-documentation-vitepress`, as is `shopware/developer-portal`, dedicated for
Designers.

## Develop

Checkout `meteor` repository:

```bash
cd /www/
git clone git@github.com:shopware/meteor.git
cd /www/meteor
```

Prepare docs environment provided by the `developer-portal` repository. This will make sure the `developer-portal`
repository is checked out and up to date.

```bash
pnpm docs:env
```

Symlink docs from your local `meteor` repository into the `developer-portal`.

```bash
pnpm docs:link
```

Run local webserver.

```bash
pnpm docs:preview
```

# Read more

- [https://github.com/vuejs/vitepress](˙vuejs/vitepress˙) - SSR framework for the documentation
- [https://github.com/shopware/developer-documentation-vitepress](˙shopware/developer-documentation-vitepress˙) -
  Shopware specific config, design and components
- [https://github.com/shopware/developer-portal](˙shopware/developer-portal˙) - Developer documentation