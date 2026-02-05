# Shopware Service Payment

## 1. Overview

The Platform implements the payment flow using a modal-based, multi-iframe architecture to isolate responsibilities between the host application, Service A, and the Purchase Interface.

This setup allows the Platform to trigger payments while keeping payment logic and sensitive UI encapsulated within dedicated services.


## 2. Environments

Need to setup the iframe url in your frontend code:

Staging: https://app.swagpurchaseinterface.staging-services.shopware.io

Production: https://app.swagpurchaseinterface.services.shopware.io

## 3. API Documentation


### Functions

#### `addPaymentIframe`

Adds a payment iframe to the specified DOM element.

This function creates an iframe that loads a payment service page and sets up event listeners to handle communication between the iframe and parent window. The iframe will handle various payment events like height synchronization, payment success, payment errors, and payment close.

##### Parameters

- **`el`** (`HTMLElement`): The HTML element to append the iframe to
- **`baseUrl`** (`string`): The base URL of the payment service
- **`options`** (`object`): Configuration options for the payment iframe
  - **`shopUrl`** (`string`): The URL of the shop
  - **`swVersion`** (`string`): The Shopware version
  - **`swUserLanguage`** (`string`): The user's language code

##### Returns

A promise that resolves to an object containing:
- **`iframeEl`** (`HTMLIFrameElement`): The created iframe element
- **`unmount`** (`() => void`): A function to clean up event listeners and close the channel

##### Example

```typescript
const container = document.getElementById('payment-container');
const { iframeEl, unmount } = await addPaymentIframe(container, 'https://payment.example.com', {
  shopUrl: 'https://shop.example.com',
  swVersion: '6.5.0',
  swUserLanguage: 'en-GB'
});

// Later, when done:
unmount();
```

#### `startPaymentFlow`

Starts the payment flow by opening a modal and returning a flow object.

This function opens a modal dialog for the payment process and returns a Flow object that allows subscribing to payment events. The modal is configured to be small, without header or footer, and not closable by the user.

##### Returns

A promise that resolves to a `Flow` object with subscription capabilities.
```
type Flow = {
  subscribe: (eventType: MESSAGE_EVENT_TYPE, callback: () => void) => {
    unsubscribe: () => void,
  },
}
```

##### Example

```typescript
    let isSubscribed = false;

    // start the payment flow
    const flow = startPaymentFlow();
    
    .....

    // subscribe events
    subscription = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS, () => {
      isSubscribed = true;
    });

    .....

    // unsubscribe when don't need to listen anymore
    subscription.unsubscribe();
```

#### `decodeLicense`

Decodes the shop license JWT from system config and returns the payload.

Reads the license key from `core.store.licenseKey` in system config, decodes the JWT, and returns the token payload containing plan information and license toggles. Returns `null` if no license is stored, the token is invalid, or any error occurs.

##### Returns

A promise that resolves to the decoded license payload or `null`:

- **Success**: An object with at least:
  - **`plan-name`** (`string`): The plan name (e.g. `'premium'`)
  - **`plan-usage`** (`string`): Usage type (e.g. `'commercial'`)
  - **`plan-variant`** (`string`): Plan variant
  - **`license-toggles`** (`Record<string, boolean>`): Feature toggles from the license
  - **`aud`**, **`exp`**, **`iat`**, **`iss`**, **`nbf`**, **`swemp`**: Standard JWT and Shopware fields
- **Failure**: `null` (no config, invalid token, or error)

##### Example

```typescript
const license = await decodeLicense();
if (license) {
  console.log(license['plan-name']);
  console.log(license['license-toggles']);
} else {
  console.log('No valid license');
}
```

### Events
- **`PAYMENT_CLOSE`** (`'payment_close'`): Event sent when the payment process should be closed
- **`PAYMENT_SUCCESS`** (`'payment_success'`): Event sent when the payment process completes successfully
- **`PAYMENT_ERROR`** (`'payment_error'`): Event sent when an error occurs during the payment process

**Event Handling**: You can subscribe to multiple event types if needed:
  ```typescript
  const successSub = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS, () => { /* ... */ });
  const errorSub = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_ERROR, () => { /* ... */ });
  const closeSub = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_CLOSE, () => { /* ... */ });
  ```

### Notes
- **Environment Setup**: Make sure to configure iframe url in your environment variables (see [Environments](#2-environments))
- **Cleanup**: Always call `unmount()` and `unsubscribe()` when component unmount to prevent memory leaks
