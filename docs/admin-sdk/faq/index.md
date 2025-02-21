---
title: "FAQ"
nav:
  position: 1100
---

# FAQ

## Can I use the same domain with subfolders for multiple apps?
No, for technical reasons, it is not possible to use the same domain with subfolders to host multiple apps. Each app must have its own separate domain.
The preferred solution is to use subdomains for each app. For example, you can use subdomains like "app-one.your-company.com", "app-two.your-company.com", and so on. Using subdomains allows you to have separate domains for each app, which avoids the technical limitations associated with using subfolders.

## How can I use components that resemble the original components in the administration?
While it is not possible to use the exact same components in the Shopware administration, there is a component library called Meteor Component Library that offers similar components. The Shopware administration components are not native Vue components because they have extension capabilities, Twig templates, and other features that cannot be directly used. However, by utilizing the Meteor Component Library, you can achieve a native look and feel for your app that seamlessly integrates with the original Shopware administration.

To access the Meteor Component Library, visit the following link: https://github.com/shopware/meteor-component-library

## How can I use snippets to translate my app?

You can manage all texts rendered within your [locations](../concepts/locations.md) with a translation plugin of your choice. If you're utilizing Vue.js as your frontend framework, you can use the i18n plugin. Additionally, to ensure consistency between your app and the Shopware Administration, you can synchronize language changes by [subscribing to them through the context API](../api-reference/context.md#subscribe-on-language-changes).

For text elements in native Shopware Administration components, such as titles within [component sections](../concepts/component-sections.md), you can employ snippet files within your app. This is supported since the Shopware Version 6.6. Here's a how to accomplish this:

1. **Create Snippet Files:** Begin by generating a snippet file for each supported language within your app. These files should reside in the `Resources/app/administration/snippet` directory. Naming conventions follow the language code format, for instance, `en-GB.json` for English language support. The file structure mirrors that of administration snippets. However it is not impossible to overwrite Shopware Administration snippets.

```json
// <app root>/Resources/app/administration/snippet/en-GB.json
{
    "my-app-name": {
        "example-card": {
            "title": "My app",
            "subtitle": "This is my app"
        }
    }
}
```

2. **Integrate Snippets:** Utilize these snippets within your app by referencing their paths directly in your code. For example:

```js
sw.ui.componentSection('sw-manufacturer-card-custom-fields__before').add({
    component: 'card', 
    props: {
        title: 'my-app-name.example-card.title',
        subtitle: 'my-app-name.example-card.subtitle',
        locationId: 'my-app-card-before-properties'
    }
})
```
