<template>
  <div class="sw-segmented-control" :class="segmentedControlClasses">
    <template v-for="(action, index) in actions">
      <div
        v-if="typeof action === 'string' && !disableContext"
        :key="index"
        class="sw-segmented-control__divider"
      />

      <!-- TOOD: Add is-opened from action value -->
      <sw-popover
        v-if="typeof action !== 'string'"
        :key="action.id"
        :child-views="action.popover && action.popover.childViews"
        :title="action.popover && action.popover.title"
      >
        <template #trigger="{ toggleFloatingUi }">
          <button
            class="sw-segmented-control__action"
            :class="getActionClass(action)"
            :aria-pressed="action.isPressed"
            @click="() => handleClick(action, toggleFloatingUi)"
          >
            <sw-icon
              v-if="action.iconName"
              :name="action.iconName"
              class="sw-segmented-control__action-icon"
            />

            <template v-if="action.hasCheckbox">
              <sw-checkbox
                :checked="action.checked"
                :label="action.label"
                @change="(event) => handleCheckboxChange(action, event)"
              />
            </template>

            <template v-else>
              <slot :name="'label__' + action.id" />

              {{ action.label }}
            </template>

            <sw-icon
              v-if="action.options"
              class="sw-segmented-control__action-options-icon"
              name="regular-chevron-down-xs"
            />

            <slot :name="'options__' + action.id" />
          </button>
        </template>

        <template #popover-items__base="{ toggleFloatingUi, changeView }">
          <slot
            :name="action.id + '--popover-items__base'"
            :toggle-floating-ui="toggleFloatingUi"
            :change-view="changeView"
          />
        </template>

        <template
          v-for="childView in flatChildViews(action.popover && action.popover.childViews)"
          #[`popover-items__${childView.name}`]="{ toggleFloatingUi, changeView }"
        >
          <slot
            :name="action.id + '--popover-items__' + childView.name"
            :toggle-floating-ui="toggleFloatingUi"
            :change-view="changeView"
          />
        </template>
      </sw-popover>
    </template>
  </div>
</template>

<script lang="ts">
import SwCheckbox from "../../form/sw-checkbox/sw-checkbox.vue";
import SwIcon from "../../icons-media/sw-icon/sw-icon.vue";
import SwPopover from "../../overlay/sw-popover/sw-popover.vue";
import type { View } from "../../overlay/sw-popover/sw-popover.interfaces";
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";

export interface SegmentedControlAction {
  id: string;
  label?: string;
  onClick?: ({ checkboxValue }: { checkboxValue?: boolean }) => void;
  isPressed?: boolean;
  isCritical?: boolean;
  hasCheckbox?: boolean;
  checked?: boolean;
  iconName?: string;
  options?: boolean;
  disabled?: boolean;
  minSquare?: boolean;
  popover?: {
    title?: string;
    childViews?: View[];
    disableFloat?: boolean;
  };
}

export type SegmentedControlActionsProp = (SegmentedControlAction | "divider")[];

