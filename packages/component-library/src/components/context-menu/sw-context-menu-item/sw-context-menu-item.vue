<template>
  <sw-popover-item
    class="sw-context-menu-item"
    :label="label"
    :icon="icon"
    :disabled="disabled"
    :on-label-click="handleLableClick"
    :type="type"
    :role="role"
  />
</template>

<script lang="ts">
import SwPopoverItem from '../../overlay/sw-popover-item/sw-popover-item.vue';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { TranslateResult } from 'vue-i18n';

export default defineComponent({
  name: 'SwContextMenuItem',

  components: {
    'sw-popover-item': SwPopoverItem,
  },

  props: {
    label: {
      type: String as PropType<string|TranslateResult>,
      required: true,
    },

    icon: {
      type: String,
      required: false,
      default: null,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    type: {
      type: String as PropType<'default' | 'active' | 'critical'>,
      required: false,
      default: 'default',
    },

    role: {
      type: String,
      required: false,
      default: 'menuitem',
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleLableClick = () => {
      if (props.disabled) {
        return;
      }

      emit('click');
    };

    return {
      handleLableClick
    };
  }
});
</script>

