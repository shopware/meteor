<template>
  <component
    :is="mainComponentTag"
    :is-opened="isOpened"
    class="sw-popover"
    :class="componentClasses"
    @close="closeFloatingUi"
  >
    <template #trigger>
      <slot name="trigger" :is-opened="isOpened" :toggle-floating-ui="toggleFloatingUi" />
    </template>

    <div ref="SwPopover" role="dialog" class="sw-popover__content">
      <div v-if="showHeader" class="sw-popover__header">
        <sw-button
          v-if="currentView.name !== 'base'"
          class="sw-popover__back-button"
          variant="secondary"
          @click="goViewBack"
        >
          <sw-icon name="solid-long-arrow-left" />
        </sw-button>

        <h3>{{ currentView.title }}</h3>

        <div v-if="currentView.name !== 'base'" class="sw-popover__header-placeholder-right" />
      </div>

      <div class="sw-popover__items">
        <transition :name="viewTransition">
          <div :key="currentView.name.toString()">
            <slot
              :name="'popover-items__' + currentView.name"
              :change-view="changeView"
              :toggle-floating-ui="toggleFloatingUi"
            />
          </div>
        </transition>
      </div>
    </div>
  </component>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed, ref, watch } from "vue";
import SwCheckbox from "../../form/sw-checkbox/sw-checkbox.vue";
import SwSwitch from "../../form/sw-switch/sw-switch.vue";
import SwIcon from "../../icons-media/sw-icon/sw-icon.vue";
import SwPopoverItem from "../sw-popover-item/sw-popover-item.vue";
import SwButton from "../../form/sw-button/sw-button.vue";
import SwSmoothReflow from "../../_internal/sw-smooth-reflow.vue";
import SwFloatingUi from "../../_internal/sw-floating-ui/sw-floating-ui.vue";
import type { TranslateResult } from "vue-i18n";
import type { View } from "./sw-popover.interfaces";

