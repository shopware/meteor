---
title: "Vue Composables"
nav:
  position: 400
---


# Vue Composables

Composable APIs provide reusable Vue Composables for working with the Shopware Administration data layer and shared state inside extensions.

They simplify common tasks such as accessing repositories or sharing reactive state between different parts of an extension.

Currently, the SDK exposes:

- [getRepository](./getRepository.md): Create a static repository instance for a given entity.
- [useRepository](./useRepository.md): Reactive wrapper around `getRepository` that updates when its inputs change.
- [useSharedState](./useSharedState.md): Share reactive state between different extension components.
