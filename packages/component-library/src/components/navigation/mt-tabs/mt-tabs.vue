<template>
  <ul class="mt-tabs">
    <li v-for="item in items" :key="item.name">
      <button
        :class="[
          'mt-tabs__item',
          {
            'mt-tabs__item--active': item.name === nameOfActiveItem,
          },
        ]"
        role="tab"
        @click="() => changeActiveTab(item.name)"
        :data-text="item.label"
        :aria-selected="item.name === nameOfActiveItem"
      >
        {{ item.label }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import MtColorBadge from "../../feedback-indicator/mt-color-badge/mt-color-badge.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import PriorityPlus from "../../_internal/mt-priority-plus-navigation.vue";

// TODO: add default bottom margin
import { useFutureFlags } from "@/composables/useFutureFlags";

export interface TabItem {
  label: string;
  name: string;
  hasError?: boolean;
  disabled?: boolean;
  badge?: "positive" | "critical" | "warning" | "info";
  onClick?: (name: string) => void;
  // @internal - will be added by priority plus menu component
  hidden?: boolean;
}

// TODO: IMO it makes more sense to use v-model for the component
const emit = defineEmits(["new-item-active"]);

const props = defineProps<{
  items: TabItem[];
  vertical?: boolean;
  small?: boolean;
  defaultItem?: string;
}>();

function changeActiveTab(tabName: string) {
  nameOfActiveItem.value = tabName;
  emit("new-item-active", tabName);
}

const nameOfActiveItem = ref("unknown");
onMounted(() => {
  const firstItem = props.items.at(0);
  if (!firstItem)
    throw new Error(
      "Failed to render mt-tabs; No items provided, please provide at least one item.",
    );

  nameOfActiveItem.value = props.defaultItem ?? firstItem.name;
});
</script>

<style scoped>
.mt-tabs {
  display: flex;
  position: relative;
  box-shadow: inset 0 -1px 0 var(--color-border-primary-default);
  list-style: none;
}

.mt-tabs--small {
  max-width: 800px;
  margin: 0 auto 15px auto;
}

.mt-tabs--future-remove-default-margin {
  margin-block-end: 0;
}

.mt-tabs--vertical {
  flex-direction: column;
  box-shadow: none;

  & li {
    border-bottom: none;
    border-left: 1px solid var(--color-border-primary-default);
  }

  & .mt-tabs__slider {
    top: 0;
    bottom: auto;
    left: 3px;
  }
}

.mt-tabs__item {
  display: inline-block;
  border-bottom: 1px solid var(--color-border-primary-default);
  padding: 10px 16px;
  white-space: nowrap;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  cursor: pointer;
  color: var(--color-text-primary-default);

  &:disabled {
    cursor: not-allowed;
    color: var(--color-text-primary-disabled);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 2px;
    border-radius: var(--border-radius-xs);
  }

  /* Trick to stop items from jumping when the active item changes
   * see: https://css-tricks.com/bold-on-hover-without-the-layout-shift/
   */
  &::after {
    content: attr(data-text);
    content: attr(data-text) / "";
    height: 0;
    display: block;
    visibility: hidden;
    overflow: hidden;
    user-select: none;
    pointer-events: none;
    font-weight: var(--font-weight-medium);

    @media speech {
      display: none;
    }
  }
}

.mt-tabs__item--error {
  color: var(--color-text-critical-default);
}

.mt-tabs__item--active {
  font-weight: var(--font-weight-medium);
}

.mt-tabs__slider {
  transform-origin: top left;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: var(--color-border-brand-selected);
  z-index: 1;
  transition: 0.2s all ease-in-out;
}

.mt-tabs__slider--error {
  background-color: var(--color-border-critical-default);
}

.mt-tabs__error-badge {
  margin-left: 2px;
  width: 12px;
  height: 12px;
  color: var(--color-icon-critical-default);

  > svg {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
