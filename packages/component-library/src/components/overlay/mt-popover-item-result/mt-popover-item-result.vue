<template>
  <div class="mt-popover-item-result">
    <mt-search v-if="!hideSearch" size="small" @update:modelValue="$emit('search', $event)" />

    <template
      v-for="group in [undefined, ...groups]"
      :key="'transition-group-' + (group && group.id)"
    >
      <transition name="option-fade">
        <div
          v-if="group && getOptionsForGroup(group.id).length > 0"
          :key="group.id"
          class="mt-popover-item-result__group-header"
          :aria-label="group.label"
        >
          <mt-text
            as="span"
            size="xs"
            color="color-text-secondary-default"
            class="mt-popover-item-result__group-label"
          >
            {{ group.label }}
          </mt-text>

          <button
            v-if="group.actionLabel"
            type="button"
            class="mt-popover-item-result__group-action"
            @click="() => $emit('click-group-action', group.id)"
          >
            {{ group.actionLabel }}
          </button>
        </div>
      </transition>

      <mt-smooth-reflow>
        <transition-group name="option-item" tag="div">
          <div
            v-for="option in getOptionsForGroup(group && group.id)"
            :key="option.id"
            class="mt-popover-item-result__option"
            :aria-label="(group && group.label ? group.label : 'No group') + ': ' + option.label"
          >
            <div
              v-if="isOptionDraggable(option)"
              v-droppable="{ ...dropConfig, data: { ...option, dropZone: 'before' } }"
              class="mt-popover-item-result__option_drop_before"
            />

            <mt-popover-item
              v-draggable="{ ...getDragConfigForOption(option), data: option }"
              class="mt-popover-item-result__option_item"
              :is-option-item="isOptionDraggable(option)"
              :label="option.label"
              :show-checkbox="selectable"
              :checkbox-checked="option.isSelected"
              :contextual-detail="option.contextualDetail"
              :meta-copy="option.metaCopy"
              :show-visibility="hidable && option.isHidable"
              :visible="option.isVisible"
              :icon="getIconForOption(option)"
              :on-label-click="
                option.isClickable ? () => $emit('click-option', option.id) : undefined
              "
              :disabled="option.disabled"
              @change-checkbox="$emit('change-checkbox', option.id, $event)"
              @change-visibility="$emit('change-visibility', option.id, $event)"
            />

            <div
              v-if="isOptionDraggable(option)"
              v-droppable="{ ...dropConfig, data: { ...option, dropZone: 'after' } }"
              class="mt-popover-item-result__option_drop_after"
            />
          </div>
        </transition-group>
      </mt-smooth-reflow>
    </template>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import MtSearch from "../../navigation/mt-search/mt-search.vue";
import MtPopoverItem from "../mt-popover-item/mt-popover-item.vue";
import MtSmoothReflow from "../../_internal/mt-smooth-reflow.vue";
import type { DropConfig, DragConfig } from "../../../directives/dragdrop.directive";
import { draggable, droppable } from "../../../directives/dragdrop.directive";
import MtText from "@/components/content/mt-text/mt-text.vue";

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
  name: "MtPopoverItemResult",
  directives: {
    draggable: draggable,
    droppable: droppable,
  },
  components: {
    "mt-search": MtSearch,
    "mt-popover-item": MtPopoverItem,
    "mt-smooth-reflow": MtSmoothReflow,
    "mt-text": MtText,
  },
  props: {
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
    groups: {
      type: Array as PropType<Group[]>,
      required: false,
      default: () => [],
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
    "change-checkbox",
    "change-visibility",
    "click-group-action",
    "click-option",
    "change-order",
    "search",
  ],
  setup(props, { emit }) {
    const dropConfig: Partial<DropConfig & { dropZone?: "before" | "after" }> = {};

    const dragConfig: Partial<DragConfig<Option & { dropZone?: "before" | "after" }>> = {
      disabled: !props.draggable,
      delay: 200,
      onDragStart: () => {
        document.body.classList.add("is-popover-item-result-dragging");
      },
      onDrop: (dragConfigData, dropConfigData) => {
        document.body.classList.remove("is-popover-item-result-dragging");

        emit("change-order", {
          itemId: dragConfigData?.id,
          dropZone: dropConfigData?.dropZone,
          dropId: dropConfigData?.id,
        });
      },
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

    const getOptionsForGroup = (groupId: string | undefined) => {
      return props.options.filter((option) => option.parentGroup === groupId);
    };

    const getIconForOption = (option: Option) => {
      if (isOptionDraggable(option)) {
        return "solid-grip-vertical-s";
      }

      if (props.draggable) {
        return "solid-thumbtack";
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

<style>
.mt-popover-item-result__group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: var(--scale-size-4);
  margin-block-start: var(--scale-size-8);
}

.mt-popover-item-result__group-label {
  text-transform: uppercase;
}

.mt-popover-item-result__group-action {
  transition: 0.3s all ease;
  background-color: transparent;
  border: none;
  color: var(--color-text-brand-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-semibold);
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: var(--color-text-brand-hover);
  }

  &:active {
    color: var(--color-text-brand-pressed);
  }
}

.mt-popover-item-result__option {
  position: relative;
}

.mt-popover-item-result [class^="mt-popover-item-result__option_drop_"] {
  position: absolute;
  height: 50%;
  width: 100%;
  inset-inline-start: 0;
  opacity: 0;
  pointer-events: none;
  transition: 0.15s all ease;

  &.is--valid-drop {
    opacity: 1;
  }
}

.mt-popover-item-result__option_drop_before {
  inset-block-start: 0;
  box-shadow: inset 0px 4px 4px -4px var(--color-border-brand-selected);
}

.mt-popover-item-result__option_drop_after {
  inset-block-end: 0;
  box-shadow: inset 0px -4px 4px -4px var(--color-border-brand-selected);
}

.mt-popover-item-result .mt-popover-item {
  transition: 0.3s all ease;
  padding-block: var(--scale-size-4);

  &.is--dragging {
    opacity: 0.25;
    border: none;
    background-color: inherit;
  }

  &.is--dragging > * {
    opacity: 1;
  }
}

.mt-popover-item-result .option-item-enter-active,
.mt-popover-item-result .option-item-leave-active {
  transition: opacity 0.5s;
}

.mt-popover-item-result .option-item-leave-active {
  transition: opacity 0.2s;
  position: absolute;
  opacity: 0;
}

.mt-popover-item-result .option-item-enter {
  opacity: 0;
}

.mt-popover-item-result .option-item-move {
  transition: transform 0.3s ease;
}

.mt-popover-item-result .option-fade-enter-active,
.mt-popover-item-result .option-fade-leave-active {
  transition: opacity 0.3s;
}

.mt-popover-item-result .option-fade-enter,
.mt-popover-item-result .option-fade-leave-to {
  opacity: 0;
}

body.is-popover-item-result-dragging [class^="mt-popover-item-result__option_drop_"] {
  pointer-events: all;
}

body.is-popover-item-result-dragging .mt-popover-item.is--drag-element {
  box-shadow: none;
  transition: 0.3s rotate ease-in-out;
}
</style>
