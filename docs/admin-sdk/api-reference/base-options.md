# Base options
There are options that exist for every message type in the SDK. You'll find a list with all of them below.

| Name         | Required | Default        | Availability        | Description                                                                                     |
| :----------- | :------- | :------------- | :------------------ | :---------------------------------------------------------------------------------------------- |
| `privileges` | false    |                | >= Shopware 6.6.3.0 | The privileges that will be checked before executing the message in the Shopware Administration |

## Example privileges
```typescript
import * as sw from '@shopware-ag/meteor-admin-sdk';

// This notification will only be displayed if the user has `product:read` permissions.
sw.notification.dispatch({
    message: 'Your product report is ready',
    privileges: [
        'product:read',
    ],
});
```
