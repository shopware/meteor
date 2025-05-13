# Context

## Language

### Get current language

#### Usage:  
```ts
const language = await sw.context.getLanguage();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{
  languageId: string,
  systemLanguageId: string
}>
```

#### Example value:
```ts
{
  languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
  systemLanguageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
}
```

### Subscribe on language changes

#### Usage:  
```ts
sw.context.subscribeLanguage(({ languageId, systemLanguageId }) => {
  // do something with the callback data
});
```

#### Parameters
| Name | Description |
| :------ | :------ |
| `callbackMethod` | Called every-time the language changes |

#### Callback value:
```ts
{
  languageId: string,
  systemLanguageId: string
}
```

#### Example callback value:
```ts
{
  languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
  systemLanguageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
}
```

## Environment

### Get current environment

#### Usage:  
```ts
const environment = await sw.context.getEnvironment();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<'development' | 'production' | 'testing'>
```

#### Example value:
```ts
'development'
```

## Locale

### Get current locale

#### Usage:  
```ts
const locale = await sw.context.getLocale();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{
  locale: string,
  fallbackLocale: string
}>
```

#### Example value:
```ts
{
  locale: 'de-DE',
  fallbackLocale: 'en-GB'
}
```

### Subscribe on locale changes

#### Usage:  
```ts
sw.context.subscribeLocale(({ locale, fallbackLocale }) => {
  // do something with the callback data
});
```

#### Parameters
| Name | Description |
| :------ | :------ |
| `callbackMethod` | Called every-time the locale changes |

#### Callback value:
```ts
{
  locale: string,
  fallbackLocale: string
}
```

#### Example callback value:
```ts
{
  locale: 'de-DE',
  fallbackLocale: 'en-GB'
}
```

## Currency

### Get current currency

#### Usage:  
```ts
const currency = await sw.context.getCurrency();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{
  systemCurrencyId: string,
  systemCurrencyISOCode: string
}>
```

#### Example value:
```ts
{
  systemCurrencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
  systemCurrencyISOCode: 'EUR'
}
```

## Shopware version

### Get current Shopware version

#### Usage:  
```ts
const shopwareVersion = await sw.context.getShopwareVersion();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
string
```

#### Example value:
```ts
'6.4.0.0'
```

### Compare current Shopware version with a given version

In many cases you have to make sure that the shop you are communicating with has a certain Shopware version. For this purpose the Meteor Admin SDK provides the `context.compareIsShopwareVersion` function.

The function always treats the current Shopware version of a shop as the left hand operator of the comparison. That means a call like `context.compareIsShopwareVersion('>=', '7.0.0')` can be read as "*Compare: is Shopware version equal or greater than 7.0.0*"

#### Usage:  
```ts
const isRightVersion = await sw.context.compareShopwareVersion('>=', '7.0.0')
```

#### Parameters
| Name         | Description                                                                                                       |
|:-------------|:------------------------------------------------------------------------------------------------------------------|
| `comparator` | The operator to compare. Possible values: `'='` `'!='` `'>'` `'<'` `'<='` `'>='`|
| `version`    | The string with the version to compare


The function supports both, Shopware's four-digit version number and semver versions. The following calls are equivalent:

```ts
await sw.context.compareShopwareVersion('>=', '6.6.4.0');

await sw.context.compareShopwareVersion('>=', '6.4.0');
```

#### Return value:

```ts
boolean
```

#### Example value:
```ts
true
```

## App information

### Get app information

#### Usage:  
```ts
const { name, version, type } = await sw.context.getAppInformation();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{ name: string ; version: string ; type: 'app' | 'plugin' }>
```

#### Example value:
```ts
{
  name: 'my-extension',
  version: '1.2.3',
  type: 'app'
}
```

## User information

### Get user information

:::caution
Do not use this feature yet. It is not implemented in a Shopware release yet.
:::

#### Usage:  
```ts
const userInformation = await sw.context.getUserInformation();
```

#### Parameters
No parameters needed.

#### Return value:
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

#### Example value:
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

### Get user timezone

:::caution
This feature will be available with Shopware ^6.6.2.0
:::

This feature allows you to get the timezone of the user.

#### Usage:
```ts
const userTimezone = await sw.context.getUserTimezone();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<string>
```

This function returns a Promise that resolves to a string representing the user's timezone.

## Module information

### Get module information
Get information about all registered modules. These modules are created by adding new menu items, setting items, etc.

The ID can be used to change the current route to the module.

#### Usage:  
```ts
const { modules } = await sw.context.getModuleInformation();

sw.window.routerPush({
  name: 'sw.extension.sdk.index',
  params: {
    id: modules[0].id // get the ID of the wanted module
  }
})
```

#### Parameters
No parameters needed.

#### Return value:
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

#### Example value:
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

### Get the shopId

> Available since Shopware v6.7.1.0

Get the shop's shop-id used by Shopware's app system

#### Usage

```ts
 const shopId = await sw.context.getShopId();
```

#### Parameters

no parameters needed

#### Return value:

```ts
Promise<string>
```