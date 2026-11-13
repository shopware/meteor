# Internal service communication

This private API is intended for internal Shopware services. It is not part of the public Admin SDK API and may change as service integrations evolve. Import it from `@shopware-ag/meteor-admin-sdk/es/_private/bridge`.

The SDK handles messaging, origin checks, schema validation, request IDs, responses, timeouts, deduplication, and concurrency. Your service supplies the event handler and implements its business operation.

## Before integrating

- Both services must run as direct child iframes of the same Administration window. Nested service frames and cross-tab delivery are not supported.
- The receiver must be loaded and subscribed before publishing.
- Agree on the destination origin, receiving location ID, event key, and payload contract.
- Use compatible SDK versions in both services.
- Each destination origin and location ID must identify one receiving iframe. Multiple matching receiver frames are not supported in this phase.

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

The first valid correlated response settles the promise. A handler result resolves it after response-schema validation; an SDK failure rejects it. Later responses are ignored.

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

Only one subscription per event key and location ID is allowed within an iframe. A second registration throws `ServiceEventError` with code `DUPLICATE_SUBSCRIPTION`, even if its handler or options differ. Unsubscribe before registering a replacement. Different event keys can have separate subscriptions.

This check is local to the iframe; it does not detect duplicate destinations across frames.

Unsubscribing removes only that subscription. It does not cancel an already running handler.

## Errors

`HANDLER_ERROR` reports an exception thrown by the business handler. `INTERNAL_ERROR` reports an unexpected error while the SDK processes a request. Both are returned as SDK errors to the publisher.

## Built-in contracts

The SDK validates these events on both sides. Events without a contract are delivered unvalidated.

| Event key | Publisher → receiver | Receiving location ID | Request | Response |
|---|---|---|---|---|
| `copilot.chat.prompt.v1` | Any allowed service → Copilot | `copilot-chat` | `{ prompt: string }` (nonempty, no other fields) | `{ status: 'success' \| 'error', message?: string }` |
| `analytics.dashboards.changed.v1` | Copilot → Analytics | `sw-main-hidden` | Object, no required fields; unknown fields are accepted | `{ status: 'success' \| 'error', message?: string }` |

`analytics.dashboards.changed.v1` tells Analytics that charts or dashboards of the current user may have changed, so it can reload them. It carries no details; the receiver refetches. Publish it fire-and-forget: `TIMEOUT` is expected when Analytics is not installed or not loaded.

New fields may be added to a v1 request only as optional fields that receivers can ignore. Anything else needs a new event key, such as `analytics.dashboards.changed.v2`.

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

## Example: notify Analytics about changed dashboards

### Subscribe in Analytics

Register in the Administration's hidden iframe, whose location ID is `sw-main-hidden` (`location.MAIN_HIDDEN`).

```ts
import { subscribeServiceEvent, SERVICE_ORIGINS } from '@shopware-ag/meteor-admin-sdk/es/_private/bridge';

subscribeServiceEvent(
  'analytics.dashboards.changed.v1',
  () => {
    reloadDashboards(); // your app refetches its charts and dashboards
    return { status: 'success' };
  },
  { allowedOrigins: [SERVICE_ORIGINS.COPILOT] },
);
```

### Publish from Copilot

```ts
import { publishServiceEvent, SERVICE_ORIGINS } from '@shopware-ag/meteor-admin-sdk/es/_private/bridge';

publishServiceEvent({
  targetOrigin: SERVICE_ORIGINS.ANALYTICS,
  targetLocationId: 'sw-main-hidden',
  eventKey: 'analytics.dashboards.changed.v1',
  data: {},
}).catch(() => {
  // Analytics may not be installed or loaded.
});
```
