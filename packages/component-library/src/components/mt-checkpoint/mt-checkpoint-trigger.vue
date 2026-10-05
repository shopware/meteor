<template>
  <mt-button variant="tertiary" size="small" class="mt-checkpoint-trigger">
    <slot />
  </mt-button>
</template>

<script setup lang="ts">
import MtButton from "@/components/mt-button/mt-button.vue";

/**
 * A button in `mt-checkpoint`, such as "Restore" to return the conversation to this point.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** The label of the button. */
  default?(): unknown;
}>();
</script>
