<template>
  <div class="mt-text-editor">
    <div class="mt-text-editor__box">
      <component :is="isInlineEdit ? 'bubble-menu' : 'div'">
        <mt-text-editor-toolbar :editor="editor">
          <!-- Special buttons -->
          <template #button_text-color="{ editor }">
            <mt-text-editor-toolbar-button-color :editor="editor" />
          </template>

          <!-- Dynamically pass all slots -->
          <template #[name]="{ editor }" v-for="(_, name) in $slots">
            <slot :name="name" :editor="editor">
            </slot>
          </template>

        </mt-text-editor-toolbar>
      </component>

      <editor-content :editor="editor" class="mt-text-editor__content"/>

      <div class="mt-text-editor__footer">
        <div class="mt-text-editor__footer-left">
          <slot name="footer-left" :editor="editor" />
        </div>
        <div class="mt-text-editor__footer-right">
          <slot name="footer-right" :editor="editor">
            {{ editor.storage.characterCount.characters() }} characters
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Add translations

// BubbleMenu is used in <component :is> in the template
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {BubbleMenu, Editor, EditorContent} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import Link from '@tiptap/extension-link'
import CharacterCount from '@tiptap/extension-character-count'
import mtTextEditorToolbar from './_internal/mt-text-editor-toolbar.vue';
import mtTextEditorToolbarButtonColor from './_internal/mt-text-editor-toolbar-button-color.vue';
import { watch } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
    required: true,
  },
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
})

const editor = new Editor({
  ...props.tipTapConfig,
  extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({
          types: ['paragraph', 'heading'],
      }),
      Color,
      TextStyle,
      ListItem,
      OrderedList,
      BulletList,
      Link.configure({
          openOnClick: false,
      }),
      CharacterCount.configure({}),
      ...(props.tipTapConfig.extensions ?? []),
  ],
  content: props.modelValue,
  editorProps: {
      attributes: {
          class: 'mt-text-editor__content-editor',
      },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
})

watch(() => props.modelValue, (newValue) => {
  const isSame = editor.getHTML() === newValue;

  if (isSame) {
      return;
  }

  editor.commands.setContent(newValue, false);
})
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

  &__content-editor {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 16px;

    /* List styles */
    ul, ol {
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
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 36px;
    background-color: var(--color-elevation-surface-sunken);
    border-top: 1px solid var(--color-border-primary-default);
    border-radius: 0 0 var(--border-radius-xs) var(--border-radius-xs);
  }
}
</style>