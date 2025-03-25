<template>
  <div class="mt-password-field">
    <mt-field-label :id="id" :has-error="!!error" :style="{ marginBottom: 'var(--scale-size-2)' }">
      {{ label }}
    </mt-field-label>

    <div :class="['mt-password-field__block', { 'mt-password-field__block--error': !!error }]">
      <mt-field-affix v-if="$slots.prefix" type="prefix">
        <slot name="prefix" />
      </mt-field-affix>

      <input
        v-model="model"
        class="mt-password-field__input"
        @change="$emit('change', model)"
        @keyup.enter="$emit('submit')"
        :type="showPassword ? 'text' : 'password'"
        :id="id"
        :placeholder="placeholder"
        :disabled="disabled"
        :name="name"
      />

      <button
        v-if="toggable"
        type="button"
        @click.prevent="showPassword = !showPassword"
        class="mt-password-field__visibility-toggle"
        :aria-label="showPassword ? t('hidePassword') : t('showPassword')"
        :disabled="disabled"
      >
        <mt-icon
          :name="showPassword ? 'solid-eye-slash' : 'solid-eye'"
          size="1.125rem"
          aria-hidden="true"
          color="var(--color-icon-primary-default)"
        />
      </button>

      <mt-field-affix v-if="$slots.suffix" type="suffix"><slot name="suffix" /></mt-field-affix>
    </div>

    <mt-field-error v-if="!!error" :error="error" />

    <div v-if="$slots.hint" class="mt-password-field__hint">
      <slot name="hint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useId } from "vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFieldAffix from "../_internal/mt-field-affix/mt-field-affix.vue";
import { useI18n } from "vue-i18n";

const model = defineModel({
  type: String,
});

withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: { code: number; detail: string } | null;
    hint?: string;
    toggable?: boolean;
    name?: string;
  }>(),
  {
    toggable: true,
  },
);

defineEmits<{
  (e: "change", value: string | undefined): void;
  (e: "submit"): void;
}>();

defineSlots<{
  prefix?: unknown;
  suffix?: unknown;
  hint?: unknown;
}>();

const id = useId();

const showPassword = ref(false);

const { t } = useI18n({
  messages: {
    en: {
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
    de: {
      showPassword: "Passwort anzeigen",
      hidePassword: "Passwort verbergen",
    },
  },
});
</script>

<style scoped>
.mt-password-field {
  width: 100%;
}

.mt-password-field__block {
  display: flex;
  align-items: center;
  min-height: var(--scale-size-48);
  /* stylelint-disable-next-line meteor/prefer-sizing-token -- This is a trick, so the children can take 100% of it's parent height */
  height: 1px;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background-color: var(--color-elevation-surface-raised);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);

  &:not(.mt-password-field__block--error)&:has(.mt-password-field__input:focus-visible) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0px 0px 4px 0px rgba(24, 158, 255, 0.3);
  }

  &:has(input:disabled) {
    background-color: var(--color-background-primary-disabled);
  }
}

.mt-password-field__block--error {
  border-color: var(--color-border-critical-default);
  background: var(--color-background-critical-default);
}

.mt-password-field__input {
  all: unset;

  flex: 1;
  padding-inline: var(--scale-size-16);
  color: var(--color-text-primary-default);
  height: 100%;

  &::placeholder {
    color: var(--color-text-secondary-default);
  }
}

.mt-password-field__visibility-toggle {
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-xs);
  height: var(--scale-size-32);
  width: var(--scale-size-32);
  margin-right: var(--scale-size-8);

  &:is(:hover, :focus-visible) {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
  }
}

.mt-password-field__hint {
  color: var(--color-text-tertiary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);

  &:empty {
    display: none;
  }
}
</style>
