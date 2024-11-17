<template>
  <ul
    :class="[
      'mt-tabs',
      {
        'mt-tabs--small': small,
        'mt-tabs--future-remove-default-margin': futureFlags.removeDefaultMargin,
      },
    ]"
    ref="tabListRef"
    role="tablist"
  >
    <li v-for="item in items" :key="item.name">
      <button
        :id="`mt-tabs__item--${item.name}`"
        :class="[
          'mt-tabs__item',
          {
            'mt-tabs__item--active': item.name === nameOfActiveTab,
            'mt-tabs__item--error': item.hasError,
          },
        ]"
        role="tab"
        :disabled="item.disabled"
        @click="() => changeActiveTab(item.name)"
        :data-text="item.label"
        :aria-selected="item.name === nameOfActiveTab"
        :aria-invalid="item.hasError"
      >
        <span>{{ item.label }}</span>

        <mt-icon
          v-if="item.hasError"
          color="var(--color-text-critical-default)"
          size="0.75rem"
          name="solid-exclamation-circle"
          :style="{ marginInlineStart: '0.25rem' }"
        />
      </button>
    </li>

    <div
      :class="['mt-tabs__slider', { 'mt-tabs__slider--animated': shouldAnimateSlider }]"
      :style="sliderStyles"
    />
  </ul>
</template>

<script setup lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted,
  watch,
  onBeforeUpdate,
  onUpdated,
  nextTick,
} from "vue";
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

const tabListRef = ref<HTMLElement | null>(null);

const showSlider = ref(false);

onMounted(() => {
  document.fonts.ready.then(() => {
    showSlider.value = true;
  });
});

const sliderStyles = computed(() => {
  if (!tabListRef.value || nameOfActiveTab.value === "unknown" || !showSlider.value)
    return undefined;

  const activeTab = tabListRef.value.querySelector(
    `#mt-tabs__item--${nameOfActiveTab.value}`,
  ) as HTMLElement | null;

  if (!activeTab)
    throw new Error(
      "Failed to render mt-tabs; Tab not found, please make sure the tab exists. Searched for tab with id: mt-tabs__item--" +
        nameOfActiveTab.value,
    );

  const paddingInlineStart = parseInt(
    window.getComputedStyle(activeTab).getPropertyValue("padding-inline-start").replace("px", ""),
  );

  const paddingInlineEnd = parseInt(
    window.getComputedStyle(activeTab).getPropertyValue("padding-inline-end").replace("px", ""),
  );

  const width = parseInt(
    window.getComputedStyle(activeTab).getPropertyValue("width").replace("px", ""),
  );

  const sliderWidth = width - paddingInlineStart - paddingInlineEnd + "px";

  return {
    width: sliderWidth,
    left: `${activeTab.offsetLeft + paddingInlineStart}px`,
  };
});

const shouldAnimateSlider = ref(false);

function changeActiveTab(tabName: string) {
  shouldAnimateSlider.value = true;
  nameOfActiveTab.value = tabName;
  emit("new-item-active", tabName);
}

const nameOfActiveTab = ref("unknown");
onMounted(() => {
  const firstItem = props.items.at(0);
  if (!firstItem)
    throw new Error(
      "Failed to render mt-tabs; No items provided, please provide at least one item.",
    );

  nameOfActiveTab.value = props.defaultItem ?? firstItem.name;
});

const futureFlags = useFutureFlags();
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
}

.mt-tabs__slider--animated {
  transition: 0.25s all cubic-bezier(0.77, 0, 0.175, 1);
}

.mt-tabs__slider--error {
  background-color: var(--color-border-critical-default);
}
</style>
