<template>
  <div
    class="sw-popover-item-result"
  >
    <sw-search
      v-if="!hideSearch"
      size="small"
      @input="$emit('search', $event)"
    />

    <template
      v-for="group in [undefined, ...groups]"
    >
      <transition
        :key="'transition-group-' + (group && group.id)"
        name="option-fade"
      >
        <div
          v-if="group && (getOptionsForGroup(group.id).length > 0)"
          :key="group.id"
          class="sw-popover-item-result__group-header"
          :aria-label="group.label"
        >
          <span class="sw-popover-item-result__group-label">{{ group.label }}</span>

          <button
            v-if="group.actionLabel"
            class="sw-popover-item-result__group-action"
            @click="() => $emit('click-group-action', group.id)"
          >
            {{ group.actionLabel }}
          </button>
        </div>
      </transition>

      <sw-smooth-reflow :key="'smooth-reflow-' + (group && group.id)">
        <transition-group
          name="option-item"
          tag="div"
        >
          <div
            v-for="option in getOptionsForGroup(group && group.id)"
            :key="option.id"
            class="sw-popover-item-result__option"
            :aria-label="((group && group.label) ? group.label : 'No group') + ': ' + option.label"
          >
            <div
              v-if="isOptionDraggable(option)"
              v-droppable="{ ...dropConfig, data: { ...option, dropZone: 'before' } }"
              class="sw-popover-item-result__option_drop_before"
            />

            <sw-popover-item  
              v-draggable="{ ...getDragConfigForOption(option), data: option }"
              class="sw-popover-item-result__option_item"
              :is-option-item="isOptionDraggable(option)"
              :label="option.label"
              :show-checkbox="selectable"
              :checkbox-checked="option.isSelected"
              :contextual-detail="option.contextualDetail"
              :meta-copy="option.metaCopy"
              :show-visibility="hidable && option.isHidable"
              :visible="option.isVisible"
              :icon="getIconForOption(option)"
              :on-label-click="option.isClickable ? () => $emit('click-option', option.id) : undefined"
              :disabled="option.disabled"
              @change-checkbox="$emit('change-checkbox', option.id, $event)"
              @change-visibility="$emit('change-visibility', option.id, $event)"
            />

            <div
              v-if="isOptionDraggable(option)"
              v-droppable="{ ...dropConfig, data: { ...option, dropZone: 'after' } }"
              class="sw-popover-item-result__option_drop_after"
            />
          </div>
        </transition-group>
      </sw-smooth-reflow>
    </template>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import SwSearch from '../../navigation/sw-search/sw-search.vue';
import SwPopoverItem from '../sw-popover-item/sw-popover-item.vue';
import SwSmoothReflow from '../../_internal/sw-smooth-reflow.vue'
import type { DropConfig, DragConfig} from '../../../directives/dragdrop.directive';
import { draggable, droppable } from '../../../directives/dragdrop.directive';

export interface Option {
  id: string;
  label: string;
  metaCopy?: string;
  contextualDetail?: string;
  parentGroup?: string;
  position?: number;
  isVisible?: boolean;
  isSelected?: boolean;
  isClickable?: boolean;
  isHidable?: boolean;
  isSortable?: boolean;
  disabled?: boolean;
}

export interface Group {
  id: string;
  label: string;
  actionLabel?: string;
}

