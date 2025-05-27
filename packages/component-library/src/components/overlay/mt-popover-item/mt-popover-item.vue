<template>
  <div class="mt-popover-item" :class="componentClasses" @click="handleLableClick">
    <div class="mt-popover-item__top-row">
      <mt-checkbox
        v-if="showCheckbox"
        :id="id"
        class="mt-popover-item__checkbox"
        :checked="checkboxChecked"
        :partial="checkboxPartial"
        @change="handleLableClick"
      />

      <slot name="extension-logo" />

      <mt-icon
        v-if="icon"
        class="mt-popover-item__icon"
        :class="iconClasses"
        :tabindex="onLabelClickTabIndex"
        :name="icon"
        @click="handleLableClick"
        @keyup.enter="handleLableClick"
      />

      <label
        class="mt-popover-item__label"
        :class="labelClasses"
        :tabindex="onLabelClickTabIndex"
        :role="role"
        :for="id"
        @click.stop.prevent="handleLableClick"
        @keyup.enter="handleLableClick"
      >
        {{ label }}

        <div v-if="metaCopy" class="mt-popover-item__meta-copy">
          {{ metaCopy }}
        </div>
      </label>

      <div class="mt-popover-item__align-right">
        <div v-if="contextualDetail" class="mt-popover-item__contextual-detail">
          {{ contextualDetail }}
        </div>

        <div v-if="shortcut" class="mt-popover-item__shortcut">
          {{ shortcut }}
        </div>

        <mt-switch
          v-if="showSwitch"
          :checked="switchValue"
          class="mt-popover-item__switch"
          @change="handleLableClick"
        />

        <template v-if="showVisibility">
          <mt-icon
            class="mt-popover-item__visibility"
            :name="visible ? 'solid-eye' : 'solid-eye-slash'"
            @click="() => emitVisibilityChange(!visible)"
          />
        </template>

        <div v-if="typeof optionsCount === 'number'" class="mt-popover-item__options-count">
          {{ optionsCount }}
        </div>

        <mt-icon
          v-if="showOptions"
          class="mt-popover-item__options"
          name="solid-chevron-right-s"
          @click="emitClickOptions"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import type { TranslateResult } from "vue-i18n";
import MtCheckbox from "../../form/mt-checkbox/mt-checkbox.vue";
import MtSwitch from "../../form/mt-switch/mt-switch.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import { createId } from "../../../utils/id";
import { useDebounceFn } from "@vueuse/core";

export type MtPopoverItemType = "default" | "critical" | "active";

