<template>
  <div class="mt-data-table-filter" data-testid="mt-data-table-filter">
    <mt-text class="mt-data-table-filter__property" size="2xs">
      {{ filter.label }}
    </mt-text>

    <mt-text size="2xs" color="color-text-secondary-default" class="mt-data-table-filter__rule">
      {{ t("is") }}
    </mt-text>

    <mt-popover class="mt-data-table-filter__option" title="Manufactuer">
      <template #trigger="{ toggleFloatingUi }">
        <button type="button" @keydown.delete="$emit('removeFilter')" @click="toggleFloatingUi">
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
      type="button"
      class="mt-data-table-filter__remove-button"
      :aria-label="t('removeButton')"
      @keydown.delete="$emit('removeFilter')"
      @click="$emit('removeFilter')"
    >
      <mt-icon name="solid-times-xxs" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtPopover from "@/components/overlay/mt-popover/mt-popover.vue";
import MtPopoverItem from "@/components/overlay/mt-popover-item/mt-popover-item.vue";
import type { Filter, Option } from "../../mt-data-table.interfaces";
import MtText from "@/components/content/mt-text/mt-text.vue";
import { useI18n } from "vue-i18n";

defineEmits<{
  (e: "removeOption", filterId: string, optionId: string): void;
  (e: "addOption", filterId: string, optionId: string): void;
  (e: "removeFilter"): void;
}>();

const props = defineProps<{
  filter: Filter;
  appliedOptions: Option[];
}>();

function isOptionSelected(optionId: string) {
  return !!props.appliedOptions.find((option) => option.id === optionId);
}

const { t } = useI18n({
  messages: {
    en: {
      is: "is",
      removeButton: "Remove filter",
    },
    de: {
      is: "ist",
      removeButton: "Filter entfernen",
    },
  },
});
</script>

<style scoped>
.mt-data-table-filter {
  display: inline-flex;

  & > * {
    height: var(--scale-size-24);
    display: grid;
    place-items: center;
  }
}

.mt-data-table-filter__property {
  border: 1px solid var(--color-border-primary-default);
  border-right: 0 none;
  border-top-left-radius: var(--border-radius-xs);
  border-bottom-left-radius: var(--border-radius-xs);
  color: var(--color-text-primary-default);
  padding-inline: var(--scale-size-8);
}

.mt-data-table-filter__rule {
  border-top: 1px solid var(--color-border-primary-default);
  border-bottom: 1px solid var(--color-border-primary-default);
  padding-right: var(--scale-size-4);
}

.mt-data-table-filter__option {
  color: var(--color-text-primary-default);
  font-size: var(--font-size-2xs);
  font-family: var(--font-family-body);
  line-height: var(--font-line-height-2xs);
  border-top: 1px solid var(--color-border-primary-default);
  border-bottom: 1px solid var(--color-border-primary-default);
  padding-inline: var(--scale-size-4) var(--scale-size-8);

  & button {
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
  border-top-right-radius: var(--border-radius-xs);
  border-bottom-right-radius: var(--border-radius-xs);
  border: 1px solid var(--color-border-primary-default);
  outline: 0 none;
  position: relative;
  height: var(--scale-size-24);
  width: var(--scale-size-24);

  & .mt-icon {
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
</style>
