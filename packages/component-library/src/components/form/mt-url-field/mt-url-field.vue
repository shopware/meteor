<template>
  <div
    :class="[
      'mt-url-field',
      {
        'mt-url-field--future-remove-default-margin': futureFlags.removeDefaultMargin,
      },
    ]"
  >
    <mt-field-label
      v-if="!!label"
      :id="id"
      :style="{ marginBottom: 'var(--scale-size-2)', gridArea: 'label' }"
      :has-error="!!error"
      :required="required"
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
        'mt-url-field__block',
        `mt-url-field__block--size-${size}`,
        {
          'mt-url-field__block--error': !!error,
        },
      ]"
    >
      <div
        :class="[
          'mt-url-field__affix',
          'mt-url-field__affix--prefix',
          {
            'mt-url-field__affix--disabled': disabled,
          },
        ]"
      >
        <button
          type="button"
          class="mt-url-field__protocol-toggle"
          :disabled="disabled || isInherited"
          @click="
            () => {
              sslActive = !sslActive;
              modelValue = url;
            }
          "
        >
          <mt-icon
            :name="sslActive ? 'solid-lock' : 'solid-lock-open'"
            :color="
              sslActive ? 'var(--color-icon-positive-default)' : 'var(--color-icon-primary-default)'
            "
            size="var(--scale-size-12)"
            aria-hidden="true"
          />
          <span>{{ urlPrefix }}</span>
        </button>
      </div>

      <input
        :value="decodeURI(currentValue || '')"
        :id="id"
        type="url"
        :placeholder="placeholder"
        :name="name"
        :required="required"
        :disabled="disabled || isInherited"
        class="mt-url-field__input"
        @input="
          (event) => {
            const result = checkInput((event.target as HTMLInputElement).value);
            currentValue = result;
            modelValue = url;
          }
        "
        @change.stop="$emit('change', ($event.target as HTMLInputElement).value || '')"
      />

      <mt-tooltip v-if="copyable" :content="t('copyTooltip')">
        <template #default="props">
          <button
            type="button"
            v-bind="props"
            class="mt-url-field__copy-button"
            :aria-label="
              copied ? t('copyButtonDescriptionValueCopied') : t('copyButtonDescription')
            "
            @click="
              () => {
                if (!currentValue) return;
                copy(currentValue);
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

      <div v-if="$slots.suffix" class="mt-url-field__affix mt-url-field__affix--suffix">
        <slot name="suffix" />
      </div>
    </div>

    <mt-field-error :error="error" :style="{ gridArea: 'error' }" />

    <div class="mt-url-field__hint" v-if="$slots.hint">
      <slot name="hint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId, computed, watch, ref, defineProps, defineEmits } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtTooltip from "../../overlay/mt-tooltip/mt-tooltip.vue";
import { useClipboard } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useFutureFlags } from "@/composables/useFutureFlags";

const futureFlags = useFutureFlags();

const URL_REGEX = {
  PROTOCOL: /([a-zA-Z0-9]+:\/\/)+/,
  PROTOCOL_HTTP: /^https?:\/\//,
  SSL: /^\s*https:\/\//,
  TRAILING_SLASH: /\/+$/,
} as const;

defineEmits<{
  change: [value: string];
  "inheritance-remove": [];
  "inheritance-restore": [];
}>();

defineSlots<{
  suffix?(): void;
  hint?(): void;
}>();

const modelValue = defineModel({
  type: String,
});

const props = withDefaults(
  defineProps<{
    omitUrlHash?: boolean;
    omitUrlSearch?: boolean;
    copyable?: boolean;
    error?: {
      detail: string;
    };
    label?: string;
    required?: boolean;
    isInheritanceField?: boolean;
    isInherited?: boolean;
    helpText?: string;
    disabled?: boolean;
    placeholder?: string;
    name?: string;
    size?: "small" | "default";
  }>(),
  {
    size: "default",
  },
);

const id = useId();

const currentValue = ref(modelValue.value);
const sslActive = ref(true);

const urlPrefix = computed(() => {
  return sslActive.value ? "https://" : "http://";
});

const url = computed(() => {
  const trimmedValue = currentValue.value?.trim();
  if (!trimmedValue) return "";

  return `${urlPrefix.value}${trimmedValue}`;
});

watch(
  () => modelValue.value,
  () => {
    const result = checkInput(currentValue.value || "");

    currentValue.value = result;
  },
  { immediate: true },
);

