---
"@shopware-ag/meteor-admin-sdk": minor
---

Add an optional `options` argument with a `timeout` (milliseconds, default 7000, at most 60000) to `search`, `get`, `save`, `clone`, `saveAll` and `delete` of `data.repository()`, for requests that need longer than the 7 second default. The message sent to the Administration is unchanged, and a timeout still does not cancel the request there. Repositories that `useRepository()` / `getRepository()` take from a `repositoryFactory` ignore the option. `send()` now also clears its timer when answered and stops listening once it timed out.
