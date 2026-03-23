---
title: "Window"
sidebar_position: 70
---


# Window

The Window API provides methods for navigation and window-related utilities inside the Shopware Administration.

::: code-group

```ts [npm]
import { window as swWindow } from '@shopware-ag/meteor-admin-sdk';
```

```ts [cdn]
// use sw.window instead of window
sw.window.routerPush({ name: '...' });
```

:::

## redirect()

Redirect to an external URL.

#### Usage

Use this method to open an external URL either in the current tab or a new tab.

```ts
sw.window.redirect({
    url: 'https://www.shopware.com',
    newTab: true
})
```

#### Parameters

| Name | Required | Default | Description |
| :------ | :------ | :------ | :------ |
| `url` | true | | The URL to open |
| `newTab` | false | false | Open the URL in a new browser tab |

#### Return value

Returns a promise without data.

## routerPush()

Navigate to another page inside the Shopware Administration.

#### Usage

This method mirrors the behavior of Vue Router’s `push()`.

Navigate using a named route:

```ts
sw.window.routerPush({
    name: 'sw.extension.sdk.index',
    params: {
        id: 'the_id_of_the_module' // can be retrieved with context.getModuleInformation
    }
})
```

Alternatively, navigate using a path:

```ts
sw.window.routerPush({
    path: `/extension/${the_id_of_the_module}` // id can be retrieved with context.getModuleInformation
})
```

#### Parameters

| Name | Required | Default | Description |
| :------ | :------ | :------ | :------ |
| `name` | false | undefined | Name of the route |
| `path` | false | undefined | Path of the route |
| `params` | false | undefined | Additional params for the new route |
| `replace` | false | false | Replace current browser history entry |

#### Return value

Returns a promise without data.

## reload()

Reload the current Administration page. This can be useful during development or when UI state must be reset.

#### Usage

```ts
sw.window.reload()
```

#### Parameters

No parameters required.

#### Return value

Returns a promise without data.

## getId()

> Available since Shopware v6.7.1.0

Returns a unique identifier for the current browser window. This is useful when working with session storage or detecting duplicated tabs.

#### Usage

```ts
sw.window.getId() 
```

#### Parameters

No parameters required

#### Return value

A `string` representing a unique identifier for the current window.

#### Example

This example clears `sessionStorage` when a duplicated browser tab is detected. This can happen if a user uses the *Duplicate Tab* feature of some browsers.

```ts
const windowId = sw.window.getId();
const storedWindowId = globalThis.sessionStorage.getItem('window-id');

if (windowId !== storedWindowId) {
    globalThis.sessionStorage.clear();
    globalThis.sessionStorage.setItem('window-id', windowId);
}

```

## getPath()

> Available since Shopware v6.7.3.0

Retrieve the current Administration router path.

#### Usage

```ts
sw.window.getPath()
```

#### Parameters

No parameters required.

#### Return value

Returns a `string` containing the full path, or an empty string if the router is not available.
