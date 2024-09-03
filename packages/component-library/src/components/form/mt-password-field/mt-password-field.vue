<template>
  <mt-base-field
    class="mt-field--password"
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
      <div class="mt-field--password__container">
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
              ? $tc('mt-password-field.titleHidePassword')
              : $tc('mt-password-field.titleShowPassword')
          "
          class="mt-field__toggle-password-visibility"
          @click="onTogglePasswordVisibility(disabled)"
        >
          <mt-icon v-if="showPassword" name="solid-eye-slash" size="18" />

          <mt-icon v-else data-testid="mt-password-field-show-button" name="solid-eye" size="18" />
        </span>
      </div>
    </template>

    <template #field-suffix>
      <slot name="suffix" />
    </template>

    <template #error>
      <mt-field-error v-if="error" :error="error" />
    </template>

    <template #field-hint>
      <slot name="hint" />
    </template>
  </mt-base-field>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";

export default defineComponent({
  name: "MtPasswordField",

  i18n: {
    messages: {
      en: {
        "mt-password-field": {
          titleHidePassword: "Hide password",
          titleShowPassword: "Show password",
        },
      },
      de: {
        "mt-password-field": {
          titleHidePassword: "Passwort verbergen",
          titleShowPassword: "Passwort anzeigen",
        },
      },
    },
  },

  components: {
    "mt-icon": MtIcon,
  },

  extends: MtTextField,

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
        ? "mt-field--password"
        : "mt-field--password mt-field--password--untoggable";
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

<style scoped>
.mt-field--password {
  & input {
    padding-right: 40px;
  }

  & .mt-icon {
    color: var(--color-icon-primary-default);
  }
}

.mt-field--password--untoggable .mt-field__input input {
  padding-right: 16px;
}

.mt-field__toggle-password-visibility {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translate(0, -50%);
}

.mt-field--password__container {
  position: relative;
  width: 100%;
}
</style>
