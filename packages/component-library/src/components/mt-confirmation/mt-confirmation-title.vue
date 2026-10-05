<template>
  <mt-text size="xs" weight="semibold" class="mt-confirmation-title">
    <slot />
  </mt-text>
</template>

<script setup lang="ts">
import MtText from "@/components/mt-text/mt-text.vue";

/**
 * The title of `mt-confirmation`, such as "Change the stock?".
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** The title. */
  default?(): unknown;
}>();
</script>
