<template>
  <priority-plus
    ref="priorityPlus"
    #default="{ mainItems, moreItems }"
    class="sw-tabs"
    :class="tabClasses"
    :list="items"
  >
    <ul role="tablist">
      <span
        class="sw-tabs--slider"
        :class="sliderClasses"
        :style="sliderStyle"
      />

      <template v-if="!vertical">
        <li
          v-for="item in mainItems"
          :key="item.name"
          ref="items"
          class="sw-tabs--item"
          :class="getItemClasses(item)"
          :data-item-name="item.name"
          role="tab"
          :aria-selected="item.name === activeItemName"
          :tabindex="0"
          @click="handleClick(item.name)"
          @keyup.enter="handleClick(item.name)"
        >
          {{ item.label }}

          <sw-icon
            v-if="item.hasError"
            class="sw-tabs--error-badge"
            name="solid-exclamation-circle"
          />

          <sw-color-badge
            v-if="item.badge"
            :variant="item.badge"
            rounded
          />
        </li>

        <!-- @vue-skip -->
        <sw-context-button
          v-if="moreItems.length"
          ref="more-items-button"
          :has-error="moreItems.some(i => i.hasError)"
        >
          <template #button-text>
            <!-- Add translation  -->
            More
          </template>

          <template #default="{ toggleFloatingUi }">
            <sw-context-menu-item
              v-for="moreItem in moreItems"
              :key="moreItem.name"
              :type="getContextMenuItemVariant(moreItem)"
              role="tab"
              :aria-selected="moreItem.name === activeItemName"
              :label="moreItem.label"
              @click="handleClick(moreItem.name); toggleFloatingUi();"
              @keyup.enter="handleClick(moreItem.name)"
            />
          </template>
        </sw-context-button>
      </template>

      <template v-if="vertical">
        <li
          v-for="item in [...mainItems, ...moreItems]"
          :key="item.name"
          ref="items"
          class="sw-tabs--item"
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
import type { PropType } from 'vue';

import Vue from 'vue';
import SwContextButton from '../../context-menu/sw-context-button/sw-context-button.vue';
import SwContextMenuItem from '../../context-menu/sw-context-menu-item/sw-context-menu-item.vue';
import SwColorBadge from '../../feedback-indicator/sw-color-badge/sw-color-badge.vue';
import SwIcon from '../../icons-media/sw-icon/sw-icon.vue';
import PriorityPlus from '../../_internal/sw-priority-plus-navigation.vue';

interface TabItem {
  label: string;
  name: string;
  hasError?: boolean;
  disabled?: boolean;
  badge?: 'positive'|'critical'|'warning'|'info';
  onClick?: (name: string) => void;
  // @internal - will be added by priority plus menu component
  hidden?: boolean;
}

