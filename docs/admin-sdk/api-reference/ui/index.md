---
title: "Extending the Administration UI"
nav:
  position: 10
---


# Extending the Administration UI

The Meteor Admin SDK allows extensions to add UI elements to the Shopware Administration.

These APIs let you integrate custom functionality into existing areas of the Administration, such as navigation menus, action buttons, settings pages, or custom modules.

The following guides cover common UI extension patterns.

## Using UI components

Shopware Administration components cannot be used directly inside apps or plugins. Instead, extensions should use the Meteor Component Library to achieve a native look and feel.

Shopware Administration components are not native Vue components. They rely on internal extension capabilities, Twig templates, and framework integrations that are not available externally.

The [Meteor Component Library](https://github.com/shopware/meteor-component-library) provides Vue components designed to resemble the original Administration UI and integrate seamlessly with  extensions built using the Meteor Admin SDK.

## Typical development flow

A typical extension often follows this progression.

1. Create a new module: Use a [Main Module](./mainModule.md) when your extension needs a dedicated application area in the Administration.

2. Expose the module in navigation: Add a [Menu](./menu.md) entry so users can access your extension.

3. Add configuration options: Use a [Settings Item](./settingsItem.md) to place configuration inside the Administration settings.

4. Add interactive actions: Use an [Action Button](./actionButton.md) to trigger extension functionality from existing pages.

5. Extend existing views: Add [Tabs](./tabs.md) to entity detail pages such as products, customers, or orders.

6. Render custom UI inside existing views: Use [Component Sections](./component-sections.md) to add components to extension points.

7. Provide contextual UI: Use [Sidebars](./sidebars.md) to display additional contextual information.

8. Open dialogs and workflows: Use [Modals](./modals.md) for confirmations, forms, or multi-step workflows.

9. Work with media: Use the [Media Modal](./mediaModal.md) to allow users to select or manage media assets.

10. Extend specialized interfaces: Use a [Payment Overview Card](./paymentOverviewCard.md) to customize how payment methods appear in the Administration.
