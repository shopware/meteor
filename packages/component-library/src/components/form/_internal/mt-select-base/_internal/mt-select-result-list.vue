<template>
  <div class="mt-select-result-list">
    <mt-popover-deprecated
      class="mt-select-result-list-popover"
      :popover-class="popoverClass"
      :z-index="1100"
      :resize-width="popoverResizeWidth"
    >
      <!-- @vue-expect-error -->
      <div
        ref="popoverContent"
        :class="[
          'mt-select-result-list__content',
          {
            'mt-select-result-list__content_empty': isLoading && (!options || options.length <= 0),
          },
        ]"
        @scroll="onScroll"
      >
        <slot name="before-item-list" />

        <ul class="mt-select-result-list__item-list">
          <template v-for="(item, index) in options">
            <slot name="result-item" v-bind="{ item, index }" />
          </template>
        </ul>

        <slot name="after-item-list" />

        <div
          v-if="!isLoading && options && options.length < 1"
          class="mt-select-result-list__empty"
        >
          <mt-icon
            name="regular-search"
            size="var(--scale-size-16)"
            style="margin-right: var(--scale-size-4)"
          />
          {{ emptyMessage || t("messageNoResults") }}
        </div>
      </div>
    </mt-popover-deprecated>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import MtPopoverDeprecated from "../../../../_internal/mt-popover-deprecated/mt-popover-deprecated.vue";
