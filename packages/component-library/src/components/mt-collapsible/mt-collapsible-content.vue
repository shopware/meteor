<template>
  <CollapsibleContent
    class="mt-collapsible-content"
    :as="as"
    :as-child="asChild"
    :force-mount="forceMount"
    @content-found="() => emits('contentFound')"
  >
    <slot />
  </CollapsibleContent>
</template>

<script setup lang="ts">
import { CollapsibleContent } from "reka-ui";

withDefaults(
  defineProps<{
    as?: string | object;
    asChild?: boolean;
    forceMount?: boolean;
  }>(),
  {
    as: "div",
    asChild: false,
    forceMount: false,
  },
);

const emits = defineEmits<{
  contentFound: [];
}>();
</script>

<style>
.mt-collapsible-content {
  overflow: hidden;
}

.mt-collapsible-content[data-state="open"] {
  animation: mt-collapsible-slide-down 300ms ease-in-out;
}

.mt-collapsible-content[data-state="closed"] {
  animation: mt-collapsible-slide-up 300ms ease-in-out;
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