export default defineComponent({
  components: {
    "sw-checkbox": SwCheckbox,
    "sw-icon": SwIcon,
    "sw-popover": SwPopover,
  },
  props: {
    actions: {
      type: Array as PropType<SegmentedControlActionsProp>,
      required: true,
    },
    /**
     * Activate to hide the padding around the controls.
     */
    disableContext: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [],
  setup(props) {
    const getActionClass = (action: SegmentedControlAction) => {
      const classes = [`sw-segmented-control__action-id-${action.id}`];

      if (action.isPressed && !action.hasCheckbox) {
        classes.push("sw-segmented-control__action--pressed");
      }

      if (action.isCritical) {
        classes.push("sw-segmented-control__action--critical");
      }

      if (action.disabled) {
        classes.push("sw-segmented-control__action--disabled");
      }

      if (action.minSquare) {
        classes.push("sw-segmented-control__action--min-square");
      }

      return classes;
    };

    const handleClick = (action: SegmentedControlAction, toggleFloatingUi: () => void) => {
      if (action.disabled) {
        return;
      }

      if (action.hasCheckbox) {
        return;
      }

      if (action.popover) {
        toggleFloatingUi();
      }

      if (action.onClick) {
        action.onClick({});
      }
    };

    const handleCheckboxChange = (action: SegmentedControlAction, checkboxValue: boolean) => {
      if (action.disabled) {
        return;
      }

      if (action.onClick) {
        action.onClick({ checkboxValue });
      }
    };

    const segmentedControlClasses = computed((): Record<string, boolean> => {
      return {
        "sw-segmented-control--disabled-context": props.disableContext,
      };
    });

    const flatChildViews = (childViews?: View[]): View[] => {
      if (!childViews) {
        return [];
      }

      return childViews.reduce<View[]>((acc, childView) => {
        if (childView.childViews) {
          return [...acc, childView, ...flatChildViews(childView.childViews)];
        }

        return [...acc, childView];
      }, []);
    };

    return {
      getActionClass,
      handleClick,
      handleCheckboxChange,
      segmentedControlClasses,
      flatChildViews,
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";
@import "../../assets/scss/mixins.scss";

.sw-segmented-control {
  display: flex;
  gap: 2px;
  width: max-content;
  background-color: $color-white;
  border: 1px solid $color-gray-500;
  border-radius: $border-radius-default;
  padding: 2px;

  .sw-floating-ui {
    display: flex;
  }

  .sw-floating-ui__trigger {
    display: flex;
  }

  &__action {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    cursor: pointer;
    border: none;
    border-radius: $border-radius-default;
    padding: 6px 12px;
    background-color: $color-white;
    font-family: inherit;
    font-size: $font-size-extra-small;
    font-weight: $font-weight-semi-bold;
    color: $color-darkgray-900;
    transition: 0.15s all ease;
    justify-content: center;
    text-align: center;

    @include focus-style();

    .sw-field--checkbox {
      margin-bottom: 0;
    }

    &-icon {
      &.sw-icon {
        width: 12px;
        height: 12px;
      }

      &.sw-icon > svg {
        width: 100% !important;
        height: 100% !important;
      }
    }

    &-options-icon.sw-icon {
      margin-top: 1px;
      width: 8px;
      height: 5px;
    }

    .sw-field__checkbox #meteor-icon-kit__regular-checkmark-xxs {
      width: 8px !important;
      height: 6px !important;
    }

    &:hover {
      color: $color-darkgray-900;
      background-color: $color-gray-100;
    }

    &:active {
      background-color: $color-gray-200;
    }

    &--pressed:not(&--critical) {
      color: $color-white;
      background-color: $color-shopware-brand-500;

      &:hover {
        color: $color-white;
        background-color: $color-shopware-brand-700;
      }

      &:active {
        background-color: $color-shopware-brand-900;
      }
    }

    &--critical.sw-segmented-control__action--pressed {
      color: $color-white;
      background-color: $color-crimson-500;

      &:hover {
        color: $color-white;
        background-color: $color-crimson-600;
      }

      &:active {
        color: $color-white;
        background-color: $color-crimson-900;
      }
    }

    &--critical {
      background-color: $color-white;
      color: $color-crimson-500;

      &:hover {
        color: $color-crimson-500;
        background-color: $color-crimson-50;
      }

      &:active {
        color: $color-crimson-500;
        background-color: $color-crimson-100;
      }
    }

    &--disabled {
      color: $color-gray-400;
      cursor: default;
      pointer-events: none;
    }

    &--min-square {
      min-width: 30px;
    }
  }

  &__divider {
    background-color: $color-gray-500;
    width: 1px;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  &--disabled-context {
    padding: 0px;
    gap: 0;

    .sw-floating-ui .sw-segmented-control__action {
      border-radius: 0;
      border-right: 1px solid $color-gray-500;
    }

    .sw-floating-ui:first-child .sw-segmented-control__action {
      border-top-left-radius: $border-radius-default - 1;
      border-bottom-left-radius: $border-radius-default - 1;
      border-left: none;
    }

    .sw-floating-ui:last-child .sw-segmented-control__action {
      border-top-right-radius: $border-radius-default - 1;
      border-bottom-right-radius: $border-radius-default - 1;
      border-right: none;
    }
  }

  .sw-field__label,
  .sw-field__label label {
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
  }

  .sw-field--checkbox__container .sw-field__label {
    margin-left: 8px;
  }
}
</style>
