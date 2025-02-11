<template>
  <div
    :class="[
      'mt-checkbox__block',
      {
        'mt-checkbox__block--bordered': bordered,
        'mt-checkbox__block--errored': !!error && bordered,
      },
    ]"
  >
    <span style="position: relative; width: var(--scale-size-16); height: var(--scale-size-16)">
      <input
        type="checkbox"
        :id="id"
        :class="[
          'mt-checkbox__checkbox',
          {
            'mt-checkbox__checkbox--errored': !!error,
          },
        ]"
        :checked="inputState"
        :required="required"
        :disabled="disabled || isInherited"
        :name="name"
        :indeterminate.prop="partial"
        @change.stop="onChange"
      />

      <mt-icon
        v-if="!!checked || !!partial"
        class="mt-checkbox__indicator"
        :name="partial ? 'solid-minus-xs' : 'solid-checkmark-xs'"
        size="var(--scale-size-10)"
        :color="
          disabled ? 'var(--color-border-primary-default)' : 'var(--color-icon-static-default)'
        "
      />
    </span>

    <mt-field-label
      :class="[
        'mt-checkbox__label',
        {
          'mt-checkbox__label--disabled': disabled,
        },
      ]"
      :id="id"
      :inheritance="!isInheritanceField ? 'none' : isInherited ? 'linked' : 'unlinked'"
      @update:inheritance="
        if (isInherited) {
          $emit('inheritance-remove');
        } else {
          $emit('inheritance-restore');
        }
      "
      :required="required"
      :has-error="!!error"
    >
      {{ label }}
    </mt-field-label>

    <mt-help-text v-if="!!helpText" :text="helpText" />
  </div>

  <mt-field-error v-if="!!error" :error="error" />
</template>

<script lang="ts">
import { defineComponent, useId } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtFieldError from "../_internal/mt-field-error/mt-field-error.vue";
import MtFormFieldMixin from "../../../mixins/form-field.mixin";
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";
import MtHelpText from "../mt-help-text/mt-help-text.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";

export default defineComponent({
  name: "MtCheckbox",

  components: {
    "mt-icon": MtIcon,
    "mt-field-error": MtFieldError,
    MtFieldLabel,
    MtHelpText,
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

  setup() {
    const futureFlags = useFutureFlags();

    const id = useId();

    return {
      id,
    };
  },

  computed: {
    inputState(): boolean {
      if (this.isInherited) {
        return this.inheritedValue;
      }

      return this.checked || false;
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
      return this.isInheritanceField && this.checked === null;
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

<style scoped>
.mt-checkbox__block {
  display: flex;
  align-items: center;
  column-gap: var(--scale-size-4);
}

.mt-checkbox__block--bordered {
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  padding-inline: var(--scale-size-16);
  min-height: var(--scale-size-48);
}

.mt-checkbox__block--errored {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-dark);
}

.mt-checkbox__checkbox {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  border-radius: var(--border-radius-checkbox);
  background: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-primary-default);
  height: var(--scale-size-16);
  width: var(--scale-size-16);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 2px;
  }

  &:checked,
  &:indeterminate {
    border-color: var(--color-interaction-primary-default);
    background-color: var(--color-interaction-primary-default);
  }

  &:disabled {
    cursor: not-allowed;
    background: var(--color-background-primary-disabled);
    border-color: var(--color-border-primary-default);
  }
}

.mt-checkbox__checkbox--errored {
  border-color: var(--color-border-critical-default);

  &:checked {
    background-color: var(--color-interaction-critical-default);
    border-color: var(--color-border-critical-default);
  }
}

.mt-checkbox__label {
  cursor: pointer;
}

.mt-checkbox__label--disabled {
  cursor: not-allowed;
}

.mt-checkbox__indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
