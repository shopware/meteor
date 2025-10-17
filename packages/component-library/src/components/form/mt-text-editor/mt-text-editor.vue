<template>
  <div v-if="editor" class="mt-text-editor" :class="componentClasses">
    <label v-if="label">
      {{ label }}
    </label>

    <div class="mt-text-editor__box">
      <component
        :is="toolbarWrapperComponent"
        :key="isInlineEdit"
        :editor="editor"
        :tippy-options="{
          maxWidth: 'none',
          zIndex: 1000,
        }"
      >
        <mt-text-editor-toolbar
          :editor="editor"
          :custom-buttons="mergedCustomButtons"
          :disabled="globalToolbarButtonDisabled"
          :excluded-buttons="excludedButtons"
          @update-contextual-buttons="updateContextualButtons"
        >
          <!-- Special buttons -->
          <template #button_text-color="{ editor: e, disabled: d, button }">
            <mt-text-editor-toolbar-button-color :editor="e" :disabled="d" :button="button" />
          </template>

          <template #button_link="{ editor: e, disabled: d, button }">
            <mt-text-editor-toolbar-button-link :editor="e" :disabled="d" :button="button" />
          </template>

          <template #button_table="{ editor: e, disabled: d, button }">
            <mt-text-editor-toolbar-button-table :editor="e" :disabled="d" :button="button" />
          </template>

          <!-- Dynamically pass all slots -->
          <template v-for="(_, name) in slots" #[name]="bindings">
            <slot :name="name" v-bind="bindings"> </slot>
          </template>
        </mt-text-editor-toolbar>
      </component>

      <editor-content v-if="!showCodeEditor" :editor="editor" class="mt-text-editor__content" />
      <code-mirror
        v-else
        :lang="lang"
        :model-value="modelValue"
        class="mt-text-editor__code-editor"
        wrap
        basic
        :disabled="disabled"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <!-- WYSIWYG approval gate overlay -->
      <div v-if="!showCodeEditor && gateActive" class="mt-text-editor__gate">
        <div class="mt-text-editor__gate-content">
          <p class="mt-text-editor__gate-text">
            {{ t("mt-text-editor.gate.message") }}
          </p>
          <div class="mt-text-editor__gate-actions">
            <mt-button variant="primary" @click="showDiffModal = true">
              {{ t("mt-text-editor.gate.showDiff") }}
            </mt-button>
          </div>
        </div>
      </div>

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
                    :disabled="globalToolbarButtonDisabled"
                    @click="toggleFloatingUi"
                  />
                </template>

                <template #popover-items__base="{ toggleFloatingUi }">
                  <mt-popover-item
                    v-for="child in button.children"
                    :key="child.name"
                    :label="child.label"
                    :icon="child.icon"
                    :type="child.isActive && child.isActive(editor) ? 'active' : 'default'"
                    :on-label-click="
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

    <mt-text-editor-diff-modal
      :is-open="showDiffModal"
      :original-html="diffOriginalHtml"
      :parsed-html="diffParsedHtml"
      @change-open="onChangeOpenDiffModal"
      @accept="handleDiffAccept"
      @cancel="handleDiffCancel"
    />
  </div>
</template>

<script setup lang="ts">
// BubbleMenu is used in <component :is> in the template
import { EditorContent, BubbleMenu, useEditor } from "@tiptap/vue-3";
// Import individual StarterKit extensions instead of the bundle
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import History from "@tiptap/extension-history";
import HardBreak from "@tiptap/extension-hard-break";
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
import Image from "@tiptap/extension-image";
import enhanceExtensionsWithAttributes from "./_internal/mt-text-editor-extension-enhancer";
import {
  GenericContainer,
  DivContainer,
  SemanticElements,
  FigcaptionElement,
} from "./_internal/mt-text-editor-html-preserving-extensions";
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
import {
  computed,
  h,
  reactive,
  ref,
  useSlots,
  watch,
  onMounted,
  nextTick,
  type PropType,
} from "vue";
import { html } from "@codemirror/lang-html";
import { useI18n } from "vue-i18n";
import ListItem from "@tiptap/extension-list-item";
import mtTextEditorDiffModal from "./_internal/mt-text-editor-diff-modal.vue";
import { getHtmlParseDiff } from "./_internal/html-parse-diff";
import mtButton from "@/components/form/mt-button/mt-button.vue";

