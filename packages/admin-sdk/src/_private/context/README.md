# Shopware Service Context

This private SDK API is available to Shopware Services through the `_private` namespace.

## `isService()`

```ts
import { _private } from '@shopware-ag/meteor-admin-sdk';

const isService = await _private.context.isService(): Promise<boolean>;
```

Resolves to `true` only when the current extension is a Shopware Service. Intended as a UI/rendering gate (e.g. deciding whether to show a grant banner). It is **not** a security boundary — the platform re-validates the caller when handling `_private.permissions.grant()`.
