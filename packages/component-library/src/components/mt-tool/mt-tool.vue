<template>
  <mt-collapsible v-model:open="open" class="mt-tool">
    <slot />
  </mt-collapsible>
</template>

<script setup lang="ts">
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";

/**
 * A tool call of an AI answer as a collapsible card. `mt-tool-header` shows the tool and its
 * state, `mt-tool-content` holds `mt-tool-input` and `mt-tool-output`. The parts take the fields
 * of an AI SDK tool part as they are.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** Whether the card is open when it first renders. */
    defaultOpen?: boolean;
  }>(),
  {
    defaultOpen: false,
  },
);

/** Whether the card is open. */
const open = defineModel<boolean>("open", { default: undefined });
if (open.value === undefined) open.value = props.defaultOpen;

defineSlots<{
  /** `mt-tool-header` and `mt-tool-content`. */
  default?(): unknown;
}>();
</script>

<style scoped>
.mt-tool {
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  background-color: var(--color-elevation-surface-default);
}
</style>
