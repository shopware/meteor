<template>
  <CollapsibleRoot
    class="mt-collapsible"
    v-bind="forwardedProps"
    :unmount-on-hide="!keepMounted"
    @update:open="(value) => emits('update:open', value)"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CollapsibleRoot>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CollapsibleRoot, useForwardProps } from "reka-ui";

const props = withDefaults(
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

const forwardedProps = useForwardProps(
  computed(() => ({
    open: props.open,
    defaultOpen: props.defaultOpen,
    disabled: props.disabled,
    as: props.as,
    asChild: props.asChild,
  })),
);

const emits = defineEmits<{
  "update:open": [value: boolean];
}>();

defineSlots<{
  default?: (props: { open: boolean }) => unknown;
}>();
</script>
