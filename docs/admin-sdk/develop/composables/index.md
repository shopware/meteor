---
title: "Composable APIs"
nav:
  position: 10
---


# Composable APIs

Composable APIs provide reusable helpers for working with the Shopware Administration data layer and shared state inside extensions.

They simplify common tasks such as accessing repositories or sharing reactive state between different parts of an extension.

Currently, the SDK exposes two composables:

- [useRepository](./useRepository.md): Access Shopware entity repositories to load and manipulate data.
- [useSharedState](./useSharedState.md): Share reactive state between different extension components.