function checkInput(inputValue: string) {
  if (!inputValue.length) return "";

  if (inputValue.match(URL_REGEX.PROTOCOL_HTTP)) {
    sslActive.value = !!inputValue.match(URL_REGEX.SSL);
  }

  const validated = transformURL(inputValue);

  if (!validated) {
    throw new Error("Invalid URL");
  } else {
    return validated;
  }
}

function transformURL(value: string) {
  const url = new URL(value.match(URL_REGEX.PROTOCOL) ? value : `${urlPrefix.value}${value}`);

  if (!url) return null;

  if (props.omitUrlSearch) url.search = "";
  if (props.omitUrlHash) url.hash = "";

  // when a hash or search query is provided we want to allow trailing slash, eg a vue route `admin#/`
  const removeTrailingSlash = url.hash === "" && url.search === "" ? URL_REGEX.TRAILING_SLASH : "";

  // build URL via native URL.toString() function instead by hand @see NEXT-15747
  return url
    .toString()
    .replace(URL_REGEX.PROTOCOL, "")
    .replace(removeTrailingSlash, "")
    .replace(url.host, decodeURI(url.host));
}

const { copy, copied } = useClipboard();

const { t } = useI18n({
  messages: {
    de: {
      copyTooltip: "URL in Zwischenablage kopieren",
      copyButtonDescription: "URL in Zwischenablage kopieren",
      copyButtonDescriptionValueCopied: "URL in Zwischenablage kopiert",
    },
    en: {
      copyTooltip: "Copy URL to clipboard",
      copyButtonDescription: "Copy URL to clipboard",
      copyButtonDescriptionValueCopied: "Copied URL to clipboard",
    },
  },
});
</script>

<style scoped>
.mt-url-field {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "label help-text"
    "input input"
    "error error"
    "hint hint";
  margin-bottom: var(--scale-size-32);
}

.mt-url-field--future-remove-default-margin {
  margin-bottom: 0;
}

.mt-url-field__block {
  grid-area: input;
  display: flex;
  align-items: center;
  /* stylelint-disable-next-line meteor/prefer-sizing-token -- A trick, so the input can take 100% of its parent */
  height: 1px;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-raised);

  &:has(.mt-url-field__input:focus-visible) {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }

  &:has(.mt-url-field__input:disabled) {
    background: var(--color-background-primary-disabled);
  }
}

.mt-url-field__block--size-default {
  min-height: var(--scale-size-48);
}

.mt-url-field__block--size-small {
  min-height: var(--scale-size-32);
}

.mt-url-field__block--error {
  border-color: var(--color-border-critical-default);
  background: var(--color-background-critical-dark);
}

.mt-url-field__input {
  all: unset;

  height: 100%;
  width: 100%;
  color: var(--color-text-primary-default);
  padding-inline: var(--scale-size-16);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-xs);

  &::placeholder {
    color: var(--color-text-secondary-default);
  }
}

.mt-url-field__affix {
  display: grid;
  place-items: center;
  height: 100%;
  background: var(--color-interaction-secondary-default);
  color: var(--color-text-primary-default);
  font-weight: var(--font-weight-medium);
  padding-inline: var(--scale-size-12);
  background: var(--color-interaction-secondary-dark);
}

.mt-url-field__affix--disabled {
  background: var(--color-interaction-secondary-disabled);
}

.mt-url-field__affix--prefix {
  border-top-left-radius: var(--border-radius-xs);
  border-bottom-left-radius: var(--border-radius-xs);
  border-right: 1px solid var(--color-border-primary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-url-field__affix--suffix {
  border-top-right-radius: var(--border-radius-xs);
  border-bottom-right-radius: var(--border-radius-xs);
  border-left: 1px solid var(--color-border-primary-default);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
}

.mt-url-field__protocol-toggle {
  display: flex;
  align-items: center;
  gap: var(--scale-size-2);

  &:focus-visible {
    outline-offset: 4px;
    outline: 2px solid var(--color-border-brand-selected);
    border-radius: var(--border-radius-xs);
  }

  &:disabled {
    cursor: default;
  }
}

.mt-url-field__copy-button {
  display: grid;
  place-items: center;
  padding: var(--scale-size-8);
  border-radius: var(--border-radius-button);
  transition: background-color 0.15s ease-out;
  margin-inline-end: var(--scale-size-6);

  &:is(:hover, :focus-visible) {
    background-color: var(--color-interaction-secondary-hover);
  }
  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
  }
}

.mt-url-field__hint {
  grid-area: hint;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-tertiary-default);
  margin-top: 0.1875rem;
}
</style>
