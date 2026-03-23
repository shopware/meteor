---
title: "Payment Overview Cards"
nav:
  position: 20
---


# Payment Overview Cards

A payment overview card allows extensions to customize how a payment method appears in the payment methods overview in the Shopware Administration.

Starting with Shopware **6.4.14.0**, extensions can replace the default payment method card with a custom component. This makes it possible to add additional logic before a payment method can be activated.

For example, you might require merchants to complete an onboarding process with your payment provider before enabling the payment method.

## Parameters

| Name                    | Required | Default        | Description                                                                                                                         |
|:------------------------|:---------| :------------- |:------------------------------------------------------------------------------------------------------------------------------------|
| `positionId`            | true     |                | The position id that is created in the payment overview, where you can add a component section to                                   |
| `paymentMethodHandlers` | true     |                | A list of formatted payment method handlers, which are handled by your component and where the default card should not be rendered. |
| `component`             | false    |                | The component name of you custom payment overview card. Only useful, if you have a plugin with a registered component               |

## Extension example

```ts
import { ui, location } from '@shopware-ag/meteor-admin-sdk';

if (location.is(location.MAIN_HIDDEN)) {
  ui.module.payment.overviewCard.add({
    positionId: 'my-custom-payment-overview-position',
    paymentMethodHandlers: [
      'handler_my_custom_payment_method_one',
      'handler_my_custom_payment_method_two', 
    ],
  });
    
  ui.componentSection.add({
    component: 'card',
    positionId: 'my-custom-payment-overview-position',
    props: {
      title: 'My payment provider',
      subtitle: 'We have all the methods that exist',
      locationId: 'my-custom-payment-overview-position-before'
    }
  })
}

if (location.is('my-custom-payment-overview-position-before')) {
  // your content here
}
```

## Custom plugin component example

```ts
import { ui } from '@shopware-ag/meteor-admin-sdk';

// register a custom component
Component.register('my-custom-payment-overview-card', {
  template: ``,// your template here
  props: {
    paymentMethods: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async changePaymentMethodActive(paymentMethod) {
      paymentMethod.active = !paymentMethod.active;

      this.$emit('set-payment-active', paymentMethod);
    },
  },
});

// add that component to the payment overview
ui.module.payment.overviewCard.add({
  component: 'my-custom-payment-overview-card',
  positionId: 'my-custom-payment-overview-position',
  paymentMethodHandlers: [
    'handler_my_custom_payment_method_one',
    'handler_my_custom_payment_method_two',
    // ...
  ],
});
```
