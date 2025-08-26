<template>
  <slot :mainItems="mainItems" :moreItems="moreItems" />
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

export interface ItemBase {
  hidden?: boolean;
  [key: string]: any;
}

function getWidth(el: Element) {
  if (!el) {
    return 0;
  }

  const styles = window.getComputedStyle(el);
  const margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);

  // @ts-expect-error - offsetWidth exists on this element
  return Math.ceil(el.offsetWidth + margin);
}

/**
 * A flexible priority plus navigation component.
 * For reference see: https://css-tricks.com/the-priority-navigation-pattern/
 *
 * @example
 * <mt-priority-plus-navigation
 *  :list="[
 *     { name: 'Home', url: '/' },
 *     { name: 'About', url: '/about' },
 *   ]"
 *   identifier="name"
 *   #default="{ mainItems, moreItems }"
 * >
 *   <template v-for="item in mainItems">
 *      <a
 *        :href="item.url"
 *        :data-priority-plus="item.name"
 *      >
 *        {{ item.name }}
 *      </a>
 *   </template>
 *
 *   <mt-context-button
 *     v-if="moreItems.length"
 *     ref="more-items-button"
 *     :has-error="moreItems.some(i => i.hasError)"
 *   >
 *     <template #button-text>More</template>
 *
 *     <mt-context-menu-item
 *      v-for="item in moreItems"
 *     >
 *     </mt-context-menu-item>
 *   </mt-context-button>
 * </mt-priority-plus-navigation>
 */
export default defineComponent({
  name: "PriorityPlusMenu",

  props: {
    /**
     * The list of navigation items to display.
     */
    list: {
      type: Array as PropType<ItemBase[]>,
      required: true,
      default() {
        return [];
      },
    },
    /**
     * The offset factor is used to multiply the width of the last visible item for the more button offset.
     */
    offsetFactor: {
      type: Number,
      default: 1.5,
    },
    /**
     * The property used to identify the items in the list.
     */
    identifier: {
      type: String,
      required: false,
      default: "name",
    },
  },

  data(): {
    accumItemWidths: any[];
    hiddenItemIdentifiers: string[];
  } {
    return {
      /**
       * The accumulated widths of the items in the list.
       * For example take this list for items with a widht of 100px each:
       * [100, 200, 300, 400, 500]
       *
       * This list is used to search the last item index which fits into the container width.
       */
      accumItemWidths: [],
      /**
       * This list contains the identifiers of the items which are hidden.
       * The values respect the prop `identifier`.
       */
      hiddenItemIdentifiers: [],
    };
  },

  computed: {
    /**
     * The items which are currently displayed.
     */
    mainItems(): ItemBase[] {
      return this.list.filter((item) => !this.hiddenItemIdentifiers.includes(item.name));
    },

    /**
     * The items which are currently hidden.
     */
    moreItems(): ItemBase[] {
      return this.list.filter((item) => this.hiddenItemIdentifiers.includes(item.name));
    },

    hasHiddenItems(): boolean {
      return !!this.moreItems.length;
    },

    /**
     * The HTML elements of the visible items.
     */
    visibleElements(): { [key: string]: Element } {
      const els = {} as { [key: string]: Element };
      this.list.forEach((item) => {
        if (this.hiddenItemIdentifiers.includes(item[this.identifier])) {
          return;
        }

        const el = this.$el.parentElement.querySelector(
          `[data-priority-plus="${item[this.identifier]}"]`,
        );
        if (!el) {
          return;
        }

        els[item[this.identifier]] = el;
      });

      return els;
    },

    /**
     * The last visible HTML element.
     */
    lastVisibleElement(): Element {
      // get the last element of this.visibleElements
      const keys = Object.keys(this.visibleElements);
      const lastKey = keys[keys.length - 1];
      return this.visibleElements[lastKey];
    },
  },

  async mounted() {
    await this.$nextTick();

    this.storeItemWidths();

    // First iteration marks the correct items as hidden
    this.handleResize();
    // Second iteration fixes the width of the container including the more button offset
    this.handleResize();

    window.addEventListener("resize", this.handleResize);
  },

  watch: {
    /**
     * Watch the list for changes and recalculate the item widths.
     * This is necessary if the list changes after the component is mounted.
     */
    list: {
      handler() {
        this.handleResize();
      },
      deep: true,
    },
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    storeItemWidths() {
      let sum = 0;

      this.list.forEach((item, index) => {
        sum += getWidth(this.visibleElements[item[this.identifier]]);
        this.accumItemWidths[index] = sum;
      });
    },

    getContainerWidth() {
      let offset = 0;

      if (this.hasHiddenItems) {
        const firstVisibleElement = Object.values(this.visibleElements)[0];
        offset = getWidth(firstVisibleElement) * this.offsetFactor;
      }

      return this.$el?.nextSibling?.offsetWidth - offset;
    },

    getLastVisibleItemIndex() {
      let index = 0;
      const containerWidth = this.getContainerWidth();

      while (index < this.accumItemWidths.length) {
        if (this.accumItemWidths[index] > containerWidth) {
          index--;
          break;
        }
        index++;
      }

      return index;
    },

    async handleResize() {
      await this.$nextTick();

      const lastVisibleItemIndex = this.getLastVisibleItemIndex();

      this.hiddenItemIdentifiers = [];

      this.list.forEach((item, index) => {
        const hidden = index > lastVisibleItemIndex;
        if (!hidden) {
          this.hiddenItemIdentifiers = this.hiddenItemIdentifiers.filter((id) => id !== item.name);
          return;
        }

        this.hiddenItemIdentifiers.push(item.name);
      });
    },
  },
});
</script>
