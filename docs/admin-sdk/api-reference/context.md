---
title: "Context"
sidebar_position: 40
---

# Context

The Context API provides read access to the current state of the Shopware Administration. Extensions can use these methods to retrieve information about the active language, locale, currency, environment, Shopware version, and more.

This is useful for adapting extension behavior based on the current Administration context — for example, loading translations for the active language or checking the Shopware version before using a newer API.

```ts
import { context } from "@shopware-ag/meteor-admin-sdk";
```

## context.getLanguage()

Returns the current Administration language ID and the system default language ID. Use this to load the correct translations or filter data by language.

#### Usage

```ts
const language = await context.getLanguage();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  languageId: string;
  systemLanguageId: string;
}>;
```

#### Example value

```ts
{
  languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
  systemLanguageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
}
```

## context.subscribeLanguage()

Subscribes to language changes in the Administration. The callback fires whenever the user switches languages, allowing extensions to react immediately (e.g. reloading translated content).

#### Usage

```ts
context.subscribeLanguage(({ languageId, systemLanguageId }) => {
  // do something with the callback data
});
```

#### Parameters

| Name             | Description                            |
| :--------------- | :------------------------------------- |
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

## context.getEnvironment()

Returns the current Administration environment mode. Use this to enable debug features or disable analytics in non-production environments.

#### Usage

```ts
const environment = await context.getEnvironment();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<"development" | "production" | "testing">;
```

#### Example value

```ts
"development";
```

## context.getLocale()

Returns the browser locale used by the Administration UI, including a fallback locale. Use this to format dates, numbers, or currencies according to the user's regional settings.

#### Usage

```ts
const locale = await context.getLocale();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  locale: string;
  fallbackLocale: string;
}>;
```

#### Example value

```ts
{
  locale: 'de-DE',
  fallbackLocale: 'en-GB'
}
```

## context.subscribeLocale()

Subscribes to locale changes in the Administration. The callback fires whenever the locale changes, allowing extensions to re-render locale-dependent content like formatted dates or currencies.

#### Usage

```ts
context.subscribeLocale(({ locale, fallbackLocale }) => {
  // do something with the callback data
});
```

#### Parameters

| Name             | Description                          |
| :--------------- | :----------------------------------- |
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

## context.getCurrency()

Returns the system currency configured for the Shopware instance. Use this when displaying prices or working with monetary values.

#### Usage

```ts
const currency = await context.getCurrency();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  systemCurrencyId: string;
  systemCurrencyISOCode: string;
}>;
```

#### Example value

```ts
{
  systemCurrencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
  systemCurrencyISOCode: 'EUR'
}
```

## context.getShopwareVersion()

Returns the Shopware version as a string. Use this to conditionally enable features or check compatibility before using newer APIs.

#### Usage

```ts
const shopwareVersion = await context.getShopwareVersion();
```

#### Parameters

No parameters needed.

#### Return value

```ts
string;
```

#### Example value

```ts
"6.4.0.0";
```

## context.compareShopwareVersion()

Compares the current Shopware version against a target version. The current Shopware version is always the left-hand side of the comparison — so `context.compareShopwareVersion('>=', '7.0.0')` reads as "is the current Shopware version equal to or greater than 7.0.0?"

#### Usage

```ts
const isRightVersion = await context.compareShopwareVersion(">=", "7.0.0");
```

#### Parameters

| Name         | Description                                                                      |
| :----------- | :------------------------------------------------------------------------------- |
| `comparator` | The operator to compare. Possible values: `'='` `'!='` `'>'` `'<'` `'<='` `'>='` |
| `version`    | The string with the version to compare                                           |

The function supports both Shopware's four-digit version number and semver versions. The following calls are equivalent:

```ts
await context.compareShopwareVersion(">=", "6.6.4.0");

await context.compareShopwareVersion(">=", "6.4.0");
```

#### Return value

```ts
boolean;
```

#### Example value

```ts
true;
```

## context.getAppInformation()

Returns metadata about the current app or plugin, including its name, version, type, and granted privileges. Use this to adapt behavior based on the extension type or check which permissions were granted.

> The `privileges` property is available since Shopware v6.7.1.0.

#### Usage

```ts
const { name, version, type, privileges } = await context.getAppInformation();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  name: string;
  version: string;
  type: "app" | "plugin";
  privileges: privileges;
}>;
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

## context.getUserInformation()

Returns details about the currently logged-in Administration user, including their roles, email, and admin status. Use this to personalize the extension UI or check user permissions.

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
    name: string;
    type: string;
    id: string;
    privileges: Array<string>;
  }>;
  active: boolean;
  admin: boolean;
  avatarId: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  localeId: string;
  title: string;
  type: string;
  username: string;
}>;
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

## context.getUserTimezone()

Returns the timezone setting of the currently logged-in user. Use this to display dates and times in the user's local timezone.

> Available since Shopware v6.6.2.0

#### Usage

```ts
const userTimezone = await context.getUserTimezone();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<string>;
```

This function returns a Promise that resolves to a string representing the user's timezone.

## context.getModuleInformation()

Returns the list of all registered extension modules (created by adding menu items, settings items, etc.). Use the module ID to navigate between extensions.

#### Usage

```ts
import { window as swWindow } from "@shopware-ag/meteor-admin-sdk";

const { modules } = await context.getModuleInformation();

swWindow.routerPush({
  name: "sw.extension.sdk.index",
  params: {
    id: modules[0].id,
  },
});
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<{
  modules: Array<{
    displaySearchBar: boolean;
    heading: string;
    id: string;
    locationId: string;
  }>;
}>;
```

#### Example value

```ts
{
  modules: [
    {
      displaySearchBar: true,
      heading: "My module",
      id: "sd5aasfsdfas",
      locationId: "my-location-id",
    },
  ];
}
```

## context.getShopId()

Returns the unique shop ID used by Shopware's app system. Use this to identify the shop instance when communicating with external services.

> Available since Shopware v6.7.1.0

#### Usage

```ts
const shopId = await context.getShopId();
```

#### Parameters

No parameters needed.

#### Return value

```ts
Promise<string>;
```

## context.can()

Checks whether a specific privilege is granted for the current app. Use this to conditionally show features that require specific permissions.

> Available since Shopware v6.7.1.0

#### Usage

```ts
const isAllowed: boolean = await context.can("product:read");
```

#### Parameters

| Name        | Description                                          |
| :---------- | :--------------------------------------------------- |
| `privilege` | The privilege string to check, e.g. `'product:read'` |

#### Return value

```ts
boolean;
```
