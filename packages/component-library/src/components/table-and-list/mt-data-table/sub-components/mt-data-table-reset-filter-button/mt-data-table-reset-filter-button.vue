<template>
  <button class="mt-data-table-reset-filter-button">
    {{ $tc("mt-data-table-reset-filter-button.label", numberOfAppliedFilters) }}
  </button>
</template>

<script lang="ts">
export default {
  props: {
    numberOfAppliedFilters: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1,
    },
  },
  i18n: {
    messages: {
      en: {
        "mt-data-table-reset-filter-button": {
          label: "Remove filter | Remove filters",
        },
      },
      de: {
        "mt-data-table-reset-filter-button": {
          label: "Filter entfernen | Filter entfernen",
        },
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.mt-data-table-reset-filter-button {
  color: var(--color-text-brand-default);
  text-decoration: underline;
  outline-offset: 4px;
  outline-color: var(--color-border-brand-selected);

  &:hover,
  &:focus-visible {
    color: var(--color-text-brand-hover);
    text-decoration: none;
  }
}
</style>
