<template>
  <mt-collapsible v-model:open="open" class="mt-chain-of-thought">
    <slot />
  </mt-collapsible>
</template>

<script setup lang="ts">
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";

/**
 * The steps an AI takes towards an answer, such as searching, reading and checking, as a
 * collapsible timeline. `mt-chain-of-thought-header` opens and closes it and
 * `mt-chain-of-thought-content` holds the `mt-chain-of-thought-step`s.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** Whether the steps are shown when it first renders. Set it when there is no header. */
    defaultOpen?: boolean;
  }>(),
  {
    defaultOpen: false,
  },
);

/** Whether the steps are shown. */
const open = defineModel<boolean>("open", { default: undefined });
if (open.value === undefined) open.value = props.defaultOpen;

defineSlots<{
  /** `mt-chain-of-thought-header` and `mt-chain-of-thought-content`. */
  default?(): unknown;
}>();
</script>

<style scoped>
.mt-chain-of-thought {
  display: grid;
  gap: var(--scale-size-8);
}
</style>
