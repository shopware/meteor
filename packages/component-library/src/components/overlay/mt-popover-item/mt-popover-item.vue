<template>
  <div class="mt-popover-item" :class="componentClasses">
    <label class="mt-popover-item__top-row" @click="handleLabelClick">
      <mt-checkbox
        v-if="showCheckbox"
        class="mt-popover-item__checkbox"
        :checked="checkboxChecked"
        :partial="checkboxPartial"
        @change="$emit('change-checkbox', $event)"
      />

      <slot name="extension-logo" />

      <mt-icon
        v-if="icon"
        class="mt-popover-item__icon"
        :class="iconClasses"
        :tabindex="onLabelClickTabIndex"
        :name="icon"
        @click="handleLabelClick"
        @keyup.enter="handleLabelClick"
      />

      <div
        class="mt-popover-item__label"
        :class="labelClasses"
        :tabindex="onLabelClickTabIndex"
        :role="role"
        @keyup.enter="handleLabelClick"
      >
        {{ label }}

        <div v-if="metaCopy" class="mt-popover-item__meta-copy">
          {{ metaCopy }}
        </div>
      </div>

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
          @change="$emit('change-switch', $event)"
        />

        <template v-if="showVisibility">
          <mt-icon
            class="mt-popover-item__visibility"
            :name="visible ? 'solid-eye' : 'solid-eye-slash'"
            @click="$emit('change-visibility', !visible)"
          />
        </template>

        <div v-if="typeof optionsCount === 'number'" class="mt-popover-item__options-count">
          {{ optionsCount }}
        </div>

        <mt-icon
          v-if="showOptions"
          class="mt-popover-item__options"
          name="solid-chevron-right-s"
          @click="$emit('click-options')"
        />
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import type { TranslateResult } from "vue-i18n";
import MtCheckbox from "../../form/mt-checkbox/mt-checkbox.vue";
import MtSwitch from "../../form/mt-switch/mt-switch.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

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
    // TODO: implement styling for disabled
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
  emits: ["change-checkbox", "change-switch", "change-visibility", "click-options"],
  setup(props, { emit }) {
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

    const handleLabelClick = () => {
      if (props.onLabelClick) {
        props.onLabelClick();
        return;
      }

      if (props.showOptions) {
        emit("click-options");
        return;
      }

      if (props.showCheckbox) {
        emit("change-checkbox", !props.checkboxChecked);
        return;
      }
    };

    const iconClasses = computed(() => {
      return {
        "mt-popover-item__icon--clickable": !!props.onLabelClick,
      };
    });

    return {
      componentClasses,
      labelClasses,
      onLabelClickTabIndex,
      handleLabelClick,
      isClickable,
      iconClasses,
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";
@import "../../assets/scss/mixins.scss";

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

$font-weight-medium: 500;

$line-height-auto: auto;
$line-height-xs: 18px;
$line-height-sm: 20px;
$line-height-md: 24px;
$line-height-lg: 28px;

$color-custom-dark: #0f172a;
$color-custom-grey: #64748b;
$color-custom-lightgrey: #cbd5e1;
$color-custom-border: #e5e7eb;

$scrollShadowSize: 16px;
$scrollShadowColor: rgba(120, 120, 120, 0.2);

.mt-popover-item {
  display: flex;
  flex-direction: column;
  color: $color-custom-dark;
  padding: 8px 0;

  // add new Inter font to popover item
  * {
    font-family: $font-family-default;
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
      background-color: $color-shopware-brand-50;
      border-radius: $border-radius-default;
      top: 4px;
      right: -8px;
      bottom: 4px;
      left: -8px;
      pointer-events: none;
    }
  }

  &.is--draggable {
    cursor: grab;
  }

  &--critical {
    color: $color-crimson-500;
  }

  &--critical:hover {
    &::before {
      background-color: $color-crimson-50;
    }
  }

  &--active {
    text-decoration: underline;
  }

  &--disabled {
    color: $color-custom-lightgrey;

    &:hover {
      text-decoration: none;
      cursor: default;

      &::before {
        background-color: transparent;
      }
    }
  }

  &--border-top {
    border-top: 1px solid $color-custom-border;
    margin-top: -1px;
  }

  &--border-bottom {
    border-bottom: 1px solid $color-custom-border;
    margin-bottom: -1px;
  }

  &__top-row {
    display: flex;
    gap: 8px;
    z-index: 1;
  }

  &__align-right {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  &__checkbox {
    margin-top: 4px;

    .mt-field--checkbox {
      margin: 0;
    }
  }

  &__icon {
    margin-top: 4px;
    padding: 1px;

    &--clickable {
      cursor: pointer;
    }

    svg {
      width: 14px !important;
      height: 14px !important;
    }
  }

  &__label {
    margin-right: 4px;
  }

  &__label,
  &__contextual-detail,
  &__shortcut {
    font-size: $font-size-xs;
    line-height: $line-height-md;
    font-weight: $font-weight-medium;

    &--clickable {
      cursor: pointer;
    }
  }

  &__contextual-detail,
  &__shortcut {
    color: $color-custom-lightgrey;
    white-space: nowrap;
  }

  &__switch {
    margin-top: 4px;

    .mt-field--switch {
      margin: 0;

      .mt-field--switch__input {
        height: 16px;
        padding: 0;
      }

      .mt-field__label {
        display: none;
      }
    }
  }

  &__visibility {
    svg {
      width: 12px !important;
      height: 8px !important;
    }

    #meteor-icon-kit__solid-eye-slash {
      width: 14px !important;
      height: 10px !important;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: -1px;
    }
  }

  &__options-count {
    margin-right: 8px;
    font-size: $font-size-xs;
    line-height: $line-height-md;
    font-weight: $font-weight-medium;
  }

  &__options {
    svg {
      width: 5px !important;
      height: 8px !important;
    }
  }

  &__visibility,
  &__options {
    cursor: pointer;
    padding-top: 4px;
    margin-top: 4px;
  }

  &__meta-copy {
    color: $color-custom-grey;
    font-size: $font-size-xxs;
    line-height: $line-height-xs;
    font-weight: $font-weight-medium;
  }
}
</style>
