<template>
  <CollapsibleContent v-bind="forwarded" class="mt-collapsible-content">
    <slot />
  </CollapsibleContent>
</template>

<script setup lang="ts">
import { CollapsibleContent, useForwardPropsEmits } from "reka-ui";

const props = defineProps<{
  /** The element or component the content should render as. */
  as?: string | object;
  /** Change the default rendered element to the one passed as a child, merging their props and behavior. */
  asChild?: boolean;
  /**
   * Used to force mounting when more control is needed. Useful when controlling
   * animation with Vue animation libraries.
   */
  forceMount?: boolean;
}>();

const emits = defineEmits<{
  /** Emitted when the content is revealed via the browser's "find in page" feature while hidden. */
  contentFound: [];
}>();

const forwarded = useForwardPropsEmits(props, emits);
</script>
