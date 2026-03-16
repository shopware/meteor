---
title: "Start Developing"
sidebar_position: 30
---


# Start Developing

This section explains how to build Administration extensions with the Meteor Admin SDK, using core extension capabilities such as UI extension points, composables, and tooling.

A typical Administration extension follows this workflow:

1. Identify an extension point in the Administration UI.
2. Add a [main module](../api-reference/ui/mainModule) or [action button](../api-reference/ui/actionButton) at that [location](./api/location).
   - **Location**: Defines where extension code runs inside the Administration UI.
   - **Main module**: The entry point of your extension inside the Administration navigation.
   - **Action button**: Adds functionality to an existing Administration view, such as the product detail page.
3. Load or modify Shopware data using [repositories](./composables/use-repository).
4. Provide feedback to users with [notifications](./notification) or [toasts](./toast).

## Development Tools

Use the [DevTools](./devtools.md) guide to discover extension points and inspect the Administration UI with Vue DevTools.

## Extension APIs

The following APIs allow extensions to interact with and extend the Shopware Administration UI:

- **[Location](./location)**: Determine where your extension is rendered inside the Administration.
- **[Context](./context)**: Access information about the current Administration context.
- **[Notification](./notification)**: Display notification messages to users.
- **[Toast](./toast)**: Show temporary toast messages.
- **[Window](./window)**: Interact with browser windows or external links.
- **[Translations](./translations)**: Localize extension UI using snippet files and synchronize language changes with the Administration.

## Composables

Composables provide reusable helpers for working with Administration data and shared state.

- **[useRepository](./composables/use-repository)**: Access Shopware repositories to load and manipulate entities.
- **[useSharedState](./composables/use-shared-state)**: Share state between extensions or components.

## CMS extensions

The CMS API allows extensions to add new CMS blocks and elements to the Shopware content system.

- **[Register CMS Block](./cms/register-cms-block)**: Add custom CMS blocks that structure and group content elements in the Shopping Experiences editor.
- **[Register CMS Element](./cms/register-cms-element)**: Create custom CMS elements that render specific content or functionality inside CMS blocks.

## Advanced topics

- **[Entity Types](./entity-types)**: Configure and extend TypeScript typings for entity access and SDK usage.
- **[Migrating Existing Admin Plugins](./migrating-existing-admin-plugins)**: Learn how to gradually migrate existing Twig-based Admin plugins to the Meteor Admin SDK.
