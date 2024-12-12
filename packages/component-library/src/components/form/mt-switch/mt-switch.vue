<template>
  <div class="mt-field--switch__container">
    <div class="mt-field--switch" :class="MtSwitchFieldClasses">
      <div class="mt-field--switch__content">
        <div class="mt-field--switch__input">
          <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
          <input
            :id="identification"
            type="checkbox"
            :name="formFieldName || identification"
            :checked="inputState"
            :disabled="isDisabled"
            @change.stop="onChange"
          />
          <div class="mt-field__switch-state">
            <div class="mt-field__switch-state-knob" />
          </div>
        </div>

        <mt-base-field
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
        </mt-base-field>
      </div>
    </div>
    <mt-field-error :error="error" :class="errorClasses" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import { createId } from "../../../utils/id";

export default defineComponent({
  name: "MtSwitch",

  components: {
    "mt-base-field": MtBaseField,
    "mt-field-error": MtFieldError,
  },

  mixins: [MtFormFieldMixin],

  props: {
    label: {
      type: String,
      required: false,
      default: "",
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

    /**
     * Name of the form field.
     */
    name: {
      type: String,
      required: false,
      default: "",
    },
  },

  data(): { id: string | undefined; currentValue: boolean | undefined } {
    return {
      currentValue: this.checked,
      id: undefined,
    };
  },

  mounted() {
    this.id = createId();
  },

  computed: {
    identification(): string {
      return `mt-field--${this.id}`;
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

    MtSwitchFieldClasses(): Record<string, boolean>[] {
      return [
        {
          "has--error": this.hasError,
          "mt-field--switch-bordered": this.bordered,
          "mt-field--switch-no-margin-top": this.removeTopMargin,
          "mt-field--switch-no-margin-bottom": this.hasError,
        },
      ];
    },

    errorClasses(): {
      "mt-field__error--move-up": boolean;
    }[] {
      return [
        {
          "mt-field__error--move-up": !this.bordered,
        },
      ];
    },

    isDisabled(): boolean {
      return this.disabled || this.isInherited;
    },
  },

  watch: {
    checked() {
      this.currentValue = this.checked;
    },
  },

  methods: {
    onChange(changeEvent: Event) {
      // @ts-expect-error - target exists on event
      this.$emit("change", changeEvent.target.checked);
    },

    onInheritanceRestore(event: Event) {
      this.$emit("inheritance-restore", event);
    },
  },
});
</script>

<style lang="scss">
.mt-field--switch__container {
  .mt-field--switch {
    margin-top: var(--scale-size-24);
    margin-bottom: var(--scale-size-22);

    &.mt-field--switch-no-margin-top {
      margin-top: 0;
    }

    &.mt-field--switch-no-margin-bottom {
      margin-bottom: 0;
    }

    .mt-field__error {
      margin-top: -14px;
    }

    .mt-field {
      margin-bottom: 0;

      .mt-block-field__block {
        border: none;
      }
    }

    .mt-field__label {
      margin-bottom: 0;

      label {
        cursor: pointer;
        flex-grow: initial;
        padding: 15px 0 15px var(--scale-size-4);
      }
    }

    .mt-field--switch__content {
      display: grid;
      grid-template-columns: 24px 1fr auto;
      align-items: center;
    }

    &.mt-field--switch-bordered {
      .mt-field__error {
        padding: 0 var(--scale-size-16);
      }
    }

    &.mt-field--switch-bordered .mt-field--switch__content {
      border-radius: 4px;
      border: 1px solid var(--color-border-primary-default);
      padding: 0 var(--scale-size-16);
    }

    .mt-field--switch__input {
      position: relative;
      padding: 15px 0;
      width: var(--scale-size-24);
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

        &:disabled ~ .mt-field__switch-state {
          background: var(--color-interaction-secondary-disabled);

          .mt-field__switch-state-knob {
            background: var(--color-icon-primary-disabled);
          }
        }

        &:checked ~ .mt-field__switch-state {
          background: var(--color-interaction-primary-default);

          .mt-field__switch-state-knob {
            left: var(--scale-size-10);
          }
        }

        &:checked:disabled ~ .mt-field__switch-state {
          background: var(--color-interaction-primary-disabled);

          .mt-field__switch-state-knob {
            background: var(--color-icon-static-default);
          }
        }
      }

      .mt-field__switch-state {
        position: absolute;
        width: 100%;
        height: var(--scale-size-16);
        z-index: 1;
        text-align: center;
        background: var(--color-interaction-secondary-disabled);
        border-radius: 8px;

        .mt-field__switch-state-knob {
          transition: all 0.3s ease-in-out;
          width: var(--scale-size-10);
          height: var(--scale-size-10);
          position: absolute;
          top: 3px;
          left: 3px;
          background: var(--color-icon-static-default);
          border-radius: 7px;
        }
      }
    }

    .mt-field__inheritance-icon {
      display: flex;
      align-items: center;
      margin-left: var(--scale-size-8);
      margin-right: 0;
    }

    &.has--error {
      &.mt-field--switch-bordered {
        .mt-field--switch__content {
          border: 1px solid var(--color-border-critical-default);
          background: var(--color-background-critical-dark);
        }
      }

      .mt-field__switch-state {
        background: var(--color-interaction-critical-default);
      }

      input[type="checkbox"]:checked ~ .mt-field__switch-state {
        background: var(--color-interaction-critical-default);
      }
    }

    &:has(:focus-visible) {
      .mt-field__switch-state {
        outline: 2px solid var(--color-border-brand-selected);
        outline-offset: 2px;
      }
    }
  }

  .mt-field__error {
    &--move-up {
      transform: translateY(-15px);
      margin-bottom: 21px;
    }
  }
}
</style>
