<template>
  <div
    class="mt-password-field mt-field"
    :class="[
      `mt-field--${size}`,
      {
        'has--error': hasError,
        'is--disabled': disabled,
        'is--inherited': isInherited,
        'has--focus': hasFocus,
        'mt-field--future-remove-default-margin': future.removeDefaultMargin,
        'mt-field--future-consistent-label-line-height': future.consistentLabelLineHeight,
      },
    ]"
  >
    <mt-field-label
      v-if="label"
      class="mt-field__label"
      :for="inputId"
      :required="required"
      :has-error="hasError"
      :disabled="disableInheritanceToggle"
      :inheritance="inheritanceState"
      :style="labelStyle"
      @update:inheritance="onInheritanceUpdate"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text
      v-if="helpText"
      class="mt-field__help-text"
      :text="helpText"
      placement="right"
      :style="{ gridArea: 'help-text', alignSelf: 'center' }"
    />

    <div class="mt-password-field__block mt-block-field__block">
      <mt-field-addition v-if="$slots.prefix" type="prefix" :size="size" :has-error="hasError">
        <slot name="prefix" />
      </mt-field-addition>

      <input
        :id="inputId"
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
          :name="showPassword ? 'regular-eye-slash' : 'regular-eye'"
          size="var(--scale-size-16)"
          aria-hidden="true"
        />
      </button>

      <mt-field-addition v-if="$slots.suffix" :size="size" :has-error="hasError">
        <slot name="suffix" />
      </mt-field-addition>
    </div>

    <mt-field-error v-if="!!error" :error="error" :style="{ gridArea: 'error' }" />

    <div v-if="showFieldHint" class="mt-field__hint-wrapper">
      <div class="mt-field__hint">
        <mt-field-hint :hide-icon="!!$slots.hint">
          <slot name="hint">
            {{ hint }}
          </slot>
        </mt-field-hint>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, useId, type CSSProperties } from "vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldAddition from "../_internal/mt-field-addition/mt-field-addition.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFieldHint from "../_internal/mt-field-hint/mt-field-hint.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import { useI18n } from "vue-i18n";
import { useFutureFlags } from "@/composables/useFutureFlags";

const model = defineModel<string | undefined>();

const props = withDefaults(
  defineProps<{
    label?: string | null;
    placeholder?: string;
    disabled?: boolean;
    error?: { code: number; detail: string } | null;
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

const future = useFutureFlags();
const slots = useSlots();
const id = useId();

const identification = computed(() => props.name ?? `mt-field--${id}`);

const inputId = computed(() =>
  props.idSuffix && props.idSuffix.length > 0
    ? `${identification.value}-${props.idSuffix}`
    : identification.value,
);

const hasError = computed(() => !!props.error);

const inheritanceState = computed<"linked" | "unlinked" | "none">(() => {
  if (!props.isInheritanceField) return "none";

  return props.isInherited ? "linked" : "unlinked";
});

const labelStyle = computed<CSSProperties>(() => ({
  gridArea: "label",
  marginBottom: "var(--scale-size-8)",
  lineHeight: future.consistentLabelLineHeight ? "var(--font-line-height-xs)" : "16px",
}));

const showFieldHint = computed(
  () => !!slots.hint || (props.hint != null && String(props.hint).trim() !== ""),
);

const emit = defineEmits<{
  (e: "change", value: string | undefined): void;
  (e: "submit"): void;
  (e: "inheritance-restore", value?: unknown): void;
  (e: "inheritance-remove", value?: unknown): void;
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

function onInheritanceUpdate(value: "linked" | "unlinked") {
  if (value === "unlinked") {
    emit("inheritance-remove");
  } else {
    emit("inheritance-restore");
  }
}

function setFocus() {
  hasFocus.value = true;
}

function removeFocus() {
  hasFocus.value = false;
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
.mt-password-field {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  width: 100%;
  margin-bottom: var(--scale-size-32);
}

.mt-password-field.has--error {
  margin-bottom: var(--scale-size-12);
}

.mt-password-field.mt-field--small,
.mt-password-field.mt-field--future-remove-default-margin {
  margin-bottom: 0;
}

.mt-password-field.is--disabled {
  cursor: not-allowed;
}

.mt-password-field__block {
  grid-area: input;
  display: flex;
  min-height: var(--scale-size-48);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  overflow: hidden;
  background-color: var(--color-background-primary-default);
}

.mt-password-field.mt-field--small .mt-password-field__block {
  min-height: var(--scale-size-32);
}

.mt-password-field__block:has(input:disabled) {
  background-color: var(--color-background-tertiary-default);
}

.mt-password-field.has--focus .mt-password-field__block {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: var(--scale-size-2);
}

.mt-password-field.has--error .mt-password-field__block {
  background-color: var(--color-background-critical-default);
  border-color: var(--color-border-critical-default);
}

.mt-password-field__input {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 13px var(--scale-size-16);
  border: none;
  background: transparent;
  font-size: var(--font-size-xs);
  font-family: var(--font-family-body);
  line-height: 1;
  color: var(--color-text-primary-default);
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.mt-password-field.mt-field--small .mt-password-field__input {
  padding: var(--scale-size-4) var(--scale-size-16);
}

.mt-password-field__input::placeholder {
  color: var(--color-text-secondary-default);
}

.mt-password-field__input:disabled {
  cursor: default;
}

.mt-password-field__visibility-toggle {
  align-self: center;
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-xs);
  height: var(--scale-size-32);
  width: var(--scale-size-32);
  margin-right: var(--scale-size-8);
  flex-shrink: 0;

  &:is(:hover, :focus-visible) {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-default);
  }
}

.mt-field__hint-wrapper {
  grid-area: hint;
  display: flex;
  justify-content: space-between;
}

.mt-field__hint {
  margin-top: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  color: var(--color-text-secondary-default);
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.mt-field__hint:empty {
  display: none;
}
</style>