export default defineComponent({
  components: {
    "sw-checkbox": SwCheckbox,
    "sw-switch": SwSwitch,
    "sw-icon": SwIcon,
    "sw-popover-item": SwPopoverItem,
    "sw-button": SwButton,
    "sw-smooth-reflow": SwSmoothReflow,
    "sw-floating-ui": SwFloatingUi,
  },
  props: {
    title: {
      type: String as PropType<string | TranslateResult>,
      required: false,
      default: "",
    },
    childViews: {
      type: Array as PropType<View[]>,
      required: false,
      default: () => [],
    },
    disableFloat: {
      type: Boolean,
      required: false,
      default: false,
    },
    width: {
      type: String as PropType<"auto" | "large" | "medium" | "small">,
      required: false,
      default: "dynamic",
      validator: (value: string) => {
        return ["dynamic", "large", "medium", "small"].includes(value);
      },
    },
  },
  emits: ["update:isOpened"],
  setup(props, { emit }) {
    const SwPopover = ref<HTMLElement | null>(null);
    const activeView = ref("base");
    const viewTransition = ref<"slideIn" | "slideOut">("slideIn");
    const isOpened = ref(false);

    watch(isOpened, (value) => {
      emit("update:isOpened", value);
    });

    const mainComponentTag = computed(() => {
      return props.disableFloat ? "div" : "sw-floating-ui";
    });

    const goViewBack = () => {
      viewTransition.value = "slideOut";

      const previousView = allViews.value.find((view) =>
        view.childViews?.some((v) => v.name === activeView.value),
      );

      if (previousView) {
        activeView.value = previousView.name as string;
      } else {
        activeView.value = "base";
      }

      if (SwPopover.value) {
        SwPopover.value.scrollTop = 0;
      }
    };

    const changeView = (view: string) => {
      viewTransition.value = "slideIn";
      activeView.value = view;

      if (SwPopover.value) {
        SwPopover.value.scrollTop = 0;
      }
    };

    const getAllViews = (views?: View[]): View[] => {
      if (!views) {
        return [];
      }

      return views.reduce<View[]>((acc, view) => {
        return [...acc, view, ...getAllViews(view.childViews)];
      }, []);
    };

    const allViews = computed<View[]>(() => {
      return [
        {
          name: "base",
          title: props.title,
        },
        ...getAllViews(props.childViews),
      ];
    });

    const currentView = computed<View>(() => {
      const currentView = allViews.value.find((view) => {
        return view.name === activeView.value;
      });

      if (currentView) {
        return {
          ...currentView,
          title: currentView.title ?? props.title,
        };
      }

      return { name: "base", title: props.title };
    });

    const closeFloatingUi = () => {
      isOpened.value = false;
    };

    const toggleFloatingUi = () => {
      isOpened.value = !isOpened.value;
    };

    const showHeader = computed(() => {
      return !!currentView.value.title || currentView.value.name !== "base";
    });

    const componentClasses = computed(() => {
      return {
        "sw-popover--float": !props.disableFloat,
        "sw-popover--open": isOpened.value,
        "sw-popover--header": showHeader.value,
        [`sw-popover--width-${props.width}`]: true,
      };
    });

    return {
      goViewBack,
      currentView,
      activeView,
      changeView,
      allViews,
      viewTransition,
      SwPopover,
      closeFloatingUi,
      toggleFloatingUi,
      isOpened,
      mainComponentTag,
      componentClasses,
      showHeader,
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
$font-family-default:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "San Francisco",
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  sans-serif;
$font-family-variables:
  "Inter var",
  -apple-system,
  BlinkMacSystemFont,
  "San Francisco",
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  sans-serif;
$font-family-default-feature-settings:
  "ss01" on,
  "ss02" on,
  "case" on,
  "cpsp" on,
  "zero" on,
  "cv09" on,
  "cv07" on,
  "cv06" on,
  "cv10" on,
  "cv11" on;

$font-weight-medium: 500;

$line-height-auto: auto;
$line-height-xs: 18px;
$line-height-sm: 20px;
$line-height-md: 24px;
$line-height-lg: 28px;

$color-card-headline: #1c1c1c;

$scrollShadowSize: 16px;
$scrollShadowColor: rgba(120, 120, 120, 0.2);

.sw-popover {
  &.sw-popover--float {
    .sw-popover__content {
      max-height: max(50vh, 250px);
    }
  }

  .sw-popover__content {
    padding: 16px;
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: var(--color-elevation-surface-overlay);
    overflow: auto;
    border-radius: $border-radius-default;
    box-shadow: 0 3px 6px 0 var(--color-border-primary-default);
    border: 1px solid var(--color-border-primary-default);
    overflow-x: hidden;
    scroll-behavior: smooth;

    &:has(.sw-popover__header) {
      padding-top: 16px;
    }

    // add new Inter font to popover
    * {
      font-family: $font-family-default;
    }

    @supports (font-variation-settings: normal) {
      * {
        font-family: $font-family-variables;
        font-feature-settings: $font-family-default-feature-settings;
      }
    }

    .sw-popover__header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      gap: 16px;

      h3 {
        margin-right: auto;
        font-size: $font-size-s;
        font-weight: $font-weight-semi-bold;
        line-height: $line-height-md;
        color: $color-darkgray-600;
        margin-bottom: 0;
      }
    }

    &__header-placeholder-right {
      width: 44px;
    }

    .sw-popover__back-button {
      margin-right: auto;
      padding-top: 12px;
      padding-bottom: 12px;
      background-color: $color-white;

      .sw-icon {
        color: $color-darkgray-800;

        svg {
          width: 12px !important;
          height: 8px !important;
        }
      }
    }
  }

  &.sw-popover--width-dynamic .sw-popover__content {
    min-width: 220px;
    max-width: 440px;
  }

  &.sw-popover--width-large .sw-popover__content {
    min-width: 340px;
    max-width: 340px;
  }

  &.sw-popover--width-medium .sw-popover__content {
    min-width: 280px;
    max-width: 280px;
  }

  &.sw-popover--width-small .sw-popover__content {
    min-width: 220px;
    max-width: 220px;
  }

  &__items {
    position: relative;
  }

  &__items:has(div.slideIn-leave-active) {
    overflow: hidden !important;
  }

  .slideIn-leave-active,
  .slideOut-leave-active {
    transition: all 0.125s ease;
  }
  .slideIn-enter-active,
  .slideOut-enter-active {
    transition: all 0.125s ease;
    transition-delay: 0.125s;
  }

  .slideIn-leave-active,
  .slideOut-leave-active {
    position: absolute;
  }

  .slideIn-leave-to {
    transform: translate3d(-110%, 0, 0);
    opacity: 0;
  }
  .slideIn-enter {
    transform: translate3d(110%, 0, 0);
  }

  .slideOut-leave-to {
    transform: translate3d(110%, 0, 0);
    opacity: 0;
  }
  .slideOut-enter {
    transform: translate3d(-110%, 0, 0);
  }
}
</style>
