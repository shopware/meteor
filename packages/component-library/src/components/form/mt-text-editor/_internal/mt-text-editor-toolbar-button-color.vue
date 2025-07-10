<template>
  <div class="mt-text-editor-toolbar-button-color">
    <mt-colorpicker
      class="mt-text-editor-toolbar-button-color__colorpicker"
      compact
      :model-value="getTextColor()"
      @update:modelValue="onUpdateModelValue"
      :disabled="button.disabled ? button.disabled(props.editor, disabled) : disabled"
      apply-mode
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import MtColorpicker from "../../mt-colorpicker/mt-colorpicker.vue";
import type { Editor } from "@tiptap/vue-3";
import type { CustomButton } from "./mt-text-editor-toolbar.vue";
import { useI18n } from "vue-i18n";

useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-text-editor-toolbar-button-color": {
        label: "Text Color",
      },
    },
    de: {
      "mt-text-editor-toolbar-button-color": {
        label: "Textfarbe",
      },
    },
  },
});

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  button: {
    type: Object as PropType<CustomButton>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const getTextColor = () => {
  return props.editor.getAttributes("textStyle").color;
};

const onUpdateModelValue = (color: string) => {
  props.editor.chain().focus().setColor(color).run();
};
</script>

<script lang="ts">
export const colorButton: CustomButton = {
  name: "text-color",
  label: "mt-text-editor-toolbar-button-color.label",
  position: 2000,
};
</script>

<style scoped>
.mt-text-editor-toolbar-button-color {
  display: flex;
  justify-content: center;
  width: var(--scale-size-32);

  :deep(.mt-colorpicker__previewWrapper) {
    width: var(--scale-size-14);
    height: var(--scale-size-14);
  }

  :deep(.mt-block-field__block) {
    min-height: unset;
  }

  :deep(.mt-colorpicker--compact .mt-colorpicker__colorpicker-position) {
    left: calc(-1 * (14px + 24px) / 2);
    top: calc(100% + var(--scale-size-14) + 4px);
  }
}
</style>
