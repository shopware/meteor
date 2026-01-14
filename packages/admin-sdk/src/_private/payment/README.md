# Shopware Service Payment

## 1. Overview

The Platform implements the payment flow using a modal-based, multi-iframe architecture to isolate responsibilities between the host application, Service A, and the Purchase Interface.

This setup allows the Platform to trigger payments while keeping payment logic and sensitive UI encapsulated within dedicated services.


## 2. Environments

Need to setup the iframe url in your frontend code:

Staging: https://app.swagpurchaseinterface.staging-services.shopware.io

Production: https://app.swagpurchaseinterface.services.shopware.io

## 3. API Documentation

### Events
- **`PAYMENT_CLOSE`** (`'payment_close'`): Event sent when the payment process should be closed
- **`PAYMENT_SUCCESS`** (`'payment_success'`): Event sent when the payment process completes successfully
- **`PAYMENT_ERROR`** (`'payment_error'`): Event sent when an error occurs during the payment process

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

###### Example

```typescript
    let isSubscriptionActive = false;

    // start the payment flow
    const flow = startPaymentFlow();
    
    .....

    // subscribe events
    subscription = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS, () => {
      isSubscriptionActive = true;
    });

    .....

    // unsubscribe when don't need to listen anymore
    subscription.unsubscribe();
```

## 4. Integration

The payment integration consists of two main steps: triggering the payment flow and rendering the payment iframe in the modal. Follow these steps to integrate the payment functionality into your application.

### Step 1: Create the Payment Trigger

First, create a UI component (e.g., a button) that triggers the payment flow. When clicked, it will open a modal and set up event listeners for payment events.

```vue
<!-- Payment Page Component -->
<script setup lang="ts">
import { startPaymentFlow, MESSAGE_EVENT_TYPE } from "@/app/utils/payment";
import { onBeforeUnmount, ref } from "vue";

const flow = ref<Awaited<ReturnType<typeof startPaymentFlow>>>();
const isSubscriptionActive = ref(false);
const subscription = ref<{ unsubscribe: () => void }>();

const openSubscriptionModal = async () => {
  // Start the payment flow and open the modal
  flow.value = await startPaymentFlow();
  
  // Subscribe to payment success events
  subscription.value = flow.value.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS, () => {
    // Handle payment success (e.g., update UI, redirect, etc.)
    isSubscriptionActive.value = true;
  });
};

// Clean up subscription when component is destroyed
onBeforeUnmount(() => {
  subscription.value?.unsubscribe();
});
</script>

<template>
  <button @click="openSubscriptionModal">Pay</button>
</template>
```

**What happens:**
- When the button is clicked, `startPaymentFlow()` opens a modal with the location ID `sw-service-payment-modal`
- The function returns a `Flow` object that allows you to subscribe to payment events
- You can listen for `PAYMENT_SUCCESS`, `PAYMENT_ERROR`, or `PAYMENT_CLOSE` events

### Step 2: Create the Modal Route Component

Create a route component for the modal location ID `sw-service-payment-modal`. This component will render the payment iframe when the modal is opened.

**Important:** 
- The route must match the location ID: `sw-service-payment-modal`
- The component should contain an empty container div where the iframe will be mounted
- The iframe URL must be configured in your environment variables (see [Environments](#2-environments))

```vue
<!-- Modal Iframe Component (sw-service-payment-modal route) -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { addPaymentIframe } from '@/app/utils/payment';
import { useRoute } from 'vue-router';

const route = useRoute();
const iframeContainer = ref<HTMLDivElement>();
const paymentObj = ref<{ iframeEl: HTMLIFrameElement; unmount: () => void }>();

onMounted(async () => {
  if (iframeContainer.value) {
    // Add the payment iframe to the container
    paymentObj.value = await addPaymentIframe(
      iframeContainer.value,
      import.meta.env.VITE_IFRAME_URL, // Your iframe URL from environment
      {
        shopUrl: route.query?.['shop-url'] as string,
        swVersion: route.query?.['sw-version'] as string,
        swUserLanguage: route.query?.['sw-user-language'] as string,
      },
    );
  }
});

// Clean up when component is destroyed
onBeforeUnmount(() => {
  paymentObj.value?.unmount();
});
</script>

<template>
  <div ref="iframeContainer" />
</template>
```

**What happens:**
- When the modal opens, this component mounts and calls `addPaymentIframe()`
- The function creates an iframe that loads the payment service page
- Event listeners are set up to handle communication between the iframe and parent window
- The iframe automatically handles height synchronization and payment events

### Complete Integration Flow

1. **User clicks payment button** → `startPaymentFlow()` is called
2. **Modal opens** → Route component for `sw-service-payment-modal` is rendered
3. **Iframe loads** → `addPaymentIframe()` creates and mounts the payment iframe
4. **Events are handled** → Payment events are processed and broadcast
5. **Cleanup** → Both `unmount()` and `unsubscribe()` should be called when done

### Notes

- **Environment Setup**: Make sure to configure `VITE_IFRAME_URL` in your environment variables (see [Environments](#2-environments))
- **Cleanup**: Always call `unmount()` and `unsubscribe()` in `onBeforeUnmount` to prevent memory leaks
- **Event Handling**: You can subscribe to multiple event types if needed:
  ```typescript
  const successSub = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_SUCCESS, () => { /* ... */ });
  const errorSub = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_ERROR, () => { /* ... */ });
  const closeSub = flow.subscribe(MESSAGE_EVENT_TYPE.PAYMENT_CLOSE, () => { /* ... */ });
  ```
