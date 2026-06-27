<template>
  <div class="mt-popover-item" :class="componentClasses" @click="handleLabelClick">
    <div class="mt-popover-item__top-row">
      <mt-checkbox
        v-if="showCheckbox"
        :id="id"
        class="mt-popover-item__checkbox"
        :checked="checkboxChecked"
        :partial="checkboxPartial"
        @change="handleLabelClick"
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

      <label
        class="mt-popover-item__label"
        :class="labelClasses"
        :tabindex="onLabelClickTabIndex"
        :role="role"
        :for="id"
        @click.stop.prevent="handleLabelClick"
        @keyup.enter="handleLabelClick"
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
          @change="handleLabelClick"
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
import MtCheckbox from "../mt-checkbox/mt-checkbox.vue";
import MtSwitch from "../mt-switch/mt-switch.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import { createId } from "../../utils/id";
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
      type: Function as PropType<((e: MouseEvent | KeyboardEvent | boolean) => void) | undefined>,
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

    const emitClickOptions = (e: MouseEvent | KeyboardEvent | boolean) => {
      emit("click-options", e);
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
    const handleLabelClick = useDebounceFn((e: MouseEvent | KeyboardEvent | boolean) => {
      if (props.onLabelClick) {
        props.onLabelClick(e);
        return;
      }

      if (props.showOptions) {
        emitClickOptions(e);
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
      handleLabelClick,
      isClickable,
      iconClasses,
      id,
    };
  },
});
</script>

<style>
.mt-popover-item {
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary-default);
  padding: var(--scale-size-8) 0;

  /* add new Inter font to popover item */
  * {
    font-family: var(--font-family-body);
  }

  @supports (font-variation-settings: normal) {
    * {
      font-family:
        "Inter",
        -apple-system,
        BlinkMacSystemFont,
        "San Francisco",
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        sans-serif;
      font-feature-settings:
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

  &:hover::before {
    position: absolute;
    background-color: var(--color-interaction-secondary-hover);
    border-radius: var(--border-radius-xs);
    inset-block: var(--scale-size-4);
    inset-inline: -8px;
    pointer-events: none;
  }

  &.is--draggable {
    cursor: grab;
  }
}

.mt-popover-item--critical {
  color: var(--color-text-critical-default);
}

.mt-popover-item--critical:hover::before {
  background-color: var(--color-background-critical-default);
}

.mt-popover-item--active {
  text-decoration: underline;
}

.mt-popover-item--disabled {
  color: var(--color-text-primary-disabled);

  &:hover {
    text-decoration: none;
    cursor: default;

    &::before {
      background-color: transparent;
    }
  }
}

.mt-popover-item--border-top {
  border-block-start: 1px solid var(--color-border-secondary-default);
  margin-block-start: -1px;
}

.mt-popover-item--border-bottom {
  border-block-end: 1px solid var(--color-border-secondary-default);
  margin-block-end: -1px;
}

.mt-popover-item__top-row {
  display: flex;
  gap: var(--scale-size-8);
  z-index: 1;
}

.mt-popover-item__align-right {
  display: flex;
  gap: var(--scale-size-8);
  margin-inline-start: auto;
}

.mt-popover-item__checkbox {
  margin-block-start: var(--scale-size-4);

  .mt-field--checkbox {
    margin: 0;
  }
}

.mt-popover-item__icon {
  margin-block-start: var(--scale-size-4);
  padding: 1px;

  svg {
    width: var(--scale-size-14) !important;
    height: var(--scale-size-14) !important;
  }
}

.mt-popover-item__icon--clickable {
  cursor: pointer;
}

.mt-popover-item__label {
  margin-inline-end: var(--scale-size-4);
}

.mt-popover-item__label,
.mt-popover-item__contextual-detail,
.mt-popover-item__shortcut {
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-medium);
}

.mt-popover-item__label--clickable,
.mt-popover-item__contextual-detail--clickable,
.mt-popover-item__shortcut--clickable {
  cursor: pointer;
}

.mt-popover-item__contextual-detail,
.mt-popover-item__shortcut {
  color: var(--color-text-secondary-default);
  white-space: nowrap;
}

.mt-popover-item__switch {
  margin: var(--scale-size-4) 0 0 0;
  min-height: var(--scale-size-16);
}

.mt-popover-item__visibility {
  svg {
    width: var(--scale-size-12) !important;
    height: var(--scale-size-8) !important;
  }

  #meteor-icon-kit__solid-eye-slash {
    width: var(--scale-size-14) !important;
    height: var(--scale-size-10) !important;
    margin-block-start: -1px;
    margin-inline: -1px;
  }
}

.mt-popover-item__options-count {
  margin-inline-end: var(--scale-size-8);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-medium);
}

.mt-popover-item__options svg {
  width: 5px !important;
  height: var(--scale-size-8) !important;
}

.mt-popover-item__visibility,
.mt-popover-item__options {
  cursor: pointer;
  padding-block-start: var(--scale-size-4);
  margin-block-start: var(--scale-size-4);
}

.mt-popover-item__meta-copy {
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  font-weight: var(--font-weight-medium);
}
</style>
