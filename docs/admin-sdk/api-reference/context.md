---
title: "Context"
sidebar_position: 40
---


# Context

The Context API provides read access to the current state of the Shopware Administration. Extensions can use these methods to retrieve information about the active language, locale, currency, environment, Shopware version, and more.

This is useful for adapting extension behavior based on the current Administration context — for example, loading translations for the active language or checking the Shopware version before using a newer API.

## Language

Retrieve or subscribe to the currently active Administration language.

### context.getLanguage()

#### Usage

```ts
const language = await context.getLanguage();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  languageId: string,
  systemLanguageId: string
}>
```

#### Example value

```ts
{
  languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
  systemLanguageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
}
```

### context.subscribeLanguage()

#### Usage

```ts
context.subscribeLanguage(({ languageId, systemLanguageId }) => {
  // do something with the callback data
});
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackMethod` | Called every-time the language changes |

#### Callback value

```ts
{
  languageId: string,
  systemLanguageId: string
}
```

#### Example callback value

```ts
{
  languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
  systemLanguageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
}
```

## Environment

Check whether the Administration is running in development, production, or testing mode.

### context.getEnvironment()

#### Usage

```ts
const environment = await context.getEnvironment();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<'development' | 'production' | 'testing'>
```

#### Example value

```ts
'development'
```

## Locale

Retrieve or subscribe to the browser locale used by the Administration UI.

### context.getLocale()

#### Usage

```ts
const locale = await context.getLocale();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  locale: string,
  fallbackLocale: string
}>
```

#### Example value

```ts
{
  locale: 'de-DE',
  fallbackLocale: 'en-GB'
}
```

### context.subscribeLocale()

#### Usage

```ts
context.subscribeLocale(({ locale, fallbackLocale }) => {
  // do something with the callback data
});
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackMethod` | Called every-time the locale changes |

#### Callback value

```ts
{
  locale: string,
  fallbackLocale: string
}
```

#### Example callback value

```ts
{
  locale: 'de-DE',
  fallbackLocale: 'en-GB'
}
```

## Currency

Retrieve the system currency configured for the Shopware instance.

### context.getCurrency()

#### Usage

```ts
const currency = await context.getCurrency();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  systemCurrencyId: string,
  systemCurrencyISOCode: string
}>
```

#### Example value

```ts
{
  systemCurrencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
  systemCurrencyISOCode: 'EUR'
}
```

## Shopware version

Query the Shopware version to conditionally enable features or check compatibility.

### context.getShopwareVersion()

#### Usage

```ts
const shopwareVersion = await context.getShopwareVersion();
```

#### Parameters

No parameters needed.

#### Return value

```ts
string
```

#### Example value

```ts
'6.4.0.0'
```

### context.compareShopwareVersion()

In many cases you have to make sure that the shop you are communicating with has a certain Shopware version. For this purpose the Meteor Admin SDK provides the `context.compareShopwareVersion` function.

The function always treats the current Shopware version of a shop as the left hand operator of the comparison. That means a call like `context.compareShopwareVersion('>=', '7.0.0')` can be read as "*Compare: is Shopware version equal or greater than 7.0.0*"

#### Usage

```ts
const isRightVersion = await context.compareShopwareVersion('>=', '7.0.0')
```

#### Parameters

| Name         | Description                                                                                                       |
|:-------------|:------------------------------------------------------------------------------------------------------------------|
| `comparator` | The operator to compare. Possible values: `'='` `'!='` `'>'` `'<'` `'<='` `'>='`|
| `version`    | The string with the version to compare

The function supports both Shopware's four-digit version number and semver versions. The following calls are equivalent:

```ts
await context.compareShopwareVersion('>=', '6.6.4.0');

await context.compareShopwareVersion('>=', '6.4.0');
```

#### Return value

```ts
boolean
```

#### Example value
```ts
true
```

## App information

Retrieve metadata about the current app or plugin, including its name, version, type, and granted privileges.

### context.getAppInformation()

> The `privileges` property is available since Shopware v6.7.1.0.

#### Usage

```ts
const { name, version, type, privileges } = await context.getAppInformation();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{ name: string ; version: string ; type: 'app' | 'plugin', privileges: privileges }>
```

#### Example value

```ts
{
  name: 'my-extension',
  version: '1.2.3',
  type: 'app'
  privileges: {
    read: [ 'product', 'customer' ],
    write: [ 'product' ],
    additional: [ 'system.cache_clear' ]
  }
}
```

## User information

Access details about the currently logged-in Administration user.

### context.getUserInformation()

> Available since Shopware v6.4.9.0

#### Usage

```ts
const userInformation = await context.getUserInformation();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  aclRoles: Array<{
    name: string,
    type: string,
    id: string,
    privileges: Array<string>,
  }>,
  active: boolean,
  admin: boolean,
  avatarId: string,
  email: string,
  firstName: string,
  id: string,
  lastName: string,
  localeId: string,
  title: string,
  type: string,
  username: string,
}>
```

#### Example value

```ts
{
    "aclRoles": [],
    "active": true,
    "admin": true,
    "avatarId": "",
    "email": "info@shopware.com",
    "firstName": "",
    "id": "e2a77f4c718d407591b4826222aa3546",
    "lastName": "admin",
    "localeId": "35bbb8c4305c47ec88b13ab30c0c5c5a",
    "title": "",
    "type": "user",
    "username": "admin"
}
```

## User Timezone

Retrieve the timezone setting of the currently logged-in user.

### context.getUserTimezone()

> Available since Shopware v6.6.2.0

#### Usage

```ts
const userTimezone = await context.getUserTimezone();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<string>
```

This function returns a Promise that resolves to a string representing the user's timezone.

## Module information

Query the list of registered extension modules to navigate between them.

### context.getModuleInformation()

Get information about all registered modules. These modules are created by adding new menu items, setting items, etc.

The ID can be used to change the current route to the module.

#### Usage

```ts
import { window as swWindow } from '@shopware-ag/meteor-admin-sdk';

const { modules } = await context.getModuleInformation();

swWindow.routerPush({
  name: 'sw.extension.sdk.index',
  params: {
    id: modules[0].id
  }
})
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  modules: Array<{
    displaySearchBar: boolean,
    heading: string,
    id: string,
    locationId: string
  }>
}>
```

#### Example value

```ts
{
  modules: [
    {
      displaySearchBar: true,
      heading: 'My module',
      id: 'sd5aasfsdfas',
      locationId: 'my-location-id'
    }
  ]
}
```

## ShopId

Retrieve the unique shop ID used by Shopware's app system.

### context.getShopId()

> Available since Shopware v6.7.1.0

#### Usage

```ts
const shopId = await context.getShopId();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<string>
```

## Check app's privileges

Check whether a specific privilege is granted for the current app. Useful for conditionally showing features.

### context.can()

> Available since Shopware v6.7.1.0

#### Usage

```ts
const isAllowed: boolean = await context.can('product:read');
```

#### Parameters

| Name        | Description                                      |
|:------------|:-------------------------------------------------|
| `privilege` | The privilege string to check, e.g. `'product:read'` |

#### Return value

```ts
boolean
```
