<template>
  <div class="mt-field" :class="classes">
    <div class="mt-field__label">
      <mt-inheritance-switch
        v-if="isInheritanceField"
        :disabled="disableInheritanceToggle"
        class="mt-field__inheritance-icon"
        :is-inherited="isInherited"
        v-bind="{ ...$attrs, class: '' }"
      />

      <label v-if="showLabel" :for="identification" :class="mtFieldLabelClasses">
        <slot name="label" />
      </label>

      <mt-help-text v-if="helpText" class="mt-field__help-text" :text="helpText" />
    </div>

    <div class="mt-block-field__block">
      <div class="mt-field__addition is--prefix">
        <slot name="field-prefix" v-bind="{ disabled, identification }" />
      </div>

      <slot name="element" v-bind="{ disabled, identification }" />

      <div v-if="copyable" class="mt-field__addition">
        <mt-field-copyable
          :display-name="identification"
          :copyable-text="copyableText"
          :tooltip="copyableTooltip"
        />
      </div>

      <div v-else class="mt-field__addition">
        <slot name="field-suffix" v-bind="{ disabled, identification }" />
      </div>
    </div>

    <slot name="error" />

    <div
      v-if="!!$slots['field-hint'] || !!$slots['field-hint-right']"
      class="mt-field__hint-wrapper"
    >
      <div class="mt-field__hint">
        <slot name="field-hint" />
      </div>

      <div class="mt-field__hint-right">
        <slot name="field-hint-right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtInheritanceSwitch from "../mt-inheritance-switch/mt-inheritance-switch.vue";
import MtFieldCopyable from "../mt-field-copyable/mt-field-copyable.vue";
import MtHelpText from "../../mt-help-text/mt-help-text.vue";
import useEmptySlotCheck from "../../../../composables/useEmptySlotCheck";
import MtValidationMixin from "../../../../mixins/validation.mixin";
import MtFormFieldMixin from "../../../../mixins/form-field.mixin";
import { createId } from "../../../../utils/id";

