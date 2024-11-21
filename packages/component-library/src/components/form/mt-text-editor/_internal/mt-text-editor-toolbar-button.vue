<template>
  <button
    @click="handleButtonClick()"
    :class="buttonClass(button)"
    v-tooltip="{
      disabled: !button.label,
      message: button.label,
      position: 'top',
      hideDelay: 0,
    }"
    :aria-label="button.label"
    :disabled="button.disabled ? button.disabled(props.editor) : disabled"
  >
    <mt-icon v-if="button.icon" :name="button.icon" />
    <span v-else>{{ button.label }}</span>
  </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { CustomButton } from './mt-text-editor-toolbar.vue';
import type { Editor } from '@tiptap/vue-3';
import mtIcon from '@/components/icons-media/mt-icon/mt-icon.vue';
import vTooltip from '@/directives/tooltip.directive';

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
const emit = defineEmits(['click']);

const handleButtonClick = () => {
  emit('click');
}

const buttonClass = (button: CustomButton) => {
  return {
    'mt-text-editor-toolbar-button': true,
    'is-active': button.isActive && button.isActive(props.editor),
  }
}
</script>

<style>
.mt-text-editor-toolbar-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 100%;

    .mt-icon {
      transition: 0.1s all ease-in-out;
      color: var(--color-text-secondary-default);
    }

    &:hover .mt-icon {
      color: var(--color-interaction-primary-hover);
    }

    &.is-active .mt-icon {
      color: var(--color-interaction-primary-pressed);
    }

    &:disabled {
      cursor: not-allowed;

      .mt-icon {
        color: var(--color-text-secondary-disabled);
      }
    }
  }
</style>