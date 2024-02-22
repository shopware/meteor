<template>
  <sw-base-field
    class="sw-field--url"
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
      <span
        class="sw-field__url-input__prefix"
        :class="prefixClass"
        aria-describedby="ssl-switch"
        role="button"
        @click="changeMode(disabled)"
      >
        <sw-icon v-if="sslActive" name="regular-lock" :small="true" />
        <sw-icon v-else name="regular-lock-open" :small="true" />
        <span aria-describedby="url-prefix">
          {{ urlPrefix }}
        </span>
      </span>
    </template>

    <template #element="{ identification }">
      <!-- @vue-ignore -->
      <input
        :id="identification"
        type="url"
        class="sw-url-input-field__input"
        :name="identification"
        :value="unicodeUri(currentValue)"
        :placeholder="placeholder"
        :disabled="disabled"
        @input.stop="onInput"
        @focus="setFocusClass"
        @blur="
          onBlur($event);
          removeFocusClass();
        "
      />
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <sw-field-error v-if="error" :error="error" />
    </template>
  </sw-base-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwTextField from "../sw-text-field/sw-text-field.vue";
import SwIcon from "../../icons-media/sw-icon/sw-icon.vue";
import unicodeUriFilter from "../../../filters/unicode-uri.filter";

const URL_REGEX = {
  PROTOCOL: /([a-zA-Z0-9]+:\/\/)+/,
  PROTOCOL_HTTP: /^https?:\/\//,
  SSL: /^\s*https:\/\//,
  TRAILING_SLASH: /\/+$/,
};

export default defineComponent({
  name: "SwUrlField",

  components: {
    "sw-icon": SwIcon,
  },

  extends: SwTextField,

  inheritAttrs: false,

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
    prefixClass(): string {
      if (this.sslActive) {
        return "is--ssl";
      }

      return "";
    },

    urlPrefix(): string {
      if (this.sslActive) {
        return "https://";
      }

      return "http://";
    },

    url(): string {
      const trimmedValue = this.currentValue.trim();
      if (trimmedValue === "") {
        return "";
      }

      return `${this.urlPrefix}${trimmedValue}`;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    combinedError(): any {
      return this.errorUrl ?? this.error;
    },
  },

  watch: {
    value() {
      this.checkInput(this.modelValue || "");
    },
  },

  created() {
    this.createdComponent();
  },

  methods: {
    createdComponent() {
      this.checkInput(this.currentValue);
    },

    unicodeUri(value: string) {
      return unicodeUriFilter(value);
    },

    onBlur(event: Event) {
      // @ts-expect-error - target is defined
      this.checkInput(event.target.value);
    },

    checkInput(inputValue: string) {
      this.errorUrl = null;

      if (!inputValue.length) {
        this.handleEmptyUrl();

        return;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (inputValue.match(URL_REGEX.PROTOCOL_HTTP)) {
        this.sslActive = this.getSSLMode(inputValue);
      }

      const validated = this.validateCurrentValue(inputValue);

      if (!validated) {
        this.setInvalidUrlError();
      } else {
        this.currentValue = validated;

        this.$emit("update:modelValue", this.url);
      }
    },

    handleEmptyUrl() {
      this.currentValue = "";

      this.$emit("update:modelValue", "");
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

    changeMode(disabled: boolean) {
      if (disabled) {
        return;
      }

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

    getSSLMode(value: string) {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      return !!value.match(URL_REGEX.SSL);
    },

    setInvalidUrlError() {
      console.error({ code: "INVALID_URL" });
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables";

$sw-field-color-secure: $color-emerald-500;

.sw-field {
  &__url-input__prefix {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    margin: -12px -15px;
    padding: 12px 15px;

    &.is--ssl {
      color: $sw-field-color-secure;
    }

    .sw-icon {
      width: 8px;
      margin-right: 4px;

      > svg {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}
</style>
