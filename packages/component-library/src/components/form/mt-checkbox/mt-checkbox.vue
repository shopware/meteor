<template>
  <div class="mt-field--checkbox__container">
    <div class="mt-field--checkbox" :class="MtCheckboxFieldClasses">
      <div class="mt-field--checkbox__content">
        <div class="mt-field__checkbox">
          <input
            :id="identification"
            type="checkbox"
            :name="identification"
            :checked="inputState"
            :disabled="isDisabled"
            :indeterminate.prop="partial"
            @change.stop="onChange"
          />
          <div class="mt-field__checkbox-state">
            <mt-icon :name="iconName" size="16" />
          </div>
        </div>

        <mt-base-field
          :disabled="isDisabled"
          :is-inheritance-field="isInheritanceField"
          :is-inherited="isInherited"
          :name="identification"
          :has-focus="false"
          :help-text="helpText"
          :required="required"
          @inheritance-restore="$emit('inheritance-restore', $event)"
          @inheritance-remove="$emit('inheritance-remove', $event)"
        >
          <template #label>
            {{ label }}
          </template>
        </mt-base-field>
      </div>
    </div>

    <mt-field-error :error="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import { createId } from "../../../utils/uuid";

export default defineComponent({
  name: "MtCheckbox",

  components: {
    "mt-icon": MtIcon,
    "mt-base-field": MtBaseField,
    "mt-field-error": MtFieldError,
  },

  mixins: [MtFormFieldMixin],

  props: {
    /**
     * A label for the checkbox.
     */
    label: {
      type: String,
      required: false,
      default: undefined,
    },

    /**
     * Toggles the disabled state of the checkbox.
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines the checked state of the checkbox.
     */
    checked: {
      type: Boolean,
      required: false,
      default: undefined,
    },

    /**
     * Determines if the field is partially checked.
     */
    partial: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Inherited value from another SalesChannel.
     */
    inheritedValue: {
      type: Boolean,
      required: false,
      default: null,
    },

    /**
     * Error object for this field.
     */
    error: {
      type: Object,
      required: false,
      default: null,
    },

    /**
     * Determines if the field is surrounded by a border.
     */
    bordered: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Help text with additional information for the field.
     */
    helpText: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * Marks the field as required with an asterix.
     */
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      currentValue: this.checked,
      id: createId(),
    };
  },

  computed: {
    MtCheckboxFieldClasses(): {
      "has--error": boolean;
      "is--disabled": boolean;
      "is--inherited": boolean;
      "is--bordered": boolean;
      "is--partly-checked": boolean;
    } {
      return {
        "has--error": !!this.hasError,
        "is--disabled": this.disabled,
        "is--inherited": !!this.isInherited,
        "is--bordered": this.bordered,
        "is--partly-checked": this.isPartlyChecked,
      };
    },

    identification(): string {
      return `mt-field--${this.id}`;
    },

    hasError(): boolean {
      return this.error && this.error.code !== 0;
    },

    inputState(): boolean {
      if (this.isInherited) {
        return this.inheritedValue;
      }

      return this.currentValue || false;
    },

    isInheritanceField(): boolean {
      if (this.$attrs.isInheritanceField) {
        return true;
      }
      return this.inheritedValue !== null;
    },

    isInherited(): boolean {
      if (this.$attrs.isInherited) {
        return true;
      }
      return this.isInheritanceField && this.currentValue === null;
    },

    isDisabled(): boolean {
      return this.disabled || this.isInherited;
    },

    isPartlyChecked(): boolean {
      return this.partial && !this.inputState;
    },

    iconName(): string {
      return this.isPartlyChecked ? "regular-minus-xxs" : "regular-checkmark-xxs";
    },
  },

  watch: {
    checked: {
      handler() {
        this.currentValue = this.checked;
      },
      immediate: true,
    },
  },

  methods: {
    onChange(changeEvent: Event) {
      // @ts-expect-error - target is defined in the event
      this.$emit("change", changeEvent.target.checked);
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$mt-field-color-text: $color-darkgray-200;
$mt-field-color-focus: $color-shopware-brand-500;
$mt-field-color-background: $color-white;
$mt-field-color-border: $color-gray-300;
$mt-field-color-error: $color-crimson-500;
$mt-field-color-inherited: $color-module-purple-900;

.mt-field--checkbox__container {
  .mt-field--checkbox {
    margin-bottom: 22px;

    .mt-inheritance-switch {
      &.mt-field__inheritance-icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .mt-field--checkbox__content {
      display: grid;
      grid-template-columns: 16px 1fr;
      align-items: center;
    }

    .mt-field {
      margin-bottom: 0;

      .mt-block-field__block {
        border: none;
      }
    }

    .mt-field--default {
      display: flex;
    }

    .mt-field__label {
      margin-bottom: 0;
      margin-left: 4px;
    }

    .mt-field__checkbox {
      width: 16px;
      height: 16px;
      position: relative;

      input[type="checkbox"] {
        opacity: 0;
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border: 0 none;
        background: none;
        -webkit-appearance: none;
        cursor: pointer;
        z-index: 2;

        &:disabled {
          cursor: not-allowed;
        }

        &:disabled ~ .mt-field__checkbox-state {
          background: $color-gray-100;
          border-color: $color-gray-300;
          color: lighten($mt-field-color-text, 40%);
        }

        &:checked ~ .mt-field__checkbox-state {
          background: $mt-field-color-focus;
          border-color: $mt-field-color-focus;

          .mt-icon {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        &:checked:disabled ~ .mt-field__checkbox-state {
          background: $color-gray-100;
          border-color: $color-gray-300;
          color: lighten($mt-field-color-text, 40%);

          .mt-icon {
            color: lighten($mt-field-color-text, 40%);
          }
        }

        &:indeterminate ~ .mt-field__checkbox-state {
          background-color: $color-shopware-brand-500;
          border: 1px solid $color-shopware-brand-500;

          .mt-icon {
            display: inline-block;
            color: white;
          }
        }
      }

      .mt-field__checkbox-state {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        text-align: center;
        background: $mt-field-color-background;
        color: $mt-field-color-text;
        border: 1px solid $mt-field-color-border;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;

        .mt-icon {
          display: none;
          color: $mt-field-color-background;
        }
      }
    }

    &.has--error {
      margin-bottom: 0;

      .mt-field__checkbox-state {
        border: 1px solid $mt-field-color-error;
      }

      .mt-field__label {
        color: $color-crimson-500;
      }

      input[type="checkbox"] {
        &:disabled ~ .mt-field__checkbox-state {
          border:
            1px solid $mt-field-color-error,
            5%;
        }

        &:checked ~ .mt-field__checkbox-state {
          border: 1px solid $mt-field-color-error;
          background-color: $mt-field-color-error;
        }

        &:checked:disabled ~ .mt-field__checkbox-state {
          border: 1px solid $mt-field-color-error;
        }
      }
    }

    &.is--inherited {
      input[type="checkbox"] {
        &:checked ~ .mt-field__checkbox-state {
          border-color: $mt-field-color-border;
          background: $mt-field-color-border;
        }
      }
    }

    &.is--bordered {
      border-radius: 4px;
      border: 1px solid $color-gray-300;
      padding: 16px;

      &.has--error {
        border-color: $mt-field-color-error;
      }
    }
  }

  .mt-field__error {
    margin-bottom: 14px;

    &.checkbox-bordered {
      margin-bottom: 8px;
    }
  }
}
</style>
