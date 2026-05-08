---
title: "Migrating Existing Admin Plugins"
sidebar_position: 110
---


# Migrating Existing Admin Plugins

The Meteor Admin SDK can be adopted gradually in existing Shopware Admin plugins. This guide shows how to combine the traditional Twig-based extension system with the SDK so you can migrate functionality step by step.

## Combining the Meteor Admin SDK with existing plugins

Shopware 6 has a rich Admin plugin extension system based on Twig and the concepts of component overriding and component extending. These concepts are very powerful, but they can also come with a steep learning curve. For this reason, you can migrate gradually to the Meteor Admin SDK.

Both approaches can work together. This allows you to start by converting only parts of your plugins and then gradually migrate more functionality as new SDK features become available.

This approach can also help simplify your plugins and prepare them for long-term maintenance.

### Example

```js
// Use existing extension capabilities
Shopware.Component.override('sw-dashboard-index', {
    methods: {
        async createdComponent() {
          // Can also use Meteor Admin SDK features
          await sw.notification.dispatch({
            title: 'Hello from the plugin',
            message: 'I am combining the existing approach with the new SDK approach',
          })

          this.$super('createdComponent');
        }
    }
});
```

## Using locations with normal Vue components without iFrame rendering

This feature is useful when you want to partially migrate from the Twig plugin system to the SDK extension system and use both systems together. Instead of rendering an iFrame view for a location, you can render a normal Vue component directly inside the Shopware Administration.

To do this, register the component in the existing plugin system:


```js
Shopware.Component.register('your-component-name', {
  // your component
})
```

To render the component in a location, add the component name to the location using the `sdkLocation` store:

```js
Shopware.State.commit('sdkLocation/addLocation', {
    locationId: 'your-location-id',
    componentName: 'your-component-name'
})
```

With this feature you can mix the usage of the Meteor Admin SDK and the existing plugin system. A complete example could look like this: It creates a new tab in the product detail page, renders a card using the `componentSection` renderer, and displays a location inside the card. Instead of rendering the traditional location iFrame, it renders a Vue component registered in the Shopware Component Factory.

```js
// in a normal plugin js file without a HTML file
import { ui, location } from '@shopware-ag/meteor-admin-sdk';

if (!location.isIframe()) {
  const myLocationId = 'my-example-location-id';

  // Create a new tab entry
  ui.tabs('sw-product-detail').addTabItem({
      label: 'Example tab',
      componentSectionId: 'example-product-detail-tab-content'
  })

  // Add a new card to the tab content which renders a location
  ui.componentSection.add({
      component: 'card',
      positionId: 'example-product-detail-tab-content',
      props: {
          title: 'Component section example',
          locationId: myLocationId
      }
  })

  // Register your component which should be rendered inside the location
  Shopware.Component.register('your-component-name', {
    // your component
  })

  // Add the component name to the specific location
  Shopware.State.commit('sdkLocation/addLocation', {
      locationId: myLocationId,
      componentName: 'your-component-name'
  })
}
```
