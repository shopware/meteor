<template>
  <button
    class="sw-data-table-add-filter-button"
    :aria-label="$t('sw-data-table-add-filter-button.label')"
  >
    <sw-icon name="solid-plus-square-s" />
  </button>
</template>

<script lang="ts">
import SwIcon from "@/components/icons-media/sw-icon/sw-icon.vue";

export default {
  components: {
    "sw-icon": SwIcon,
  },
  i18n: {
    messages: {
      en: {
        "sw-data-table-add-filter-button": {
          label: "Add filter",
        },
      },
      de: {
        "sw-data-table-add-filter-button": {
          label: "Filter hinzufügen",
        },
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/scss/variables.scss";

.sw-data-table-add-filter-button {
  /* Reset button styles */
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background: none;

  color: var(--color-icon-primary-default);
  height: 34px;
  width: 34px;

  // TODO: remove min-width later when we found a better solution
  min-width: 34px;
  cursor: pointer;
  outline: 0;
  border-radius: $border-radius-default;

  &:hover,
  &:focus-visible {
    background-color: var(--color-background-primary-disabled);
    color: var(--color-icon-primary-hover);
  }
}
</style>
