<template>
  <div class="mt-segmented-control" :class="segmentedControlClasses">
    <template v-for="(action, index) in actions">
      <div
        v-if="typeof action === 'string' && !disableContext"
        :key="index"
        class="mt-segmented-control__divider"
      />

      <!-- TOOD: Add is-opened from action value -->
      <mt-popover
        v-if="typeof action !== 'string'"
        :key="action.id"
        :child-views="action.popover && action.popover.childViews"
        :title="action.popover && action.popover.title"
      >
        <template #trigger="{ toggleFloatingUi }">
          <button
            type="button"
            class="mt-segmented-control__action"
            :class="getActionClass(action)"
            :aria-pressed="action.isPressed"
            @click="() => handleClick(action, toggleFloatingUi)"
            :disabled="action.disabled"
          >
            <mt-icon
              v-if="action.iconName"
              :name="action.iconName"
              class="mt-segmented-control__action-icon"
            />

            <template v-if="action.hasCheckbox">
              <mt-checkbox
                :checked="action.checked"
                :label="action.label"
                @change="(event) => handleCheckboxChange(action, event)"
              />
            </template>

            <template v-else>
              <slot :name="'label__' + action.id" />

              {{ action.label }}
            </template>

            <mt-icon
              v-if="action.options"
              class="mt-segmented-control__action-options-icon"
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
      </mt-popover>
    </template>
  </div>
</template>

<script lang="ts">
import MtCheckbox from "../../form/mt-checkbox/mt-checkbox.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtPopover from "../../overlay/mt-popover/mt-popover.vue";
import type { View } from "../../overlay/mt-popover/mt-popover.interfaces";
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
    "mt-checkbox": MtCheckbox,
    "mt-icon": MtIcon,
    "mt-popover": MtPopover,
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
      const classes = [`mt-segmented-control__action-id-${action.id}`];

      if (action.isPressed && !action.hasCheckbox) {
        classes.push("mt-segmented-control__action--pressed");
      }

      if (action.isCritical) {
        classes.push("mt-segmented-control__action--critical");
      }

      if (action.disabled) {
        classes.push("mt-segmented-control__action--disabled");
      }

      if (action.minSquare) {
        classes.push("mt-segmented-control__action--min-square");
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
        "mt-segmented-control--disabled-context": props.disableContext,
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

<style>
.mt-segmented-control {
  display: flex;
  gap: var(--scale-size-2);
  width: max-content;
  background-color: var(--color-elevation-surface-overlay);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-button);
  padding: var(--scale-size-2);

  & .mt-floating-ui {
    display: flex;
  }

  & .mt-floating-ui__trigger {
    display: flex;
  }

  & .mt-field__label,
  & .mt-field__label label {
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
  }

  & .mt-field--checkbox__container .mt-field__label {
    margin-left: var(--scale-size-8);
  }
}

.mt-segmented-control__action {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  position: relative;
  cursor: pointer;
  border: none;
  border-radius: var(--border-radius-button);
  padding: var(--scale-size-6) var(--scale-size-12);
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  transition:
    0.15s background ease,
    0.15s color ease;
  justify-content: center;
  text-align: center;

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    box-shadow: 0px 0px 4px 0px rgba(24, 158, 255, 0.3);
  }

  &:hover,
  &:focus-visible {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:active {
    background-color: var(--color-interaction-secondary-dark);
  }

  & .mt-field--checkbox {
    margin-bottom: 0;
  }

  & .mt-field__checkbox #meteor-icon-kit__regular-checkmark-xxs {
    width: var(--scale-size-8) !important;
    height: var(--scale-size-6) !important;
  }
}

.mt-segmented-control__action-icon.mt-icon {
  width: var(--scale-size-12);
  height: var(--scale-size-12);

  & > svg {
    width: 100% !important;
    height: 100% !important;
  }
}

.mt-segmented-control__action-options-icon.mt-icon {
  margin-top: 1px;
  width: var(--scale-size-8);
  height: 5px;
}

.mt-segmented-control__action--pressed:not(.mt-segmented-control__action--critical) {
  color: var(--color-text-static-default);
  background-color: var(--color-interaction-primary-default);

  &:hover,
  &:focus-visible {
    background-color: var(--color-interaction-primary-hover);
  }

  &:active {
    background-color: var(--color-interaction-primary-pressed);
  }
}

.mt-segmented-control__action--critical {
  color: var(--color-text-critical-default);

  &:hover,
  &:focus-visible {
    background-color: var(--color-background-critical-dark);
  }

  &:active {
    color: var(--color-text-static-default);
    background-color: var(--color-interaction-critical-pressed);
  }
}

.mt-segmented-control__action--critical.mt-segmented-control__action--pressed {
  color: var(--color-text-static-default);
  background-color: var(--color-interaction-critical-default);

  &:hover,
  &:focus-visible {
    background-color: var(--color-interaction-critical-hover);
  }

  &:active {
    background-color: var(--color-interaction-critical-pressed);
  }
}

.mt-segmented-control__action--disabled {
  color: var(--color-text-primary-disabled);
  cursor: default;
  pointer-events: none;
}

.mt-segmented-control__action--min-square {
  min-width: 30px;
}

.mt-segmented-control__divider {
  background-color: var(--color-border-primary-default);
  width: 1px;
  margin-top: var(--scale-size-4);
  margin-bottom: var(--scale-size-4);
}

.mt-segmented-control--disabled-context {
  padding: 0px;
  gap: 0;

  & .mt-floating-ui .mt-segmented-control__action {
    border-radius: var(--border-radius-none);
    border-right: 1px solid var(--color-border-primary-default);
  }

  & .mt-floating-ui:first-child .mt-segmented-control__action {
    border-top-left-radius: calc(var(--border-radius-xs) - 1px);
    border-bottom-left-radius: calc(var(--border-radius-xs) - 1px);
    border-left: none;
  }

  & .mt-floating-ui:last-child .mt-segmented-control__action {
    border-top-right-radius: calc(var(--border-radius-xs) - 1px);
    border-bottom-right-radius: calc(var(--border-radius-xs) - 1px);
    border-right: none;
  }
}
</style>