export default defineComponent({
  name: 'SwPopoverItemResult',
  directives: {
    draggable: draggable,
    droppable: droppable,
  },
  components: {
    'sw-search': SwSearch,
    'sw-popover-item': SwPopoverItem,
    'sw-smooth-reflow': SwSmoothReflow,
  },
  props: {
    options: {
      type: Array as PropType<Option[]>,
      required: true
    },
    groups: {
      type: Array as PropType<Group[]>,
      required: false,
      default: () => []
    },
    hideSearch: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    hidable: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'change-checkbox',
    'change-visibility',
    'click-group-action',
    'click-option',
    'change-order',
    'search',
  ],
  setup(props, { emit }) {
    const dropConfig: Partial<DropConfig & {dropZone?: 'before'|'after'}> = {};

    const dragConfig: Partial<DragConfig<Option & {dropZone?: 'before'|'after'}>> = {
      disabled: !props.draggable,
      delay: 200,
      onDragStart: () => {
        document.body.classList.add('is-popover-item-result-dragging');
      },
      onDrop: (dragConfigData, dropConfigData) => {
        document.body.classList.remove('is-popover-item-result-dragging');

        emit('change-order', {
          itemId: dragConfigData?.id,
          dropZone: dropConfigData?.dropZone,
          dropId: dropConfigData?.id,
        });
      }
    };

    const isOptionDraggable = (option: Option) => {
      return props.draggable && option.isSortable;
    };

    const getDragConfigForOption = (option: Option) => {
      return {
        ...dragConfig,
        disabled: !isOptionDraggable(option),
      };
    };

    const getOptionsForGroup = (groupId: string|undefined) => {
      return props.options.filter((option) => option.parentGroup === groupId);
    };

    const getIconForOption = (option: Option) => {
      if (isOptionDraggable(option)) {
        return 'solid-grip-vertical-s';
      }

      if (props.draggable) {
        return 'solid-thumbtack';
      }

      return undefined;
    };

    return {
      getOptionsForGroup,
      getDragConfigForOption,
      isOptionDraggable,
      getIconForOption,
      dropConfig,
      dragConfig,
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
$font-family-default: "Inter", -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI",
  Roboto, "Helvetica Neue", sans-serif;
$font-family-variables: "Inter var", -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI",
  Roboto, "Helvetica Neue", sans-serif;
$font-family-default-feature-settings: "ss01" on, "ss02" on, "case" on, "cpsp" on, "zero" on,
  "cv09" on, "cv07" on, "cv06" on, "cv10" on, "cv11" on;

$font-weight-medium: 500;

$line-height-auto: auto;
$line-height-xs: 18px;
$line-height-sm: 20px;
$line-height-md: 24px;
$line-height-lg: 28px;

$color-custom-dark: #0F172A;
$color-custom-grey: #64748B;
$color-custom-lightgrey: #CBD5E1;
$color-custom-border: #E5E7EB;

$scrollShadowSize: 16px;
$scrollShadowColor: rgba(120, 120, 120, 0.2);

.sw-popover-item-result {
  &__group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    margin-top: 8px;
  }

  &__group-label {
    color: $color-gray-900;
    text-transform: uppercase;
    font-size: $font-size-xxs;
    line-height: $line-height-md;
    font-weight: $font-weight-medium;
  }

  &__group-action {
    transition: 0.3s all ease;
    background-color: transparent;
    border: none;
    color: $color-shopware-brand-500;
    font-size: $font-size-xs;
    line-height: $line-height-xs;
    font-weight: $font-weight-semi-bold;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: $color-shopware-brand-800;
    }

    &:active {
      color: $color-shopware-brand-900;
    }
  }

  &__option {
    position: relative;
  }

  [class^="sw-popover-item-result__option_drop_"] {
    position: absolute;
    height: 50%;
    width: 100%;
    left: 0;
    opacity: 0;
    pointer-events: none;
    transition: 0.15s all ease;

    &.is--valid-drop {
      opacity: 1;
    }
  }

  $dropzone-highlight-width: 4px;
  $dropzone-highlight-negative-width: -4px;

  &__option_drop_before {
    top: 0;
    box-shadow: inset 0px $dropzone-highlight-width $dropzone-highlight-width $dropzone-highlight-negative-width $color-shopware-brand-900;
  }

  &__option_drop_after {
    bottom: 0;
    box-shadow: inset 0px $dropzone-highlight-negative-width $dropzone-highlight-width $dropzone-highlight-negative-width $color-shopware-brand-900;
  }

  .sw-popover-item {
    transition: 0.3s all ease;
    padding-top: 4px;
    padding-bottom: 4px;

    &.is--dragging {
      opacity: 0.25;
      border: none;
      background-color: inherit;
    }

    &.is--dragging > * {
      opacity: 1;
    }
  }

  .option-item-enter-active, .option-item-leave-active {
    transition: opacity 0.5s;
  }

  .option-item-leave-active {
    transition: opacity 0.2s;
    position: absolute;
    opacity: 0;
  }

  .option-item-enter {
    opacity: 0;
  }

  .option-item-move {
    transition: transform 0.3s ease;
  }

  .option-fade-enter-active, .option-fade-leave-active {
    transition: opacity .3s;
  }
  .option-fade-enter, .option-fade-leave-to {
    opacity: 0;
  }
}

body.is-popover-item-result-dragging {
  [class^="sw-popover-item-result__option_drop_"] {
    pointer-events: all;
  }

  .sw-popover-item {
    &.is--drag-element {
      box-shadow: none;
      transition: 0.3s rotate ease-in-out;
    }
  }
}
</style>
