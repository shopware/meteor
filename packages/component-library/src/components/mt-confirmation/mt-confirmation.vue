<template>
  <div v-if="visible" class="mt-confirmation">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from "vue";
import type { MtToolApproval, MtToolState } from "@/types/ai";
import { confirmationContextKey } from "./confirmation-context";

/**
 * Asks the user to approve a tool call before it runs, and shows the answer afterwards. Bind the
 * `approval` and `state` of an AI SDK tool part. Its parts show depending on the state:
 * `mt-confirmation-request` and `mt-confirmation-actions` while the approval is requested,
 * `mt-confirmation-accepted` or `mt-confirmation-rejected` once the user answered. It shows
 * nothing without an approval or while the input is still streaming.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The `approval` of the tool part. */
    approval?: MtToolApproval;
    /** The `state` of the tool part. */
    state: MtToolState;
  }>(),
  {
    approval: undefined,
  },
);

defineSlots<{
  /** `mt-confirmation-title`, the request and answer parts and `mt-confirmation-actions`. */
  default?(): unknown;
}>();

provide(confirmationContextKey, {
  approval: toRef(props, "approval"),
  state: toRef(props, "state"),
});

const visible = computed(
  () =>
    props.approval !== undefined &&
    props.state !== "input-streaming" &&
    props.state !== "input-available",
);
</script>

<style scoped>
.mt-confirmation {
  display: grid;
  gap: var(--scale-size-8);
  padding: var(--scale-size-12);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  background-color: var(--color-elevation-surface-default);
}
</style>
