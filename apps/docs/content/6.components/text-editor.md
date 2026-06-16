---
title: Text Editor
description: A flexible rich text editor for adding WYSIWYG and raw HTML editing to Meteor interfaces.
---

## Import

```ts
import { MtTextEditor } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Text Editor** to let users author rich text content such as descriptions, notes, or formatted documents.
- Bind the HTML content with `v-model`; the value is an HTML string.
- Use the `customButtons` and `excludedButtons` props to tailor the toolbar to your use case, or set `show-toolbar` to `false` to hide it entirely.
- Switch between WYSIWYG and raw HTML editing with the code mode, controllable through `v-model:code-mode`.
- Enable `is-inline-edit` for an inline editing experience with a floating toolbar.
- Extend the editor with custom Tiptap extensions through the `tipTapConfig` prop.

## Examples

### Basic

::component-example{name="text-editor-basic-example" fullWidth}
::

### Inline editing

Enables inline editing with a floating toolbar.

::component-example{name="text-editor-inline-edit-example" fullWidth}
::

### Hidden toolbar

Hide the toolbar completely for a simpler editing experience or a custom toolbar.

::component-example{name="text-editor-hidden-toolbar-example" fullWidth}
::

### Code mode

Start the editor in raw HTML editing mode.

::component-example{name="text-editor-code-mode-example" fullWidth}
::

### Two-way code mode binding

Control the editor mode programmatically with `v-model:code-mode`.

::component-example{name="text-editor-code-mode-two-way-binding-example" fullWidth}
::

### Custom toolbar buttons

Add custom buttons to the toolbar, backed by a custom Tiptap extension.

::component-example{name="text-editor-custom-buttons-example" fullWidth}
::

### Security gate on initial load

When the initial HTML would change after parsing, an overlay blocks WYSIWYG editing until the diff is reviewed and accepted.

::component-example{name="text-editor-diff-modal-example" fullWidth}
::

## Slots

### `button_<name>`

A dynamic slot is rendered for every toolbar button as `button_<name>`. Use it to replace the automatically rendered button with your own component. For example, to customize the `text-color` button:

```html
<template>
  <mt-text-editor v-model="content">
    <template #button_text-color="{ editor, disabled, button }">
      <mt-text-editor-toolbar-button
        :button="button"
        :editor="editor"
        :disabled="disabled"
        @click="openColorPickerModal"
      />

      <ColorPickerModal
        v-if="showColorPickerModal"
        v-model="color"
        @confirm="applyTextColor"
        @cancel="closeColorPickerModal"
      />
    </template>
  </mt-text-editor>
</template>
```

### `contextual-buttons`

Custom buttons for the editor footer. These can change contextually based on the editor's current state.

### `footer-left` and `footer-right`

Customize the left or right sections of the editor's footer.

## Toolbar buttons

The editor includes these built-in buttons by default. Use the `excludedButtons` prop to remove buttons and `customButtons` to add your own. The position values are useful when inserting custom buttons (see [Positioning](#positioning)).

| Button name    | Description                                        | Alignment | Position |
| -------------- | -------------------------------------------------- | --------- | -------- |
| format         | Opens a popover with formatting options.           | left      | 1000     |
| text-color     | Allows the user to pick a text color.              | left      | 2000     |
| bold           | Toggles bold text.                                 | left      | 3000     |
| italic         | Toggles italic text.                               | left      | 4000     |
| underline      | Toggles underlined text.                           | left      | 5000     |
| strikethrough  | Toggles strikethrough text.                        | left      | 6000     |
| superscript    | Toggles superscript text.                          | left      | 7000     |
| subscript      | Toggles subscript text.                            | left      | 8000     |
| text-alignment | Opens a popover to set text alignment.             | left      | 9000     |
| unordered-list | Toggles an unordered list.                         | left      | 10000    |
| numbered-list  | Toggles a numbered list.                           | left      | 11000    |
| link           | Opens a modal to insert or edit links.             | left      | 12000    |
| table          | Opens a modal to insert or modify tables.          | left      | 13000    |
| undo           | Undoes the last action.                            | right     | 1000     |
| redo           | Redoes the last undone action.                     | right     | 2000     |
| toggle-code    | Toggles between WYSIWYG mode and raw HTML editing. | right     | 3000     |

## Custom buttons

Add custom buttons to the toolbar by passing an array of `CustomButton` objects to the `customButtons` prop. Each button supports these properties:

- **`name`** (required): A unique identifier for the button.
- **`label`** (required): The visible label, as direct text or a translation key.
- **`icon`**: An optional icon name from the Meteor icon set, shown instead of the label.
- **`isActive`**: A function returning whether the button is currently active (for example, when bold is toggled on).
- **`action`**: A function that runs when the button is clicked, where you apply an editor command.
- **`children`**: An array of child buttons to build a dropdown or multi-level menu.
- **`alignment`**: Whether the button appears on the `left` or `right` of the toolbar.
- **`position`**: The button's order in the toolbar. Lower values appear first.
- **`disabled`**: A function returning whether the button should be disabled.
- **`contextualButtons`**: A function returning additional footer buttons based on the editor's state.

### Simple button

A custom button that toggles bold formatting:

```html
<template>
  <mt-text-editor v-model="content" :custom-buttons="customButtons" />
</template>

<script setup>
  import { ref } from "vue";

  const content = ref("<p>Your content here</p>");

  const customButtons = [
    {
      name: "custom-bold",
      label: "Bold",
      icon: "regular-bold-xs",
      position: 3500,
      action: (editor) => {
        editor.chain().focus().toggleBold().run();
      },
      isActive: (editor) => editor.isActive("bold"),
    },
  ];
