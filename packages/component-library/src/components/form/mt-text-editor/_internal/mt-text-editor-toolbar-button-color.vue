<template>
  <div class="mt-text-editor-toolbar-button-color">
    <mt-colorpicker
      class="mt-text-editor-toolbar-button-color__colorpicker"
      compact
      :model-value="getTextColor()"
      @update:modelValue="onUpdateModelValue"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import MtColorpicker from '../../mt-colorpicker/mt-colorpicker.vue';
import type { Editor } from '@tiptap/vue-3';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

const getTextColor = () => {
  return props.editor.getAttributes('textStyle').color;
}

const onUpdateModelValue = (color: string) => {
  props.editor.chain().focus().setColor(color).run();
}
</script>

<style lang="scss">
.mt-text-editor-toolbar-button-color {
  display: flex;
  justify-content: center;
  width: 32px;

  .mt-colorpicker__previewWrapper {
    width: 14px;
    height: 14px;
  }

  .mt-colorpicker--compact .mt-colorpicker__colorpicker-position {
    left: calc(-1 * (14px + 24px) / 2);
    top: calc(100% + 14px + 4px);
  }
}
</style>