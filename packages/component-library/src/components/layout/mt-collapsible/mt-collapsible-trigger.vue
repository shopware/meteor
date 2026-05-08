<template>
  <CollapsibleTrigger class="mt-collapsible-trigger" :as="as" :as-child="asChild">
    <slot />
  </CollapsibleTrigger>
</template>

<script setup lang="ts">
import { CollapsibleTrigger } from "reka-ui";

withDefaults(
  defineProps<{
    as?: string | object;
    asChild?: boolean;
  }>(),
  {
    as: "button",
    asChild: false,
  },
);
</script>
