<template>
  <div class="mt-text-editor" :class="componentClasses" v-if="editor">
    <label v-if="label">
      {{ label }}
    </label>

    <div class="mt-text-editor__box">
      <component
        :is="toolbarWrapperComponent"
        :editor="editor"
        :tippyOptions="{
          maxWidth: 'none',
          zIndex: 1000,
        }"
        :key="isInlineEdit"
      >
        <mt-text-editor-toolbar
          :editor="editor"
          :custom-buttons="mergedCustomButtons"
          :disabled="globalToolbarButtonDisabled"
          @updateContextualButtons="updateContextualButtons"
          :excludedButtons="excludedButtons"
        >
          <!-- Special buttons -->
          <template #button_text-color="{ editor, disabled, button }">
            <mt-text-editor-toolbar-button-color
              :editor="editor"
              :disabled="disabled"
              :button="button"
            />
          </template>

          <template #button_link="{ editor, disabled, button }">
            <mt-text-editor-toolbar-button-link
              :editor="editor"
              :disabled="disabled"
              :button="button"
            />
          </template>

          <template #button_table="{ editor, disabled, button }">
            <mt-text-editor-toolbar-button-table
              :editor="editor"
              :disabled="disabled"
              :button="button"
            />
          </template>

          <!-- Dynamically pass all slots -->
          <template #[name]="bindings" v-for="(_, name) in slots">
            <slot :name="name" v-bind="bindings"> </slot>
          </template>
        </mt-text-editor-toolbar>
      </component>

      <editor-content v-if="!showCodeEditor" :editor="editor" class="mt-text-editor__content" />
      <code-mirror
        v-else
        :lang="lang"
        :modelValue="modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
        class="mt-text-editor__code-editor"
        wrap
        basic
        :disabled="disabled"
      />

      <div class="mt-text-editor__footer">
        <div class="mt-text-editor__footer-left">
          <slot
            v-if="!disabled"
            name="contextual-buttons"
            :editor="editor"
            :buttons="contextualButtons"
          >
            <template v-for="button in contextualButtons" :key="button.name">
              <mt-popover v-if="button.children">
                <template #trigger="{ toggleFloatingUi }">
                  <mt-text-editor-toolbar-button
                    :button="button"
                    :editor="editor"
                    @click="toggleFloatingUi"
                    :disabled="globalToolbarButtonDisabled"
                  />
                </template>

                <template #popover-items__base="{ toggleFloatingUi }">
                  <mt-popover-item
                    v-for="child in button.children"
                    :key="child.name"
                    :label="child.label"
                    :icon="child.icon"
                    :type="child.isActive && child.isActive(editor) ? 'active' : 'default'"
                    :onLabelClick="
                      () => {
                        button.action?.(editor!);
                        toggleFloatingUi();
                      }
                    "
                  />
                </template>
              </mt-popover>

              <mt-text-editor-toolbar-button
                v-else
                :button="button"
                :editor="editor"
                :disabled="globalToolbarButtonDisabled"
                @click="button.action?.(editor)"
              />
            </template>
          </slot>
          <slot name="footer-left" :editor="editor" />
        </div>
        <div class="mt-text-editor__footer-right">
          <slot name="footer-right" :editor="editor">
            {{
              t("mt-text-editor.footer.characters", {
                characters: editor?.storage.characterCount.characters(),
              })
            }}
          </slot>
        </div>
      </div>
    </div>

    <mt-field-error v-if="error" :error="error" />
  </div>
</template>

<script setup lang="ts">
// BubbleMenu is used in <component :is> in the template
import { EditorContent, BubbleMenu, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Placeholder from "@tiptap/extension-placeholder";
import mtTextEditorToolbar, { type CustomButton } from "./_internal/mt-text-editor-toolbar.vue";
import mtTextEditorToolbarButtonColor, {
  colorButton,
} from "./_internal/mt-text-editor-toolbar-button-color.vue";
import mtTextEditorToolbarButtonLink, {
  linkButton,
} from "./_internal/mt-text-editor-toolbar-button-link.vue";
import mtTextEditorToolbarButtonTable, {
  tableButton,
} from "./_internal/mt-text-editor-toolbar-button-table.vue";
import mtTextEditorToolbarButton from "./_internal/mt-text-editor-toolbar-button.vue";
import mtPopoverItem from "@/components/overlay/mt-popover-item/mt-popover-item.vue";
import mtPopover from "@/components/overlay/mt-popover/mt-popover.vue";
import mtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import CodeMirror from "vue-codemirror6";
import { computed, h, reactive, ref, useSlots, watch, type PropType } from "vue";
import { html } from "@codemirror/lang-html";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-text-editor": {
        buttons: {
          "toggle-code": "Toggle code",
        },
        footer: {
          characters: "{characters} characters",
        },
      },
    },
    de: {
      "mt-text-editor": {
        buttons: {
          "toggle-code": "Codeansicht umschalten",
        },
        footer: {
          characters: "{characters} Zeichen",
        },
      },
    },
  },
});

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
    required: true,
  },
  /**
   * Enable inline edit mode
   */
  isInlineEdit: {
    type: Boolean,
    default: false,
  },
  /**
   * Add custom configuration for the tip tap editor
   */
  tipTapConfig: {
    type: Object,
    default: () => ({}),
  },
  /**
   * Custom buttons to be added to the toolbar
   */
  customButtons: {
    type: Array as PropType<CustomButton[]>,
    default: () => [],
  },
  /**
   * Excluded buttons from the toolbar
   */
  excludedButtons: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /**
   * Add disabled state to the editor
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Add placeholder text to the editor
   */
  placeholder: {
    type: String,
    default: "",
  },

  /**
   * An error in your business logic related to this field.
   *
   * @example {"code": 500, "detail": "Error while saving"}
   */
  error: {
    type: Object,
    required: false,
    default: null,
  },

  /**
   * A label for your text field. Usually used to guide the user what value this field controls.
   */
  label: {
    type: String,
    required: false,
    default: null,
  },
});

