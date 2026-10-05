<template>
  <mt-collapsible-content class="mt-chain-of-thought-content">
    <ol class="mt-chain-of-thought-content__list" role="list" :aria-label="label ?? t('label')">
      <slot />
    </ol>
  </mt-collapsible-content>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";

/**
 * The steps of `mt-chain-of-thought`, shown while it is open.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The accessible name of the list. Defaults to a translated "Chain of thought". */
    label?: string;
  }>(),
  {
    label: undefined,
  },
);

// The list sets role="list": Safari drops the list semantics of lists without list markers.
defineSlots<{
  /** The steps, `mt-chain-of-thought-step`. */
  default?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { label: "Chain of thought" },
    de: { label: "Gedankengang" },
  },
});
</script>

<style scoped>
.mt-chain-of-thought-content__list {
  display: grid;
  gap: var(--scale-size-8);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
