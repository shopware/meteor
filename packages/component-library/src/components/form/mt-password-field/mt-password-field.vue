<template>
  <div class="mt-password-field">
    <mt-field-label :id="id" :has-error="!!error">{{ label }}</mt-field-label>

    <div :class="['mt-password-field__box', { 'mt-password-field__box--has-error': !!error }]">
      <div class="mt-password-field__affix mt-password-field__affix--prefix">
        <slot name="prefix" />
      </div>

      <input
        v-model="model"
        :type="showPassword ? 'text' : 'password'"
        :id="id"
        :placeholder="placeholder"
        :disabled="disabled"
      />

      <button
        v-if="toggable"
        @click="showPassword = !showPassword"
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

      <div class="mt-password-field__affix mt-password-field__affix--suffix">
        <slot name="suffix" />
      </div>
    </div>

    <mt-field-error v-if="!!error" :error="error" />

    <div class="mt-password-field__hint">
      <slot name="hint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { createId } from "@/utils/id";
import { onMounted, ref } from "vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import { useI18n } from "@/composables/useI18n";

const model = defineModel();

withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: { code: number; detail: string } | null;
    hint?: string;
    toggable?: boolean;
  }>(),
  {
    toggable: true,
  },
);

defineEmits<{
  (e: "change", value: string): void;
}>();

defineSlots<{
  prefix: void;
  suffix: void;
  hint: void;
}>();

const id = ref("");
onMounted(() => {
  id.value = createId();
});

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

.mt-password-field__box {
  display: flex;
  align-items: center;
  height: 3rem;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background-color: var(--color-elevation-surface-raised);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);

  &:has(input:focus) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }

  &:has(input:disabled) {
    background-color: var(--color-background-primary-disabled);
  }
}

.mt-password-field__box--has-error {
  border-color: var(--color-border-critical-default);
  background: var(--color-background-critical-default);
}

input {
  all: unset;

  flex: 1;
  padding-inline: 1rem;
  color: var(--color-text-primary-default);

  &::placeholder {
    color: var(--color-text-secondary-default);
  }
}

.mt-password-field__visibility-toggle {
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-xs);
  height: 2rem;
  width: 2rem;
  margin-right: 0.5rem;

  &:is(:hover, :focus-visible) {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
  }
}

.mt-password-field__affix {
  padding-inline: 1rem;
  background: var(--color-interaction-secondary-dark);
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--color-text-primary-default);

  &:empty {
    display: none;
  }
}

.mt-password-field__affix--prefix {
  border-top-left-radius: var(--border-radius-xs);
  border-bottom-left-radius: var(--border-radius-xs);
  border-right: 1px solid var(--color-border-primary-default);
}

.mt-password-field__affix--suffix {
  border-top-right-radius: var(--border-radius-xs);
  border-bottom-right-radius: var(--border-radius-xs);
  border-left: 1px solid var(--color-border-primary-default);
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
