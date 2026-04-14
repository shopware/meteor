# Consent

:::caution
The consent API is experimental. Behavior, payloads, and availability may still change in upcoming Shopware versions.
:::

> Available since Shopware v6.7.10.0

The `sw.consent` API can be used to inspect the current state of a consent and to trigger a consent request flow in the Administration.

`sw.consent.status()` returns a `Promise<Consent>`.
`sw.consent.request()` returns an object with:
- `requestPromise: Promise<Consent>`
- `abort: (reason: unknown) => void`

## `Consent`

`Consent` is the value object returned by the consent API. It represents the current state of a consent in Shopware.

### Properties

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Technical name of the consent. |
| `status` | `'unset' \| 'declined' \| 'revoked' \| 'accepted'` | Current consent status. |
| `updatedAt` | `string \| null` | Timestamp of the last consent state update. |
| `acceptedRevision` | `string \| null` | Revision that was accepted by the user. |
| `lastRevision` | `string \| null` | Latest known revision of the consent. |

### Derived flags

| Name | Type | Description |
| :------ | :------ | :------ |
| `isAccepted` | `boolean` | `true` when the current status is `accepted`. |
| `isStale` | `boolean` | `true` when the consent is accepted, but the accepted revision differs from the latest revision. |

### Example

```ts
const consent = await sw.consent.status({
  consent: 'product_analytics',
});

if (consent.isAccepted && !consent.isStale) {
  console.log(`Consent "${consent.name}" is up to date.`);
}
```

## Get consent status

Read the current state of a consent without opening a consent prompt.

#### Usage

```ts
const consent = await sw.consent.status({
  consent: 'product_analytics',
});
```

#### Parameters

| Name | Required | Description |
| :------ | :------ | :------ |
| `consent` | true | Technical name of the consent to load. |

#### Return value

```ts
Promise<Consent>
```

#### Example value

```ts
{
  name: 'product_analytics',
  status: 'accepted',
  updatedAt: '2026-04-13T11:00:00.000Z',
  acceptedRevision: '2026-03-01',
  lastRevision: '2026-05-01',
  isAccepted: true,
  isStale: true,
}
```

## Request consent

Trigger the consent request flow in the Administration and resolve with the resulting consent state.

#### Usage

```ts
const { requestPromise } = sw.consent.request({
  consent: 'product_analytics',
  requestMessage: 'Please confirm that we may track Admin usage data.',
  privacyLink: 'https://www.shopware.com/en/privacy/dpa/',
});

const consent = await requestPromise;
```

#### Parameters

| Name | Required | Description |
| :------ | :------ | :------ |
| `consent` | true | Technical name of the consent to request. |
| `requestMessage` | false | Optional message shown together with the consent request. |
| `privacyLink` | false | Optional link to the privacy policy or related information. |

#### Return value

```ts
{
  requestPromise: Promise<Consent>,
  abort: (reason: unknown) => void,
}
```

`requestPromise` resolves when Shopware sends back the matching consent response.

#### Abort example

```ts
const { requestPromise, abort } = sw.consent.request({
  consent: 'product_analytics',
});

const timeout = setTimeout(() => {
  abort(new Error('Consent request timed out'));
}, 5000);

try {
  const consent = await requestPromise;
  console.log(consent.status);
} catch (error) {
  console.error(error);
} finally {
  clearTimeout(timeout);
}
```
