<template>
  <mt-base-field
    class="mt-field--url"
    :disabled="disabled"
    :required="required"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    :copyable="copyable"
    :copyable-tooltip="copyableTooltip"
    :copyable-text="url"
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
      <button
        :class="[
          'mt-field__url-input__prefix',
          {
            'is--ssl': sslActive,
          },
        ]"
        aria-describedby="ssl-switch"
        :disabled="disabled"
        @click="changeMode"
      >
        <mt-icon v-if="sslActive" name="regular-lock" :small="true" />
        <mt-icon v-else name="regular-lock-open" :small="true" />
        <span aria-describedby="url-prefix">
          {{ urlPrefix }}
        </span>
      </button>
    </template>

    <template #element="{ identification }">
      <!-- @vue-ignore -->
      <input
        :id="identification"
        type="url"
        class="mt-url-input-field__input"
        :name="identification"
        :value="unicodeUri(currentValue)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled || isInherited"
        @focus="setFocusClass"
        @blur="
          checkInput($event.target.value);
          removeFocusClass();
        "
        @change.stop="$emit('change', $event.target.value || '')"
      />
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <mt-field-error v-if="error" :error="error" />
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import punycode from "punycode/";

const URL_REGEX = {
  PROTOCOL: /([a-zA-Z0-9]+:\/\/)+/,
  PROTOCOL_HTTP: /^https?:\/\//,
  SSL: /^\s*https:\/\//,
  TRAILING_SLASH: /\/+$/,
};

export default defineComponent({
  name: "MtUrlField",

  components: {
    "mt-icon": MtIcon,
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

  data() {
    return {
      sslActive: true,
      currentValue: this.modelValue || "",
      errorUrl: null,
      currentDebounce: null,
    };
  },

  computed: {
    urlPrefix(): string {
      if (this.sslActive) {
        return "https://";
      }

      return "http://";
    },

    url(): string {
      // @ts-expect-error -- modelValue is always a string
      const trimmedValue = this.currentValue.trim();
      if (trimmedValue === "") {
        return "";
      }

      return `${this.urlPrefix}${trimmedValue}`;
    },
  },

  watch: {
    modelValue() {
      // @ts-expect-error -- modelValue is always a string
      this.checkInput(this.modelValue || "");
    },
  },

  created() {
    // @ts-expect-error -- modelValue is always a string
    this.checkInput(this.currentValue);
  },

  methods: {
    unicodeUri(value: string) {
      if (!value) {
        return "";
      }

      const unicode = punycode.toUnicode(value);

      return decodeURI(unicode);
    },

    checkInput(inputValue: string) {
      this.errorUrl = null;

      if (!inputValue.length) {
        this.currentValue = "";
        this.$emit("update:modelValue", "");

        return;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (inputValue.match(URL_REGEX.PROTOCOL_HTTP)) {
        this.sslActive = !!inputValue.match(URL_REGEX.SSL);
      }

      const validated = this.validateCurrentValue(inputValue);

      if (!validated) {
        this.setInvalidUrlError();
      } else {
        this.currentValue = validated;

        this.$emit("update:modelValue", this.url);
      }
    },

    validateCurrentValue(value: string) {
      const url = this.getURLInstance(value);

      // If the input is invalid, no URL can be constructed
      if (!url) {
        return null;
      }

      if (this.omitUrlSearch) {
        url.search = "";
      }

      if (this.omitUrlHash) {
        url.hash = "";
      }

      // when a hash or search query is provided we want to allow trailing slash, eg a vue route `admin#/`
      const removeTrailingSlash =
        url.hash === "" && url.search === "" ? URL_REGEX.TRAILING_SLASH : "";

      // build URL via native URL.toString() function instead by hand @see NEXT-15747
      return url
        .toString()
        .replace(URL_REGEX.PROTOCOL, "")
        .replace(removeTrailingSlash, "")
        .replace(url.host, this.unicodeUri(url.host));
    },

    changeMode() {
      this.sslActive = !this.sslActive;
      this.$emit("update:modelValue", this.url);
    },

    getURLInstance(value: string) {
      try {
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const url = value.match(URL_REGEX.PROTOCOL) ? value : `${this.urlPrefix}${value}`;

        return new URL(url);
      } catch {
        this.setInvalidUrlError();

        return null;
      }
    },

    setInvalidUrlError() {
      console.error({ code: "INVALID_URL" });
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables";

$mt-field-color-secure: $color-emerald-500;

.mt-field {
  &__url-input__prefix {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    margin: -12px -15px;
    padding: var(--scale-size-12) 15px;

    &.is--ssl {
      color: $mt-field-color-secure;
    }

    .mt-icon {
      width: var(--scale-size-8);
      margin-right: var(--scale-size-4);

      > svg {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}
</style>
