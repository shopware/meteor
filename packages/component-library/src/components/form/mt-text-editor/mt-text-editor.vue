<template>
  <div class="mt-text-editor" :class="componentClasses">
    <div class="mt-text-editor__box">
      <component
        :is="toolbarWrapperComponent"
        :editor="editor"
        :tippyOptions="{
          maxWidth: 'none',
          zIndex: 0,
        }"
        :key="isInlineEdit"
      >
        <mt-text-editor-toolbar
          :editor="editor"
          :custom-buttons="mergedCustomButtons"
          :disabled="showCodeEditor"
          @updateContextualButtons="updateContextualButtons"
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
          <template #[name]="{ editor }" v-for="(_, name) in $slots">
            <slot :name="name" :editor="editor"> </slot>
          </template>
        </mt-text-editor-toolbar>
      </component>

      <editor-content v-if="!showCodeEditor" :editor="editor" class="mt-text-editor__content" />
      <code-mirror
        v-else
        :lang="lang"
        :modelValue="modelValue"
        @update:modelValue="editor?.commands.setContent(String($event), true)"
        class="mt-text-editor__code-editor"
        wrap
        basic
      />

      <div class="mt-text-editor__footer">
        <div class="mt-text-editor__footer-left">
          <slot name="contextual-buttons" :editor="editor" :buttons="contextualButtons">
            <template v-for="button in contextualButtons" :key="button.name">
              <mt-popover v-if="button.children">
                <template #trigger="{ toggleFloatingUi }">
                  <mt-text-editor-toolbar-button
                    :button="button"
                    :editor="editor"
                    @click="toggleFloatingUi"
                    :disabled="showCodeEditor"
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
                        button.action?.(editor);
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
                :disabled="showCodeEditor"
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
                characters: editor.storage.characterCount.characters(),
              })
            }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// BubbleMenu is used in <component :is> in the template
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
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
import CodeMirror from "vue-codemirror6";
import { computed, h, reactive, ref, watch, type PropType } from "vue";
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
});

const componentClasses = computed(() => {
  return {
    "mt-text-editor--inline-edit": props.isInlineEdit,
  };
});

/**
 * Editor
 */
const editor = new Editor({
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
});

watch(
  () => props.modelValue,
  (newValue) => {
    const isSame = editor.getHTML() === newValue;

    if (isSame) {
      return;
    }

    editor.commands.setContent(newValue, false);
  },
);

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
</script>

<style lang="scss">
.mt-text-editor {
  display: flex;
  flex-direction: column;
  background-color: var(--color-elevation-surface-default);

  &__box {
    border: 1px solid var(--color-border-primary-default);
    border-radius: var(--border-radius-xs);
  }

  &__content {
    height: 260px;
    overflow: auto;
  }

  &__code-editor {
    height: 260px;
    overflow: auto;

    .cm-editor {
      height: inherit;
    }
  }

  &__content-editor {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 16px;

    /* List styles */
    ul,
    ol {
      padding: 0 1rem;
      margin: 1.25rem 1rem 1.25rem 0.4rem;

      li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
    }

    /** WYSIWYG styles */
    outline: 0 solid transparent;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary-default);
      letter-spacing: 0;
      margin-bottom: 0;
    }

    h1 {
      font-size: 36px;
      line-height: var(--font-line-height-3xl);
      margin-top: 36px;
    }

    h2 {
      font-size: var(--font-size-3xl);
      line-height: var(--font-line-height-2xl);
      margin-top: 30px;
    }

    h3 {
      font-size: var(--font-size-xl);
      line-height: var(--font-line-height-xl);
      margin-top: 28px;
    }

    h4 {
      font-size: var(--font-size-l);
      line-height: var(--font-line-height-l);
      margin-top: 24px;
    }

    h5 {
      font-size: var(--font-size-s);
      line-height: var(--font-line-height-m);
      margin-top: 22px;
    }

    h6 {
      font-size: var(--font-size-xs);
      line-height: var(--font-line-height-s);
      margin-top: 22px;
    }

    p,
    div {
      font-weight: normal;
      font-size: var(--font-size-s);
      line-height: var(--font-line-height-m);
      color: var(--color-text-secondary-default);
      letter-spacing: 0;
      margin-top: 16px;
    }

    blockquote {
      font-size: var(--font-size-s);
      font-style: italic;
      line-height: var(--font-line-height-m);
      color: var(--color-text-secondary-default);
      margin-left: 20px;
      position: relative;
      margin-top: 16px;

      &::before {
        content: '"';
        font-size: 40px;
        line-height: 16px;
        color: var(--color-text-tertiary-default);
        position: absolute;
        top: 10px;
        left: -24px;
      }
    }

    ul,
    ol {
      margin-left: 20px;
      margin-top: 16px;

      li {
        font-weight: normal;
        font-size: var(--font-size-s);
        line-height: var(--font-line-height-m);
        color: var(--color-text-secondary-default);
        margin-bottom: 4px;
      }

      li:last-child {
        margin-bottom: 0;
      }
    }

    hr {
      max-width: 160px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 16px;
      border: 2px solid var(--color-background-primary-disabled);
    }

    & > *:first-child {
      margin-top: 0;
    }

    /* Table-specific styling */
    table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;

      td,
      th {
        border: 1px solid var(--color-border-primary-default);
        box-sizing: border-box;
        min-width: 1em;
        padding: 6px 8px;
        position: relative;
        vertical-align: top;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: var(--color-background-primary-default);
        font-weight: bold;
        text-align: left;
      }

      p {
        margin: 0;
      }

      .selectedCell:after {
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

      .column-resize-handle {
        background-color: var(--color-interaction-primary-default);
        pointer-events: none;
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        top: calc(-1 * var(--font-line-height-m) / 2);
        bottom: calc(-1 * var(--font-line-height-m) / 2);
        width: 4px;
        z-index: 10;
      }
    }

    .tableWrapper {
      margin: 1.5rem 0;
      overflow-x: auto;
    }

    &.resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 36px;
    background-color: var(--color-background-primary-disabled);
    border-top: 1px solid var(--color-border-primary-default);
    border-radius: 0 0 var(--border-radius-xs) var(--border-radius-xs);
    transition: transform 0.2s ease-in-out;
  }

  &__footer-left {
    display: flex;
    align-items: center;
  }

  &--inline-edit {
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

  &--inline-edit:focus-within {
    .mt-text-editor__footer {
      pointer-events: all;
      transform: scale(1, 1);
    }
  }
}
</style>
