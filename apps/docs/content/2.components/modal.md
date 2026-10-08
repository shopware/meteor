---
title: Modal
description: A dialog that sits above the current page to focus attention on a single task or decision.
---

::component-example{name="modal-default-example"}
::

## Usage

**Modal** is a dialog that sits above the current page to focus attention on a single task or decision. Use it for flows that need clear interruption, such as confirmations, forms, or important details, when users need to complete a focused task without leaving the current page and the content should sit above the rest of the interface instead of becoming part of the page layout.

```ts
import {
  MtModal,
  MtModalRoot,
  MtModalTrigger,
  MtModalClose,
  MtModalAction,
} from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Modal** is built from a small set of companion exports that work together:

- `mt-modal-root` wraps all related modal components and controls whether the modal is visible.
- `mt-modal` renders the modal surface and content container.
- `mt-modal-trigger` defines the element that opens the modal when clicked, usually a [**Button**](/components/button).
- `mt-modal-action` performs an action before closing the modal, most often for confirm flows.
- `mt-modal-close` closes the modal when clicked.

These parts are exported together so the pattern can be composed in one place.

## Composition

In most cases you open a modal through a trigger. Wrap the related parts in `mt-modal-root`:

```html
<template>
  <mt-modal-root>
    <mt-modal title="Some random title">
      <template #default>This is my modal</template>

      <template #footer>
        <mt-button-close :as="MtButton" variant="secondary">
          Close
        </mt-button-close>
      </template>
    </mt-modal>

    <mt-modal-trigger :as="MtButton">Open modal</mt-modal-trigger>
  </mt-modal-root>
</template>
```

To run work before the modal closes, such as a network request, use `mt-modal-action`. Its click handler receives a `done` callback that closes the modal when you call it:

```html
<template>
  <!-- mt-modal-root and mt-modal are the same as above -->
  <template #footer>
    <mt-modal-action
      :as="MtButton"
      variant="primary"
      @click="
        (done) => {
          // Do something like a network request

          // Call `done` to close the modal
          done();
        }
      "
    >
      Confirm action
    </mt-modal-action>
  </template>
</template>
```

### Controlled state

To open a modal from something other than a trigger, control the open state directly with the `isOpen` prop on `mt-modal-root`:

```html
<template>
  <mt-modal-root :is-open="isOpen">
    <mt-modal title="Some random title">
      <template #default>This is my modal</template>

      <template #footer>
        <mt-button variant="secondary" @click="() => (isOpen = false)">
          Close
        </mt-button>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>

<script setup>
  const isOpen = ref(false);

  onMounted(() => {
    setTimeout(() => {
      isOpen.value = true;
    }, 1_000);
  });
</script>
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep modal content focused on a single task or decision.
- Use a clear title and footer actions so users understand how to continue or cancel.
- Choose a modal width that matches the amount of content.

#dont

- Do not overload a modal with several unrelated tasks.
- Do not use a modal when inline content or a dedicated page would be easier to understand.
- Do not make closing behavior ambiguous.

::

## Behavior

- `mt-modal-root` controls whether the modal is mounted and visible.
- `mt-modal-trigger`, `mt-modal-action`, and `mt-modal-close` support common opening and closing flows.
- `mt-modal-action` receives a `done` callback so you can run work, such as a network request, before the modal closes.
- Use the `isOpen` prop on `mt-modal-root` to control the open state directly when something other than a trigger opens the modal.
- Footer actions are usually the clearest place for confirmation and cancellation controls.

## Accessibility

- Use a clear title so users immediately understand the purpose of the dialog.
- Keep focus behavior predictable and ensure footer actions are reachable by keyboard.
- Only use **Modal** when interrupting the current flow is justified by the task.
