# Base Options

Base options are shared configuration options that can be passed to SDK methods which accept a single payload object. They are provided as additional properties alongside the method's own parameters.

This applies to APIs such as `notification.dispatch()`, `toast.dispatch()`, many `ui.*` methods, `context.*`, `data.get()`, and `data.update()`.

Higher-level data helpers such as `data.repository.*` and `data.subscribe()` currently use narrower method signatures and do not expose base options on their public API.

More options may be added in the future. Currently, the following option is available:

| Name         | Required | Default | Availability        | Description                                                                                |
| :----------- | :------- | :------ | :------------------ | :----------------------------------------------------------------------------------------- |
| `privileges` | false    |         | >= Shopware 6.6.3.0 | Check the current user's privileges before executing the action. See [Privileges](#privileges). |

#### Usage

In this example, the base options are passed on the same object as the method-specific fields:

```ts
import { notification } from '@shopware-ag/meteor-admin-sdk';

notification.dispatch({
    message: 'Your product report is ready',
    /* ... base options ... */
});
```

## Privileges

The `privileges` option accepts an array of privilege strings. When provided, the SDK checks whether the current Administration user holds all listed privileges before executing the action. If any privilege is missing, the action is silently skipped.

:::warning Not a security feature
Privilege checks happen client-side in the browser. They prevent UI elements from appearing for users who lack the required permissions, but they do not enforce access control on the server. Server-side authorization is still required for any sensitive operation.
:::

#### Privilege string format

Each privilege string follows the pattern `action:entity`:

```
'product:read'
'order:update'
'category:create'
'customer:delete'
```

Available actions:

| Action       | Description                          |
| :----------- | :----------------------------------- |
| `read`       | Read access to the entity            |
| `create`     | Permission to create new entities    |
| `update`     | Permission to modify existing entities |
| `delete`     | Permission to remove entities        |
| `additional` | Custom additional privileges         |

#### Usage

Pass the `privileges` array to any SDK method that supports base options:

```ts
import { notification, ui } from '@shopware-ag/meteor-admin-sdk';

notification.dispatch({
    message: 'Your product report is ready',
    privileges: [
        'product:read',
    ],
});

ui.actionButton.add({
    action: 'generate-report',
    entity: 'product',
    view: 'detail',
    label: 'Generate Report',
    privileges: [
        'product:read',
        'order:read',
    ],
});
```

#### Parameters

| Name         | Type       | Required | Description                                                                 |
| :----------- | :--------- | :------- | :-------------------------------------------------------------------------- |
| `privileges` | `string[]` | false    | Array of `action:entity` strings. All must match for the action to execute. |
