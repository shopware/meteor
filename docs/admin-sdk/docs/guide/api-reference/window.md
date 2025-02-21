# Window

### Redirect to another URL

#### Usage:  
```ts
sw.window.redirect({
    url: 'https://www.shopware.com,
    newTab: true
})
```

#### Parameters:
| Name | Required | Default | Description |
| :------ | :------ | :------ | :------ |
| `url` | true | | The title of the notification |
| `newTab` | false | false | The message of the notification |

#### Return value:
Returns a promise without data.

### Push to another page
For redirecting to other pages in the admin.

#### Usage:
The usage matches the Vue Router push capabilities. Here are two examples how to use it for redirecting to your own modules:

```ts
sw.window.routerPush({
    name: 'sw.extension.sdk.index',
    params: {
        id: 'the_id_of_the_module' // can be get with context.getModuleInformation
    }
})
```

```ts
sw.window.routerPush({
    path: `/extension/${the_id_of_the_module}` // id can be get with context.getModuleInformation
})
```

#### Parameters:
| Name | Required | Default | Description |
| :------ | :------ | :------ | :------ |
| `name` | false | undefined | The name of the route |
| `path` | false | undefined | The path of the route |
| `params` | false | undefined | Additional params for the new route |
| `replace` | false | false | Should not change the browser history |

#### Return value:
Returns a promise without data.

### Reload page

Useful for development. You can trigger a page reload on file changes.

#### Usage:  
```ts
sw.window.reload()
```

#### Parameters:
No parameters required.

#### Return value:
Returns a promise without data.

### Get an unique identifier for the window

> Available since Shopware v6.7.1.0

When it comes to session handling it can be useful to have a unique identifier for your window.

### Usage:
```ts
sw.window.getId() 
```

### Parameters
No parameters required

### Return value:
A `string` representing an unique identifier for the current window

### Example
In this example we check if the `sessionStorage` contains data from a former window. This can happen if a user uses the *Duplicate Tab* feature of some browsers.

```ts
const windowId = sw.window.getId();
const storedWindowId = globalThis.sessionStorage.getItem('window-id');

if (windowId !== storedWindowId) {
    globalThis.sessionStorage.clear();
    globalThis.sessionStorage.setItem('window-id', windowId);
}

```
