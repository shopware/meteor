---
title: "Toast"
sidebar_position: 60
---


# Toast

Toasts display short, temporary messages to provide feedback about user actions or system events. Unlike [notifications](./notification.md), which persist in the notification center until dismissed, toasts disappear automatically after a short time.

See also: [Base Options](../api-reference/base-options.md) for shared configuration options supported by SDK message APIs.

> Available since Shopware v6.6.2.0

## Dispatch a toast

![toast example](./assets/toast-example.png)

#### Usage

```ts
function alertYes() {
  alert('Yes');
}

sw.toast.dispatch({
    msg: 'Your message',
    dismissible: true,
    type: 'positive',
    action: {
        label: 'action',
        callback: alertYes
    },
})
```

#### Parameters

| Name          | Required | Default | Description                                                                                                    |
|:--------------|:---------|:--------|:---------------------------------------------------------------------------------------------------------------|
| `msg`         | true     |         | Defines a toast's main expression or message to the user.                                                      |
| `type`        | true     |         | Defines the toast type. Available `types` are `positive`, `informal` and `critical`.                           |
| `icon`        | false    | None    | An icon that should be displayed in front of your message.                                                      |
| `dismissible` | false    | `false` | Specifies if the toast can be manually dismissed.                                                             |
| `action`      | false    | None    | Adds a clickable button to the toast. The button receives a label and a callback which is called once clicked. |

#### Return value

Returns a promise without data.
