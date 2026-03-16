---
title: "API Reference"
nav:
  position: 40
---

# API Reference

The Meteor Admin SDK provides APIs for extending the Shopware Administration UI and interacting with Administration data.

These APIs allow extensions to add user interface elements, access and modify entity data, register CMS blocks and elements, and share state between components.

Use the sections below to navigate the available APIs.

## Extending the Administration UI

These APIs allow extensions to add UI elements to the Shopware Administration.  
They can be used to register modules, add navigation entries, extend existing pages, and display dialogs or side panels.

Typical use cases include:

- Creating custom modules in the Administration
- Extending entity detail pages
- Adding navigation or settings entries
- Displaying modals or contextual UI elements

APIs in this section include:

- [Main Module](./ui/mainModule.md)
- [Menu](./ui/menu.md)
- [Settings Item](./ui/settingsItem.md)
- [Action Button](./ui/actionButton.md)
- [Tabs](./ui/tabs.md)
- [Component Sections](./ui/component-sections.md)
- [Sidebars](./ui/sidebars.md)
- [Modals](./ui/modals.md)
- [Media Modal](./ui/mediaModal.md)
- [Payment Overview Card](./ui/paymentOverviewCard.md)

## Working with Data

These tools allow extensions to access and manipulate Shopware entity data from within the Administration.

They follow the same repository-based data access pattern used internally by the Administration.

Typical workflows include:

- Accessing entity repositories
- Retrieving entity data
- Subscribing to changes
- Updating or persisting entities

Tools this section include:

- [Repository](./data/repository.md)
- [Get](./data/get.md)
- [Subscribe](./data/subscribe.md)
- [Update](./data/update.md)
- [In-App Purchases](./data/in-app-purchases.md)

## Composable APIs

Composable APIs provide reusable helpers for working with the Administration state and data layer inside extensions.

They simplify common patterns such as accessing repositories or sharing state between components.

APIs in this section include:

- [useRepository](../develop/composables/useRepository.md)
- [useSharedState](../develop/composables/useSharedState.md)

## Extending the CMS

These APIs allow extensions to add new CMS blocks and elements to the Shopware Shopping Experiences editor.

They can be used to introduce custom content components that merchants can use when building storefront pages.

APIs in this section include:

- [Register CMS Block](../develop/cms/registerCmsBlock.md)
- [Register CMS Element](../develop/cms/registerCmsElement.md)

## Shared Options

Some SDK APIs support shared configuration options that control how actions are executed in the Administration.

- [Base Options](./base-options.md)
