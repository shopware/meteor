<template>
  <div class="mt-text-editor-toolbar" role="menu" tabindex="0">
    <div class="mt-text-editor-toolbar__buttons-left">
      <template v-for="button in buttonsLeft" :key="button.name">
        <slot
          :name="'button_' + button.name"
          :editor="props.editor"
          :disabled="disabled"
          :button="button"
        >
          <mt-popover v-if="button.children" :key="button.name">
            <template #trigger="{ toggleFloatingUi }">
              <mt-text-editor-toolbar-button
                :button="button"
                :editor="props.editor"
                @click="toggleFloatingUi"
                :disabled="disabled"
              />
            </template>

            <template #popover-items__base="{ toggleFloatingUi }">
              <mt-popover-item
                v-for="child in button.children"
                :key="child.name"
                :label="t(child.label)"
                :icon="child.icon"
                :type="child.isActive && child.isActive(props.editor) ? 'active' : 'default'"
                :onLabelClick="
                  () => {
                    handleButtonClick(child);
                    toggleFloatingUi();
                  }
                "
              />
            </template>
          </mt-popover>

          <mt-text-editor-toolbar-button
            v-else
            :button="button"
            :editor="props.editor"
            :disabled="disabled"
            @click="handleButtonClick(button)"
          />
        </slot>
      </template>
    </div>

    <slot name="default" />

    <div class="mt-text-editor-toolbar__buttons-right">
      <template v-for="button in buttonsRight" :key="button.name">
        <slot
          :name="'button_' + button.name"
          :editor="props.editor"
          :disabled="disabled"
          :button="button"
        >
          <mt-popover v-if="button.children" :key="button.name">
            <template #trigger="{ toggleFloatingUi }">
              <mt-text-editor-toolbar-button
                :button="button"
                :editor="props.editor"
                @click="toggleFloatingUi"
                :disabled="disabled"
              />
            </template>

            <template #popover-items__base>
              <mt-popover-item
                v-for="child in button.children"
                :key="child.name"
                :label="t(child.label)"
                :icon="child.icon"
                :type="child.isActive && child.isActive(props.editor) ? 'active' : 'default'"
                :onLabelClick="() => handleButtonClick(child)"
              />
            </template>
          </mt-popover>

          <mt-text-editor-toolbar-button
            v-else
            :button="button"
            :editor="props.editor"
            @click="handleButtonClick(button)"
            :disabled="disabled"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import { computed, watch, type PropType } from "vue";
import mtPopover from "@/components/overlay/mt-popover/mt-popover.vue";
import mtPopoverItem from "@/components/overlay/mt-popover-item/mt-popover-item.vue";
import mtTextEditorToolbarButton from "./mt-text-editor-toolbar-button.vue";
import { useI18n } from "vue-i18n";

export interface CustomButton {
  name: string;
  label: string;
  icon?: string;
  isActive?: (editor: Editor) => boolean;
  action?: (editor: Editor) => void;
  children?: CustomButton[];
  alignment?: "left" | "right";
  // For sorting the button order. Default using 1000s steps to provide space for custom buttons
  position?: number;
  disabled?: (editor: Editor, globalDisabled: boolean) => boolean;
  contextualButtons?: (editor: Editor) => CustomButton[];
}

const { t } = useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-text-editor-toolbar": {
        buttons: {
          format: "Format",
          p: "Paragraph",
          h1: "Headline 1",
          h2: "Headline 2",
          h3: "Headline 3",
          h4: "Headline 4",
          h5: "Headline 5",
          h6: "Headline 6",
          bold: "Bold",
          italic: "Italic",
          underline: "Underline",
          strikethrough: "Strikethrough",
          superscript: "Superscript",
          subscript: "Subscript",
          "text-alignment": "Text Alignment",
          "align-left": "Align left",
          "align-center": "Align center",
          "align-right": "Align right",
          justify: "Justify",
          "unordered-list": "Insert Unordered List",
          "numbered-list": "Insert Ordered List",
          undo: "Undo",
          redo: "Redo",
        },
      },
    },
    de: {
      "mt-text-editor-toolbar": {
        buttons: {
          format: "Format",
          p: "Absatz",
          h1: "Überschrift 1",
          h2: "Überschrift 2",
          h3: "Überschrift 3",
          h4: "Überschrift 4",
          h5: "Überschrift 5",
          h6: "Überschrift 6",
          bold: "Fett",
          italic: "Kursiv",
          underline: "Unterstrichen",
          strikethrough: "Durchgestrichen",
          superscript: "Hochgestellt",
          subscript: "Tiefgestellt",
          "text-alignment": "Textausrichtung",
          "align-left": "Links ausrichten",
          "align-center": "Zentriert ausrichten",
          "align-right": "Rechts ausrichten",
          justify: "Blocksatz",
          "unordered-list": "Unsortierte Liste einfügen",
          "numbered-list": "Sortierte Liste einfügen",
          undo: "Rückgängig",
          redo: "Wiederholen",
        },
      },
    },
  },
});

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  customButtons: {
    type: Array as PropType<CustomButton[]>,
    default: () => [],
  },
  excludedButtons: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["updateContextualButtons"]);

