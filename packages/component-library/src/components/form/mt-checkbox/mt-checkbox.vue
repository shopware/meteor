<template>
  <div class="mt-field--checkbox__container">
    <div class="mt-field--checkbox" :class="{ ...MtCheckboxFieldClasses, ...checkboxClasses }">
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
            <mt-icon :name="iconName" />
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
            <slot name="label">
              {{ label }}
            </slot>
          </template>
        </mt-base-field>
      </div>
    </div>

    <mt-field-error :error="error" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtBaseField from "../_internal/mt-base-field/mt-base-field.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import { createId } from "../../../utils/id";
import { useFutureFlags } from "@/composables/useFutureFlags";

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
     * Determines if the field is inherited.
     */
    isInherited: {
      type: Boolean,
      required: false,
      default: false,
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

  data(): { id: string | undefined; currentValue: boolean | undefined } {
    return {
      currentValue: this.checked,
      id: undefined,
    };
  },

  mounted() {
    this.id = createId();
  },

  setup() {
    const futureFlags = useFutureFlags();

    const checkboxClasses = computed(() => ({
      "mt-switch--future-remove-default-margin": futureFlags.removeDefaultMargin,
    }));

    return {
      checkboxClasses,
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
        "is--inherited": !!this.isInheritedComputed,
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
      if (this.isInheritedComputed) {
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

    isInheritedComputed(): boolean {
      if (this.isInherited) {
        return true;
      }

      return this.isInheritanceField && this.currentValue === null;
    },

    isDisabled(): boolean {
      return this.disabled || this.isInheritedComputed;
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
      this.$emit("update:checked", changeEvent.target.checked);

      // @ts-expect-error - target is defined in the event
      // @deprecated tag:4.0 - Will be removed. Use `update:checked` instead.
      this.$emit("change", changeEvent.target.checked);
    },
  },
});
</script>

<style>
.mt-field--checkbox__container {
  & .mt-field--checkbox {
    margin-bottom: var(--scale-size-22);

    &.mt-switch--future-remove-default-margin {
      margin-bottom: 0;
    }

    & .mt-inheritance-switch {
      &.mt-field__inheritance-icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    & .mt-field--checkbox__content {
      display: grid;
      grid-template-columns: 16px 1fr;
      align-items: center;
    }

    & .mt-field {
      margin-bottom: 0;

      & .mt-block-field__block {
        border: none;
      }
    }

    & .mt-field--default {
      display: flex;
    }

    & .mt-field__label {
      margin-bottom: 0;
      margin-left: var(--scale-size-4);

      & .mt-help-text {
        margin-left: var(--scale-size-8);
      }
    }

    & .mt-field__checkbox {
      width: var(--scale-size-16);
      height: var(--scale-size-16);
      position: relative;

      &:has(:focus-visible) {
        outline: 2px solid var(--color-border-brand-selected);
        outline-offset: 2px;
        border-radius: var(--border-radius-checkbox);
      }

      & input[type="checkbox"] {
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
          background: var(--color-background-primary-disabled);
          border-color: var(--color-border-primary-default);
        }

        &:checked ~ .mt-field__checkbox-state {
          background: var(--color-interaction-primary-default);
          border-color: var(--color-interaction-primary-default);

          & .mt-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--color-icon-static-default);
          }
        }

        &:checked:disabled ~ .mt-field__checkbox-state {
          background: var(--color-background-primary-disabled);
          border-color: var(--color-border-primary-default);

          & .mt-icon {
            color: var(--color-border-primary-default);
          }
        }

        &:indeterminate ~ .mt-field__checkbox-state {
          background-color: var(--color-interaction-primary-default);
          border: 1px solid var(--color-interaction-primary-default);

          & .mt-icon {
            display: inline-block;
            color: var(--color-icon-static-default);
          }
        }
      }

      & .mt-field__checkbox-state {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        text-align: center;
        background: var(--color-elevation-surface-raised);
        color: var(--color-text-primary-default);
        border: 1px solid var(--color-border-primary-default);
        border-radius: var(--border-radius-checkbox);
        display: flex;
        justify-content: center;
        align-items: center;

        & .mt-icon {
          display: none;
          color: var(--color-background-primary-default);
        }
      }
    }

    &.has--error {
      margin-bottom: 0;

      & .mt-field__checkbox-state {
        border: 1px solid var(--color-interaction-critical-default);
      }

      & .mt-field__label {
        color: var(--color-text-critical-default);
      }

      & input[type="checkbox"] {
        &:disabled ~ .mt-field__checkbox-state {
          border: 1px solid var(--color-interaction-critical-default);
        }

        &:checked ~ .mt-field__checkbox-state {
          border: 1px solid var(--color-interaction-critical-default);
          background-color: var(--color-interaction-critical-default);
        }

        &:checked:disabled ~ .mt-field__checkbox-state {
          border: 1px solid var(--color-interaction-critical-default);
        }
      }
    }

    &.is--inherited {
      & input[type="checkbox"] {
        &:checked ~ .mt-field__checkbox-state {
          border-color: var(--color-border-primary-default);
          background: var(--color-background-primary-disabled);
        }
      }
    }

    &.is--bordered {
      border-radius: 4px;
      border: 1px solid var(--color-border-primary-default);
      padding: var(--scale-size-16);

      &.has--error {
        border-color: var(--color-border-critical-default);
      }
    }
  }

  & .mt-field__error {
    margin-bottom: var(--scale-size-14);

    &.checkbox-bordered {
      margin-bottom: var(--scale-size-8);
    }
  }

  & .mt-block-field__block {
    min-height: unset;
  }
}
</style>
