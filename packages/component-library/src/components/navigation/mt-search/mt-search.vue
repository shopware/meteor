<template>
  <div :class="['mt-search', `mt-search--size-${size}`, { 'mt-search--disabled': disabled }]">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @change="$emit('change', ($event.target as HTMLInputElement).value)"
      class="mt-search__input"
      :disabled="disabled"
      type="search"
      :placeholder="placeholder || t('placeholder')"
    />

    <mt-icon
      name="regular-search-s"
      size="var(--scale-size-16)"
      color="var(--color-icon-primary-default)"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    size?: "small" | "default";
    disabled?: boolean;
  }>(),
  {
    size: "default",
  },
);

const { t } = useI18n({
  messages: {
    en: {
      placeholder: "Search",
    },
    de: {
      placeholder: "Suchen",
    },
  },
});

defineEmits<{
  (e: "change", value: string): void;
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped>
.mt-search {
  background: var(--color-elevation-surface-raised);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
  overflow: hidden;
  display: flex;
  align-items: center;

  &:focus-within {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }
}

.mt-search--size-default {
  padding: var(--scale-size-12) var(--scale-size-16);
}

.mt-search--size-small {
  padding: var(--scale-size-4) var(--scale-size-16);
}

.mt-search__input {
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  font-size: var(--font-size-xs);
  font-family: var(--font-size-body);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-primary-default);
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }

  &::placeholder {
    color: var(--color-text-secondary-default);
  }

  &:disabled {
    color: var(--color-text-primary-disabled);

    &::placeholder {
      color: var(--color-text-secondary-disabled);
    }
  }
}

.mt-search--disabled {
  background-color: var(--color-background-primary-disabled);
}
</style>
