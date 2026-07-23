# Meteor

Meteor is Shopware’s open-source design system that drives our commerce solutions.
Extend and customise every aspect of Shopware – create elegant, delightful, and
accessible experiences. There are no limits to your imagination.

## How to navigate through this project

This repository contains all project related to the Meteor Design System used and maintained by shopware and it's contributors.

```shell
meteor/
├── docs
│   └── admin-sdk               # Documentation about the Meteor Admin SDK
├── examples
│   ├── admin-sdk-app           # Basic project to get started with the Meteor Admin SDK
│   └── nuxt-app                # Simple Nuxt server-side rendered application
└── packages
    ├── admin-sdk               # SDK to build Apps for the Shopware 6 Administration
    ├── component-library       # Collection of the Meteor Vue.js components
    ├── icon-kit                # Meteor icons in one single place
    └── tokens                  # Design Tokens powering the Meteor Design System
```

## Local development

Install the dependencies and start Storybook and the documentation site together:

```shell
pnpm install
pnpm dev
```

This serves Storybook on `http://localhost:6006` and the documentation on `http://localhost:3001`. See the [contribution guidelines](./CONTRIBUTING.md#local-development) for more ways to run the packages.

## Contribute to Meteor

Pull requests are welcome. See the [contribution guidelines](./CONTRIBUTING.md) for more information.

## License

Source code is under a custom license based on MIT.
