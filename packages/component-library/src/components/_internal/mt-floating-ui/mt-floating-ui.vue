<template>
  <div ref="floatingUi" class="mt-floating-ui">
    <div ref="floatingUiTrigger" class="mt-floating-ui__trigger">
      <slot name="trigger" />
    </div>
    <div
      v-if="isOpened"
      ref="floatingUiContent"
      v-on-click-outside="onClickOutside"
      class="mt-floating-ui__content"
      :data-show="isOpened"
      tabindex="0"
    >
      <div v-if="showArrow" ref="floatingUiArrow" class="mt-floating-ui__arrow" data-popper-arrow />

      <transition name="popoverTransition">
        <template v-if="isOpened">
          <slot />
        </template>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, nextTick } from "vue";
import type { AutoUpdateOptions, ComputePositionConfig } from "@floating-ui/dom";
import {
  computePosition,
  autoUpdate,
  offset as floatingUiOffset,
  arrow,
  flip,
} from "@floating-ui/dom";
import { vOnClickOutside } from "@vueuse/components";
import { defineProps, defineEmits } from "vue";

export type MtFloatingUiProps = {
  isOpened: boolean;
  floatingUiOptions?: Partial<ComputePositionConfig>;
  showArrow?: boolean;
  offset?: number;
  autoUpdateOptions?: Partial<AutoUpdateOptions>;
};

const props = defineProps<MtFloatingUiProps>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// eslint-disable-next-line prefer-const
let floatingUiContent = ref<HTMLElement | null>(null);
const floatingUiTrigger = ref<HTMLElement | null>(null);
const floatingUiArrow = ref<HTMLElement | null>(null);
const floatingUi = ref<HTMLElement | null>(null);
let cleanup: () => void;

const bodyContainer = window.document.querySelector("body")!;
const originalParentContainer = floatingUiContent.value?.parentElement;

const createFloatingUi = () => {
  if (!floatingUiTrigger.value || !floatingUiContent.value) {
    return;
  }

  // move the popover to the body
  bodyContainer.appendChild(floatingUiContent.value as HTMLElement);

  // add given classes also to popover element
  const givenClasses = [...(floatingUi.value?.classList.values() ?? [])].filter(
    (c) => c !== "mt-floating-ui",
  ) as string[];
  floatingUiContent.value.classList.add(...givenClasses);

  cleanup = autoUpdate(
    floatingUiTrigger.value,
    floatingUiContent.value as HTMLElement,
    () => {
      if (!floatingUiTrigger.value || !floatingUiContent.value) {
        return;
      }

      computePosition(floatingUiTrigger.value, floatingUiContent.value as HTMLElement, {
        placement: "bottom-start",
        strategy: "fixed",
        middleware: [
          floatingUiOffset(props.offset ?? 6),
          ...(() => {
            if (props.showArrow && floatingUiArrow.value) {
              return [arrow({ element: floatingUiArrow.value as HTMLElement })];
            }
            return [];
          })(),
          flip(),
          ...(props.floatingUiOptions?.middleware ?? []),
        ],
        ...props.floatingUiOptions,
      }).then(({ x, y, middlewareData, placement }) => {
        if (!floatingUiContent.value) {
          return;
        }

        const staticSide = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[placement.split("-")[0]] as "top" | "right" | "bottom" | "left";

        if (props.showArrow && floatingUiArrow.value && middlewareData.arrow) {
          Object.assign(floatingUiArrow.value.style, {
            left: middlewareData.arrow.x != null ? `${middlewareData.arrow.x}px` : "",
            top: middlewareData.arrow.y != null ? `${middlewareData.arrow.y}px` : "",
            right: "",
            bottom: "",
            [staticSide]: "-2px",
          });
        }

        Object.assign(floatingUiContent.value.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        // remove all staticSide classes
        ["top", "right", "bottom", "left"].forEach((side) => {
          floatingUiContent.value?.classList.remove(`mt-floating-ui--${side}`);
        });

        // add staticSide class
        floatingUiContent.value.classList.add(`mt-floating-ui--${staticSide}`);
      });
    },
    {
      // fixes endless compute loop in rare situations (e.g. data-table)
      layoutShift: false,
      ...props.autoUpdateOptions,
    },
  );
};

const removeFloatingUi = () => {
  // cleanup the floating ui listener
  if (cleanup) {
    cleanup();
  }

  // remove the popover from the body
  if (
    floatingUiContent.value &&
    // floatingUiContent.value have to be direct child of bodyContainer
    floatingUiContent.value.parentElement === bodyContainer
  ) {
    originalParentContainer?.appendChild(floatingUiContent.value as HTMLElement);
  }
};

watch(
  () => props.isOpened,
  (isOpened) => {
    if (isOpened) {
      nextTick(() => {
        createFloatingUi();
      });
    } else {
      removeFloatingUi();
    }
  },
  { immediate: true },
);

const onClickOutside = (event: Event) => {
  // emit close when click is not inside trigger or content
  if (floatingUi.value?.contains(event.target as Node)) {
    return;
  }

  emit("close");
};

onBeforeUnmount(() => {
  removeFloatingUi();

  if (floatingUiContent?.value && originalParentContainer) {
    originalParentContainer?.removeChild(floatingUiContent?.value as HTMLElement);
  } else {
    floatingUiContent?.value?.remove();
  }
});
</script>

<style lang="scss">
.mt-floating-ui {
  display: inline-block;
  position: relative;

  .mt-floating-ui__trigger {
    display: inline-block;
  }
}

.mt-floating-ui__content {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1070;

  &[data-show] {
    display: block;
  }

  /***
  * Arrow indicator
  */
  .mt-floating-ui__arrow {
    position: absolute;
    width: var(--scale-size-8);
    height: var(--scale-size-8);
    background: inherit;
    transform: rotate(45deg);
  }

  &.mt-floating-ui--top .mt-popover__content {
    transform-origin: top;
  }

  &.mt-floating-ui--right .mt-popover__content {
    transform-origin: right;
  }

  &.mt-floating-ui--bottom .mt-popover__content {
    transform-origin: bottom;
  }

  &.mt-floating-ui--left .mt-popover__content {
    transform-origin: left;
  }
}

.popoverTransition-enter-active,
.popoverTransition-leave-active {
  transition:
    transform 0.15s,
    opacity 0.15s;
}

.popoverTransition-enter, .popoverTransition-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: scale3d(1, 0, 1);
  opacity: 0;
}
</style>