const componentClasses = computed(() => {
  return {
    "mt-text-editor--inline-edit": props.isInlineEdit,
    "mt-text-editor--disabled": props.disabled,
    "mt-text-editor--error": !!props.error,
  };
});

/**
 * Editor
 */
const editor = useEditor({
  ...props.tipTapConfig,
  extensions: [
    StarterKit,
    Underline,
    Subscript,
    Superscript,
    TextAlign.configure({
      types: ["paragraph", "heading"],
    }),
    Color,
    TextStyle,
    Link.configure({
      openOnClick: false,
    }),
    CharacterCount.configure({}),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
      placeholder: props.placeholder,
      showOnlyWhenEditable: true,
    }),
    ...(props.tipTapConfig.extensions ?? []),
  ],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: "mt-text-editor__content-editor",
    },
  },
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  editable: !props.disabled,
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (showCodeEditor.value) {
      return;
    }

    const isSame = editor.value?.getHTML() === newValue;

    if (isSame) {
      return;
    }

    editor.value?.commands.setContent(newValue, false);
  },
);

watch(
  () => props.disabled,
  (newValue) => {
    editor.value?.setEditable(!newValue);
  },
);

const globalToolbarButtonDisabled = computed(() => {
  return props.disabled || showCodeEditor.value;
});

/**
 * Custom buttons
 */
const mergedCustomButtons = computed<CustomButton[]>(() => {
  const editorButtons: CustomButton[] = [
    colorButton,
    linkButton,
    tableButton,
    {
      name: "toggle-code",
      label: "mt-text-editor.buttons.toggle-code",
      icon: "regular-code-xs",
      action: () => (showCodeEditor.value = !showCodeEditor.value),
      alignment: "right",
      position: 3000,
      disabled: () => false,
    },
  ];

  return [...editorButtons, ...props.customButtons];
});

/**
 * Contextual buttons for footer
 */
const contextualButtons = reactive<CustomButton[]>([]);
const updateContextualButtons = (buttons: CustomButton[]) => {
  contextualButtons.splice(0, contextualButtons.length, ...buttons);
};

/**
 * Toolbar wrapper component
 */
const toolbarWrapperComponent = computed(() => {
  return props.isInlineEdit ? h(BubbleMenu) : h("div");
});

/**
 * Code Editor
 */
const showCodeEditor = ref(false);
const lang = html();

watch(
  () => showCodeEditor.value,
  (newValue, oldValue) => {
    // When switching from code editor to WYSIWYG editor, update the content
    if (!newValue && oldValue) {
      editor.value?.commands.setContent(props.modelValue, false);
    }
  },
);

const slots = useSlots() as Record<string, unknown>;
</script>

<style scoped>
.mt-text-editor {
  display: flex;
  flex-direction: column;
  background-color: var(--color-elevation-surface-default);
}

label {
  display: block;
  font-size: var(--font-size-xs);
  line-height: 1rem;
  color: var(--color-text-primary-default);
  margin-bottom: var(--scale-size-8);
}

.mt-text-editor__box {
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
}

.mt-text-editor__content,
.mt-text-editor__code-editor {
  height: 260px;
  overflow: auto;
}

.mt-text-editor__code-editor :deep(.cm-editor) {
  height: inherit;
}

