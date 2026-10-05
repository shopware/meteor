<template>
  <dropdown-menu-root v-if="models.length > 1">
    <dropdown-menu-trigger as-child>
      <mt-button
        class="mt-prompt-field-model-select__trigger"
        variant="tertiary"
        block
        :disabled="disabled || context.disabled.value"
        :aria-label="t('label', { model: activeModel?.label ?? '' })"
      >
        <span class="mt-prompt-field-model-select__label">{{ activeModel?.label }}</span>
        <template #iconBack>
          <mt-icon name="regular-chevron-down-xs" size="8" decorative />
        </template>
      </mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
      <mt-action-menu>
        <dropdown-menu-radio-group
          :model-value="activeModel?.value"
          @update:model-value="(value) => (model = String(value))"
        >
          <dropdown-menu-radio-item
            v-for="option in models"
            :key="option.value"
            class="mt-prompt-field-model-select__item"
            :value="option.value"
            :disabled="option.disabled"
          >
            <span class="mt-prompt-field-model-select__text">
              <mt-text as="span" size="xs">{{ option.label }}</mt-text>
              <mt-text
                v-if="option.description"
                as="span"
                size="2xs"
                color="color-text-secondary-default"
              >
                {{ option.description }}
              </mt-text>
            </span>

            <dropdown-menu-item-indicator class="mt-prompt-field-model-select__indicator">
              <mt-icon name="regular-checkmark-xs" size="10" decorative />
            </dropdown-menu-item-indicator>
          </dropdown-menu-radio-item>
        </dropdown-menu-radio-group>
      </mt-action-menu>
    </dropdown-menu-portal>
  </dropdown-menu-root>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "reka-ui";
import MtActionMenu from "@/components/mt-action-menu/mt-action-menu.vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { usePromptFieldContext } from "./composables/usePromptFieldContext";
import type { MtPromptFieldModel } from "./mt-prompt-field.types";

/**
 * The model choice of `mt-prompt-field`, placed in its `tools-end` slot. It renders nothing with
 * fewer than two models.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The models to choose from. */
    models: MtPromptFieldModel[];
    /** Disables the model choice. */
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

/** The `value` of the selected model. */
const model = defineModel<string>();

const context = usePromptFieldContext("mt-prompt-field-model-select");

const { t } = useI18n({
  messages: {
    en: { label: "Model: {model}" },
    de: { label: "Modell: {model}" },
  },
});

const activeModel = computed(
  () => props.models.find((option) => option.value === model.value) ?? props.models[0],
);
</script>

<style>
/* A long model name is cut off with an ellipsis instead of crowding the submit button. */
.mt-prompt-field-model-select__trigger .mt-button__content {
  min-width: 0;
}

.mt-prompt-field-model-select__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mt-prompt-field-model-select__item {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-height: var(--scale-size-32);
  padding: var(--scale-size-4) var(--scale-size-10);
  color: var(--color-text-primary-default);
  border-radius: var(--border-radius-s);
  outline: none;
  cursor: pointer;
  user-select: none;
}

.mt-prompt-field-model-select__item[data-highlighted] {
  background-color: var(--color-interaction-secondary-hover);
}

.mt-prompt-field-model-select__item[data-disabled] {
  color: var(--color-text-primary-disabled);
  cursor: not-allowed;
}

.mt-prompt-field-model-select__text {
  display: grid;
  flex: 1;
  min-width: 0;
}

.mt-prompt-field-model-select__indicator {
  display: grid;
  place-items: center;
  margin-inline-start: auto;
  padding-inline-start: var(--scale-size-16);
  color: var(--color-icon-primary-default);
}
</style>
