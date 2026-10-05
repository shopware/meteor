<template>
  <mt-text
    v-if="approval?.approved === false && ANSWERED_STATES.includes(state)"
    size="xs"
    color="color-text-secondary-default"
    class="mt-confirmation-rejected"
  >
    <slot />
  </mt-text>
</template>

<script setup lang="ts">
import MtText from "@/components/mt-text/mt-text.vue";
import { ANSWERED_STATES, useConfirmationContext } from "./confirmation-context";

/**
 * Shown in `mt-confirmation` once the user declined the tool call.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** The answer, such as "You declined the stock change." */
  default?(): unknown;
}>();

const { approval, state } = useConfirmationContext("mt-confirmation-rejected");
</script>