:deep(.mt-text-editor__content-editor) {
  width: 100%;
  height: 100%;
  padding: var(--scale-size-16);

  /* List styles */
  ul,
  ol {
    padding: 0 var(--scale-size-16);
    margin: var(--scale-size-20) var(--scale-size-16) var(--scale-size-20) 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* WYSIWYG styles */
  outline: 0 solid transparent;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary-default);
    letter-spacing: 0;
    margin-bottom: 0;
  }

  h1 {
    font-size: 36px;
    line-height: var(--font-line-height-3xl);
    margin-top: var(--scale-size-36);
  }

  h2 {
    font-size: var(--font-size-3xl);
    line-height: var(--font-line-height-2xl);
    margin-top: var(--scale-size-30);
  }

  h3 {
    font-size: var(--font-size-xl);
    line-height: var(--font-line-height-xl);
    margin-top: var(--scale-size-28);
  }

  h4 {
    font-size: var(--font-size-l);
    line-height: var(--font-line-height-l);
    margin-top: var(--scale-size-24);
  }

  h5 {
    font-size: var(--font-size-s);
    line-height: var(--font-line-height-m);
    margin-top: var(--scale-size-22);
  }

  h6 {
    font-size: var(--font-size-xs);
    line-height: var(--font-line-height-s);
    margin-top: var(--scale-size-22);
  }

  p,
  div {
    font-weight: normal;
    font-size: var(--font-size-s);
    line-height: var(--font-line-height-m);
    color: var(--color-text-primary-default);
    letter-spacing: 0;
    margin-top: var(--scale-size-16);
  }

  blockquote {
    font-size: var(--font-size-s);
    font-style: italic;
    line-height: var(--font-line-height-m);
    color: var(--color-text-primary-default);
    margin-left: var(--scale-size-20);
    position: relative;
    margin-top: var(--scale-size-16);
  }

  blockquote::before {
    content: '"';
    font-size: 40px;
    line-height: 16px;
    color: var(--color-text-tertiary-default);
    position: absolute;
    top: var(--scale-size-10);
    left: -24px;
  }

  ul,
  ol {
    margin-left: var(--scale-size-20);
    margin-top: var(--scale-size-16);

    li {
      font-weight: normal;
      font-size: var(--font-size-s);
      line-height: var(--font-line-height-m);
      color: var(--color-text-primary-default);
      margin-bottom: var(--scale-size-4);
    }

    li:last-child {
      margin-bottom: 0;
    }
  }

  hr {
    max-width: 160px;
    margin-left: auto;
    margin-right: auto;
    margin-top: var(--scale-size-16);
    border: 2px solid var(--color-background-primary-disabled);
  }

  > *:first-child {
    margin-top: 0;
  }

  /* Table-specific styling */
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
  }

  table td,
  table th {
    border: 1px solid var(--color-border-primary-default);
    box-sizing: border-box;
    min-width: 1em;
    padding: var(--scale-size-6) var(--scale-size-8);
    position: relative;
    vertical-align: top;

    > * {
      margin-bottom: 0;
    }
  }

  table th {
    background-color: var(--color-background-primary-default);
    font-weight: bold;
    text-align: left;
  }

  table p {
    margin: 0;
  }

  table .selectedCell::after {
    background: var(--color-background-primary-disabled);
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  table .column-resize-handle {
    background-color: var(--color-interaction-primary-default);
    pointer-events: none;
    position: absolute;
    right: -2px;
    top: calc(-1 * var(--font-line-height-m) / 2);
    bottom: calc(-1 * var(--font-line-height-m) / 2);
    width: var(--scale-size-4);
    z-index: 10;
  }

  .tableWrapper {
    margin: var(--scale-size-24) 0;
    overflow-x: auto;
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
}

.mt-text-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--scale-size-16);
  height: var(--scale-size-36);
  background-color: var(--color-background-primary-disabled);
  border-top: 1px solid var(--color-border-primary-default);
  border-radius: 0 0 var(--border-radius-xs) var(--border-radius-xs);
  transition: transform 0.2s ease-in-out;
}

.mt-text-editor__footer-left {
  display: flex;
  align-items: center;
}

.mt-text-editor--inline-edit {
  .mt-text-editor__content {
    height: auto;
  }

  .mt-text-editor__box {
    border: none;
  }

  .mt-text-editor__footer {
    transform: scale(1, 0);
    transform-origin: bottom;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    pointer-events: none;
  }
}

.mt-text-editor--inline-edit:focus-within .mt-text-editor__footer {
  pointer-events: all;
  transform: scale(1, 1);
}

.mt-text-editor--disabled .mt-text-editor__content {
  background-color: var(--color-background-primary-disabled);
}

:deep(.mt-text-editor__content-editor p.is-editor-empty:first-child::before) {
  color: var(--color-text-secondary-default);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.mt-text-editor--error .mt-text-editor__box {
  border-color: var(--color-icon-critical-default);
}

.mt-text-editor--error .mt-text-editor__content {
  background-color: var(--color-background-critical-dark);
}

.mt-text-editor--error label {
  color: var(--color-text-critical-default);
}
</style>
