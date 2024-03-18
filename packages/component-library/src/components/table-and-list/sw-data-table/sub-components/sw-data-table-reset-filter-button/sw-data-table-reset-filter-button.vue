<template>
  <button class="sw-data-table-reset-filter-button">
    {{ $tc("sw-data-table-reset-filter-button.label", numberOfAppliedFilters) }}
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
        "sw-data-table-reset-filter-button": {
          label: "Remove filter | Remove filters",
        },
      },
      de: {
        "sw-data-table-reset-filter-button": {
          label: "Filter entfernen | Filter entfernen",
        },
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.sw-data-table-reset-filter-button {
  /* Reset button styles */
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background: none;
  cursor: pointer;

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
