<template>
  <div ref="floatingUi" class="mt-floating-ui" :class="{ 'mt-floating-ui--detached': detached }">
    <div v-if="!detached" ref="floatingUiTrigger" class="mt-floating-ui__trigger">
      <slot name="trigger" />
    </div>
    <Teleport to="body">
      <div
        v-if="isOpened"
        ref="floatingUiContent"
        v-on-click-outside="onClickOutside"
        class="mt-floating-ui__content"
        :data-show="isOpened"
        tabindex="0"
        :style="contentStyles"
      >
        <div
          v-if="showArrow"
          ref="floatingUiArrow"
          class="mt-floating-ui__arrow"
          data-popper-arrow
        />

        <transition name="popoverTransition">
          <template v-if="isOpened">
            <slot
              :reference-element-width="referenceElementWidth"
              :reference-element-height="referenceElementHeight"
            />
          </template>
        </transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, nextTick, computed } from "vue";
import type { AutoUpdateOptions, ComputePositionConfig } from "@floating-ui/dom";
import {
  computePosition,
  autoUpdate,
  offset as floatingUiOffset,
  arrow,
  flip,
  size,
} from "@floating-ui/dom";
import { vOnClickOutside } from "@vueuse/components";

export type MtFloatingUiProps = {
  isOpened: boolean;
  floatingUiOptions?: Partial<ComputePositionConfig>;
  showArrow?: boolean;
  offset?: number;
  autoUpdateOptions?: Partial<AutoUpdateOptions>;
  /**
   * If true, the floating UI content will match the width of the reference element.
   */
  matchReferenceWidth?: boolean;
  /**
   * An external DOM element to anchor the floating content to, instead of the
   * built-in trigger slot wrapper
   */
  anchorElement?: HTMLElement | null;
  /**
   * When true, the trigger slot is not rendered and the root wrapper is not displayed
   * Use with `anchorElement`.
   */
  detached?: boolean;
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
const referenceElementHeight = ref<number>(0);
const referenceElementWidth = ref<number>(0);
let cleanup: () => void;

const originalParentContainer = floatingUiContent.value?.parentElement;

const contentStyles = computed(() => {
  const styles: Record<string, string> = {};

  if (props.matchReferenceWidth) {
    styles.width = `${referenceElementWidth.value}px`;
  }

  return styles;
});

const createFloatingUi = () => {
  const referenceEl = props.anchorElement ?? floatingUiTrigger.value;

  if (!referenceEl || !floatingUiContent.value) {
    return;
  }

  // add given classes also to popover element
  const givenClasses = [...(floatingUi.value?.classList.values() ?? [])].filter(
    (c) => c !== "mt-floating-ui",
  ) as string[];
  floatingUiContent.value.classList.add(...givenClasses);

  cleanup = autoUpdate(
    referenceEl,
    floatingUiContent.value as HTMLElement,
    () => {
      if (!referenceEl || !floatingUiContent.value) {
        return;
      }

      computePosition(referenceEl, floatingUiContent.value as HTMLElement, {
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
          size({
            apply({ rects }) {
              referenceElementWidth.value = rects.reference.width ?? 0;
              referenceElementHeight.value = rects.reference.height ?? 0;
            },
          }),
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

watch(
  () => props.anchorElement,
  () => {
    if (props.isOpened) {
      removeFloatingUi();
      nextTick(() => {
        createFloatingUi();
      });
    }
  },
);

const onClickOutside = (event: Event) => {
  // emit close when click is not inside trigger, external reference, or content
  if (
    floatingUi.value?.contains(event.target as Node) ||
    props.anchorElement?.contains(event.target as Node)
  ) {
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

  &.mt-floating-ui--detached {
    display: contents;
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
