---
title: "Positions"
nav:
  position: 40
---


# Positions

Positions define where UI components can be injected into the Shopware Administration.

Each extendable area exposes a unique `positionId`. Extensions use this identifier to tell the Administration where a UI component or extension should be rendered.

Extension developers can extend existing areas or create new areas in the Administration. Memorizing all available `positionId`s is impractical. Instead, the SDK provides tooling to help discover them dynamically.

## Example

Suppose an extension wants to add a new tab to the product detail page. The extension must target the correct `positionId` for the tab bar.

```js
sw.ui.tabs('sw-product-detail').addTabItem({ ... })
```

In this example, `sw-product-detail` is the `positionId` that identifies the tab bar in the product detail page.

## Finding position IDs with Vue DevTools

Because the number of available positions is large and varies across views, the Meteor Admin SDK provides a plugin for [Vue DevTools](../develop/devtools.md) to help discover them.

Open the plugin in the Administration. When the DevTools plugin is open, it shows all extendable positions for the current Administration view. Selecting a position displays additional information, including the corresponding SDK API that can be used to extend it.

This provides a visual way to identify which parts of the Administration can be extended and which positionId should be used.