export default defineComponent({
  name: "MtBaseField",

  components: {
    "mt-inheritance-switch": MtInheritanceSwitch,
    "mt-help-text": MtHelpText,
    "mt-field-copyable": MtFieldCopyable,
  },

  mixins: [MtFormFieldMixin, MtValidationMixin],

  props: {
    /**
     * Determines if the field is disabled.
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines if the field is required.
     */
    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Toggles the inheritance visualization.
     */
    isInherited: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines if the field is inheritable.
     */
    isInheritanceField: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines the active state of the inheritance toggle.
     */
    disableInheritanceToggle: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Toggles the copy function of the text field.
     */
    copyable: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * If set to true the tooltip will change on successful copy.
     */
    copyableTooltip: {
      type: Boolean,
      required: false,
      default: false,
    },

    hasFocus: {
      type: Boolean,
      required: true,
    },

    /**
     * A text that helps the user to understand what this field does.
     */
    helpText: {
      type: String,
      required: false,
      default: "",
    },

    copyableText: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * The size of the text field.
     *
     * @values small, default
     */
    size: {
      type: String,
      required: false,
      default: "default",
      validator(value: string) {
        return ["small", "default"].includes(value);
      },
    },

    /**
     * @ignore
     */
    name: {
      type: String,
      required: false,
      default: null,
    },
  },

  data(): { id: string | undefined } {
    return {
      id: undefined,
    };
  },

  mounted() {
    this.id = createId();
  },

  computed: {
    identification(): string {
      if (this.name) {
        return this.name;
      }

      return `mt-field--${this.id}`;
    },

    showLabel(): boolean {
      // @ts-expect-error - label exists on scopedSlots and if not we use optional chaining
      return !!this.$slots.label || !!this.$slots.label?.();
    },

    mtFieldLabelClasses(): { "is--required": boolean } {
      return {
        "is--required": this.required,
      };
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    classes(): any[] {
      return [
        {
          "has--error": this.hasError,
          "is--disabled": this.disabled,
          "is--inherited": this.isInherited,
          "has--focus": this.hasFocus,
        },
        this.mtBlockSize,
      ];
    },

    mtBlockSize(): string {
      return `mt-field--${this.size}`;
    },

    hasError(): boolean {
      return this.hasSlotContent(this.$slots.error);
    },
  },

  setup() {
    const { hasSlotContent } = useEmptySlotCheck();

    return {
      hasSlotContent,
    };
  },
});
</script>

<style lang="scss">
@import "../../../assets/scss/variables.scss";

$mt-field-transition: border-color 0.3s ease-out;
$mt-field-transition:
  border-color 0.3s ease-out,
  background 0.3s ease;

.mt-field {
  width: 100%;
  margin-bottom: 32px;

  .mt-field__help-text {
    margin-left: 4px;
    align-self: center;
  }

  &.has--error {
    margin-bottom: 12px;
  }

  &__hint-wrapper {
    display: flex;
    justify-content: space-between;
  }

  &__hint,
  &__hint-right {
    margin-top: 4px;
    font-size: $font-size-extra-small;
    color: $color-gray-500;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__hint-right {
    justify-content: flex-end;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px $color-white inset;
  }

  .mt-block-field__block {
    display: flex;
  }

  input,
  select,
  textarea {
    display: block;
    width: 100%;
    min-width: 0;
    padding: 13px 16px;
    border: none;
    background: $color-white;
    font-size: $font-size-small;
    font-family: $font-family-default;
    line-height: 22px;
    transition: $mt-field-transition;
    color: $color-darkgray-200;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    &:invalid,
    &:-moz-submit-invalid,
    &:-moz-ui-invalid {
      box-shadow: none;
    }

    &:disabled {
      background: $color-gray-100;
      border-color: $color-gray-300;
      cursor: default !important;
    }

    &::placeholder {
      color: lighten($color-darkgray-200, 25%);
    }
  }

  .mt-block-field__block {
    border: 1px solid $color-gray-300;
    border-radius: $border-radius-default;
    overflow: hidden;
  }

  &.has--focus {
    .mt-block-field__block {
      border-color: $color-shopware-brand-500;
      box-shadow: 0 0 4px lighten($color-shopware-brand-500, 30%);
    }
  }

  &.has--error {
    label {
      color: $color-crimson-500;
    }

    &.mt-field input {
      background-color: $color-crimson-50;
    }

    .mt-field__addition {
      border-left: 1px solid $color-crimson-500;

      &.is--prefix {
        border-right: 1px solid $color-crimson-500;
      }
    }

    .mt-block-field__block {
      background: $color-crimson-50;
      border-color: $color-crimson-500;
    }
  }

  &.has--error.has--focus {
    .mt-block-field__block {
      box-shadow: 0 0 4px lighten($color-crimson-500, 30%);
    }
  }

  .mt-field--select__options .mt-icon {
    margin-bottom: 5px;
  }

  &.mt-field--small {
    margin-bottom: 0;

    input,
    textarea,
    select {
      padding: 5px 16px;
    }
  }

  .mt-field__addition {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    min-width: 50px;
    background: $color-gray-50;
    border-left: 1px solid $color-gray-300;
    border-right: none;
    line-height: 22px;
    padding: 12px 15px;
    font-size: $font-size-small;
    color: $color-darkgray-200;
    transition: $mt-field-transition;

    &:empty {
      display: none;
    }

    &.is--prefix {
      border-right: 1px solid $color-gray-300;
      border-left: none;

      &:empty {
        display: none;
      }
    }
  }

  &.is--disabled {
    .mt-field__addition {
      background: $color-gray-100;
    }
  }

  &.mt-field--small {
    .mt-field__addition {
      padding: 5px 16px;
    }
  }

  // Inheritance
  .mt-field__inheritance-icon {
    margin-left: 4px;
    margin-right: 4px;
  }

  .mt-field__button-restore {
    color: $color-darkgray-200;
    padding: 0 8px;
    border: none;
    background: none;
    outline: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }

  // Label
  .mt-field__label {
    display: flex;
    line-height: 16px;
    font-size: 14px;
    margin-bottom: 8px;
    color: $color-darkgray-200;

    label {
      flex-grow: 1;
    }
  }

  .mt-field__label .is--required::after {
    content: "*";
    color: $color-shopware-brand-500;
  }

  &.is--inherited {
    .mt-field__label {
      color: $color-module-purple-900;
    }
  }
}
</style>
