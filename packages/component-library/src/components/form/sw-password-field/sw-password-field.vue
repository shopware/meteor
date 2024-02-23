<template>
  <sw-base-field
    class="sw-field--password"
    :disabled="disabled"
    :required="required"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    :copyable="copyable"
    :copyable-tooltip="copyableTooltip"
    :copyable-text="currentValue"
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
      <slot name="prefix" />
    </template>

    <template #element="{ identification, disabled }">
      <div class="sw-field--password__container">
        <input
          :id="identification"
          :type="showPassword ? 'text' : 'password'"
          :name="identification"
          :placeholder="passwordPlaceholder"
          :disabled="disabled"
          :value="currentValue"
          :autocomplete="autocomplete"
          @input.stop="onInput"
          @change.stop="onChange"
          @focus="setFocusClass"
          @blur="removeFocusClass"
        />
        <span
          v-if="passwordToggleAble"
          :title="
            showPassword
              ? $tc('sw-password-field.titleHidePassword')
              : $tc('sw-password-field.titleShowPassword')
          "
          class="sw-field__toggle-password-visibility"
          @click="onTogglePasswordVisibility(disabled)"
        >
          <sw-icon v-if="showPassword" name="regular-eye-slash" small />

          <sw-icon v-else data-testid="sw-password-field-show-button" name="regular-eye" small />
        </span>
      </div>
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <sw-field-error v-if="error" :error="error" />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>
  </sw-base-field>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SwIcon from "../../icons-media/sw-icon/sw-icon.vue";
import SwTextField from "../sw-text-field/sw-text-field.vue";

export default defineComponent({
  name: "SwPasswordField",

  i18n: {
    messages: {
      en: {
        "sw-password-field": {
          titleHidePassword: "Hide password",
          titleShowPassword: "Show password",
        },
      },
      de: {
        "sw-password-field": {
          titleHidePassword: "Passwort verbergen",
          titleShowPassword: "Passwort anzeigen",
        },
      },
    },
  },

  components: {
    "sw-icon": SwIcon,
  },

  extends: SwTextField,

  props: {
    passwordToggleAble: {
      type: Boolean,
      required: false,
      default: true,
    },

    placeholderIsPassword: {
      type: Boolean,
      required: false,
      default: false,
    },

    autocomplete: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      showPassword: false,
    };
  },

  computed: {
    typeFieldClass(): string {
      return this.passwordToggleAble
        ? "sw-field--password"
        : "sw-field--password sw-field--password--untoggable";
    },

    passwordPlaceholder(): string {
      return this.showPassword || !this.placeholderIsPassword
        ? this.placeholder
        : "*".repeat(this.placeholder.length ? this.placeholder.length : 6);
    },
  },

  methods: {
    onTogglePasswordVisibility(disabled: boolean) {
      if (disabled) {
        return;
      }

      this.showPassword = !this.showPassword;
    },
  },
});
</script>

<style lang="scss">
.sw-field.sw-field--password {
  .sw-field--password__container {
    position: relative;
    width: 100%;
  }

  .sw-field__toggle-password-visibility {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translate(0, -50%);
  }

  input {
    padding-right: 40px;
  }

  &.sw-field--password.sw-field--password--untoggable .sw-field__input {
    input {
      padding-right: 16px;
    }
  }

  .sw-icon {
    #meteor-icon-kit__regular-eye-slash {
      width: 16px;
      height: 16px;
    }

    #meteor-icon-kit__regular-eye {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
