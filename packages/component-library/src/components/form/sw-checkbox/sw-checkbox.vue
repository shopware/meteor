<template>
  <div class="sw-field--checkbox__container">
    <div
      class="sw-field--checkbox"
      :class="swCheckboxFieldClasses"
    >
      <div class="sw-field--checkbox__content">
        <div class="sw-field__checkbox">
          <input
            :id="identification"
            type="checkbox"
            :name="identification"
            :checked="inputState"
            :disabled="isDisabled"
            :indeterminate.prop="partial"
            @change="onChange"
          >
          <div class="sw-field__checkbox-state">
            <sw-icon
              :name="iconName"
              size="16"
            />
          </div>
        </div>

        <sw-base-field
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
        </sw-base-field>
      </div>
    </div>

    <sw-field-error :error="error" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SwIcon from '../../icons-media/sw-icon/sw-icon.vue';
import SwBaseField from '../_internal/sw-base-field/sw-base-field.vue';
import SwFieldError from '../_internal/sw-field-error/sw-field-error.vue';
import SwFormFieldMixin from '../../../mixins/form-field.mixin';
import { createId } from '../../../utils/uuid';

export default Vue.extend({
  name: 'SwCheckbox',

  components: {
    'sw-icon': SwIcon,
    'sw-base-field': SwBaseField,
    'sw-field-error': SwFieldError,
  },

  mixins: [
    SwFormFieldMixin,
  ],

  inheritAttrs: false,

  props: {
    /**
     * A label for the checkbox.
     */
    label: {
      type: String,
      required: false,
      default: undefined
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
    swCheckboxFieldClasses(): {
      'has--error': boolean,
      'is--disabled': boolean,
      'is--inherited': boolean,
      'is--bordered': boolean,
      'is--partly-checked': boolean,
    } {
      return {
        'has--error': !!this.hasError,
        'is--disabled': this.disabled,
        'is--inherited': !!this.isInherited,
        'is--bordered': this.bordered,
        'is--partly-checked': this.isPartlyChecked,
      };
    },

    identification(): string {
      return `sw-field--${this.id}`;
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
      return this.isPartlyChecked ? 'regular-minus-xxs' : 'regular-checkmark-xxs';
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
      this.$emit('change', changeEvent.target.checked);
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$sw-field-color-text: $color-darkgray-200;
$sw-field-color-focus: $color-shopware-brand-500;
$sw-field-color-background: $color-white;
$sw-field-color-border: $color-gray-300;
$sw-field-color-error: $color-crimson-500;
$sw-field-color-inherited: $color-module-purple-900;

.sw-field--checkbox__container {
  .sw-field--checkbox {
    margin-bottom: 22px;

    .sw-inheritance-switch {
      &.sw-field__inheritance-icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .sw-field--checkbox__content {
      display: grid;
      grid-template-columns: 16px 1fr;
      align-items: center;
    }

    .sw-field {
      margin-bottom: 0;

      .sw-block-field__block {
        border: none;
      }
    }

    .sw-field--default {
      display: flex;
    }

    .sw-field__label {
      margin-bottom: 0;
      margin-left: 4px;
    }

    .sw-field__checkbox {
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

        &:disabled ~ .sw-field__checkbox-state {
          background: $color-gray-100;
          border-color: $color-gray-300;
          color: lighten($sw-field-color-text, 40%);
        }

        &:checked ~ .sw-field__checkbox-state {
          background: $sw-field-color-focus;
          border-color: $sw-field-color-focus;

          .sw-icon {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        &:checked:disabled ~ .sw-field__checkbox-state {
          background: $color-gray-100;
          border-color: $color-gray-300;
          color: lighten($sw-field-color-text, 40%);

          .sw-icon {
            color: lighten($sw-field-color-text, 40%);
          }
        }

        &:indeterminate ~ .sw-field__checkbox-state {
          background-color: $color-shopware-brand-500;
          border: 1px solid $color-shopware-brand-500;

          .sw-icon {
            display: inline-block;
            color: white;
          }
        }
      }

      .sw-field__checkbox-state {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        text-align: center;
        background: $sw-field-color-background;
        color: $sw-field-color-text;
        border: 1px solid $sw-field-color-border;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;

        .sw-icon {
          display: none;
          color: $sw-field-color-background;
        }
      }
    }

    &.has--error {
      margin-bottom: 0;

      .sw-field__checkbox-state {
        border: 1px solid $sw-field-color-error;
      }

      .sw-field__label {
        color: $color-crimson-500;
      }

      input[type="checkbox"] {
        &:disabled ~ .sw-field__checkbox-state {
          border: 1px solid $sw-field-color-error, 5%;
        }

        &:checked ~ .sw-field__checkbox-state {
          border: 1px solid $sw-field-color-error;
          background-color: $sw-field-color-error;
        }

        &:checked:disabled ~ .sw-field__checkbox-state {
          border: 1px solid $sw-field-color-error;
        }
      }
    }

    &.is--inherited {
      input[type="checkbox"] {
        &:checked ~ .sw-field__checkbox-state {
          border-color: $sw-field-color-border;
          background: $sw-field-color-border;
        }
      }
    }

    &.is--bordered {
      border-radius: 4px;
      border: 1px solid $color-gray-300;
      padding: 16px;

      &.has--error {
        border-color: $sw-field-color-error;
      }
    }
  }

  .sw-field__error {
    margin-bottom: 14px;

    &.checkbox-bordered {
      margin-bottom: 8px;
    }
  }
}
</style>
