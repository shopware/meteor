<template>
  <div
    :class="[
      'mt-email-field',
      {
        'mt-email-field--future-no-default-margin': futureFlags.removeDefaultMargin,
      },
    ]"
  >
    <mt-field-label
      v-if="label"
      :for="id ?? ''"
      :has-error="!!error || !!errorMessage"
      :required="required"
      :style="{ gridArea: 'label', marginBottom: 'var(--scale-size-2)' }"
      :inheritance="!isInheritanceField ? 'none' : isInherited ? 'linked' : 'unlinked'"
      @update:inheritance="
        if (isInherited) {
          $emit('inheritance-remove');
        } else {
          $emit('inheritance-restore');
        }
      "
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text v-if="!!helpText" :text="helpText" :style="{ gridArea: 'help-text' }" />

    <div
      :class="[
        'mt-email-field__block',
        {
          'mt-email-field__block--error': !!error || !!errorMessage,
          'mt-email-field__block--small': small,
        },
      ]"
      :style="{ gridArea: 'input' }"
    >
      <mt-field-affix v-if="$slots.prefix" type="prefix">
        <slot name="prefix" />
      </mt-field-affix>

      <input
        v-model="model"
        class="mt-email-field__input"
        type="email"
        ref="inputRef"
        :id="id"
        :required="required"
        :disabled="disabled || isInherited"
        :name="name"
        :placeholder="placeholder"
        :aria-invalid="!!errorMessage || !!error"
        :aria-describedby="!!errorMessage || !!error ? errorId : undefined"
        @change="$emit('change', ($event.target as HTMLInputElement).value)"
        @focus="$emit('focus')"
        @blur="
          () => {
            checkValidity();
            $emit('blur');
          }
        "
      />

      <mt-field-copyable
        v-if="copyable"
        :copyable-text="model"
        :copyable-tooltip="copyableTooltip"
      />

      <mt-field-affix type="suffix" v-else-if="$slots.suffix">
        <slot name="suffix" />
      </mt-field-affix>
    </div>

    <mt-field-error
      v-if="error || errorMessage"
      :id="errorId"
      :error="errorMessage || error"
      :style="{ gridArea: 'error' }"
    />

    <div v-if="showFieldHint" class="mt-email-field__hint" :style="{ gridArea: 'hint' }">
      <mt-field-hint :hide-icon="!!$slots.hint">
        <slot name="hint">{{ hint }}</slot>
      </mt-field-hint>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, useId, useSlots } from "vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtFieldHint from "../_internal/mt-field-hint/mt-field-hint.vue";
import MtFieldAffix from "../_internal/mt-field-affix/mt-field-affix.vue";
import MtFieldCopyable from "../_internal/mt-field-copyable/mt-field-copyable.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";

const futureFlags = useFutureFlags();

const model = defineModel({
  type: String,
});

const props = defineProps<{
  disabled?: boolean;
  required?: boolean;
  modelValue?: string;
  name?: string;
  label?: string;
  error?: {
    detail: string;
  };
  helpText?: string;
  copyable?: boolean;
  copyableTooltip?: boolean;
  placeholder?: string;
  small?: boolean;
  isInherited?: boolean;
  isInheritanceField?: boolean;
  /**
   * Optional caption below the field. The `#hint` slot takes precedence when provided.
   */
  hint?: string | null;
}>();

const slots = useSlots();

const showFieldHint = computed(
  () => !!slots.hint || (props.hint != null && String(props.hint).trim() !== ""),
);

defineEmits(["change", "blur", "focus", "inheritance-restore", "inheritance-remove"]);

const id = useId();

const errorId = useId();

const inputRef = ref<HTMLInputElement | null>(null);

const errorMessage = ref<
  | undefined
  | {
      detail: string;
    }
>(undefined);

function checkValidity() {
  if (!inputRef.value) return;

  const isValid = inputRef.value?.checkValidity();
  if (isValid) {
    errorMessage.value = undefined;
    return;
  }

  errorMessage.value = { detail: inputRef.value?.validationMessage };
}
</script>

<style scoped>
.mt-email-field {
  display: grid;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  grid-template-columns: 1fr auto;
  margin-bottom: var(--scale-size-32);
}

.mt-email-field--future-no-default-margin {
  margin-bottom: 0;
}

.mt-email-field__block {
  --mt-email-field-border-radius: var(--border-radius-xs);

  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--mt-email-field-border-radius);
  background-color: var(--color-background-primary-default);
  min-height: var(--scale-size-48);
  /* stylelint-disable-next-line meteor/prefer-sizing-token -- this is a trick so that the input field take 100% of its parent's height */
  height: 1px;

  & ::placeholder {
    color: var(--color-text-secondary-default);
  }

  &:not(.mt-email-field__block--error)&:has(.mt-email-field__input:focus-visible) {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: var(--scale-size-2);
  }

  &:has(.mt-email-field__input:disabled) {
    background-color: var(--color-background-tertiary-default);

    & ::placeholder {
      color: var(--color-text-secondary-disabled);
    }
  }
}

.mt-email-field__block--error {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-default);
}

.mt-email-field__input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;

  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary-default);
  padding-inline: var(--scale-size-16);
  height: 100%;
  width: 100%;
}

.mt-email-field__hint {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-secondary-default);
  margin-top: 0.1875rem;
}

.mt-email-field__block--small {
  min-height: var(--scale-size-32);
}
</style>
