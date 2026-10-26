---
"@shopware-ag/meteor-admin-sdk": minor
---

Add service-to-service request/response messaging through `_private.bridge.publishServiceEvent` and `_private.bridge.subscribeServiceEvent` for services embedded in the Shopware Administration.

The bridge handles origin validation, event contracts, response correlation, configurable timeouts, request deduplication, and per-subscription concurrency, which defaults to `single`. It includes service origin constants and the `copilot.chat.prompt.v1` contract.

Add Zod as a runtime dependency for message and event schema validation. SDK failures use a separate response discriminator and structured `ServiceEventError` codes, including `INVALID_PARAMS` for invalid origins or timeouts.
