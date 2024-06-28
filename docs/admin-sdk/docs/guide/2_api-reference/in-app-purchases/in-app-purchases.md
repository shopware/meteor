# In-App Purchase Flow

> Available since Shopware v6.6.7.0
> 
In-App purchases allow you to create different functionality based on purchases the user has made in your app. This guide will show you how to start the in-app purchase flow.

### Opening modal with details of feature

To open a modal with the details of the feature you want to purchase, you can use the following code:

```ts
sw.iap.trigger({
    featureId: 'your-feature-id',
});
```

This will create a modal in admin which takes the user through the checkout flow in which the app will be purchased or subscribed to.