import MtIcon from "../../../../icons-media/mt-icon/mt-icon.vue";
import { provide } from "vue";
import {
  MtSelectResultAddActiveItemListener,
  MtSelectResultAddItemSelectByKeyboardListener,
  MtSelectResultRemoveActiveItemListener,
  MtSelectResultRemoveItemSelectByKeyboardListener,
} from "@/helper/provideInjectKeys";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MtSelectResultList",

  components: {
    "mt-popover-deprecated": MtPopoverDeprecated,
    "mt-icon": MtIcon,
  },

  provide() {
    return {
      setActiveItemIndex: this.setActiveItemIndex,
    };
  },

  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          messageNoResults: "No results found.",
        },
        de: {
          messageNoResults: "Es wurden keine Ergebnisse gefunden.",
        },
      },
    });

    const activeItemIndex = ref(0);
    const activeItemChangeListeners = ref<Array<(index: number) => void>>([]);
    const itemSelectByKeyboardListeners = ref<Array<(index: number) => void>>([]);

    const emitActiveItemIndex = () => {
      activeItemChangeListeners.value.forEach((listener) => {
        listener(activeItemIndex.value);
      });
    };

    const setActiveItemIndex = (index: number) => {
      activeItemIndex.value = index;
      emitActiveItemIndex();
    };

    const addToActiveItemChangeListeners = (listener: (index: number) => void) => {
      activeItemChangeListeners.value.push(listener);
    };

    const removeActiveItemChangeListener = (listener: (index: number) => void) => {
      activeItemChangeListeners.value = activeItemChangeListeners.value.filter(
        (l) => l !== listener,
      );
    };

    const addToItemSelectByKeyboardListeners = (listener: (index: number) => void) => {
      itemSelectByKeyboardListeners.value.push(listener);
    };

    const removeItemSelectByKeyboardListener = (listener: (index: number) => void) => {
      itemSelectByKeyboardListeners.value = itemSelectByKeyboardListeners.value.filter(
        (l) => l !== listener,
      );
    };

    provide(MtSelectResultAddActiveItemListener, addToActiveItemChangeListeners);
    provide(MtSelectResultRemoveActiveItemListener, removeActiveItemChangeListener);
    provide(MtSelectResultAddItemSelectByKeyboardListener, addToItemSelectByKeyboardListeners);
    provide(MtSelectResultRemoveItemSelectByKeyboardListener, removeItemSelectByKeyboardListener);

    return {
      t,
      activeItemIndex,
      emitActiveItemIndex,
      setActiveItemIndex,
      addToActiveItemChangeListeners,
      removeActiveItemChangeListener,
      addToItemSelectByKeyboardListeners,
      removeItemSelectByKeyboardListener,
    };
  },

  props: {
    options: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },

    emptyMessage: {
      type: String,
      required: false,
      default: null,
    },

    focusEl: {
      type: [Object] as PropType<HTMLDocument | HTMLElement>,
      required: false,
      default() {
        return document;
      },
    },

    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },

    popoverClasses: {
      type: Array as PropType<string[]>,
      required: false,
      default() {
        return [];
      },
    },

    popoverResizeWidth: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data(): {
    activeItemChangeListeners: Array<(index: number) => void>;
    itemSelectByKeyboardListeners: Array<(index: number) => void>;
  } {
    return {
      activeItemChangeListeners: [],
      itemSelectByKeyboardListeners: [],
    };
  },

  computed: {
    popoverClass(): string[] {
      return [...this.popoverClasses, "mt-select-result-list-popover-wrapper"];
    },
  },

  created(): void {
    this.addEventListeners();
  },

  mounted(): void {
    // Set first item active
    this.emitActiveItemIndex();
  },

  beforeUnmount(): void {
    this.removeEventListeners();
  },

  methods: {
    addEventListeners() {
      // @ts-expect-error - property "key" exists on this event
      this.focusEl.addEventListener("keydown", this.navigate);
      document.addEventListener("click", this.checkOutsideClick);
    },

    removeEventListeners() {
      // @ts-expect-error - property "key" exists on this event
      this.focusEl.removeEventListener("keydown", this.navigate);
      document.removeEventListener("click", this.checkOutsideClick);
    },

    /**
     *
     * @param event {Event}
     */
    checkOutsideClick(event: MouseEvent) {
      event.stopPropagation();

      // @ts-expect-error - $refs is defined
      const popoverContentClicked = this.$refs.popoverContent.contains(event.target);
      const componentClicked = this.$el.contains(event.target);
      // @ts-expect-error - target exists
      const parentClicked = this.$parent.$el.contains(event.target);

      if (popoverContentClicked || componentClicked || parentClicked) {
        return;
      }

      this.$emit("outside-click");
    },

    navigate({ key }: { key: string }) {
      key = key.toUpperCase();
      if (key === "ARROWDOWN") {
        this.navigateNext();
        return;
      }

      if (key === "ARROWUP") {
        this.navigatePrevious();
        return;
      }

      if (key === "ENTER") {
        this.emitClicked();
      }
    },

    navigateNext() {
      if (this.activeItemIndex >= this.options.length - 1) {
        this.$emit("paginate");
        return;
      }

      this.activeItemIndex += 1;

      this.emitActiveItemIndex();
      this.updateScrollPosition();
    },

    navigatePrevious() {
      if (this.activeItemIndex > 0) {
        this.activeItemIndex -= 1;
      }

      this.emitActiveItemIndex();
      this.updateScrollPosition();
    },

    updateScrollPosition() {
      // wait until the new active item is rendered and has the active class
      this.$nextTick(() => {
        const resultContainer = document.querySelector(".mt-select-result-list__content");
        // @ts-expect-error - resultContainer is defined
        const activeItem = resultContainer.querySelector(".is--active");
        // @ts-expect-error - activeItem is defined
        const itemHeight = activeItem.offsetHeight;
        // @ts-expect-error - activeItem is defined
        const activeItemPosition = activeItem.offsetTop;
        // @ts-expect-error - resultContainer is defined
        const actualScrollTop = resultContainer.scrollTop;

        if (activeItemPosition === 0) {
          return;
        }

        // @ts-expect-error - resultContainer is defined
        // Check if we need to scroll down
        if (resultContainer.offsetHeight + actualScrollTop < activeItemPosition + itemHeight) {
          // @ts-expect-error - resultContainer is defined
          resultContainer.scrollTop += itemHeight;
        }

        // Check if we need to scroll up
        if (actualScrollTop !== 0 && activeItemPosition - actualScrollTop - itemHeight <= 0) {
          // @ts-expect-error - resultContainer is defined
          resultContainer.scrollTop -= itemHeight;
        }
      });
    },

    emitClicked() {
      // This emit is subscribed in the mt-result component. They can for example be disabled and need
      // choose on their own if they are selected
      this.$emit("item-select-by-keyboard", this.activeItemIndex);

      this.itemSelectByKeyboardListeners.forEach((listener) => {
        listener(this.activeItemIndex);
      });
    },

    onScroll(event: UIEvent) {
      // @ts-expect-error - event target is defined
      if (this.getBottomDistance(event.target) !== 0) {
        return;
      }

      this.$emit("paginate");
    },

    getBottomDistance(element: Element) {
      return element.scrollHeight - element.clientHeight - element.scrollTop;
    },
  },
});
</script>

<style lang="scss">
@import "../../../../assets/scss/variables";

$mt-select-result-list-transition: all ease-in-out 0.2s;

.mt-select-result-list,
.mt-select-result-list-popover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.mt-select-result-list-popover .mt-popover-deprecated__wrapper {
  width: 100%;
}

.mt-select-result-list__content {
  width: 100%;
  max-height: 250px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid var(--color-border-primary-default);
  box-shadow: 0 3px 6px 0 $color-gray-300;
  background-color: var(--color-elevation-surface-overlay);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  padding: var(--scale-size-8);
  border-radius: 4px;

  .mt-select-result-list__item-list {
    list-style: none;
  }

  .mt-select-result-list__empty {
    padding: var(--scale-size-10) var(--scale-size-16);
    color: var(--color-text-primary-default);
  }
}

.mt-select-result-list__content_empty {
  opacity: 0;
  min-height: 293px;
  height: 293px;
}

.mt-popover-deprecated__wrapper.--placement-bottom-outside.mt-select-result-list-popover-wrapper {
  transform: translate(0, calc(-100% - 48px));
}
</style>
