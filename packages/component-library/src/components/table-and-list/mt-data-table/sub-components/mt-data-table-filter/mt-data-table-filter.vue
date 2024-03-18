<template>
  <div class="mt-data-table-filter" data-testid="mt-data-table-filter">
    <span class="mt-data-table-filter__property" @keydown.delete="$emit('removeOption')">
      {{ filter.label }}
    </span>

    <span class="mt-data-table-filter__rule">is</span>

    <mt-popover class="mt-data-table-filter__option" title="Manufactuer">
      <template #trigger="{ toggleFloatingUi }">
        <button @keydown.delete="$emit('removeOption')" @click="toggleFloatingUi">
          {{ appliedOptions.map((option) => option.label).join(", ") }}
        </button>
      </template>

      <template #popover-items__base>
        <mt-popover-item
          v-for="option in filter.type.options"
          :key="option.id"
          :label="option.label"
          show-checkbox
          :checkbox-checked="isOptionSelected(option.id)"
          @change-checkbox="
            (isChecked) =>
              isChecked
                ? $emit('addOption', filter.id, option.id)
                : $emit('removeOption', filter.id, option.id)
          "
        />
      </template>
    </mt-popover>

    <button
      class="mt-data-table-filter__remove-button"
      :aria-label="$t('mt-data-table-filter.remove-button')"
      @keydown.delete="$emit('removeOption')"
      @click="$emit('removeOption')"
    >
      <mt-icon name="solid-times-xxs" aria-hidden="true" />
    </button>
  </div>
</template>

<script lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtPopover from "@/components/overlay/mt-popover/mt-popover.vue";
import MtPopoverItem from "@/components/overlay/mt-popover-item/mt-popover-item.vue";
import { defineComponent, type PropType } from "vue";
import type { Filter, Option } from "../../mt-data-table.interfaces";

export default defineComponent({
  name: "MtDataTableFilter",

  components: {
    "mt-icon": MtIcon,
    "mt-popover": MtPopover,
    "mt-popover-item": MtPopoverItem,
  },
  i18n: {
    messages: {
      en: {
        "mt-data-table-filter.remove-button": "Remove filter",
      },
      de: {
        "mt-data-table-filter.remove-button": "Filter entfernen",
      },
    },
  },
  emits: ["removeOption", "addOption"],
  props: {
    filter: {
      type: Object as PropType<Filter>,
      required: true,
    },
    appliedOptions: {
      type: Array as PropType<Option[]>,
      required: true,
    },
  },
  setup(props) {
    function isOptionSelected(optionId: string) {
      return !!props.appliedOptions.find((option) => option.id === optionId);
    }

    return {
      isOptionSelected,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../../../../assets/scss/variables.scss";

.mt-data-table-filter {
  display: inline-flex;
  font-size: 12px;

  & > * {
    height: 24px;
    display: grid;
    place-items: center;
  }

  .mt-data-table-filter__property {
    border: 1px solid var(--color-border-primary-default);
    border-right: 0 none;
    border-top-left-radius: $border-radius-default;
    border-bottom-left-radius: $border-radius-default;
    color: var(--color-text-primary-default);
    padding-inline: 8px;
  }

  .mt-data-table-filter__rule {
    color: var(--color-text-secondary-default);
    border-top: 1px solid var(--color-border-primary-default);
    border-bottom: 1px solid var(--color-border-primary-default);
    padding-right: 4px;
  }

  .mt-data-table-filter__option {
    color: var(--color-text-primary-default);
    border-top: 1px solid var(--color-border-primary-default);
    border-bottom: 1px solid var(--color-border-primary-default);
    padding-inline: 4px 8px;

    button {
      outline: 0 none;
    }

    &:has(button:hover) {
      background-color: var(--color-interaction-secondary-hover);
    }

    &:has(button:focus-visible) {
      background-color: var(--color-background-brand-default);
      outline: var(--color-border-brand-selected) solid 1px;
      outline-offset: -1px;
    }
  }

  .mt-data-table-filter__remove-button {
    color: var(--color-icon-primary-default);
    border-top-right-radius: $border-radius-default;
    border-bottom-right-radius: $border-radius-default;
    border: 1px solid var(--color-border-primary-default);
    outline: 0 none;
    position: relative;
    height: 24px;
    width: 24px;

    .mt-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &:focus-visible {
      background-color: var(--color-background-brand-default);
      border-color: var(--color-border-brand-selected);
    }

    &:hover {
      background-color: var(--color-interaction-secondary-hover);
    }
  }
}
</style>
