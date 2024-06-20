<template>
  <priority-plus ref="priorityPlus" #default="{ mainItems, moreItems }" :list="items">
    <ul :class="tabClasses" role="tablist">
      <span :class="sliderClasses" :style="sliderStyle" />

      <template v-if="!vertical">
        <li
          v-for="item in mainItems"
          :key="item.name"
          :data-priority-plus="item.name"
          ref="items"
          :data-text="item.label"
          :class="getItemClasses(item)"
          :data-item-name="item.name"
          role="tab"
          :aria-selected="item.name === activeItemName"
          :tabindex="0"
          @click="handleClick(item.name)"
          @keyup.enter="handleClick(item.name)"
        >
          {{ item.label }}

          <mt-icon
            v-if="item.hasError"
            :class="stylex(styles.errorBadge)"
            size="0.75rem"
            name="solid-exclamation-circle"
          />

          <mt-color-badge v-if="item.badge" :variant="item.badge" rounded />
        </li>

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
    </ul>
  </priority-plus>
</template>

<script lang="ts">
import stylex from "@stylexjs/stylex";
import { defineComponent, type PropType } from "vue";
import MtContextButton from "../../context-menu/mt-context-button/mt-context-button.vue";
import MtContextMenuItem from "../../context-menu/mt-context-menu-item/mt-context-menu-item.vue";
import MtColorBadge from "../../feedback-indicator/mt-color-badge/mt-color-badge.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import PriorityPlus from "../../_internal/mt-priority-plus-navigation.vue";

type Stylex = (...classes: Record<string, unknown>[]) => string;

const styles = stylex.create({
  tabs: {
    display: "flex",
    position: "relative",
  },
  tabsSmall: {
    // TODO: do we really need this? I strongly believe the parent should take care of that
    maxWidth: "50rem",
    // TODO: again I belive this should not be here. The parent should take care of that.
    margin: "0 auto",
    marginBlockEnd: "0.9375rem",
  },
  tabsHorizontal: {
    flexDirection: "row",
    borderBottom: "1px solid var(--color-border-primary-default)",
  },
  tabsVertical: {
    flexDirection: "column",
    borderLeft: "1px solid var(--color-border-primary-default)",
  },
  item: {
    display: "inline-block",
    cursor: "pointer",
    color: "var(--color-text-primary-default)",
    paddingBlock: "0.625rem",
    paddingInline: "1rem",
    fontSize: "1rem",
    "::after": {
      content: 'attr(data-text) / ""',
      height: 0,
      display: "block",
      visibility: "hidden",
      overflow: "hidden",
      userSelect: "none",
      pointerEvents: "none",
      fontWeight: 500,

      "@media speech": {
        display: "none",
      },
    },
  },
  itemError: {
    color: "var(--color-text-critical-default)",
  },
  itemActive: {
    fontWeight: 500,
  },
  errorBadge: {
    // TODO: can we get rid of this and use flex gap instead?
    marginInlineStart: "0.125rem",
    height: "0.75rem",
    width: "0.75rem",
    color: "var(--color-icon-critical-default)",
    whiteSpace: "nowrap",
  },
  slider: {
    transformOrigin: "top left",
    position: "absolute",
    backgroundColor: "var(--color-border-brand-selected)",
  },
  sliderHorizontal: {
    bottom: -1,
    left: 0,
    height: "0.125rem",
  },
  sliderVertical: {
    top: 0,
    bottom: "auto",
    left: "0.125rem",
  },
  sliderError: {
    backgroundColor: "var(--color-border-critical-default)",
  },
  sliderAnimated: {
    transition: "0.2s all ease-out",
  },
});

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
    tabClasses(): Record<string, boolean> {
      this.refreshKey;

      return {
        [stylex(styles.tabs)]: true,
        [stylex(styles.tabsSmall)]: !!this.small,
        [stylex(styles.tabsVertical)]: !!this.vertical,
        [stylex(styles.tabsHorizontal)]: !this.vertical,
      };
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeDomItem(): any | undefined {
      this.refreshKey;

      // Access "this.activeItemName" before to react dynamically on changes
      const activeItemName = this.activeItemName;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const domItems = this.$refs.items ? (this.$refs.items as any[]) : [];

      const activeDomItem = domItems.find((item) => {
        return item.getAttribute("data-item-name") === activeItemName;
      });

      return activeDomItem;
    },

    sliderPosition(): number {
      this.refreshKey;

      if (!this.activeItem) {
        return 0;
      }

      // Handle the case when the active item is hidden
      if (!this.activeDomItem && this.$refs["more-items-button"]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      this.refreshKey;

      if (!this.activeItem) {
        return 0;
      }

      // Handle the case when the active item is hidden
      if (!this.activeDomItem && this.$refs["more-items-button"]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (this.$refs["more-items-button"] as any).$el?.offsetWidth;
      }

      if (this.activeItem?.hidden && this.$refs["more-items-button"]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      this.refreshKey;

      return this.items.find((item) => {
        return item.name === this.activeItemName;
      });
    },

    sliderClasses(): Record<string, boolean> {
      this.refreshKey;

      return {
        [stylex(styles.slider)]: true,
        [stylex(styles.sliderHorizontal)]: !this.vertical,
        [stylex(styles.sliderVertical)]: !!this.vertical,
        [stylex(styles.sliderError)]: this.activeItem?.hasError ?? false,
        [stylex(styles.sliderAnimated)]: this.passedFirstRender,
      };
    },

    sliderStyle(): string {
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

  setup() {
    type NewType = Stylex;

    return {
      stylex: stylex as unknown as NewType,
      styles,
    };
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
        [stylex(styles.item)]: true,
        [stylex(styles.itemError)]: item.hasError,
        [stylex(styles.itemActive)]: item.name === this.activeItemName,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

<style lang="scss">
.mt-tabs {
  .mt-context-button {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border-primary-default);

    button {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: $font-size-default;
    }
  }
}
</style>