export default defineComponent({
  name: "MtPopoverItem",
  components: {
    "mt-checkbox": MtCheckbox,
    "mt-switch": MtSwitch,
    "mt-icon": MtIcon,
  },
  props: {
    label: {
      type: String as PropType<string | TranslateResult>,
      required: true,
    },
    type: {
      type: String as PropType<MtPopoverItemType>,
      required: false,
      default: "default",
      validator: (value: string) => {
        return ["default", "critical", "active"].includes(value);
      },
    },
    showCheckbox: {
      type: Boolean,
      required: false,
      default: false,
    },
    checkboxChecked: {
      type: Boolean,
      required: false,
      default: false,
    },
    checkboxPartial: {
      type: Boolean,
      required: false,
      default: false,
    },
    icon: {
      type: String,
      required: false,
      default: "",
    },
    onLabelClick: {
      type: Function as PropType<(() => void) | undefined>,
      required: false,
      default: undefined,
    },
    metaCopy: {
      type: String as PropType<string | TranslateResult>,
      required: false,
      default: "",
    },
    contextualDetail: {
      type: String,
      required: false,
      default: "",
    },
    shortcut: {
      type: String,
      required: false,
      default: "",
    },
    showSwitch: {
      type: Boolean,
      required: false,
      default: false,
    },
    switchValue: {
      type: Boolean,
      required: false,
      default: false,
    },
    showVisibility: {
      type: Boolean,
      required: false,
      default: false,
    },
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    showOptions: {
      type: Boolean,
      required: false,
      default: false,
    },
    optionsCount: {
      type: Number,
      required: false,
      default: undefined,
    },
    borderTop: {
      type: Boolean,
      required: false,
      default: false,
    },
    borderBottom: {
      type: Boolean,
      required: false,
      default: false,
    },
    role: {
      type: String,
      required: false,
      default: "menuitem",
    },
    isOptionItem: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change-checkbox", "change-switch", "change-visibility", "click-options", "close"],
  setup(props, { emit }) {
    const id = createId();

    const emitChangeCheckbox = (changeValue: boolean) => {
      emit("change-checkbox", changeValue);
    };

    const emitChangeSwitch = (changeValue: boolean) => {
      emit("change-switch", changeValue);
    };

    const emitVisibilityChange = (changeValue: boolean) => {
      emit("change-visibility", changeValue);
    };

    const emitClickOptions = () => {
      emit("click-options");
    };

    const isClickable = computed(() => {
      return (
        (!!props.onLabelClick ||
          props.showSwitch ||
          props.showCheckbox ||
          props.showOptions ||
          props.isOptionItem) &&
        !props.disabled
      );
    });

    const componentClasses = computed(() => {
      return {
        "mt-popover-item--default": props.type === "default",
        "mt-popover-item--critical": props.type === "critical",
        "mt-popover-item--active": props.type === "active",
        "mt-popover-item--disabled": props.disabled,
        "mt-popover-item--border-top": props.borderTop,
        "mt-popover-item--border-bottom": props.borderBottom,
        "mt-popover-item--clickable": !!isClickable.value,
      };
    });

    const labelClasses = computed(() => {
      return {
        "mt-popover-item__label--clickable":
          (!!props.onLabelClick || props.showSwitch || props.showCheckbox || props.showOptions) &&
          !props.disabled,
      };
    });

    const onLabelClickTabIndex = computed(() => {
      return props.onLabelClick ? 0 : -1;
    });

    // Debounce the label click to prevent too many calls
    const handleLableClick = useDebounceFn(() => {
      if (props.onLabelClick) {
        props.onLabelClick();
        return;
      }

      if (props.showOptions) {
        emitClickOptions();
        return;
      }

      if (props.showSwitch) {
        emitChangeSwitch(!props.switchValue);
        return;
      }

      if (props.showCheckbox) {
        emitChangeCheckbox(!props.checkboxChecked);
        return;
      }
    }, 16);

    const iconClasses = computed(() => {
      return {
        "mt-popover-item__icon--clickable": !!props.onLabelClick,
      };
    });

    return {
      emitChangeCheckbox,
      emitChangeSwitch,
      emitVisibilityChange,
      emitClickOptions,
      componentClasses,
      labelClasses,
      onLabelClickTabIndex,
      handleLableClick,
      isClickable,
      iconClasses,
      id,
    };
  },
});
</script>

<style lang="scss">
/**
* Use inter-font instead of normal font for popover. Also add the new variables to this file.
*/
$font-family-default:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "San Francisco",
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  sans-serif;
$font-family-variables:
  "Inter var",
  -apple-system,
  BlinkMacSystemFont,
  "San Francisco",
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  sans-serif;
$font-family-default-feature-settings:
  "ss01" on,
  "ss02" on,
  "case" on,
  "cpsp" on,
  "zero" on,
  "cv09" on,
  "cv07" on,
  "cv06" on,
  "cv10" on,
  "cv11" on;

$color-custom-dark: #0f172a;
$color-custom-grey: #64748b;
$color-custom-lightgrey: #cbd5e1;
$color-custom-border: #e5e7eb;

$scrollShadowSize: 16px;
$scrollShadowColor: rgba(120, 120, 120, 0.2);

.mt-popover-item {
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary-default);
  padding: var(--scale-size-8) 0;

  // add new Inter font to popover item
  * {
    font-family: var(--font-family-body);
  }

  @supports (font-variation-settings: normal) {
    * {
      font-family: $font-family-variables;
      font-feature-settings: $font-family-default-feature-settings;
    }
  }

  &.mt-popover-item--clickable {
    cursor: pointer;
  }

  &.mt-popover-item--clickable:hover {
    position: relative;

    &::before {
      content: "";
    }
  }

  &:hover {
    &::before {
      position: absolute;
      background-color: var(--color-interaction-secondary-hover);
      border-radius: var(--border-radius-xs);
      top: var(--scale-size-4);
      right: -8px;
      bottom: var(--scale-size-4);
      left: -8px;
      pointer-events: none;
    }
  }

  &.is--draggable {
    cursor: grab;
  }

  &--critical {
    color: var(--color-text-critical-default);
  }

  &--critical:hover {
    &::before {
      background-color: var(--color-background-critical-default);
    }
  }

  &--active {
    text-decoration: underline;
  }

  &--disabled {
    color: var(--color-text-primary-disabled);

    &:hover {
      text-decoration: none;
      cursor: default;

      &::before {
        background-color: transparent;
      }
    }
  }

  &--border-top {
    border-top: 1px solid var(--color-border-primary-default);
    margin-top: -1px;
  }

  &--border-bottom {
    border-bottom: 1px solid var(--color-border-primary-default);
    margin-bottom: -1px;
  }

  &__top-row {
    display: flex;
    gap: var(--scale-size-8);
    z-index: 1;
  }

  &__align-right {
    display: flex;
    gap: var(--scale-size-8);
    margin-left: auto;
  }

  &__checkbox {
    margin-top: var(--scale-size-4);

    .mt-field--checkbox {
      margin: 0;
    }
  }

  &__icon {
    margin-top: var(--scale-size-4);
    padding: 1px;

    &--clickable {
      cursor: pointer;
    }

    svg {
      width: var(--scale-size-14) !important;
      height: var(--scale-size-14) !important;
    }
  }

  &__label {
    margin-right: var(--scale-size-4);
  }

  &__label,
  &__contextual-detail,
  &__shortcut {
    font-size: var(--font-size-xs);
    line-height: var(--font-line-height-xs);
    font-weight: var(--font-weight-medium);

    &--clickable {
      cursor: pointer;
    }
  }

  &__contextual-detail,
  &__shortcut {
    color: var(--color-text-secondary-default);
    white-space: nowrap;
  }

  &__switch {
    margin: var(--scale-size-4) 0 0 0;
    min-height: var(--scale-size-16);
  }

  &__visibility {
    svg {
      width: var(--scale-size-12) !important;
      height: var(--scale-size-8) !important;
    }

    #meteor-icon-kit__solid-eye-slash {
      width: var(--scale-size-14) !important;
      height: var(--scale-size-10) !important;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: -1px;
    }
  }

  &__options-count {
    margin-right: var(--scale-size-8);
    font-family: var(--font-family-body);
    font-size: var(--font-size-xs);
    line-height: var(--font-line-height-xs);
    font-weight: var(--font-weight-medium);
  }

  &__options {
    svg {
      width: 5px !important;
      height: var(--scale-size-8) !important;
    }
  }

  &__visibility,
  &__options {
    cursor: pointer;
    padding-top: var(--scale-size-4);
    margin-top: var(--scale-size-4);
  }

  &__meta-copy {
    color: var(--color-text-secondary-default);
    font-size: var(--font-size-2xs);
    line-height: var(--font-line-height-2xs);
    font-weight: var(--font-weight-medium);
  }
}
</style>
