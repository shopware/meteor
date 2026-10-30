---
"@shopware-ag/meteor-admin-sdk": minor
---

Add an internal service-to-service request/response bridge for Shopware services through `publishServiceEvent` and `subscribeServiceEvent`, imported from `@shopware-ag/meteor-admin-sdk/es/_private/bridge`.

The bridge handles origin validation, event contracts, response correlation, configurable timeouts, request deduplication, and per-subscription concurrency, which defaults to `single`. It includes service origin constants and the `copilot.chat.prompt.v1` contract.

Add Zod as a runtime dependency for message and event schema validation. SDK failures use a separate response discriminator and structured `ServiceEventError` codes, including `INVALID_PARAMS` for invalid origins or timeouts.

The bridge is available only through its subpath export so importing the SDK root does not include bridge validation and Zod.
