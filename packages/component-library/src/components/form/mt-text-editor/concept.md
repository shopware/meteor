### **Concept: `mt-text-editor`**

This document outlines the full concept of the `mt-text-editor` component, designed as an all-in-one, highly flexible text editor built with Vue 3 and TipTap. The component offers a fully integrated toolbar, customizable buttons, and advanced support for dynamic slots.

---

### **Overview**

The `mt-text-editor` component provides a ready-to-use rich text editor that includes:
1. **Self-managed TipTap editor instance**: No need to create or manage the editor manually.
2. **Configurable toolbar**: Default buttons, exclusion of unwanted buttons, addition of custom buttons, and slot-based overrides.
3. **Dynamic slots for buttons**: Developers can provide custom implementations for any toolbar button directly via named slots.
4. **Default behavior with minimal configuration**: Out-of-the-box functionality for common use cases while supporting deep customization.

---

### **Goals**

1. **Ease of Use**: Enable basic usage with minimal configuration.
2. **Extensibility**: Allow full customization of the toolbar and editor behavior through props and slots.
3. **Reusability**: Provide a modular architecture with clear separation of concerns.
4. **Dynamic Customization**: Use named slots to override or extend functionality without unnecessary complexity.

---

### **Component Architecture**

#### **Main Components**
1. **`mt-text-editor`**:
   - Parent component that manages the TipTap editor instance.
   - Contains the editor content area.
   - Includes the `mt-text-editor-toolbar` for rendering the toolbar.
   - Acts as a wrapper for advanced customization using slots.
   
2. **`mt-text-editor-toolbar`**:
   - Child component responsible for rendering the toolbar buttons.
   - Supports default buttons, custom buttons, and slot-based overrides.

#### **Flow of Data and Slots**
- `mt-text-editor` instantiates the editor and passes it to the `mt-text-editor-toolbar`.
- Named slots in `mt-text-editor` are dynamically forwarded to `mt-text-editor-toolbar` for button customization.
- Default buttons are used if no slots are provided.

---

### **API Design**

#### **1. `mt-text-editor` Props**

| **Prop**              | **Type**       | **Default**        | **Description**                                                                                   |
|------------------------|----------------|--------------------|---------------------------------------------------------------------------------------------------|
| `modelValue`          | `String`       | `''`               | The initial content of the editor, bound via `v-model`.                                          |
| `editorConfig`        | `Object`       | `{}`               | Optional configuration object passed to TipTap's editor instance.                                |                                            |
| `excludedButtons`     | `Array`        | `[]`               | An array of default button `name`s to exclude.                                                   |
| `customButtons`       | `Array`        | `[]`               | An array of additional custom button objects for the toolbar.                                    |

---

#### **2. `mt-text-editor-toolbar` Props**

| **Prop**              | **Type**       | **Default**        | **Description**                                                                                   |
|------------------------|----------------|--------------------|---------------------------------------------------------------------------------------------------|
| `editor`              | `Object`       | `null`             | The TipTap editor instance passed from the parent.                                               |                                               |
| `excludedButtons`     | `Array`        | `[]`               | An array of default button `name`s to exclude.                                                   |
| `customButtons`       | `Array`        | `[]`               | An array of additional custom button objects for the toolbar.                                    |

---

#### **Default Toolbar Buttons**

The toolbar supports the following default buttons out of the box:

| **Name**      | **Label**      | **Action**                                        |
|---------------|----------------|--------------------------------------------------|
| `bold`        | Bold           | Toggles bold formatting.                         |
| `italic`      | Italic         | Toggles italic formatting.                       |
| `underline`   | Underline      | Toggles underline formatting.                    |
| `strike`      | Strikethrough  | Toggles strikethrough formatting.                |
| `bulletList`  | Bullet List    | Converts the selection into a bullet list.       |
| `orderedList` | Ordered List   | Converts the selection into a numbered list.     |
| `link`        | Link           | Opens a dialog or popover to insert a hyperlink. |

---

#### **Dynamic Slots**

Dynamic slots provide developers with full control over button behavior and appearance.

- **Slot Name**: Matches the `name` of the button (`bold`, `italic`, etc.).
- **Slot Props**:
  - `editor`: The TipTap editor instance.

If a named slot is not provided, the toolbar renders the default button implementation.

---

### **Implementation**

#### **1. `mt-text-editor`**

```vue
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import mtTextEditorToolbar from './mt-text-editor-toolbar.vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  editorConfig: { type: Object, default: () => ({}) },
  excludedButtons: { type: Array, default: () => [] },
  customButtons: { type: Array, default: () => [] },
});

const editor = ref(null);

onMounted(() => {
  editor.value = new Editor({
    ...props.editorConfig,
    content: props.modelValue,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML());
    },
  });
});

onUnmounted(() => {
  editor.value?.destroy();
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mt-text-editor">
    <!-- Toolbar -->
    <mt-text-editor-toolbar
      v-if="editor"
      :editor="editor"
      :excluded-buttons="excludedButtons"
      :custom-buttons="customButtons"
      /* I will check if this is possible. If not, I will replace it with a v-for loop and pass the slots directly to the toolbar component*/
      v-bind="$slots"
    />

    <!-- Editor Content Area -->
    <div ref="editor"></div>
  </div>
</template>
```

---

#### **2. `mt-text-editor-toolbar`**

```vue
<script setup>
const props = defineProps({
  editor: { type: Object, required: true },
  excludedButtons: { type: Array, default: () => [] },
  customButtons: { type: Array, default: () => [] },
});

// Just an example. Will be much more in the actual implementation
const defaultButtons = [
  { name: 'bold', label: 'Bold', action: (editor) => editor.chain().focus().toggleBold().run() },
  { name: 'italic', label: 'Italic', action: (editor) => editor.chain().focus().toggleItalic().run() },
];

const buttons = computed(() => {
  const baseButtons = defaultButtons.filter((btn) => !props.excludedButtons.includes(btn.name));
  return [...baseButtons, ...props.customButtons];
});

const handleButtonAction = (button) => button.action(props.editor);
</script>

<template>
  <div class="mt-text-editor-toolbar">
    <template v-for="button in buttons" :key="button.name">
      <slot :name="button.name" :editor="props.editor">
        <!-- Example. Will be more detailed in actual implementation -->
        <button @click="handleButtonAction(button)">
          {{ button.label }}
        </button>
      </slot>
    </template>
  </div>
</template>
```

---

### **Usage Examples**

#### **1. Basic Usage**
```vue
<template>
  <mt-text-editor v-model="content" />
</template>

<script setup>
const content = ref('<p>Hello World</p>');
</script>
```

---

#### **2. Custom Buttons**
```vue
<template>
  <mt-text-editor
    v-model="content"
    :custom-buttons="[{ name: 'custom', label: 'Custom', action: customAction }]"
  />
</template>

<script setup>
const customAction = (editor) => {
  // Just an example
  editor.chain().focus().toggleBold().run();
};
const content = ref('');
</script>
```

---

#### **3. Overriding Buttons**
```vue
<template>
  <mt-text-editor v-model="content">
    <template #bold="{ editor }">
      <button @click="editor.chain().focus().toggleBold().run()" style="color: red">
        Custom Bold
      </button>
    </template>
  </mt-text-editor>
</template>

<script setup>
const content = ref('');
</script>
```

---

### **Conclusion**

This concept provides a robust, flexible, and extensible text editor component. The separation of concerns between the `mt-text-editor` and `mt-text-editor-toolbar` ensures modularity, while the slot-based customization offers developers fine-grained control over button functionality and styling.