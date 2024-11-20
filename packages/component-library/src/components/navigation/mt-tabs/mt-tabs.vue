<template>
  <mt-priority-plus :list="items" #default="{ mainItems, moreItems }">
    <ul
      :class="[
        'mt-tabs',
        {
          'mt-tabs--small': small,
          'mt-tabs--vertical': vertical,
          'mt-tabs--future-remove-default-margin': futureFlags.removeDefaultMargin,
        },
      ]"
      ref="tabListRef"
      role="tablist"
    >
      <li
        v-for="item in vertical ? [...mainItems, ...moreItems] : mainItems"
        :key="item.name"
        :data-priority-plus="item.name"
      >
        <button
          :id="`mt-tabs__item--${item.name}`"
          :class="[
            'mt-tabs__item',
            {
              'mt-tabs__item--active': item.name === activeTab?.name,
              'mt-tabs__item--error': item.hasError,
            },
          ]"
          role="tab"
          :disabled="item.disabled"
          @click="() => changeActiveTab(item)"
          :data-text="item.label"
          :aria-selected="item.name === activeTab?.name"
          :aria-invalid="item.hasError"
          :tabindex="item.name === activeTab?.name ? 0 : -1"
          @keydown.arrow-right="focusNextTab"
          @blur="onBlur"
        >
          <span>{{ item.label }}</span>

          <mt-icon
            v-if="item.hasError"
            color="var(--color-text-critical-default)"
            size="0.75rem"
            name="solid-exclamation-circle"
            :style="{ marginInlineStart: '0.5rem' }"
          />

          <mt-color-badge v-if="item.badge" :variant="item.badge" rounded />
        </button>
      </li>

      <li v-if="moreItems.length && !vertical">
        <mt-bare-popover>
          <template #trigger="params">
            <button
              ref="moreTabsButton"
              v-bind="params"
              role="tab"
              :class="[
                'mt-tabs__item',
                {
                  // @ts-expect-error
                  'mt-tabs__item--active': moreItems.some((item) => item.name === activeTab?.name),
                  // @ts-expect-error
                  'mt-tabs__item--error': moreItems.some((item) => item.hasError),
                },
              ]"
              :aria-label="t('moreTabsAriaLabel')"
              :tabindex="moreItems.some((item) => item.name === activeTab?.name) ? 0 : -1"
            >
              <mt-icon
                name="solid-ellipsis-h-s"
                color="var(--color-text-primary-default)"
                style="margin-inline-end: 0.5rem"
              />

              <span>{{ t("moreTabs") }}</span>
            </button>
          </template>

          <template #default="{ closePopover }">
            <mt-bare-popover-item
              v-for="item in moreItems"
              :key="item.name"
              role="tab"
              :aria-selected="item.name === activeTab?.name"
              :style="{
                textDecoration: item.name === activeTab?.name && 'underline',
                fontWeight: item.name === activeTab?.name && 'var(--font-weight-semibold)',
                color: item.hasError
                  ? 'var(--color-text-critical-default)'
                  : item.name === activeTab?.name
                    ? 'var(--color-text-brand-default)'
                    : 'var(--color-text-primary-default)',
              }"
              @click="
                () => {
                  changeActiveTab(item);
                  closePopover();
                }
              "
            >
              <span>{{ item.label }}</span>

              <mt-color-badge v-if="item.badge" :variant="item.badge" rounded />
            </mt-bare-popover-item>
          </template>
        </mt-bare-popover>
      </li>

      <div
        :class="[
          'mt-tabs__slider',
          {
            'mt-tabs__slider--animated': shouldAnimateSlider,
            'mt-tabs__slider--error': activeTab?.hasError,
          },
        ]"
        :style="sliderStyles"
        data-testid="mt-tabs__slider"
      />
    </ul>
  </mt-priority-plus>
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
  type CSSProperties,
} from "vue";
import MtColorBadge from "../../feedback-indicator/mt-color-badge/mt-color-badge.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtPriorityPlus from "../../_internal/mt-priority-plus-navigation.vue";
import MtBarePopoverItem from "@/components/overlay/mt-bare-popover/sub-components/mt-bare-popover-item.vue";
import MtBarePopover from "@/components/overlay/mt-bare-popover/mt-bare-popover.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";
import { useI18n } from "@/composables/useI18n";

export interface TabItem {
  label: string;
  name: string;
  hasError?: boolean;
  disabled?: boolean;
  badge?: "positive" | "critical" | "warning" | "info";
  onClick?: (name: string) => void;
  hidden?: boolean;
}

const emit = defineEmits(["new-item-active"]);

const props = defineProps<{
  items: TabItem[];
  vertical?: boolean;
  small?: boolean;
  defaultItem?: string;
}>();

