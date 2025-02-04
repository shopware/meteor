<template>
  <div class="mt-url-field">
    <mt-field-label
      v-if="!!label"
      :id="id"
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
        <button class="mt-url-field__protocol-toggle" :disabled="disabled || isInherited">
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
        :value="decodeURI(modelValue)"
        :id="id"
        type="url"
        :placeholder="placeholder"
        :name="name"
        :required="required"
        :disabled="disabled || isInherited"
        class="mt-url-field__input"
      />

      <div v-if="$slots.suffix" class="mt-url-field__affix mt-url-field__affix--suffix">
        <slot name="suffix" />
      </div>
    </div>

    <mt-field-error :error="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent, useId } from "vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";

const URL_REGEX = {
  PROTOCOL: /([a-zA-Z0-9]+:\/\/)+/,
  PROTOCOL_HTTP: /^https?:\/\//,
  SSL: /^\s*https:\/\//,
  TRAILING_SLASH: /\/+$/,
};

export default defineComponent({
  name: "MtUrlField",

  components: {
    MtIcon,
    MtFieldLabel,
  },

  extends: MtTextField,

  props: {
    /**
     * If set to true then all url hashes will be removed
     */
    omitUrlHash: {
      type: Boolean,
      default: false,
    },
    /**
     * If set to true then all query parameters will be removed
     */
    omitUrlSearch: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const id = useId();

    return { id };
  },

  data() {
    return {
      sslActive: true,
      currentValue: this.modelValue || "",
    };
  },

  computed: {
    urlPrefix() {
      return this.sslActive ? "https://" : "http://";
    },

    url(): string {
      // @ts-expect-error -- modelValue is always a string
      const trimmedValue = this.currentValue.trim();
      if (!trimmedValue) return "";

      return `${this.urlPrefix}${trimmedValue}`;
    },
  },

  watch: {
    modelValue: {
      handler() {
        // @ts-expect-error -- modelValue is always a string
        const result = this.checkInput(this.currentValue);

        this.currentValue = result;
      },
      immediate: true,
    },
  },

  methods: {
    checkInput(inputValue: string) {
      if (!inputValue.length) return "";

      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (inputValue.match(URL_REGEX.PROTOCOL_HTTP)) {
        this.sslActive = !!inputValue.match(URL_REGEX.SSL);
      }

      const validated = this.transformURL(inputValue);

      if (!validated) {
        throw new Error("Invalid URL");
      } else {
        return validated;
      }
    },

    transformURL(value: string) {
      const url = new URL(value.match(URL_REGEX.PROTOCOL) ? value : `${this.urlPrefix}${value}`);

      if (!url) return null;

      if (this.omitUrlSearch) url.search = "";
      if (this.omitUrlHash) url.hash = "";

      // when a hash or search query is provided we want to allow trailing slash, eg a vue route `admin#/`
      const removeTrailingSlash =
        url.hash === "" && url.search === "" ? URL_REGEX.TRAILING_SLASH : "";

      // build URL via native URL.toString() function instead by hand @see NEXT-15747
      return url
        .toString()
        .replace(URL_REGEX.PROTOCOL, "")
        .replace(removeTrailingSlash, "")
        .replace(url.host, decodeURI(url.host));
    },
  },
});
</script>

<style scoped>
.mt-url-field__block {
  display: flex;
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
</style>