const defaultButtons: CustomButton[] = [
  {
    name: "format",
    label: "mt-text-editor-toolbar.buttons.format",
    icon: "regular-style-xs",
    position: 1000,
    children: [
      {
        name: "p",
        label: "mt-text-editor-toolbar.buttons.p",
        action: () => props.editor.chain().focus().setParagraph().run(),
        isActive: (editor) => editor.isActive("paragraph"),
      },
      {
        name: "h1",
        label: "mt-text-editor-toolbar.buttons.h1",
        action: () => props.editor.chain().focus().setHeading({ level: 1 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 1 }),
      },
      {
        name: "h2",
        label: "mt-text-editor-toolbar.buttons.h2",
        action: () => props.editor.chain().focus().setHeading({ level: 2 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 2 }),
      },
      {
        name: "h3",
        label: "mt-text-editor-toolbar.buttons.h3",
        action: () => props.editor.chain().focus().setHeading({ level: 3 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 3 }),
      },
      {
        name: "h4",
        label: "mt-text-editor-toolbar.buttons.h4",
        action: () => props.editor.chain().focus().setHeading({ level: 4 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 4 }),
      },
      {
        name: "h5",
        label: "mt-text-editor-toolbar.buttons.h5",
        action: () => props.editor.chain().focus().setHeading({ level: 5 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 5 }),
      },
      {
        name: "h6",
        label: "mt-text-editor-toolbar.buttons.h6",
        action: () => props.editor.chain().focus().setHeading({ level: 6 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 6 }),
      },
    ],
  },
  {
    name: "bold",
    label: "mt-text-editor-toolbar.buttons.bold",
    icon: "regular-bold-xs",
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
    position: 3000,
  },
  {
    name: "italic",
    label: "mt-text-editor-toolbar.buttons.italic",
    icon: "regular-italic-xs",
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
    position: 4000,
  },
  {
    name: "underline",
    label: "mt-text-editor-toolbar.buttons.underline",
    icon: "regular-underline-xs",
    action: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
    position: 5000,
  },
  {
    name: "strikethrough",
    label: "mt-text-editor-toolbar.buttons.strikethrough",
    icon: "regular-strikethrough-xs",
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
    position: 6000,
  },
  {
    name: "superscript",
    label: "mt-text-editor-toolbar.buttons.superscript",
    icon: "regular-superscript-xs",
    action: () => props.editor.chain().focus().toggleSuperscript().run(),
    isActive: (editor) => editor.isActive("superscript"),
    position: 7000,
  },
  {
    name: "subscript",
    label: "mt-text-editor-toolbar.buttons.subscript",
    icon: "regular-subscript-xs",
    action: () => props.editor.chain().focus().toggleSubscript().run(),
    isActive: (editor) => editor.isActive("subscript"),
    position: 8000,
  },
  {
    name: "text-alignment",
    label: "mt-text-editor-toolbar.buttons.text-alignment",
    icon: "regular-align-left-xs",
    children: [
      {
        name: "align-left",
        label: "mt-text-editor-toolbar.buttons.align-left",
        action: () => props.editor.chain().focus().setTextAlign("left").run(),
        isActive: (editor) => editor.isActive({ textAlign: "left" }),
      },
      {
        name: "align-center",
        label: "mt-text-editor-toolbar.buttons.align-center",
        action: () => props.editor.chain().focus().setTextAlign("center").run(),
        isActive: (editor) => editor.isActive({ textAlign: "center" }),
      },
      {
        name: "align-right",
        label: "mt-text-editor-toolbar.buttons.align-right",
        action: () => props.editor.chain().focus().setTextAlign("right").run(),
        isActive: (editor) => editor.isActive({ textAlign: "right" }),
      },
      {
        name: "justify",
        label: "mt-text-editor-toolbar.buttons.justify",
        action: () => props.editor.chain().focus().setTextAlign("justify").run(),
        isActive: (editor) => editor.isActive({ textAlign: "justify" }),
      },
    ],
    position: 9000,
  },
  {
    name: "unordered-list",
    icon: "regular-list-unordered-xs",
    label: "mt-text-editor-toolbar.buttons.unordered-list",
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
    position: 10000,
  },
  {
    name: "numbered-list",
    icon: "regular-list-numbered-xs",
    label: "mt-text-editor-toolbar.buttons.numbered-list",
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
    position: 11000,
  },
  {
    name: "undo",
    icon: "regular-undo-xs",
    alignment: "right",
    label: "mt-text-editor-toolbar.buttons.undo",
    action: () => props.editor.chain().focus().undo().run(),
    disabled: (editor) => {
      if (props.disabled) {
        return true;
      }

      return !editor.can().undo();
    },
    position: 1000,
  },
  {
    name: "redo",
    icon: "regular-redo-xs",
    alignment: "right",
    label: "mt-text-editor-toolbar.buttons.redo",
    action: () => props.editor.chain().focus().redo().run(),
    disabled: (editor) => {
      if (props.disabled) {
        return true;
      }

      return !editor.can().redo();
    },
    position: 2000,
  },
];

