<template>
  <div class="mt-textarea">
    <mt-field-label
      v-if="!!label"
      :id="id"
      :required="required"
      :has-error="!!error && !!error.detail"
      :inheritance="!isInheritanceField ? 'none' : isInherited ? 'linked' : 'unlinked'"
      :style="{
        gridArea: 'label',
        marginBottom: 'var(--scale-size-2)',
      }"
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

    <mt-help-text
      v-if="!!helpText"
      :text="helpText"
      :style="{ gridArea: 'help-text', justifySelf: 'end' }"
    />

    <textarea
      v-model="model"
      :class="[
        'mt-textarea__textarea',
        {
          'mt-textarea__textarea--error': !!error && !!error.detail,
        },
      ]"
      @change="$emit('change', model)"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      :id="id"
      :required="required"
      :disabled="disabled || isInherited"
      :name="name"
      :placeholder="placeholder"
      :maxlength="maxLength"
    />

    <mt-field-error
      v-if="!!error && !!error.detail"
      :error="error"
      :style="{ gridArea: 'error' }"
    />

    <div v-if="!!$slots.hint" class="mt-textarea__hint">
      <slot name="hint" />
    </div>

    <span v-if="!!maxLength" class="mt-textarea__max-length"
      >{{ model?.length ?? 0 }}/{{ maxLength }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { useId } from "@/composables/useId";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";

const model = defineModel({
  type: String,
});

const id = useId();

defineEmits<{
  change: [typeof model.value];
  "inheritance-remove": void;
  "inheritance-restore": void;
  focus: void;
  blur: void;
}>();

defineProps<{
  required?: boolean;
  disabled?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  error?: {
    detail: string;
  };
  helpText?: string;
  maxLength?: number;
  isInherited?: boolean;
  isInheritanceField?: boolean;
}>();
</script>

<style scoped>
.mt-textarea {
  display: grid;
  grid-template-areas:
    "label help-text"
    "textarea textarea"
    "error error"
    "hint max-length";
  grid-template-columns: auto auto;
  justify-content: space-between;
}

.mt-textarea__textarea {
  resize: vertical;
  width: 100%;
  border: 1px solid var(--color-border-primary-default);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
  min-height: 125px;
  max-height: 300px;
  border-radius: var(--border-radius-xs);
  padding: var(--scale-size-12) var(--scale-size-16);
  grid-area: textarea;
  background-color: var(--color-elevation-surface-raised);
  outline: none;

  &:focus-visible:not(.mt-textarea__textarea--error) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0px 0px 4px 0px rgba(24, 158, 255, 0.3);
  }

  &::placeholder {
    color: var(--color-text-secondary-default);
  }

  &:disabled {
    color: var(--color-text-primary-disabled);
    background-color: var(--color-background-primary-disabled);
    cursor: not-allowed;
  }
}

.mt-textarea__textarea--error {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-dark);
}

.mt-textarea__hint {
  grid-area: hint;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-tertiary-default);
  margin-top: var(--scale-size-4);
}

.mt-textarea__max-length {
  grid-area: max-length;
  justify-self: end;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-tertiary-default);
  margin-top: var(--scale-size-4);
}
</style>
