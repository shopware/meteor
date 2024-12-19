<template>
  <div
    :class="[
      'mt-text-field',
      {
        'mt-text-field--future-remove-default-margin': future.removeDefaultMargin,
      },
    ]"
  >
    <mt-field-label
      :id="id"
      :required="required"
      :has-error="!!error"
      :inheritance="inheritance"
      style="grid-area: label"
      @update:inheritance="handleInheritanceChange"
    >
      {{ label }}
    </mt-field-label>

    <div
      :class="[
        'mt-text-field__box',
        {
          'mt-text-field__box--has-error': !!error,
          'mt-text-field__box--size-small': size === 'small',
        },
      ]"
    >
      <div class="mt-text-field__affix mt-text-field__affix--prefix">
        <slot name="prefix"></slot>
      </div>

      <input
        :id="id"
        :value="modelValue"
        @change="$emit('change', ($event.target as HTMLInputElement).value)"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
      />

      <div class="mt-text-field__affix mt-text-field__affix--suffix">
        <button
          v-if="copyable"
          class="mt-text-field__copy-button"
          @click="copy(modelValue)"
          :disabled="disabled"
        >
          <mt-icon
            aria-hidden="true"
            :name="copied ? 'regular-checkmark' : 'regular-copy'"
            size="1.125rem"
            :color="
              disabled ? 'var(--color-icon-primary-disabled)' : 'var(--color-icon-primary-default)'
            "
          />
        </button>

        <slot v-else name="suffix"></slot>
      </div>
    </div>

    <mt-field-error v-if="!!error" :error="error" style="grid-area: error" />

    <div class="mt-text-field__hint">
      <slot name="hint" />
    </div>

    <mt-text
      v-if="maxLength !== undefined"
      color="color-text-tertiary-default"
      size="xs"
      style="justify-self: flex-end"
    >
      {{ modelValue?.length ?? 0 }}/{{ maxLength }}
    </mt-text>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useClipboard } from "@vueuse/core";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";
import { createId } from "@/utils/id";

const props = withDefaults(
  defineProps<{
    label: string;
    placeholder?: string;
    maxLength?: number;
    modelValue: string;
    required?: boolean;
    disabled?: boolean;
    error?: { code: number; detail: string } | null;
    isInheritanceField?: boolean;
    isInherited?: boolean;
    copyable?: boolean;
    size?: "default" | "small";
  }>(),
  {
    size: "default",
  },
);

const emit = defineEmits<{
  change: [value: string];
  "update:modelValue": [value: string];
  "inheritance-restore": [];
  "inheritance-remove": [];
}>();

const inheritance = computed(() => {
  if (!props.isInheritanceField) return "none";

  return props.isInherited ? "linked" : "unlinked";
});

const id = ref("");
onMounted(() => {
  id.value = createId();
});

const { copy, copied } = useClipboard();

function handleInheritanceChange(value: string) {
  if (value === "linked") {
    emit("inheritance-restore");
    return;
  }

  emit("inheritance-remove");
}

const future = useFutureFlags();
</script>

<style scoped>
.mt-text-field {
  display: grid;
  grid-template-areas:
    "label label"
    "box box"
    "error error"
    "hint hint";
  margin-bottom: 32px;
}

.mt-text-field--future-remove-default-margin {
  margin-bottom: 0;
}

.mt-text-field__box {
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-raised);
  height: 3rem;
  border: 1px solid var(--color-border-primary-default);
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  display: flex;
  grid-area: box;

  &:has(input:focus) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }

  &:has(input:disabled) {
    background: var(--color-background-primary-disabled);
  }
}

.mt-text-field__box--has-error {
  border-color: var(--color-border-critical-default);
  background: var(--color-background-critical-dark);

  &:focus-within {
    border-color: var(--color-border-critical-default);
    box-shadow: unset;
  }
}

input {
  all: unset;
  padding: 0.8125rem 1rem;
  flex: 1;

  &:disabled {
    color: var(--color-text-secondary-disabled);
  }

  &::placeholder {
    color: var(--color-text-secondary-default);
  }
}

.mt-text-field__hint {
  color: var(--color-text-tertiary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
}

.mt-text-field__affix {
  display: grid;
  place-items: center;
  background: var(--color-interaction-secondary-default);
  padding-inline: 1rem;
}

.mt-text-field__affix--prefix {
  border-inline-end: 1px solid var(--color-border-primary-default);
  border-top-left-radius: var(--border-radius-xs);
  border-bottom-left-radius: var(--border-radius-xs);

  &:empty {
    display: none;
  }
}

.mt-text-field__affix--suffix {
  border-inline-start: 1px solid var(--color-border-primary-default);
  border-top-right-radius: var(--border-radius-xs);
  border-bottom-right-radius: var(--border-radius-xs);

  &:empty {
    display: none;
  }
}

.mt-text-field__copy-button {
  outline-offset: 0.375rem;
  background: var(--color-interaction-secondary-default);

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    border-radius: 0.025rem;
  }
}

.mt-text-field__box--size-small {
  height: 2rem;
}
</style>
