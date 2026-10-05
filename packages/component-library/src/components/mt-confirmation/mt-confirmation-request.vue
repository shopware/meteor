<template>
  <mt-text v-if="state === 'approval-requested'" size="xs" class="mt-confirmation-request">
    <slot />
  </mt-text>
</template>

<script setup lang="ts">
import MtText from "@/components/mt-text/mt-text.vue";
import { useConfirmationContext } from "./confirmation-context";

/**
 * The request of `mt-confirmation`, such as what the tool call will change. Shown while the
 * approval is requested.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** What the user is asked to approve. */
  default?(): unknown;
}>();

const { state } = useConfirmationContext("mt-confirmation-request");
</script>