</script>
```

### Dropdown menu

Use the `children` property to build a dropdown. Each child is another `CustomButton`:

```html
<template>
  <mt-text-editor v-model="content" :custom-buttons="customButtons" />
</template>

<script setup>
  import { ref } from "vue";

  const content = ref("<p>Your content here</p>");

  const customButtons = [
    {
      name: "custom-format",
      label: "Format",
      icon: "regular-style-xs",
      position: 1500,
      children: [
        {
          name: "custom-bold",
          label: "Bold",
          icon: "regular-bold-xs",
          action: (editor) => {
            editor.chain().focus().toggleBold().run();
          },
          isActive: (editor) => editor.isActive("bold"),
        },
        {
          name: "custom-italic",
          label: "Italic",
          icon: "regular-italic-xs",
          action: (editor) => {
            editor.chain().focus().toggleItalic().run();
          },
          isActive: (editor) => editor.isActive("italic"),
        },
      ],
    },
  ];
</script>
```

### Contextual footer buttons

Use the `contextualButtons` property to return footer buttons that appear based on the editor's state, such as a "Remove link" action that only shows when a link is selected:

```html
<template>
  <mt-text-editor v-model="content" :custom-buttons="customButtons" />
</template>

<script setup>
  import { ref } from "vue";

  const content = ref("<p>Your content here</p>");

  const customButtons = [
    {
      name: "custom-link",
      label: "Link",
      icon: "regular-link-xs",
      position: 12500,
      action: (editor) => {
        const url = prompt("Enter the URL");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      contextualButtons: (editor) => {
        if (!editor.isActive("link")) {
          return [];
        }

        return [
          {
            name: "remove-link",
            label: "Remove Link",
            icon: "regular-times-xs",
            action: (editor) => {
              editor.chain().focus().unsetLink().run();
            },
          },
        ];
      },
    },
  ];
</script>
```

### Disabling a button by state

Provide a `disabled` function to disable a button dynamically, for example when the editor is empty:

```html
<script setup>
  const customButtons = [
    {
      name: "custom-bold",
      label: "Bold",
      icon: "regular-bold-xs",
      position: 3500,
      action: (editor) => {
        editor.chain().focus().toggleBold().run();
      },
      isActive: (editor) => editor.isActive("bold"),
      disabled: (editor) => editor.getText().length === 0,
    },
  ];
</script>
```

### Positioning

Buttons are sorted by their `position` value, lowest first. The default buttons use increments of `1000`, leaving room to insert custom buttons at specific positions. For example, `position: 3500` places a button between `bold` (3000) and `italic` (4000). See the [Toolbar buttons](#toolbar-buttons) table for the default positions.

## Customizing with Tiptap extensions

The editor's features are built on [Tiptap extensions](https://tiptap.dev/docs/editor/core-concepts/extensions). Pass custom extensions through the `tipTapConfig` prop, except the hardcoded `content`, `editorProps`, and `onUpdate` properties:

```html
<template>
  <mt-text-editor v-model="content" :tip-tap-config="tipTapConfig" />
</template>

<script setup>
  import { Underline } from "@tiptap/extension-underline";

  const tipTapConfig = {
    extensions: [Underline],
  };
</script>
```

## Validating before save

The component exposes a `validate()` method through a template ref. It checks the current code editor content against what Tiptap can represent and shows the diff modal if the HTML differs. It returns `true` when valid (no diff, or not in code mode) and `false` when the diff modal was shown. This is useful for validating content before closing a modal or saving:

```html
<template>
  <mt-text-editor ref="editor" v-model="content" />
  <mt-button @click="onSave">Save</mt-button>
</template>

<script setup>
  import { ref } from "vue";

  const editor = ref(null);
  const content = ref("<p>Your content here</p>");

  const onSave = async () => {
    if (!editor.value) return;
    const isValid = await editor.value.validate();
    if (!isValid) return;
    // proceed with save
  };
</script>
```

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Use `v-model` to keep the HTML content in sync with your state.
- Provide a `label` so users understand what the field is for.
- Tailor the toolbar with `customButtons` and `excludedButtons` to match the editing needs of the context.
- Use the code mode when users need to inspect or edit the raw HTML.

#dont

- Do not feed unsupported HTML markup without expecting the security gate to require a diff review first.
- Do not rely on the editor for plain, unformatted text where a simpler input is enough.
- Do not hide the toolbar unless you provide another way to apply formatting.

::

## Behavior

- The editor is built on Tiptap and accepts custom extensions through `tipTapConfig`, except the hardcoded `content`, `editorProps`, and `onUpdate` properties.
- When the editor mounts in WYSIWYG mode, it dry-runs a Tiptap parse and compares the result with the initial HTML. If the HTML differs, an overlay blocks editing until the user reviews a diff and accepts the parsed result. While the gate is active, `update:modelValue` emits are suppressed.
- When switching from code mode to WYSIWYG, the editor compares the code with Tiptap's parsed output and shows a side-by-side diff modal if changes are detected. The user can accept the changes and switch, or stay in the code editor.
- The component exposes a `validate()` method through a template ref. It checks the current code editor content against what Tiptap can represent and shows the diff modal if the HTML differs. It returns `true` when valid (no diff or not in code mode) and `false` when the diff modal was shown, which is useful before saving or closing a parent modal.
- Custom buttons are ordered by their `position` value, with default buttons spaced in increments of `1000` so custom buttons can be inserted between them.
- The footer shows a live character count, and `contextual-buttons` can change based on the current cursor position.

## Accessibility

- Provide a `label` so the field has an accessible name.
- When replacing default buttons with custom ones, ensure each button keeps a clear, descriptive label.
- The code editor mode is powered by CodeMirror and lets users inspect and edit the raw HTML directly.
