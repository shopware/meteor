---
title: "Translations"
sidebar_position: 80
---


# Translations

Extensions can localize text displayed in the Shopware Administration using snippet files and a frontend translation library.

For content rendered inside your extension UI, you can use any translation solution supported by your frontend framework (for example, the Vue i18n plugin). To keep translations synchronized with the Administration language, listen for language changes using the [Context API](../api-reference/context.md#subscribe-on-language-changes).

For text rendered [inside](../concepts/locations.md) native Administration UI components (such as titles inside [component sections](../concepts/component-sections.md)), Shopware supports snippet files inside the app.

## Creating snippet files

Create one snippet file per supported language in the app. These files should reside in the `Resources/app/administration/snippet` directory.

Use the language code as the filename—for example: `en-GB.json` for English language support. The file structure mirrors that of administration snippets. Example snippet file:

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

Snippet files follow the same structure used by the Shopware Administration. Overriding existing Administration snippets is possible, if needed.

## Using snippets in an extension

Reference snippet keys directly in the UI configuration. Example:

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

When the Administration language changes, the corresponding snippet file is automatically used.
