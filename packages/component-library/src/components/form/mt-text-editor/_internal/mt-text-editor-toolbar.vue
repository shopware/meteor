<template>
  <div class="mt-text-editor-toolbar" role="menu" tabindex="0">
    <div class="mt-text-editor-toolbar__buttons-left">
      <template v-for="button in buttons" :key="button.name">
        <slot :name="'button_' + button.name" :editor="props.editor">
          <mt-popover v-if="button.children" :key="button.name">
            <template #trigger="{ toggleFloatingUi }">
              <mt-text-editor-toolbar-button
                :button="button"
                :editor="props.editor"
                @click="toggleFloatingUi"
              />
            </template>

            <template #popover-items__base>
              <mt-popover-item
                v-for="child in button.children"
                :key="child.name"
                :label="child.label"
                :icon="child.icon"
                :type="(child.isActive && child.isActive(props.editor)) ? 'active' : 'default'"
                :onLabelClick="() => handleButtonClick(child)"
              />
            </template>
          </mt-popover>

          <mt-text-editor-toolbar-button
            v-else
            :button="button"
            :editor="props.editor"
            @click="handleButtonClick(button)"
          />
        </slot>
      </template>
    </div>

    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
// TODO: Add translations
import type { Editor } from '@tiptap/vue-3';
import { computed, type PropType } from 'vue';
import mtPopover from '@/components/overlay/mt-popover/mt-popover.vue';
import mtPopoverItem from '@/components/overlay/mt-popover-item/mt-popover-item.vue';
import mtTextEditorToolbarButton from './mt-text-edtior-toolbar-button.vue';

export interface CustomButton {
  name: string;
  label: string;
  icon?: string;
  isActive?: (editor: Editor) => boolean;
  action?: (editor: Editor) => void;
  children?: CustomButton[];
}

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
})

const defaultButtons: CustomButton[] = [
  {
    name: 'format',
    label: 'Format',
    icon: 'regular-style-xs',
    children: [
      {
        name: 'p',
        label: 'Paragraph',
        action: () => props.editor.chain().focus().setParagraph().run(),
        isActive: editor => editor.isActive('paragraph'),
      },
      {
        name: 'h1',
        label: 'Headline 1',
        action: () => props.editor.chain().focus().setHeading({ level: 1 }).run(),
        isActive: editor => editor.isActive('heading', { level: 1 }),
      },
      {
        name: 'h2',
        label: 'Headline 2',
        action: () => props.editor.chain().focus().setHeading({ level: 2 }).run(),
        isActive: editor => editor.isActive('heading', { level: 2 }),
      },
      {
        name: 'h3',
        label: 'Headline 3',
        action: () => props.editor.chain().focus().setHeading({ level: 3 }).run(),
        isActive: editor => editor.isActive('heading', { level: 3 }),
      },
      {
        name: 'h4',
        label: 'Headline 4',
        action: () => props.editor.chain().focus().setHeading({ level: 4 }).run(),
        isActive: editor => editor.isActive('heading', { level: 4 }),
      },
      {
        name: 'h5',
        label: 'Headline 5',
        action: () => props.editor.chain().focus().setHeading({ level: 5 }).run(),
        isActive: editor => editor.isActive('heading', { level: 5 }),
      },
      {
        name: 'h6',
        label: 'Headline 6',
        action: () => props.editor.chain().focus().setHeading({ level: 6 }).run(),
        isActive: editor => editor.isActive('heading', { level: 6 }),
      },
    ],
  },
  {
    name: 'text-color',
    label: 'Text Color',
  },
  {
    name: 'bold',
    label: 'Bold',
    icon: 'regular-bold-xs',
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: editor => editor.isActive('bold'),
  },
  {
    name: 'italic',
    label: 'Italic',
    icon: 'regular-italic-xs',
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: editor => editor.isActive('italic'),
  },
  {
    name: 'underline',
    label: 'Underline',
    icon: 'regular-underline-xs',
    action: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: editor => editor.isActive('underline'),
  },
  {
    name: 'strikethrough',
    label: 'Strikethrough',
    icon: 'regular-strikethrough-xs',
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: editor => editor.isActive('strike'),
  },
  {
    name: 'superscript',
    label: 'Superscript',
    icon: 'regular-superscript-xs',
    action: () => props.editor.chain().focus().toggleSuperscript().run(),
    isActive: editor => editor.isActive('superscript'),
  },
  {
    name: 'subscript',
    label: 'Subscript',
    icon: 'regular-subscript-xs',
    action: () => props.editor.chain().focus().toggleSubscript().run(),
    isActive: editor => editor.isActive('subscript'),
  },
  {
    name: 'text-alignment',
    label: 'Text Alignment',
    // TODO: make this dynamically change based on the current alignment
    icon: 'regular-align-left-xs',
    children: [
      {
        name: 'align-left',
        label: 'Align left',
        action: () => props.editor.chain().focus().setTextAlign('left').run(),
        isActive: editor => editor.isActive({ textAlign: 'left' }),
      },
      {
        name: 'align-center',
        label: 'Align center',
        action: () => props.editor.chain().focus().setTextAlign('center').run(),
        isActive: editor => editor.isActive({ textAlign: 'center' }),
      },
      {
        name: 'align-right',
        label: 'Align right',
        action: () => props.editor.chain().focus().setTextAlign('right').run(),
        isActive: editor => editor.isActive({ textAlign: 'right' }),
      },
      {
        name: 'justify',
        label: 'Justify',
        action: () => props.editor.chain().focus().setTextAlign('justify').run(),
        isActive: editor => editor.isActive({ textAlign: 'justify' }),
      },
    ],
  },
  {
    name: 'unordered-list',
    icon: 'regular-list-unordered-xs',
    label: 'Insert Unordered List',
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: editor => editor.isActive('bulletList'),
  },
  {
    name: 'numbered-list',
    icon: 'regular-list-numbered-xs',
    label: 'Insert Ordered List',
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: editor => editor.isActive('orderedList'),
  },
]

const buttons = computed(() => {
  const baseButtons = defaultButtons.filter(button => !props.excludedButtons.includes(button.name))
  
  return [...baseButtons, ...props.customButtons]
})

const handleButtonClick = (button: CustomButton) => {
  if (button.children) {
    // Open a dropdown with children buttons
  }

  if (!button.action) {
    return;
  }

  button.action(props.editor)
}

</script>

<style lang="scss">
.mt-text-editor-toolbar {
  padding: 0 6px;
  border-radius: var(--border-radius-xs) var(--border-radius-xs) 0 0;
  height: 36px;
  user-select: none;
  width: 100%;
  background: var(--color-elevation-surface-sunken);
  border-bottom: 1px solid var(--color-icon-primary-disabled);
  color: var(--color-text-secondary-default);

  &__buttons-left {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .mt-floating-ui__trigger {
    display: block;
  }
}
</style>