const { t } = useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-text-editor": {
        buttons: {
          "switch-to-code": "Switch to code mode",
          "switch-to-visual": "Switch to visual mode",
        },
        footer: {
          characters: "{characters} characters",
        },
        diff: {
          title: "Code changes required",
          subtitle:
            "Editing in visual mode requires changes to your code. Some parts may be removed or new code may be added to ensure compatibility.",
          accept: "Apply changes",
          cancel: "Continue in code mode",
          headlines: {
            current: "Your code",
            new: "With changes applied",
          },
        },
        gate: {
          message: "This editor contains custom code that isn’t fully supported in visual mode.",
          showDiff: "View code",
        },
      },
    },
    de: {
      "mt-text-editor": {
        buttons: {
          "switch-to-code": "In den Code-Modus wechseln",
          "switch-to-visual": "In den visuellen Modus wechseln",
        },
        footer: {
          characters: "{characters} Zeichen",
        },
        diff: {
          title: "Codeänderungen erforderlich",
          subtitle:
            "Das Bearbeiten im visuellen Modus erfordert Änderungen an deinem Code. Einige Teile können entfernt oder neuer Code hinzugefügt werden, um die Kompatibilität sicherzustellen.",
          accept: "Änderungen anwenden",
          cancel: "Im Code-Modus fortfahren",
          headlines: {
            current: "Dein Code",
            new: "Mit angewandten Änderungen",
          },
        },
        gate: {
          message:
            "Dieser Editor enthält benutzerdefinierten Code, der im visuellen Modus nicht vollständig unterstützt wird.",
          showDiff: "Code anzeigen",
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
const editorExtensions = enhanceExtensionsWithAttributes([
  // Use individual StarterKit extensions instead of the bundle
  Document,
  Paragraph,
  Text,
  Heading,
  Bold,
  Italic,
  Strike,
  Code,
  CodeBlock,
  Blockquote,
  HorizontalRule,
  BulletList,
  OrderedList,
  Dropcursor,
  Gapcursor,
  History,
  HardBreak,
  ListItem,
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
    HTMLAttributes: {
      // Don't automatically add rel attributes - we'll handle this manually in the link button
      rel: null,
      target: null, // Don't set target by default
    },
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
  Image.configure({
    allowBase64: true,
  }),
  // Add HTML preserving extensions for span, div, and semantic elements
  GenericContainer,
  DivContainer,
  SemanticElements,
  FigcaptionElement,
  ...(props.tipTapConfig.extensions ?? []),
]);

// WYSIWYG approval gate state (declare early so editor callbacks can read it)
const gateActive = ref(false);

// Suppress emits during init and controlled updates
const suppressUpdates = ref(true);

const editor = useEditor({
  ...props.tipTapConfig,
  extensions: editorExtensions,
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: "mt-text-editor__content-editor",
    },
  },
  onUpdate: ({ editor }) => {
    if (suppressUpdates.value || gateActive.value) return;
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
      label: showCodeEditor.value
        ? "mt-text-editor.buttons.switch-to-visual"
        : "mt-text-editor.buttons.switch-to-code",
      icon: "regular-code-xs",
      action: () => onToggleCodeClick(),
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

// Diff modal state
const showDiffModal = ref(false);
const diffOriginalHtml = ref("");
const diffParsedHtml = ref("");
// Raw parsed HTML to apply on acceptance (beautified only for display)
const parsedHtmlRaw = ref("");

const onToggleCodeClick = async () => {
  // Switching to Code view directly
  if (!showCodeEditor.value) {
    showCodeEditor.value = true;
    return;
  }

  // Switching from Code to WYSIWYG: dry-run parse and compare using util
  const diff = await getHtmlParseDiff(props.modelValue, editorExtensions, {
    parseFromBeautified: false,
  });
  if (!diff.hasDiff) {
    showCodeEditor.value = false;
    return;
  }
  diffOriginalHtml.value = diff.originalBeautified;
  diffParsedHtml.value = diff.parsedBeautified;
  parsedHtmlRaw.value = diff.parsedRaw;
  showDiffModal.value = true;
};

const handleDiffAccept = async () => {
  const applied = parsedHtmlRaw.value;
  emit("update:modelValue", applied);
  showCodeEditor.value = false;
  suppressUpdates.value = true;
  editor.value?.commands.setContent(applied, false);
  await nextTick();
  suppressUpdates.value = false;
  showDiffModal.value = false;
  if (gateActive.value) {
    gateActive.value = false;
    editor.value?.setEditable(!props.disabled);
  }
};

const handleDiffCancel = () => {
  // Open code editor, if not already open
  showCodeEditor.value = true;
  // Stay in code editor
  showDiffModal.value = false;
};

const onChangeOpenDiffModal = (value: boolean) => {
  showDiffModal.value = value;
};

watch(
  () => showCodeEditor.value,
  (newValue, oldValue) => {
    // When switching from code editor to WYSIWYG editor, update the content
    if (!newValue && oldValue) {
      suppressUpdates.value = true;
      editor.value?.commands.setContent(props.modelValue, false);
      Promise.resolve().then(() => {
        suppressUpdates.value = false;
      });
    }
  },
);

const slots = useSlots() as Record<string, unknown>;

// Initial gate check when component mounts in WYSIWYG
onMounted(async () => {
  if (showCodeEditor.value) return; // Only relevant in WYSIWYG
  // Wait for editor to be ready
  await Promise.resolve();
  const diff = await getHtmlParseDiff(props.modelValue, editorExtensions, {
    parseFromBeautified: true,
  });
  if (diff.hasDiff) {
    gateActive.value = true;
    diffOriginalHtml.value = diff.originalBeautified;
    diffParsedHtml.value = diff.parsedBeautified;
    parsedHtmlRaw.value = diff.parsedRaw;
    editor.value?.setEditable(false);
  }
  // Allow subsequent updates to emit after initial gate check
  suppressUpdates.value = false;
});
</script>

<style scoped>
.mt-text-editor {
  display: flex;
  flex-direction: column;
}

label {
  display: block;
  font-size: var(--font-size-xs);
  line-height: 1rem;
  color: var(--color-text-primary-default);
  margin-bottom: var(--scale-size-8);
}

.mt-text-editor__box {
  position: relative;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
}

.mt-text-editor:not(.mt-text-editor--inline-edit) .mt-text-editor__box {
  background: var(--color-background-primary-default);
}

.mt-text-editor__code-editor {
  background: var(--color-static-white);
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

  ol {
    list-style: decimal;
    list-style-position: outside;
  }

  ul {
    list-style: disc;
    list-style-position: outside;
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
    color: var(--color-text-secondary-default);
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
    border: 2px solid var(--color-border-secondary-default);
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
    background-color: var(--color-background-tertiary-default);
    font-weight: bold;
    text-align: left;
  }

  table p {
    margin: 0;
  }

  table .selectedCell::after {
    background: var(--color-background-tertiary-default);
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
  background-color: var(--color-background-tertiary-default);
  border-top: 1px solid var(--color-border-primary-default);
  border-radius: 0 0 var(--border-radius-xs) var(--border-radius-xs);
  transition: transform 0.2s ease-in-out;
  color: var(--color-text-secondary-default);
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
  background-color: var(--color-background-tertiary-default);
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
  background-color: var(--color-background-critical-default);
}

.mt-text-editor--error label {
  color: var(--color-text-critical-default);
}

/* Gate overlay */
.mt-text-editor__gate {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.mt-text-editor__gate::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--color-elevation-backdrop-default);
  z-index: 2;
  border-radius: var(--border-radius-2xs);
  backdrop-filter: blur(6px);
}

.mt-text-editor__gate-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--scale-size-24);
  text-align: center;
  z-index: 3;
}

.mt-text-editor__gate-text {
  color: var(--color-static-white);
  margin-bottom: var(--scale-size-16);
}

.mt-text-editor__gate-actions {
  display: flex;
  gap: var(--scale-size-8);
}
</style>
