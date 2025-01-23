<template>
  <component
    :is="mainComponentTag"
    :is-opened="isOpened"
    class="mt-popover"
    :class="componentClasses"
    @close="closeFloatingUi"
  >
    <template #trigger>
      <slot name="trigger" :is-opened="isOpened" :toggle-floating-ui="toggleFloatingUi" />
    </template>

    <div ref="MtPopover" role="dialog" class="mt-popover__content">
      <div v-if="showHeader" class="mt-popover__header">
        <mt-button
          v-if="currentView.name !== 'base'"
          class="mt-popover__back-button"
          variant="secondary"
          @click="goViewBack"
        >
          <mt-icon name="solid-long-arrow-left" />
        </mt-button>

        <mt-text as="h3" class="mt-popover__title" size="s" weight="semibold">
          {{ currentView.title }}
        </mt-text>

        <div v-if="currentView.name !== 'base'" class="mt-popover__header-placeholder-right" />
      </div>

      <div class="mt-popover__items">
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
import MtCheckbox from "../../form/mt-checkbox/mt-checkbox.vue";
import MtSwitch from "../../form/mt-switch/mt-switch.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtPopoverItem from "../mt-popover-item/mt-popover-item.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtSmoothReflow from "../../_internal/mt-smooth-reflow.vue";
import MtFloatingUi from "../../_internal/mt-floating-ui/mt-floating-ui.vue";
import type { TranslateResult } from "vue-i18n";
import type { View } from "./mt-popover.interfaces";
import MtText from "@/components/content/mt-text/mt-text.vue";

export default defineComponent({
  components: {
    "mt-text": MtText,
    "mt-checkbox": MtCheckbox,
    "mt-switch": MtSwitch,
    "mt-icon": MtIcon,
    "mt-popover-item": MtPopoverItem,
    "mt-button": MtButton,
    "mt-smooth-reflow": MtSmoothReflow,
    "mt-floating-ui": MtFloatingUi,
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
    const MtPopover = ref<HTMLElement | null>(null);
    const activeView = ref("base");
    const viewTransition = ref<"slideIn" | "slideOut">("slideIn");
    const isOpened = ref(false);

    watch(isOpened, (value) => {
      emit("update:isOpened", value);
    });

    const mainComponentTag = computed(() => {
      return props.disableFloat ? "div" : "mt-floating-ui";
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

      if (MtPopover.value) {
        MtPopover.value.scrollTop = 0;
      }
    };

    const changeView = (view: string) => {
      viewTransition.value = "slideIn";
      activeView.value = view;

      if (MtPopover.value) {
        MtPopover.value.scrollTop = 0;
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
      const classes = {
        "mt-popover--float": !props.disableFloat,
        "is--open": isOpened.value,
        "has--header": showHeader.value,
        [`mt-popover--width-${props.width}`]: true,
      };

      return classes;
    });

    return {
      goViewBack,
      currentView,
      activeView,
      changeView,
      allViews,
      viewTransition,
      MtPopover,
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

<style>
.mt-popover--float .mt-popover__content {
  max-height: max(50vh, 250px);
}

.mt-popover__content {
  padding: var(--scale-size-16);
  padding-top: var(--scale-size-4);
  padding-bottom: var(--scale-size-4);
  background-color: var(--color-elevation-surface-overlay);
  overflow: auto;
  border-radius: var(--border-radius-overlay);
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 8%),
    0 2px 1px rgba(0, 0, 0, 6%),
    0 1px 3px rgba(0, 0, 0, 10%);
  overflow-x: hidden;
  scroll-behavior: smooth;

  &:has(.mt-popover__header) {
    padding-top: var(--scale-size-16);
  }
}

.mt-popover__content__header-placeholder-right {
  width: 44px;
}

.mt-popover__header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--scale-size-16);
  gap: var(--scale-size-16);
}

.mt-popover__title {
  margin-right: auto;
  margin-block-end: 0;
}

.mt-popover__back-button {
  margin-right: auto;
  padding-top: var(--scale-size-12);
  padding-bottom: var(--scale-size-12);

  & .mt-icon {
    & svg {
      width: var(--scale-size-12) !important;
      height: var(--scale-size-8) !important;
    }
  }
}

.mt-popover--width-dynamic .mt-popover__content {
  min-width: 220px;
  max-width: 440px;
}

.mt-popover--width-large .mt-popover__content {
  min-width: 340px;
  max-width: 340px;
}

.mt-popover--width-medium .mt-popover__content {
  min-width: 280px;
  max-width: 280px;
}

.mt-popover--width-small .mt-popover__content {
  min-width: 220px;
  max-width: 220px;
}

.mt-popover__items {
  position: relative;

  &:has(div.slideIn-leave-active) {
    overflow: hidden !important;
  }
}

/* Animations */
.mt-popover {
  & .slideIn-leave-active,
  & .slideOut-leave-active {
    transition: all 0.125s ease;
  }

  & .slideIn-enter-active,
  & .slideOut-enter-active {
    transition: all 0.125s ease;
    transition-delay: 0.125s;
  }

  & .slideIn-leave-active,
  & .slideOut-leave-active {
    position: absolute;
  }

  & .slideIn-leave-to {
    transform: translate3d(-110%, 0, 0);
    opacity: 0;
  }

  & .slideIn-enter {
    transform: translate3d(110%, 0, 0);
  }

  & .slideOut-leave-to {
    transform: translate3d(110%, 0, 0);
    opacity: 0;
  }

  & .slideOut-enter {
    transform: translate3d(-110%, 0, 0);
  }
}
</style>
