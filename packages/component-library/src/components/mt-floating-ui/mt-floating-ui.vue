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
  hide,
  getOverflowAncestors,
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

// Smallest content worth keeping on the preferred side: three 45px result rows
// plus chrome. The floor may overshoot the pane on purpose — that leftover
// overflow is what still lets `flip()` change sides.
const MIN_HEIGHT = 150;

// The content is teleported to `<body>` and positioned `fixed`, so its own
// clipping ancestors are just the viewport — sizing and flipping have to be
// bounded by the reference's scroll panes to learn about a dialog body it sits
// in. Skip `overflow: hidden` ancestors: they are usually field-sized boxes
// that would collapse the boundary onto the reference, leaving no side that fits.
const scrollBoundariesOf = (referenceEl: Element): Element[] | "clippingAncestors" => {
  const scrollables = getOverflowAncestors(referenceEl).filter((ancestor): ancestor is Element => {
    if (!(ancestor instanceof Element) || ancestor === document.body) {
      return false;
    }

    const { overflowY } = getComputedStyle(ancestor);

    return overflowY === "auto" || overflowY === "scroll";
  });

  return scrollables.length > 0 ? scrollables : "clippingAncestors";
};

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

  // `middleware` is pulled out so consumer-supplied middleware extends the
  // defaults instead of replacing them via the config spread below.
  const { middleware: consumerMiddleware, ...consumerOptions } = props.floatingUiOptions ?? {};

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
        ...consumerOptions,
        middleware: [
          floatingUiOffset(props.offset ?? 6),
          ...(() => {
            if (props.showArrow && floatingUiArrow.value) {
              return [arrow({ element: floatingUiArrow.value as HTMLElement })];
            }
            return [];
          })(),
          // Order matters: `size()` before `flip()` makes content that is merely
          // too tall shrink and scroll where it is, instead of jumping over the
          // reference and covering the field it belongs to.
          size({
            boundary: scrollBoundariesOf(referenceEl),
            apply({ availableHeight, rects, elements }) {
              referenceElementWidth.value = rects.reference.width ?? 0;
              referenceElementHeight.value = rects.reference.height ?? 0;

              const cap = Math.max(availableHeight, MIN_HEIGHT);
              elements.floating.style.maxHeight = `${cap}px`;

              // Content with no scrollable region ignores the cap and paints
              // past it, which would only hide that overflow from `flip()` — a
              // context menu would sit half off-screen instead of changing sides.
              if (elements.floating.scrollHeight > Math.ceil(cap)) {
                elements.floating.style.maxHeight = "";
              }
            },
          }),
          flip({ boundary: scrollBoundariesOf(referenceEl) }),
          ...(consumerMiddleware ?? []),
          hide(),
        ],
      }).then(({ x, y, middlewareData, placement, strategy }) => {
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

        // A zero-area reference reports as hidden (all its overflow offsets are
        // 0), so exclude it: anchors may legitimately be size-less markers, and
        // in jsdom every element measures 0.
        const referenceRect = referenceEl.getBoundingClientRect();
        const referenceIsMeasurable = referenceRect.width > 0 && referenceRect.height > 0;

        // Set `position` inline (not just via CSS) so it always matches the
        // strategy the coordinates were computed for. Consumer classes are
        // copied onto this teleported element above, and a class carrying
        // `position: absolute` would otherwise make it interpret these
        // viewport coordinates as document coordinates — the popover then
        // drifts away on scroll. Inline style wins over any copied class.
        Object.assign(floatingUiContent.value.style, {
          position: strategy,
          left: `${x}px`,
          top: `${y}px`,
          // The content follows its reference on scroll; once the reference is
          // fully scrolled out of its clipping containers the content must not
          // stay visible (it would float over unrelated UI).
          visibility:
            referenceIsMeasurable && middlewareData.hide?.referenceHidden ? "hidden" : "visible",
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
  // Flex column so the `max-height` from `size()` reaches the slotted content:
  // a block child with its own `max-height` paints past the capped box.
  display: flex;
  flex-direction: column;

  &[data-show] {
    display: flex;
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
