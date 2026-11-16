---
title: Grant Permission Service Banner
description: A banner that asks users to grant the permissions a Shopware Service needs before it can be activated.
---

## Usage

**Grant Permission Service Banner** displays a permission request for a Shopware Service, with a primary action to grant the permissions and a secondary link to more information. It is intended for internal Shopware Services only.

```ts
import { MtGrantPermissionServiceBanner } from "@shopware-ag/meteor-component-library";
```

```html
<template>
  <mt-grant-permission-service-banner
    @grant-success="onGranted"
    @grant-error="onGrantFailed"
  />
</template>
```

## API reference

:component-api

## Behavior

- The banner manages its own visibility through the [`useServicePermission`](/utilities/composables/use-service-permission) composable: it renders only while permissions still need to be granted and hides itself after a successful grant.
- Clicking the primary action runs the grant flow and emits `grant-success` on success or `grant-error` with the error on failure.
- The more-info action opens the Shopware Services documentation in a new tab and emits `more-info`.
- Title, description, and action labels are built in and localized (English and German); they cannot be overridden.
- The layout adapts to the width of its container, switching from a stacked to a horizontal arrangement as space allows.

## Related

- [**useServicePermission**](/utilities/composables/use-service-permission): the composable the banner uses, for building custom permission UI instead.
- [**Banner**](/components/banner): for general inline notices that are not tied to service permissions.
