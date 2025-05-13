<template>
  <priority-plus ref="priorityPlus" #default="{ mainItems, moreItems }" :list="items">
    <div :class="tabClasses" role="tablist">
      <span class="mt-tabs__slider" :class="sliderClasses" :style="sliderStyle" />

      <template v-if="!vertical">
        <button
          v-for="item in mainItems"
          type="button"
          :key="item.name"
          :data-priority-plus="item.name"
          ref="items"
          class="mt-tabs__item"
          :data-text="item.label"
          :class="getItemClasses(item)"
          :data-item-name="item.name"
          role="tab"
          :aria-selected="item.name === activeItemName"
          :disabled="item.disabled"
          @click="handleClick(item.name)"
          @keyup.enter="handleClick(item.name)"
        >
          {{ item.label }}

          <mt-icon
            v-if="item.hasError"
            class="mt-tabs__error-badge"
            name="solid-exclamation-circle"
            size="var(--scale-size-12)"
            color="var(--color-icon-critical-default)"
          />

          <mt-color-badge v-if="item.badge" :variant="item.badge" rounded />
        </button>

        <!-- @vue-skip -->
        <mt-context-button
          v-if="moreItems.length"
          ref="more-items-button"
          :has-error="moreItems.some((i) => i.hasError)"
        >
          <template #button-text>
            <!-- Add translation  -->
            More
          </template>

          <template #default="{ toggleFloatingUi }">
            <mt-context-menu-item
              v-for="moreItem in moreItems"
              :key="moreItem.name"
              :type="getContextMenuItemVariant(moreItem)"
              role="tab"
              :aria-selected="moreItem.name === activeItemName"
              :label="moreItem.label"
              @click="
                handleClick(moreItem.name);
                toggleFloatingUi();
              "
              @keyup.enter="handleClick(moreItem.name)"
            />
          </template>
        </mt-context-button>
      </template>

      <template v-if="vertical">
        <li
          v-for="item in [...mainItems, ...moreItems]"
          :key="item.name"
          ref="items"
          class="mt-tabs__item"
          :class="getItemClasses(item)"
          :data-item-name="item.name"
          @click="handleClick(item.name)"
        >
          {{ item.label }}
        </li>
      </template>
    </div>
  </priority-plus>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent, computed } from "vue";
import MtContextButton from "../../context-menu/mt-context-button/mt-context-button.vue";
import MtContextMenuItem from "../../context-menu/mt-context-menu-item/mt-context-menu-item.vue";
import MtColorBadge from "../../feedback-indicator/mt-color-badge/mt-color-badge.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import PriorityPlus from "../../_internal/mt-priority-plus-navigation.vue";
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

