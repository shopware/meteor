# In-App Purchase Flow

In-App purchases allow you to create different functionality based on purchases the user has made in your app. This guide will show you how to start the in-app purchase flow.

### Opening modal with details of feature

To open a modal with the details of the feature you want to purchase, you can use the following code:

```ts
sw.iap.trigger({
    featureName: 'Your Feature Name',
    priceModel: 'The price model that the user selected',
});
```

This will create a modal in admin which takes the user through the checkout flow in which the app will be purchased or subscribed to.
