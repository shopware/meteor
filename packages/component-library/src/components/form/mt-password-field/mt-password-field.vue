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
        <button
          v-if="passwordToggleAble"
          :disabled="disabled"
          :aria-label="showPassword ? t('titleHidePassword') : t('titleShowPassword')"
          class="mt-field__toggle-password-visibility"
          @click="() => (showPassword = !showPassword)"
        >
          <mt-icon v-if="showPassword" name="solid-eye-slash" size="18" />

          <mt-icon v-else data-testid="mt-password-field-show-button" name="solid-eye" size="18" />
        </button>
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
import { computed, defineComponent, ref } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import { useI18n } from "@/composables/useI18n";

export default defineComponent({
  name: "MtPasswordField",

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

  setup(props) {
    const showPassword = ref(false);

    const passwordPlaceholder = computed(() =>
      showPassword.value || !props.placeholderIsPassword
        ? props.placeholder
        : "*".repeat(props.placeholder.length ? props.placeholder.length : 6),
    );

    const { t } = useI18n({
      messages: {
        en: {
          titleHidePassword: "Hide password",
          titleShowPassword: "Show password",
        },
        de: {
          titleHidePassword: "Passwort verbergen",
          titleShowPassword: "Passwort anzeigen",
        },
      },
    });

    return {
      t,
      showPassword,
      passwordPlaceholder,
    };
  },
});
</script>

<style scoped>
.mt-field--password {
  & input {
    padding-right: var(--scale-size-40);
  }

  & .mt-icon {
    color: var(--color-icon-primary-default);
  }
}

.mt-field--password--untoggable .mt-field__input input {
  padding-right: 0.5rem;
}

.mt-field__toggle-password-visibility {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translate(0, -50%);
  padding: 0.5rem;
  border-radius: var(--border-radius-button);
  outline-color: var(--color-border-brand-selected);
  transition: all 0.15s ease-out;

  &:is(:hover, :focus-visible) {
    background-color: var(--color-interaction-secondary-hover);
  }
}

.mt-field--password__container {
  position: relative;
  width: 100%;
}
</style>