const { t } = useI18n({
  messages: {
    en: {
      moreTabs: "More",
      moreTabsAriaLabel: "More tabs",
    },
    de: {
      moreTabs: "Mehr",
      moreTabsAriaLabel: "Mehr Tabs",
    },
  },
});

const tabListRef = ref<HTMLElement | null>(null);
const showSlider = ref(false);
const shouldAnimateSlider = ref(false);
const activeTab = ref<TabItem | null>(null);
const sliderStyles = ref<CSSProperties | undefined>(undefined);
const moreTabsButton = ref<HTMLElement | null>(null);

const calculateSliderDimensions = () => {
  if (!tabListRef.value || !activeTab.value || !showSlider.value) return undefined;

  const activeTabDOMElement = tabListRef.value.querySelector(
    `#mt-tabs__item--${activeTab.value.name}`,
  ) as HTMLElement | null;

  if (!activeTabDOMElement) {
    if (!moreTabsButton.value)
      throw new Error(
        "Failed to render mt-tabs; Tab not found, please make sure the tab exists. Searched for tab with id: mt-tabs__item--" +
          activeTab.value.name,
      );

    return {
      width: `${moreTabsButton.value.offsetWidth}px`,
      left: `${moreTabsButton.value.offsetLeft}px`,
    };
  }

  if (props.vertical) {
    return {
      height: `${activeTabDOMElement.offsetHeight}px`,
      top: `${activeTabDOMElement.offsetTop}px`,
    };
  }

  const paddingInlineStart = parseInt(
    window
      .getComputedStyle(activeTabDOMElement)
      .getPropertyValue("padding-inline-start")
      .replace("px", ""),
  );

  const paddingInlineEnd = parseInt(
    window
      .getComputedStyle(activeTabDOMElement)
      .getPropertyValue("padding-inline-end")
      .replace("px", ""),
  );

  const width = parseInt(
    window.getComputedStyle(activeTabDOMElement).getPropertyValue("width").replace("px", ""),
  );

  const sliderWidth = width - paddingInlineStart - paddingInlineEnd + "px";

  return {
    width: sliderWidth,
    left: `${activeTabDOMElement.offsetLeft + paddingInlineStart}px`,
  };
};

watch(
  () => [activeTab.value, props.items],
  async () => {
    await nextTick();
    sliderStyles.value = calculateSliderDimensions();
  },
  { deep: true },
);

onMounted(() => {
  const firstItem = props.items.at(0);
  if (!firstItem) {
    throw new Error(
      "Failed to render mt-tabs; No items provided, please provide at least one item.",
    );
  }

  const defaultItem = props.items.find((item) => item.name === props.defaultItem);
  activeTab.value = defaultItem ?? firstItem;

  document.fonts.ready.then(async () => {
    showSlider.value = true;
    await nextTick();

    sliderStyles.value = calculateSliderDimensions();
  });
});

function changeActiveTab(tab: TabItem) {
  shouldAnimateSlider.value = true;
  activeTab.value = tab;

  emit("new-item-active", tab.name);
}

watch(
  () => props.items,
  () => {
    const newActiveTab = props.items.find((item) => item.name === activeTab.value?.name);
    if (!newActiveTab) return;

    activeTab.value = newActiveTab;
  },
);

function focusNextTab() {
  const indexOfActiveTab = props.items.findIndex((item) => item.name === activeTab.value?.name);
  const nextItem = props.items.at(indexOfActiveTab + 1);

  if (!tabListRef.value || !nextItem || !activeTab.value) return;

  const nextTabDOMElement = tabListRef.value.querySelector<HTMLButtonElement>(
    `#mt-tabs__item--${nextItem.name}`,
  );
  const currentFocusedTab = tabListRef.value.querySelector<HTMLButtonElement>(
    `#mt-tabs__item--${activeTab.value.name}`,
  );

  if (!nextTabDOMElement || !currentFocusedTab) return;

  nextTabDOMElement.setAttribute("tabindex", "0");
  nextTabDOMElement.focus();

  currentFocusedTab.setAttribute("tabindex", "-1");
}

function onBlur(event: FocusEvent) {
  const focusedAnotherTabItem =
    event.relatedTarget instanceof HTMLElement &&
    event.relatedTarget.getAttribute("role") === "tab";

  if (focusedAnotherTabItem || !tabListRef.value || !(event.target instanceof HTMLElement)) return;
  event.target.setAttribute("tabindex", "-1");

  const activeTabDOMElement = tabListRef.value.querySelector<HTMLButtonElement>(
    `#mt-tabs__item--${activeTab.value?.name}`,
  );

  if (!activeTabDOMElement) return;
  activeTabDOMElement.setAttribute("tabindex", "0");
}

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

  & .mt-tabs__item {
    border-bottom: none;
    border-left: 1px solid var(--color-border-primary-default);
  }

  & .mt-tabs__slider {
    width: 2px;
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
