<template>
  <mt-popover-item
    class="mt-context-menu-item"
    :label="label"
    :icon="icon"
    :disabled="disabled"
    :on-label-click="
      () => {
        if (disabled) return;

        $emit('click');
      }
    "
    :type="type"
    :role="role"
  />
</template>

<script setup lang="ts">
import MtPopoverItem from "../../overlay/mt-popover-item/mt-popover-item.vue";
import { type TranslateResult } from "vue-i18n";

withDefaults(
  defineProps<{
    label: string | TranslateResult;
    icon?: string;
    disabled?: boolean;
    type?: "default" | "active" | "critical";
    role?: string;
  }>(),
  {
    type: "default",
    role: "menuitem",
  },
);

defineEmits<{ click: [] }>();
</script>
