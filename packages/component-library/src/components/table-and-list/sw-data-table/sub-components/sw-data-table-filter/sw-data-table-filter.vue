<template>
  <div class="sw-data-table-filter">
    <div class="sw-data-table-filter__filter-section">
      <button
        class="sw-data-table-filter__button sw-data-table-filter__button--property"
        @keydown.delete="$emit('remove')"
      >
        <!-- <sw-icon name="solid-spinner-star" class="sw-data-table-filter__icon" aria-hidden="true" /> -->

        <span>{{ property }}</span>
      </button>

      <span class="sw-data-table-filter__rule">is</span>

      <button
        class="sw-data-table-filter__button sw-data-table-filter__button--option"
        @keydown.delete="$emit('remove')"
      >
        <!-- <sw-icon name="solid-check-circle-s" class="sw-data-table-filter__icon" aria-hidden="true" /> -->

        <span>{{ option }}</span>
      </button>
    </div>

    <button
      class="sw-data-table-filter__remove-button"
      :aria-label="$t('sw-data-table-filter.remove-button')"
      @keydown.delete="$emit('remove')"
      @click="$emit('remove')"
    >
      <sw-icon name="solid-times-xxs" aria-hidden="true" />
    </button>
  </div>
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
        "sw-data-table-filter.remove-button": "Remove filter",
      },
      de: {
        "sw-data-table-filter.remove-button": "Filter entfernen",
      },
    },
  },
  emits: ["remove"],
  props: {
    property: {
      type: String,
      required: true,
    },
    option: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/scss/variables.scss";

.sw-data-table-filter {
  border: 1px solid var(--color-border-primary-default);
  border-radius: $border-radius-default;
  box-shadow:
    0px 1px 2px 0px rgba(0, 0, 0, 0.06),
    0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  color: var(--color-text-secondary-default);
  font-size: $font-size-xxs;
  display: inline-flex;
  align-items: center;
  height: 24px;
  line-height: 1;
  overflow: hidden;
  background-color: var(--color-elevation-surface-raised);

  .sw-data-table-filter__filter-section {
    display: flex;
    align-items: baseline;
  }

  button {
    // Reset button styles
    padding: 0;
    border: none;
    font: inherit;
    background: none;
    cursor: pointer;
    color: inherit;
  }

  .sw-data-table-filter__button {
    color: var(--color-text-primary-default);
    height: 22px;

    &:hover {
      color: var(--color-text-secondary-default);
    }

    &:focus-visible {
      color: var(--color-text-brand-default);
      outline: 0 none;
      background-color: var(--color-background-brand-default);
      border-color: var(--color-border-brand-selected);
    }
  }

  .sw-data-table-filter__button--property {
    border-right: 1px solid transparent;
    padding-right: 4px;
    padding-left: 8px;
  }

  .sw-data-table-filter__button--option {
    border-left: 1px solid transparent;
    padding-left: 4px;
    padding-right: 8px;
  }

  .sw-data-table-filter__rule {
    padding-inline: 4px;
  }

  .sw-data-table-filter__icon {
    color: var(--color-icon-primary-default);
  }

  .sw-data-table-filter__remove-button {
    position: relative;
    color: var(--color-icon-primary-default);
    border-left: 1px solid var(--color-border-primary-default);
    height: 23px;
    width: 24px;
    outline: 0 none;

    &:hover {
      color: var(--color-icon-primary-hover);
    }

    &:focus-visible {
      background-color: var(--color-background-brand-default);
      border-left-color: var(--color-border-brand-selected);

      .sw-icon {
        color: var(--color-icon-brand-default);
      }
    }

    .sw-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
