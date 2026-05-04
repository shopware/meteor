<template>
  <CollapsibleTrigger v-bind="forwarded" class="mt-collapsible-trigger">
    <slot />
  </CollapsibleTrigger>
</template>

<script setup lang="ts">
import { CollapsibleTrigger, useForwardProps } from "reka-ui";

const props = defineProps<{
  /** The element or component the trigger should render as. Defaults to `button`. */
  as?: string | object;
  /** Change the default rendered element to the one passed as a child, merging their props and behavior. */
  asChild?: boolean;
}>();

const forwarded = useForwardProps(props);
</script>
