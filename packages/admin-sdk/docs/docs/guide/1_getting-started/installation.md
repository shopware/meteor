---
title: "Installation"
sidebar_position: 1
---

# Installation

## Prerequisites:

You need to have an working [app](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide) or [plugin](https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide) installed on your Shopware 6 instance.

## Prepare your app or plugin

### App:

You need to create a HTML page with an JS file for your app. This page needs to be served by your app-server as it needs to be accesible via URL.
For development purposes you can use [App server sdk](https://github.com/FriendsOfShopware/app-server-sdk-js).

Once you got the registration/ handshake working you need to add the `<base-app-url>` field to the `<admin>` section of the [manifest](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide#manifest-file) file. This field should contain the public URL of your app. Let's assume your app HTML page is served under `http://localhost/my-example-app.html`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/platform/trunk/src/Core/Framework/App/Manifest/Schema/manifest-1.0.xsd">
    <meta>
        <name>MyExampleApp</name>
        <!-- App meta data... -->
    </meta>

    <setup>
        <registrationUrl>http://link-to-your-local-app-server/register</registrationUrl>
        <secret>S3cr3tf0re$t</secret>
    </setup>

    <admin>
        <!-- Insert your app page URL here -->
        <base-app-url>http://localhost/my-example-app.html</base-app-url>
    </admin>
</manifest>
```

In your new HTML file you need inject a JS file. This file can use the Meteor Admin SDK via CDN or if you want to use a build tools then you
can use the NPM package.

### Plugin:
**Notice:** Plugins will work on self-hosted instances only. You won't be able to use a Shopware 6 cloud instance with plugins.

Open the path `custom/plugins/yourPlugin/src/Resources/app/administration`. This is the base path for all new admin files.

Create a new base `index.html` file. This file will be automatically injected to the administration when the plugin is activated. Then you need to create a JavaScript file in the subfolder `src/main.js`. This file will be automatically injected into the created HTML file.

For plugins the best way is to install the SDK via NPM. But first you need to initialize a new NPM project in your plugin folder with
`npm init --yes`.

## Installing the SDK:

The preferred way of using the library is with a NPM package. This guarantees the smallest bundle size for your apps and plugins, since this way only necessary functions are bundled together.

The CDN method is easy to use and fast to implement. It is best used for quick prototyping or if you don't want to work with building tools.

### Using NPM (require bundling):
Install it to your `package.json`
```
npm i --save @shopware-ag/meteor-admin-sdk
```

and import it into your app or plugin:
```js
// import everything as one big object
import * as sw from '@shopware-ag/meteor-admin-sdk';

// or import only needed functionality scope
import { notification }  from '@shopware-ag/meteor-admin-sdk';

// or the direct method (here with an alias)
import { dispatch as dispatchNotification } from '@shopware-ag/meteor-admin-sdk/es/notification'

```

### Using CDN:
Import the source from the CDN

```js
// use the latest version available
<script src="https://unpkg.com/@shopware-ag/meteor-admin-sdk/cdn"></script>

// use a fix version (example here: 1.2.3)
<script src="https://unpkg.com/@shopware-ag/meteor-admin-sdk@1.2.3/cdn"></script>
```

and access it with the global variable `sw`.

```js
sw.notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
})
```

## Adding types for Entities (TS only)

The data management inside the SDK supports complete TypeScript support. This allows complete type safety when getting
entities, editing or saving them.

For adding the types you need to create a global type definition file like `global.d.ts`. Inside this file you can
add the types for the entities by extending the global namespace.

### Using auto-generated types from Shopware
This is the easiest solution. Just install the correct type definition for the matching shopware version:

`npm install @shopware-ag/entity-schema-types@5.0.0`

The version number should match the Shopware version number without the `6.` in the beginning. Examples:  

`Shopware 6.5.0.0` → `@shopware-ag/entity-schema-types@5.0.0`
`Shopware 6.5.1.2` → `@shopware-ag/entity-schema-types@5.1.2`
`Shopware 6.6.3.1` → `@shopware-ag/entity-schema-types@6.3.1`

```ts
// global.d.ts
import '@shopware-ag/entity-schema-types';
```

### Using "any" fallback

This is the easiest solution. You set the type to `any` for every entity. The downside of this is the missing type safety.

```ts
// global.d.ts
declare namespace EntitySchema {
    interface Entities {
        [entityName: string]: any;
    }
}
```

### Using custom types

This is the safest solution. You define for every needed entity every property and association. The downside of this is
that it takes time to write the definitions.

```ts
// global.d.ts
declare namespace EntitySchema {
    interface Entities {
        // using product_manufacturer as an example
        product_manufacturer: product_manufacturer;
        // in this case 'media', 'product' and 'product_manufacturer_translation' is also needed
        ...
    }

    interface product_manufacturer {
        id: string;
        versionId: string;
        mediaId?: string;
        link?: string;
        name: string;
        description?: string;
        customFields?: unknown;
        /* 
        * Entity and EntityCollection is defined in the namespace and can directly be used.
        * The value in the generic (here 'media', 'product' and 'product_manufacturer_translation') need
        * also to be defined in this file.
        */ 
        media?: Entity<'media'>;
        products?: EntityCollection<'product'>;
        translations: EntityCollection<'product_manufacturer_translation'>;
        createdAt: string;
        updatedAt?: string;
        translated?: {name?: string, description?: string, customFields?: unknown};
    }

    // 'media', 'product' and 'product_manufacturer_translation' also needs to be added
    ...
}
```