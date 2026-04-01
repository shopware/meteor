---
title: "Extending the UI"
nav:
  position: 100
---


# Extending the Administration UI

The Meteor Admin SDK allows extensions to add UI elements to the Shopware Administration.

These APIs let you integrate custom functionality into existing areas of the Administration, such as navigation menus, action buttons, settings pages, or custom modules.

The following guides cover common UI extension patterns.

## Using UI components

Extensions should use the [Meteor Component Library](https://github.com/shopware/meteor/tree/main/packages/component-library) to build their UI. It provides Vue components designed to match the Administration look and feel and integrate seamlessly with the Meteor Admin SDK.

## Adding new pages and navigation

- [Main Module](./mainModule.md): Add a dedicated app area in the Administration
- [Menu](./menu.md): Add navigation entries to the sidebar
- [Settings Item](./settingsItem.md): Place configuration inside the Administration settings

## Extending existing views

- [Tabs](./tabs.md): Add tabs to entity detail pages such as products, customers, or orders
- [Component Sections](./component-sections.md): Inject custom components into extension points
- [Sidebars](./sidebars.md): Display additional contextual information

## Actions and dialogs

- [Action Button](./actionButton.md): Trigger extension functionality from existing pages
- [Notification](./notification.md): Show persistent feedback in the notification center
- [Toast](./toast.md): Show short, temporary feedback messages
- [Modals](./modals.md): Confirmations, forms, or multi-step workflows
- [Media Modal](./mediaModal.md): Select or manage media assets
