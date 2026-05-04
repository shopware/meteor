<template>
  <CollapsibleRoot v-bind="forwarded" class="mt-collapsible">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CollapsibleRoot>
</template>

<script setup lang="ts">
import { CollapsibleRoot, useForwardPropsEmits } from "reka-ui";

const props = defineProps<{
  /** The controlled open state of the collapsible */
  open?: boolean;
  /** The open state when initially rendered */
  defaultOpen?: boolean;
  /** When `true`, prevents the user from interacting with the collapsible. */
  disabled?: boolean;
  /** When `true`, the content element is unmounted while closed. */
  unmountOnHide?: boolean;
  /** The element or component the root should render as. */
  as?: string | object;
  /** Change the default rendered element to the one passed as a child, merging their props and behavior. */
  asChild?: boolean;
}>();

const emits = defineEmits<{
  "update:open": [value: boolean];
}>();

defineSlots<{
  default?: (props: { open: boolean }) => unknown;
}>();

const forwarded = useForwardPropsEmits(props, emits);
</script>
