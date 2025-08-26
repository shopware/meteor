# Media modal

The purpose of this method is to enable the app to interact with the Administration's media modal, specifically to open the modal and select media from it. This method is available in version 6.7.1

### Open modal

Open media modal in the current view.

#### Usage:

```ts
ui.mediaModal.open({
  initialFolderId: "initialFolderId",
  allowMultiSelect: false,
  fileAccept: "image/png",
  selectors: ["fileName", "id", "url"],
  callback: ({ fileName, id, url }) => {},
});
```

#### Parameters

All parameters are similar to `sw-media-modal-v2` component's props

| Name               | Required | Default                   | Description                                                                          |
| :----------------- | :------- | :------------------------ | :----------------------------------------------------------------------------------- |
| `initialFolderId`  | false    | null                      | Initial folder id where the media modal will open                                    |
| `entityContext`    | false    | null                      | The entity name that upload image will be stored in that entity folder in Upload tab |
| `allowMultiSelect` | false    | true                      | Define single or multiple selection                                                  |
| `defaultTab`       | false    | library                   | Defines which tab should be opened by default                                        |
| `fileAccept`       | false    | image/\*                  | Define the file types which are allowed to be uploaded in Upload tab                 |
| `selectors`        | false    | ['fileName', 'id', 'url'] | Selected properties which should be returned in callback function                    |
| `callback`         | true     |                           | Callback function which will be called once the media item is selected.              |

#### Example

![Menu item example](./assets/media-modal.png)

```ts
ui.mediaModal.open({
  initialFolderId: "productMediaFolderId",
  allowMultiSelect: false,
  selectors: ["fileName", "id", "url"],
  callback: ({ fileName, id, url }) => {},
});
```