export default defineComponent({
  name: "MtTabs",

  components: {
    "mt-context-button": MtContextButton,
    "mt-context-menu-item": MtContextMenuItem,
    "priority-plus": PriorityPlus,
    "mt-color-badge": MtColorBadge,
    "mt-icon": MtIcon,
  },

  emits: ["new-item-active"],

  props: {
    items: {
      type: Array as PropType<TabItem[]>,
      required: true,
    },

    vertical: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * @deprecated v4.0.0 - Set max-width through parent container element
     */
    small: {
      type: Boolean,
      required: false,
      default: false,
    },

    defaultItem: {
      type: String,
      required: false,
      default: "",
    },
  },

  data() {
    return {
      // refreshKey is for recalculating specific computed properties
      refreshKey: true,
      activeItemName: "",
      showMoreItems: false,
      passedFirstRender: false,
    };
  },

  computed: {
    activeDomItem(): any | undefined {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.refreshKey;

      // Access "this.activeItemName" before to react dynamically on changes
      const activeItemName = this.activeItemName;

      const domItems = this.$refs.items ? (this.$refs.items as any[]) : [];

      const activeDomItem = domItems.find((item) => {
        return item.getAttribute("data-item-name") === activeItemName;
      });

      return activeDomItem;
    },

    sliderPosition(): number {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.refreshKey;

      if (!this.activeItem) {
        return 0;
      }

      // Handle the case when the active item is hidden
      if (!this.activeDomItem && this.$refs["more-items-button"]) {
        return (this.$refs["more-items-button"] as any).$el?.offsetLeft;
      }

      const leftPaddingOfActiveDomItem = parseFloat(
        getComputedStyle(this.activeDomItem).paddingLeft,
      );

      return this.vertical
        ? this.activeDomItem.offsetTop
        : this.activeDomItem.offsetLeft + leftPaddingOfActiveDomItem;
    },

    sliderLength(): number {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.refreshKey;

      if (!this.activeItem) {
        return 0;
      }

      // Handle the case when the active item is hidden
      if (!this.activeDomItem && this.$refs["more-items-button"]) {
        return (this.$refs["more-items-button"] as any).$el?.offsetWidth;
      }

      if (this.activeItem?.hidden && this.$refs["more-items-button"]) {
        return (this.$refs["more-items-button"] as any).$el?.offsetWidth;
      }

      const stylesOfActiveDomItem = getComputedStyle(this.activeDomItem);
      const widthWithoutPadding =
        this.activeDomItem.clientWidth -
        parseFloat(stylesOfActiveDomItem.paddingLeft) -
        parseFloat(stylesOfActiveDomItem.paddingRight);

      return this.vertical ? this.activeDomItem.offsetHeight : widthWithoutPadding;
    },

    activeItem(): TabItem | undefined {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.refreshKey;

      return this.items.find((item) => {
        return item.name === this.activeItemName;
      });
    },

    sliderClasses(): Record<string, boolean> {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.refreshKey;

      return {
        "mt-tabs__slider--error": this.activeItem?.hasError ?? false,
        "mt-tabs__slider--animated": this.passedFirstRender,
      };
    },

    sliderStyle(): string {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.refreshKey;

      if (this.vertical) {
        return `
          transform: translate(0, ${this.sliderPosition}px) rotate(90deg);
          width: ${this.sliderLength}px;
      `;
      }

      return `
        transform: translate(${this.sliderPosition}px, 0) rotate(0deg);
        width: ${this.sliderLength}px;
    `;
    },
  },

  setup(props) {
    const futureFlags = useFutureFlags();

    const tabClasses = computed(() => {
      return [
        "mt-tabs",
        {
          "mt-tabs--vertical": props.vertical,
          "mt-tabs--small": props.small,
          "mt-tabs--future-remove-default-margin": futureFlags.removeDefaultMargin,
        },
      ];
    });

    return {
      tabClasses,
    };
  },

  watch: {
    items: "handleResize",
    vertical: "handleResize",
    small: "handleResize",
  },

  mounted() {
    this.setActiveItem(this.defaultItem);

    this.$nextTick(() => {
      this.handleResize();

      this.passedFirstRender = true;
    });

    // @ts-expect-error $device helper is not registered in TS yet
    this.$device.onResize({
      listener() {
        this.handleResize();
      },
      component: this,
      scope: this,
    });
  },

  beforeUnmount() {
    // @ts-expect-error $device helper is not registered in TS yet
    this.$device.removeResizeListener(this);
  },

  methods: {
    handleClick(itemName: string): void {
      this.setActiveItem(itemName);
      this.$emit("new-item-active", itemName);

      const matchingItem = this.items.find((item) => item.name === itemName);

      if (!matchingItem?.onClick) {
        return;
      }

      matchingItem.onClick(itemName);
    },

    getItemClasses(item: TabItem) {
      return {
        "mt-tabs__item--error": item.hasError,
        "mt-tabs__item--active": item.name === this.activeItemName,
      };
    },

    getContextMenuItemVariant(item: TabItem): string {
      if (item.hasError) {
        return "critical";
      }

      if (item.name === this.activeItemName) {
        return "active";
      }

      if (item.badge === "critical") {
        return "critical";
      }

      return "default";
    },

    setActiveItem(itemName: string): void {
      this.activeItemName = `${itemName}`;
      this.refreshKey = !this.refreshKey;
    },

    handleResize() {
      if (this.$refs.priorityPlus) {
        this.refreshKey = !this.refreshKey;

        (this.$refs.priorityPlus as any).handleResize().then(() => {
          this.refreshKey = !this.refreshKey;
        });
      }
    },

    toggleMoreTabItems() {
      this.showMoreItems = !this.showMoreItems;
    },
  },
});
</script>

<style scoped>
.mt-tabs {
  display: flex;
  position: relative;
  box-shadow: inset 0 -1px 0 var(--color-border-primary-default);
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
  padding: var(--scale-size-10) var(--scale-size-16);
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
  height: var(--scale-size-2);
  background-color: var(--color-border-brand-selected);
  z-index: 1;
}

.mt-tabs__slider--error {
  background-color: var(--color-border-critical-default);
}

.mt-tabs__slider--animated {
  transition: 0.2s all ease-in-out;
}

.mt-context-button {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-border-primary-default);

  & button {
    display: flex;
    align-items: center;
    gap: var(--scale-size-4);
    font-size: var(--font-size-s);
    line-height: var(--font-line-height-s);
    font-family: var(--font-family-body);
  }
}

.mt-tabs__error-badge {
  margin-left: var(--scale-size-2);
}
</style>