const buttonsLeft = computed(() => {
  return [...defaultButtons, ...props.customButtons]
    .filter((button) => {
      const isExcluded = props.excludedButtons.includes(button.name);
      const isRight = button.alignment === "right";

      return !isExcluded && !isRight;
    })
    .sort((a, b) => {
      // Sort by position. If no position is set, move to the end
      return (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER);
    });
});

const buttonsRight = computed(() => {
  return [...defaultButtons, ...props.customButtons]
    .filter((button) => {
      const isExcluded = props.excludedButtons.includes(button.name);
      const isRight = button.alignment === "right";

      return !isExcluded && isRight;
    })
    .sort((a, b) => {
      // Sort by position. If no position is set, move to the end
      return (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER);
    });
});

const handleButtonClick = (button: CustomButton) => {
  if (!button.action) {
    return;
  }

  button.action(props.editor);
};

const contextualButtons = computed(() => {
  return [...buttonsLeft.value, ...buttonsRight.value]
    .filter((button) => {
      return button.contextualButtons && button.contextualButtons(props.editor).length > 0;
    })
    .map((button) => {
      return button.contextualButtons!(props.editor);
    })
    .flat();
});

watch(
  contextualButtons,
  (newValue, oldValue) => {
    // Check if the buttons have changed
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
      return;
    }

    // Emit contextual buttons
    emit("updateContextualButtons", newValue);
  },
  { immediate: true },
);
</script>

<style scoped>
.mt-text-editor-toolbar {
  padding: 0 var(--scale-size-6);
  border-radius: var(--border-radius-xs) var(--border-radius-xs) 0 0;
  height: var(--scale-size-36);
  user-select: none;
  width: 100%;
  background: var(--color-background-primary-disabled);
  border-bottom: 1px solid var(--color-icon-primary-disabled);
  color: var(--color-text-secondary-default);
  display: flex;
}

.mt-text-editor-toolbar__buttons-left,
.mt-text-editor-toolbar__buttons-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.mt-text-editor-toolbar__buttons-right {
  margin-left: auto;
}

.mt-text-editor-toolbar :deep(.mt-floating-ui) {
  height: inherit;
}

.mt-text-editor-toolbar :deep(.mt-floating-ui__trigger) {
  display: block;
  height: inherit;
}

.mt-text-editor--inline-edit .mt-text-editor-toolbar {
  border: none;
  border-radius: var(--border-radius-xs);
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 8%),
    0 2px 1px rgba(0, 0, 0, 6%),
    0 1px 3px rgba(0, 0, 0, 10%);
}
</style>
