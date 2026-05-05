<template>
  <CollapsibleRoot
    class="mt-collapsible"
    :open="open"
    :default-open="defaultOpen"
    :disabled="disabled"
    :as="as"
    :as-child="asChild"
    :unmount-on-hide="!keepMounted"
    @update:open="(value) => emits('update:open', value)"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CollapsibleRoot>
</template>

<script setup lang="ts">
import { CollapsibleRoot } from "reka-ui";

withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    as?: string | object;
    asChild?: boolean;
    /**
     * Whether the closed content stays mounted in the DOM when closed.
     * Defaults to `true`
     */
    keepMounted?: boolean;
  }>(),
  {
    as: "div",
    asChild: false,
    keepMounted: true,
  },
);

const emits = defineEmits<{
  "update:open": [value: boolean];
}>();

defineSlots<{
  default?: (props: { open: boolean }) => unknown;
}>();
</script>
