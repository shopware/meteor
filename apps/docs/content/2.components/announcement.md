---
title: Announcement
description: A full-width message at the top of an application, such as planned downtime or an upcoming event.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="announcement-basic-example"}
::

## Usage

**Announcement** is a full-width message at the top of an application, for news that concerns everyone who uses it, such as planned downtime or an upcoming event. Place it in the `banner` slot of [**App**](/components/app), above the header, as shown in [Status banner](/components/app#status-banner). Messages about a single page belong in a [**Banner**](/components/banner) in that page.

```ts
import { MtAnnouncement } from "@shopware-ag/meteor-component-library";
```

## Examples

### Variants

Pick the variant by how urgent the message is.

::component-example{name="announcement-variants-example"}
::

### Links

Links in the message take its text color and wrap with the text, so they stay readable on every variant.

::component-example{name="announcement-links-example"}
::

### Closable

With `closable`, the announcement shows a close button and emits `close` when it is clicked. It doesn't hide itself: remove it.

::component-example{name="announcement-closable-example"}
::

### Keep it closed

Remember which announcement was closed, so it stays closed after a reload while a new announcement still shows. Keep it in the browser, as below, or with the user's account on your server, so it stays closed on every device.

```vue [App.vue]
<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import { MtAnnouncement, MtApp } from "@shopware-ag/meteor-component-library";

// Give each new announcement a new id, so closing one doesn't hide the next.
const announcementId = "maintenance-2026-11-16";
const storageKey = "closed-announcement";
const isClosed = ref(localStorage.getItem(storageKey) === announcementId);

function close() {
  localStorage.setItem(storageKey, announcementId);
  isClosed.value = true;
}
</script>

<template>
  <mt-app>
    <template #banner>
      <mt-announcement
        v-if="!isClosed"
        variant="attention"
        icon="regular-tools"
        closable
        @close="close"
      >
        Planned maintenance on Sunday, November 16, from 2:00 to 4:00 AM CET.
      </mt-announcement>
    </template>

    <RouterView />
  </mt-app>
</template>
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep the message to one or two sentences.
- Say in the text what the message is about, so its meaning doesn't depend on the color.
- Pick the variant by urgency: `critical` for an ongoing outage, `attention` for planned downtime, `info` or `neutral` for news and events, and `positive` for good news, such as a fixed outage.
- Show one announcement at a time.
- Make an announcement closable when people can work without it, and keep it closed once they close it.

#dont

- Do not use **Announcement** for messages about a single page or form. Use a [**Banner**](/components/banner) in that page.
- Do not use it for short feedback on an action. Use a [**Snackbar**](/components/snackbar).
- Do not stack several announcements.
- Do not make an announcement about an ongoing outage closable while the outage lasts.

::

## Behavior

- **Announcement** fills the width of its container.
- Long text wraps onto more lines and is never cut off. Long words and links break instead of making the page wider.
- On wide screens, the text is centered. Below 640px of viewport width, it is aligned to the start, so wrapped lines are easier to read.
- The icon is part of the first line and stays there when the text wraps.
- Links take the text color, keep their underline, and show a focus ring in the text color.
- With `closable`, a close button sits at the end of the first line, and the text stays centered on the whole width. The announcement doesn't hide itself when it is closed.

## Accessibility

- **Announcement** has no role and no live region. Screen readers read it in the order of the page, before the header when it sits in the `banner` slot of [**App**](/components/app).
- The icon is decorative and hidden from screen readers, so the text has to carry the whole message.
- The close button is named "Close announcement" ("Ankündigung schließen" in German).
- Inside [**App**](/components/app), the focus moves to the content when the announcement goes away while it holds the focus.

## Related components

- [**Banner**](/components/banner): for messages about a single page, in its content.
- [**App**](/components/app): for the shell whose `banner` slot holds the announcement.
- [**Snackbar**](/components/snackbar): for short feedback after an action.