export default Vue.extend({
  name: 'SwTabs',

  components: {
    'sw-context-button': SwContextButton,
    'sw-context-menu-item': SwContextMenuItem,
    'priority-plus': PriorityPlus,
    'sw-color-badge': SwColorBadge,
    'sw-icon': SwIcon
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
      default: '',
    },
  },

  data(): {
    refreshKey: boolean,
    activeItemName: string,
    showMoreItems: boolean,
  } {
    return {
      // refreshKey is for recalculating specific computed properties
      refreshKey: true,
      activeItemName: '',
      showMoreItems: false,
    };
  },

  computed: {
    tabClasses(): Record<string, boolean> {
      this.refreshKey;

      return {
        'sw-tabs--vertical': this.vertical,
        'sw-tabs--small': this.small
      };
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeDomItem(): any|undefined {
      this.refreshKey;

      // Access "this.activeItemName" before to react dynamically on changes
      const activeItemName = this.activeItemName;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const domItems = this.$refs.items ? this.$refs.items as any[] : [];

      const activeDomItem = domItems.find(item => {
        return item.getAttribute('data-item-name') === activeItemName;
      })

      return activeDomItem;
    },

    sliderPosition(): number {
      this.refreshKey;

      if (!this.activeDomItem && !this.activeItem) {
        return 0;
      }

      if (
        this.activeItem?.hidden &&
        this.$refs['more-items-button']
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (this.$refs['more-items-button'] as any).$el?.offsetLeft
      }

      return this.vertical ? this.activeDomItem?.offsetTop : this.activeDomItem?.offsetLeft;
    },

    sliderLength(): number {
      this.refreshKey;

      if (!this.activeDomItem && !this.activeItem) {
        return 0;
      }

      if (
        this.activeItem?.hidden &&
        this.$refs['more-items-button']
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (this.$refs['more-items-button'] as any).$el?.offsetWidth
      }

      return this.vertical
        ? this.activeDomItem?.offsetHeight
        : this.activeDomItem?.offsetWidth;
    },

    activeItem(): TabItem|undefined {
      this.refreshKey;

      return this.items.find(item => {
        return item.name === this.activeItemName;
      });
    },

    sliderClasses(): Record<string, boolean> {
      this.refreshKey;

      return {
        'sw-tabs--slider__has-error': (this.activeItem?.hasError) ?? false,
      }
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
    }
  },

  watch: {
    items: 'handleResize',
    vertical: 'handleResize',
    small: 'handleResize',
  },

  mounted() {
    this.setActiveItem(this.defaultItem);

    // @ts-expect-error $device helper is not registered in TS yet
    this.$device.onResize({
      listener() {
        this.handleResize();
      },
      component: this,
      scope: this,
    });
  },

  beforeDestroy() {
    // @ts-expect-error $device helper is not registered in TS yet
    this.$device.removeResizeListener(this);
  },

  methods: {
    handleClick(itemName: string): void {
      this.setActiveItem(itemName);
      this.$emit('new-item-active', itemName);

      const matchingItem = this.items.find(item => item.name === itemName);

      if (!matchingItem?.onClick) {
        return;
      }

      matchingItem.onClick(itemName);
    },

    getItemClasses(item: TabItem) {
      return {
        'sw-tabs--item__has-error': item.hasError,
        'sw-tabs--item__is-active': item.name === this.activeItemName,
      }
    },

    getContextMenuItemVariant(item: TabItem): string {
      if (item.hasError) {
        return 'critical';
      }

      if (item.name === this.activeItemName) {
        return 'active'
      }

      if (item.badge === 'critical') {
        return 'critical'
      }

      return 'default';
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
        })
      }
    },

    toggleMoreTabItems() {
      this.showMoreItems = !this.showMoreItems;
    }
  }
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.sw-tabs {
  display: flex;
  position: relative;
  box-shadow: inset 0 -1px 0 $color-gray-300;

  &.sw-tabs--small {
    max-width: 800px;
    margin: 0 auto 15px auto;
  }

  &.sw-tabs--vertical {
    flex-direction: column;
    box-shadow: none;

    li {
      border-bottom: none;
      border-left: 1px solid $color-gray-300;
    }

    .sw-tabs--slider {
      top: 0;
      bottom: auto;
    }
  }

  .sw-tabs--item {
    display: inline-block;
    border-bottom: 1px solid $color-gray-300;
    padding: 10px 16px;
    white-space: nowrap;
    font-size: $font-size-default;
    cursor: pointer;
    color: $color-darkgray-200;

    &__has-error {
      color: $color-crimson-500;
      border-bottom: 1px solid $color-crimson-500;
    }

    &__is-active {
      color: $color-black;
    }

    &__has-error.sw-tabs--item__is-active {
      color: $color-crimson-500;
    }
  }

  .sw-tabs--slider {
    transform-origin: top left;
    transition: 0.2s all ease-in-out;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: $color-shopware-brand-500;
    z-index: 1;

    &__has-error {
      background-color: $color-crimson-500;
    }
  }

  .sw-context-button {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $color-gray-300;

    button {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: $font-size-default;
    }
  }

  .sw-tabs--error-badge {
    margin-left: 2px;
    width: 12px;
    height: 12px;

    > svg {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
