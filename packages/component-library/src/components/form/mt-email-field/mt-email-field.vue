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
      :id="id ?? ''"
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

      <mt-tooltip v-if="copyable" :content="t('copyTooltip')">
        <template #default="params">
          <button
            type="button"
            v-bind="params"
            class="mt-email-field__copy-button"
            :aria-label="
              copied ? t('copyButtonDescriptionValueCopied') : t('copyButtonDescription')
            "
            @click="
              () => {
                if (!model) return;

                copy(model);
              }
            "
          >
            <mt-icon
              :name="copied ? 'regular-checkmark' : 'regular-copy'"
              size="var(--scale-size-18)"
              color="var(--color-icon-primary-default)"
            />
          </button>
        </template>
      </mt-tooltip>

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

    <div v-if="$slots.hint" class="mt-email-field__hint" :style="{ gridArea: 'hint' }">
      <slot name="hint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, useTemplateRef, useId } from "vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtTooltip from "@/components/overlay/mt-tooltip/mt-tooltip.vue";
import MtFieldAffix from "../_internal/mt-field-affix/mt-field-affix.vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@vueuse/core";
import { useFutureFlags } from "@/composables/useFutureFlags";

const futureFlags = useFutureFlags();

const model = defineModel({
  type: String,
});

defineProps<{
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
}>();

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

const { copy, copied } = useClipboard();

const { t } = useI18n({
  messages: {
    de: {
      copyTooltip: "In Zwischenablage kopieren",
      copyButtonDescription: "In Zwischenablage kopieren",
      copyButtonDescriptionValueCopied: "In Zwischenablage kopiert",
    },
    en: {
      copyTooltip: "Copy to clipboard",
      copyButtonDescription: "Copy to clipboard",
      copyButtonDescriptionValueCopied: "Copied to clipboard",
    },
  },
});
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
  background-color: var(--color-elevation-surface-raised);
  min-height: var(--scale-size-48);
  /* stylelint-disable-next-line meteor/prefer-sizing-token -- this is a trick so that the input field take 100% of its parent's height */
  height: 1px;

  & ::placeholder {
    color: var(--color-text-secondary-default);
  }

  &:not(.mt-email-field__block--error)&:has(.mt-email-field__input:focus-visible) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0px 0px 4px 0px rgba(24, 158, 255, 0.3);
  }

  &:has(.mt-email-field__input:disabled) {
    background-color: var(--color-background-primary-disabled);

    & ::placeholder {
      color: var(--color-text-secondary-disabled);
    }
  }
}

.mt-email-field__block--error {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-dark);
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

.mt-email-field__copy-button {
  position: absolute;
  display: grid;
  place-items: center;
  right: var(--scale-size-8);
  top: 50%;
  transform: translate(0, -50%);
  padding: var(--scale-size-8);
  border-radius: var(--border-radius-button);
  transition: background-color 0.15s ease-out;

  &:is(:hover, :focus-visible) {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
  }
}

.mt-email-field__hint {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-tertiary-default);
  margin-top: 0.1875rem;
}

.mt-email-field__block--small {
  min-height: var(--scale-size-32);
}
</style>
