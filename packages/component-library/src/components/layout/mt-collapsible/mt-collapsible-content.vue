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

<style>
.mt-collapsible-content {
  overflow: hidden;
}

.mt-collapsible-content[data-state="open"] {
  animation: mt-collapsible-slide-down 300ms ease-out;
}

.mt-collapsible-content[data-state="closed"] {
  animation: mt-collapsible-slide-up 300ms ease-out;
}

@keyframes mt-collapsible-slide-down {
  from {
    height: 0;
  }
  to {
    height: var(--reka-collapsible-content-height);
  }
}

@keyframes mt-collapsible-slide-up {
  from {
    height: var(--reka-collapsible-content-height);
  }
  to {
    height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-collapsible-content[data-state="open"],
  .mt-collapsible-content[data-state="closed"] {
    animation: none;
  }
}
</style>
