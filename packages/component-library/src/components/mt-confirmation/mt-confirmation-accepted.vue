<template>
  <mt-text
    v-if="approval?.approved === true && ANSWERED_STATES.includes(state)"
    size="xs"
    color="color-text-secondary-default"
    class="mt-confirmation-accepted"
  >
    <slot />
  </mt-text>
</template>

<script setup lang="ts">
import MtText from "@/components/mt-text/mt-text.vue";
import { ANSWERED_STATES, useConfirmationContext } from "./confirmation-context";

/**
 * Shown in `mt-confirmation` once the user approved the tool call.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** The answer, such as "You approved the stock change." */
  default?(): unknown;
}>();

const { approval, state } = useConfirmationContext("mt-confirmation-accepted");
</script>
