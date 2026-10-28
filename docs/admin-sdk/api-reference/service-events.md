---
title: "Service Communication"
nav:
  position: 90
---

# Service communication

Use service events to send a request from one Shopware service iframe to another and await its response. The bridge is available through `@shopware-ag/meteor-admin-sdk/es/_private/bridge`.

The SDK handles messaging, origin checks, schema validation, request IDs, responses, timeouts, deduplication, and concurrency. Your service supplies the event handler and implements its business operation.

## Before integrating

- Both services must run as direct child iframes of the same Administration window. Nested service frames and cross-tab delivery are not supported.
- The receiver must be loaded and subscribed before publishing.
- Agree on the destination origin, receiving location ID, event key, and payload contract.
- Use compatible SDK versions in both services.

## publishServiceEvent(params)

Sends once to the Administration's direct child frames using the exact target origin. Each receiver filters by location ID and event key. Returns `Promise<unknown>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `targetOrigin` | `string` | Yes | Exact destination origin, such as `https://copilot.apps.shopware.io`. No path, trailing slash, or wildcard. |
| `targetLocationId` | `string` | Yes | Exact location ID exposed by the receiving iframe's `location.get()`. |
| `eventKey` | `string` | Yes | Shared event identifier, for example `copilot.chat.prompt.v1`. |
| `data` | `unknown` | Yes | Request payload. Must be supported by structured cloning and satisfy the request schema when one exists. |
| `options` | `object` | No | Publishing configuration. |
| `options.timeout` | `number` | No | Finite milliseconds greater than zero and at most **60,000**, inclusive. Defaults to **10,000**. |

Use meaningful, nonempty location IDs and event keys. The current implementation does not reject empty routing strings during parameter validation; unmatched values eventually time out.

The first valid correlated response settles the promise. A handler result resolves it after response-schema validation; an SDK failure rejects it. Later responses are ignored. Other receiving handlers may still be executing.

There is no automatic retry. A timeout stops the publisher waiting but does not cancel the receiving handler or prove that the operation did not execute.

## subscribeServiceEvent(eventKey, handler, options)

Registers one subscription and returns an idempotent `() => void` unsubscribe callback.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `eventKey` | `string` | Yes | Exact event key to receive. |
| `handler` | `(data: unknown) => unknown \| Promise<unknown>` | Yes | Business operation. Its return value becomes the response. Return the promise for asynchronous work. |
| `options` | `object` | Yes | Subscription configuration. |
| `options.allowedOrigins` | `readonly string[]` | Yes | Permitted sender origins. No default. `['*']` permits all origins; `[]` permits none. |
| `options.concurrency` | `'single' \| 'parallel'` | No | Defaults to `single`. Overlapping calls to a single-concurrency subscription are rejected with `HANDLER_BUSY`. |

The SDK reads the receiving location through `location.get()`. A missing or empty location ID throws `MISSING_LOCATION_ID` during subscription setup.

Multiple subscriptions for the same event key are allowed. Each matching authorized subscription can execute. Multiple matching receiver frames are also allowed; publishers receive only the first response that settles their request.

Unsubscribing removes only that subscription. It does not cancel an already running handler.

## Example: send a prompt to Copilot

The example uses the built-in `copilot.chat.prompt.v1` contract.

### Subscribe to prompts

Register once when the receiving iframe initializes. Its location ID must be `copilot-chat`.

```ts
import { subscribeServiceEvent, SERVICE_ORIGINS } from '@shopware-ag/meteor-admin-sdk/es/_private/bridge';

const unsubscribe = subscribeServiceEvent(
  'copilot.chat.prompt.v1',
  async (data) => {
    const { prompt } = data as { prompt: string };
    await createConversation(prompt); // assume create a conversation with above prompt
    return { status: 'success' };
  },
  { allowedOrigins: [SERVICE_ORIGINS.ANALYTICS] },
);
```

### Publish a prompt

```ts
import { publishServiceEvent, SERVICE_ORIGINS } from '@shopware-ag/meteor-admin-sdk/es/_private/bridge';

try {
  const response = await publishServiceEvent({
    targetOrigin: SERVICE_ORIGINS.COPILOT,
    targetLocationId: 'copilot-chat', // Must match the location-id of the iframe that subscribes.
    eventKey: 'copilot.chat.prompt.v1',
    data: { prompt: 'List the top 10 products by revenue in the last 30 days.' },
  }) as { status: 'success' | 'error'; message?: string };

  console.log(response.status, response.message);
} catch (error) {
  console.error('Prompt submission failed:', error);
}
```
