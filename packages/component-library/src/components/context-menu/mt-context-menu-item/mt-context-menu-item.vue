<template>
  <mt-popover-item
    class="mt-context-menu-item"
    :label="label"
    :icon="icon"
    :disabled="disabled"
    :on-label-click="handleLableClick"
    :type="type"
    :role="role"
  />
</template>

<script lang="ts">
import MtPopoverItem from "../../overlay/mt-popover-item/mt-popover-item.vue";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import { type TranslateResult } from "vue-i18n";

export default defineComponent({
  name: "MtContextMenuItem",

  components: {
    "mt-popover-item": MtPopoverItem,
  },

  props: {
    label: {
      type: String as PropType<string | TranslateResult>,
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
      type: String as PropType<"default" | "active" | "critical">,
      required: false,
      default: "default",
    },

    role: {
      type: String,
      required: false,
      default: "menuitem",
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const handleLableClick = () => {
      if (props.disabled) {
        return;
      }

      emit("click");
    };

    return {
      handleLableClick,
    };
  },
});
</script>
