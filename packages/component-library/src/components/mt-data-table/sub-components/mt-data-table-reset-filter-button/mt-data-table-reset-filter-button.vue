<template>
  <button type="button" class="mt-data-table-reset-filter-button">
    {{ t("label", { n: numberOfAppliedFilters }) }}
  </button>
</template>

<script setup lang="ts">
import { useMeteorI18n } from "@/composables/use-meteor-i18n";

defineProps<{
  numberOfAppliedFilters: number;
}>();

const { t } = useMeteorI18n({
  namespace: "mt.data-table-reset-filter-button",
  messages: {
    en: {
      label: "Remove filter | Remove filters",
    },
    de: {
      label: "Filter entfernen | Filter entfernen",
    },
  },
});
</script>

<style scoped>
.mt-data-table-reset-filter-button {
  color: var(--color-text-brand-default);
  text-decoration: underline;
  outline-offset: 4px;
  outline-color: var(--color-border-brand-default);

  &:hover,
  &:focus-visible {
    color: var(--color-text-brand-hover);
    text-decoration: none;
  }
}
</style>
