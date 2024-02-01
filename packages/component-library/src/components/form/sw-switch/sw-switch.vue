<template>
  <div class="sw-field--switch__container">
    <div
      class="sw-field--switch"
      :class="swSwitchFieldClasses"
    >
      <div class="sw-field--switch__content">
        <div class="sw-field--switch__input">
          <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
          <input
            :id="identification"
            type="checkbox"
            :name="formFieldName || identification"
            :checked="inputState"
            :disabled="isDisabled"
            @change="onChange"
          >
          <div class="sw-field__switch-state">
            <div class="sw-field__switch-state-knob" />
          </div>
        </div>

        <sw-base-field
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
          :name="identification"
          :has-focus="false"
          :help-text="helpText"
          :is-inheritance-field="isInheritanceField"
          :is-inherited="isInherited"
          @inheritance-restore="onInheritanceRestore($event)"
          @inheritance-remove="$emit('inheritance-remove', $event)"
        >
          <template #label>
            {{ label }}
          </template>
        </sw-base-field>
      </div>
    </div>
    <sw-field-error
      :error="error"
      :class="errorClasses"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SwBaseField from '../_internal/sw-base-field/sw-base-field.vue';
import SwFieldError from '../_internal/sw-field-error/sw-field-error.vue';
import SwFormFieldMixin from '../../../mixins/form-field.mixin';
import { createId } from '../../../utils/uuid';

export default Vue.extend({
  name: 'SwSwitch',

  components: {
    'sw-base-field': SwBaseField,
    'sw-field-error': SwFieldError,
  },

  mixins: [SwFormFieldMixin],

  inheritAttrs: false,

  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines the checked state of the checkbox.
     */
    checked: {
      type: Boolean,
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
     * Inherited value from another SalesChannel.
     */
    inheritedValue: {
      type: Boolean,
      required: false,
      default: null,
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
     * Error object for this field.
     */
    error: {
      type: Object,
      required: false,
      default: null,
    },

    removeTopMargin: {
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
    identification(): string {
      return `sw-field--${this.id}`;
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

    hasError(): boolean {
      return this.error && this.error.code !== 0;
    },

    swSwitchFieldClasses(): Record<string, boolean>[] {
      return [
        {
          'has--error': this.hasError,
          'sw-field--switch-bordered': this.bordered,
          'sw-field--switch-no-margin-top': this.removeTopMargin,
          'sw-field--switch-no-margin-bottom': this.hasError,
          // @ts-expect-error - classes exist on checkbox field
          ...this.swCheckboxFieldClasses,
        },
      ];
    },

    errorClasses(): {
      'sw-field__error--move-up': boolean;
    }[] {
      return [
        {
          'sw-field__error--move-up': !this.bordered,
        },
      ];
    },

    isDisabled(): boolean {
      return this.disabled || this.isInherited;
    },
  },

  watch: {
    checked() { this.currentValue = this.checked; },
  },

  methods: {
    onChange(changeEvent: Event) {
      // @ts-expect-error - target exists on event
      this.$emit('change', changeEvent.target.checked);
    },

    onInheritanceRestore(event: Event) {
      this.$emit('inheritance-restore', event);
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$sw-field--switch-color-border: $color-gray-300;
$sw-field--switch-color-background: $color-white;
$sw-field--switch-color-text: $color-darkgray-200;
$sw-field--switch-color-focus: $color-shopware-brand-500;
$sw-field--switch-color-error: $color-crimson-500;

.sw-field--switch__container {
  .sw-field--switch {
    margin-top: 24px;
    margin-bottom: 22px;

    &.sw-field--switch-no-margin-top {
      margin-top: 0;
    }

    &.sw-field--switch-no-margin-bottom {
      margin-bottom: 0;
    }

    .sw-field__error {
      margin-top: -14px;
    }

    .sw-field {
      margin-bottom: 0;

      .sw-block-field__block {
        border: none;
      }
    }

    .sw-field__label {
      margin-bottom: 0;

      label {
        cursor: pointer;
        flex-grow: initial;
        padding: 15px 0 15px 4px;
      }
    }

    .sw-field--switch__content {
      display: grid;
      grid-template-columns: 24px 1fr auto;
      align-items: center;
      color: $sw-field--switch-color-text;
    }

    &.sw-field--switch-bordered {
      .sw-field__error {
        padding: 0 16px;
      }
    }

    &.sw-field--switch-bordered .sw-field--switch__content {
      border-radius: 4px;
      border: 1px solid $sw-field--switch-color-border;
      padding: 0 16px;
    }

    .sw-field--switch__input {
      position: relative;
      padding: 15px 0;
      width: 24px;
      height: 100%;

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
        z-index: 2;
        cursor: pointer;

        &:disabled {
          cursor: auto;
        }

        &:disabled ~ .sw-field__switch-state {
          background: $color-gray-100;

          .sw-field__switch-state-knob {
            background: $sw-field--switch-color-border;
          }
        }

        &:checked ~ .sw-field__switch-state {
          background: $sw-field--switch-color-focus;

          .sw-field__switch-state-knob {
            left: 10px;
          }
        }

        &:checked:disabled ~ .sw-field__switch-state {
          background: $color-gray-100;
        }
      }

      .sw-field__switch-state {
        position: absolute;
        width: 100%;
        height: 16px;
        z-index: 1;
        text-align: center;
        background: $sw-field--switch-color-border;
        border-radius: 8px;

        .sw-field__switch-state-knob {
          transition: all 0.3s ease-in-out;
          width: 10px;
          height: 10px;
          position: absolute;
          top: 3px;
          left: 3px;
          background: $sw-field--switch-color-background;
          border-radius: 7px;
        }
      }
    }

    .sw-field__inheritance-icon {
      display: flex;
      align-items: center;
      margin-left: 8px;
      margin-right: 0;
    }

    &.has--error {
      .sw-block-field__block {
        background: $color-crimson-50;
      }

      &.sw-field--switch-bordered {
        .sw-field--switch__content {
          border: 1px solid $sw-field--switch-color-error;
          background: $color-crimson-50;
        }
      }

      .sw-field__switch-state {
        background: $sw-field--switch-color-error;
      }

      input[type="checkbox"] {
        &:disabled ~ .sw-field__switch-state {
          background: $sw-field--switch-color-error;

          .sw-field__switch-state-knob {
            background: darken($sw-field--switch-color-error, 5%);
          }
        }

        &:checked ~ .sw-field__switch-state {
          background: $sw-field--switch-color-error;
        }

        &:checked:disabled ~ .sw-field__switch-state {
          background: $sw-field--switch-color-error;
        }
      }
    }

    &.is--inherited {
      input[type="checkbox"] {
        &:checked ~ .sw-field__switch-state {
          background: $sw-field--switch-color-border;
        }
      }
    }

    &:focus-within {
      .sw-field__switch-state {
        border-color: $color-shopware-brand-500;
        box-shadow: 0 0 4px $color-shopware-brand-500;
      }
    }
  }

  .sw-field__error {
    &--move-up {
      transform: translateY(-19px);
      margin-bottom: 21px;
    }
  }
}
</style>
