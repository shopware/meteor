<template>
  <div
    :class="[
      'mt-switch',
      {
        'mt-switch--no-top-margin': removeTopMargin,
        'mt-switch--future-no-default-margin': !!futureFlags.removeDefaultMargin,
        'mt-switch--not-bordered': !bordered,
        'mt-switch--disabled': disabled,
      },
    ]"
  >
    <div
      :class="[
        'mt-switch__block',
        {
          'mt-switch__block--bordered': bordered,
          'mt-switch__block--errored': !!error && !!bordered,
        },
      ]"
    >
      <!-- @vue-expect-error -->
      <!-- @deprecated: v6.0.0 -- remove aria-label, it's there as a hot-fix.  First rule of aria do not use aria if not needed -->
      <input
        :checked="isInherited ? inheritedValue : checked || modelValue"
        type="checkbox"
        :class="['mt-switch__switch', { 'mt-switch__switch--errored': !!error }]"
        :id="id"
        :disabled="disabled || isInherited"
        :required="required"
        :aria-describedby="!!error ? errorId : undefined"
        :aria-invalid="!!error || undefined"
        :aria-label="label || $attrs['aria-label']"
        :name="name"
        @change.stop.prevent="
          () => {
            $emit('change', !checked);
            $emit('update:modelValue', !modelValue);
          }
        "
      />

      <mt-field-label
        :class="['mt-switch__label', { 'mt-switch__label--disabled': disabled }]"
        :id="id"
        :inheritance="!isInheritanceField ? 'none' : isInherited ? 'linked' : 'unlinked'"
        :has-error="!!error"
        :required="required"
        @update:inheritance="
          if (isInherited) {
            $emit('inheritance-remove');
          } else {
            $emit('inheritance-restore');
          }
        "
        >{{ label }}</mt-field-label
      >

      <mt-help-text v-if="!!helpText" :text="helpText" class="mt-switch__help-text" />
    </div>

    <mt-field-error v-if="!!error" :error="error" :id="errorId" />
  </div>
</template>

<script setup lang="ts">
import { useId } from "vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";

defineProps<{
  modelValue?: boolean;
  label?: string;
  isInherited?: boolean;
  isInheritanceField?: boolean;
  inheritedValue?: boolean;
  required?: boolean;
  disabled?: boolean;
  checked?: boolean;
  bordered?: boolean;
  helpText?: string;
  error?: { detail: string };
  removeTopMargin?: boolean;
  name?: string;
}>();

const id = useId();
const errorId = useId();
const futureFlags = useFutureFlags();

defineEmits<{
  change: [value: boolean];
  "update:modelValue": [value: boolean];
  "inheritance-remove": [];
  "inheritance-restore": [];
}>();
</script>

<style>
.mt-switch {
  margin-top: var(--scale-size-24);
  margin-bottom: var(--scale-size-22);
}

.mt-switch--not-bordered {
  min-height: var(--scale-size-48);
}

.mt-switch--no-top-margin {
  margin-top: 0;
}

.mt-switch--future-no-default-margin {
  margin: 0;
}

.mt-switch__block {
  display: flex;
  align-items: center;
}

.mt-switch__block--bordered {
  min-height: var(--scale-size-48);
  border: 1px solid var(--color-border-primary-default);
  padding-inline: var(--scale-size-16);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-raised);
}

.mt-switch__block--errored {
  border-color: var(--color-border-critical-default);
  background: var(--color-background-critical-dark);
}

.mt-switch__switch {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;

  cursor: pointer;
  border-radius: var(--border-radius-round);
  height: var(--scale-size-16);
  width: var(--scale-size-24);
  background: var(--color-interaction-secondary-disabled);
  position: relative;

  &:disabled {
    cursor: not-allowed;
  }

  &::after {
    content: "";
    display: block;
    width: var(--scale-size-10);
    height: var(--scale-size-10);
    border-radius: var(--border-radius-round);
    background: var(--color-icon-static-default);
    position: absolute;
    top: 50%;
    left: 3px;
    transform: translateY(-50%);
    transition: 200ms left cubic-bezier(0.23, 1, 0.32, 1);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 2px;
  }

  &:checked::after {
    left: calc(100% - var(--scale-size-10) - 3px);
  }

  &:checked:not(.mt-switch__switch--errored) {
    background: var(--color-interaction-primary-default);

    &:disabled {
      background-color: var(--color-interaction-primary-disabled);
    }
  }

  &:disabled:not(:checked):not(.mt-switch__switch--errored) {
    &::after {
      background-color: var(--color-icon-primary-disabled);
    }
  }
}

.mt-switch__switch--errored {
  background: var(--color-interaction-critical-default);
}

.mt-switch__label {
  padding-left: var(--scale-size-4);
  cursor: pointer;
}

.mt-switch__label--disabled {
  cursor: not-allowed;
}

.mt-switch__help-text {
  margin-left: var(--scale-size-8);
  height: var(--scale-size-16);
  display: grid;
  place-items: center;
}
</style>
