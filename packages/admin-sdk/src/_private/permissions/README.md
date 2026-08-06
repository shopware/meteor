# Shopware Service Permissions

This private SDK API is available to Shopware Services through the `_private` namespace.

```ts
import { _private } from '@shopware-ag/meteor-admin-sdk';

await _private.permissions.grant();
```

The Administration resolves the current permissions revision and grants it through the platform service. The revision is intentionally not supplied by the service.
