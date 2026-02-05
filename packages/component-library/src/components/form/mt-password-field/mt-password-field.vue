<template>
  <mt-base-field
    class="mt-password-field"
    :disabled="disabled"
    :required="required"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    :has-focus="hasFocus"
    :help-text="helpText"
    :name="name"
    :size="size"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
  >
    <template #label>
      {{ label }}
    </template>

    <template #field-prefix>
      <slot name="prefix" />
    </template>

    <template #element="{ identification }">
      <input
        :id="createInputId(identification)"
        :type="showPassword ? 'text' : 'password'"
        :name="identification"
        :placeholder="placeholder"
        :disabled="disabled || isInherited"
        :value="model ?? ''"
        :aria-label="label || undefined"
        class="mt-password-field__input"
        @input="onInput"
        @change.stop="onChange"
        @keyup.enter="$emit('submit')"
        @focus="setFocus"
        @blur="removeFocus"
      />

      <button
        v-if="toggable"
        type="button"
        class="mt-password-field__visibility-toggle"
        :aria-label="showPassword ? t('hidePassword') : t('showPassword')"
        :disabled="disabled || isInherited"
        @click.prevent="showPassword = !showPassword"
      >
        <mt-icon
          :name="showPassword ? 'solid-eye-slash' : 'solid-eye'"
          size="1.125rem"
          aria-hidden="true"
        />
      </button>
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <mt-field-error v-if="!!error" :error="error" />
    </template>

    <template #field-hint>
      <slot name="hint">
        {{ hint }}
      </slot>
    </template>
  </mt-base-field>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import { useI18n } from "vue-i18n";

const model = defineModel<string | undefined>();

const props = withDefaults(
  defineProps<{
    label?: string | null;
    placeholder?: string;
    disabled?: boolean;
    error?: { code: number; detail: string } | null;
    // @deprecated - use slot "hint" instead
    hint?: string | null;
    toggable?: boolean;
    name?: string | undefined;
    // additions to align with base-field
    required?: boolean;
    helpText?: string;
    size?: "small" | "default";
    isInherited?: boolean;
    isInheritanceField?: boolean;
    disableInheritanceToggle?: boolean;
    idSuffix?: string;
  }>(),
  {
    label: null,
    placeholder: "",
    toggable: true,
    error: null,
    // @deprecated - use slot "hint" instead
    hint: null,
    required: false,
    helpText: "",
    size: "default",
    isInherited: false,
    isInheritanceField: false,
    disableInheritanceToggle: false,
    idSuffix: "",
    name: undefined,
  },
);

const emit = defineEmits<{
  (e: "change", value: string | undefined): void;
  (e: "submit"): void;
  (e: "inheritance-restore", value: unknown): void;
  (e: "inheritance-remove", value: unknown): void;
  (e: "update:modelValue", value: string | undefined): void;
}>();

defineSlots<{
  prefix?: unknown;
  suffix?: unknown;
  hint?: unknown;
}>();

const showPassword = ref(false);
const hasFocus = ref(false);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  emit("update:modelValue", target?.value);
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement | null;
  emit("change", target?.value);
}

function setFocus() {
  hasFocus.value = true;
}

function removeFocus() {
  hasFocus.value = false;
}

function createInputId(identification: string): string {
  if (!props.idSuffix || props.idSuffix.length <= 0) {
    return identification;
  }
  return `${identification}-${props.idSuffix}`;
}

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
.mt-password-field :deep(.mt-block-field__block) {
  &:has(input:disabled) {
    background-color: var(--color-background-tertiary-default);
  }
}

.mt-password-field__visibility-toggle {
  align-self: center;
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
    outline: 2px solid var(--color-border-brand-default);
  }
}
</style>
