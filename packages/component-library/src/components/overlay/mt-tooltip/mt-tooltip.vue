<template>
  <slot
    name="default"
    v-bind="{
      id: `mt-tooltip--${id}__trigger`,
      onFocus: () => {
        setState({ isFocusingTrigger: true });
        show({ gotOpenedBy: 'focus' });
      },
      onBlur,
      onKeydown: (event: KeyboardEvent) => {
        const keysThatCloseTooltip = ['Escape', ' ', 'Enter'];
        if (keysThatCloseTooltip.includes(event.key)) hide({ causedByKeyPress: true });
        mouseoverTimeout.stop();
      },
      onMouseover,
      onMouseleave,
      onMousedown,
      onMouseup: () => setState({ isPressingTrigger: false }),
      'aria-describedby': `mt-tooltip--${id}__tooltip`,
    }"
  />

  <Teleport to="body">
    <Transition v-bind="$attrs">
      <div
        v-show="isVisible"
        :data-placement="calculatedPlacement"
        style="position: absolute; z-index: 1100"
      >
        <!-- Needs to be v-show, otherwise we have a jumping entry when tooltip is visible for the first time -->
        <div
          role="tooltip"
          :id="`mt-tooltip--${id}__tooltip`"
          class="tooltip"
          ref="tooltipRef"
          :style="{ ...floatingStyles, maxWidth: `${props.maxWidth}px` }"
          tabindex="-1"
          @mouseover="setState({ isHoveringTooltip: true })"
          @mouseleave="onMouseLeaveTooltip"
        >
          <span class="mt-tooltip__content" v-html="sanitizedContent" data-theme="dark" />

          <svg
            aria-hidden="true"
            ref="arrowRef"
            width="8"
            height="4"
            viewBox="0 0 8 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :style="{
              background: 'var(--color-elevation-surface-floating)',
              height: '0.5rem',
              width: '0.5rem',
              borderRadius: '2px',
              position: 'absolute',
              left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
              top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
              rotate: '45deg',
              [arrowOffset]: '-0.125rem',
            }"
          >
            <path
              d="M8 0L4.70711 3.29289C4.31658 3.68342 3.68342 3.68342 3.29289 3.29289L0 0H8Z"
              fill="var(--color-elevation-surface-floating)"
            />
          </svg>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, computed, provide, useId, type ComputedRef } from "vue";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  arrow,
  type Placement,
} from "@floating-ui/vue";
import { useTooltipState } from "./composables/useTooltipState";
import { useTimeout } from "@vueuse/core";
import { TooltipContext } from "./composables/useIsInsideTooltip";
import DOMPurify from "dompurify";
export type { Placement } from "@floating-ui/vue";

const props = withDefaults(
  defineProps<{
    content: string;
    delayDurationInMs?: number;
    hideDelayDurationInMs?: number;
    placement?: Placement;
    maxWidth?: number;
  }>(),
  {
    delayDurationInMs: 300,
    hideDelayDurationInMs: 300,
    placement: "top",
    maxWidth: 240,
  },
);

const sanitizedContent = useSanitizedHtml(props.content);

const id = useId();

onMounted(() => {
  nextTick(() => {
    const triggerDOMElement = document.querySelector<HTMLElement>(`#mt-tooltip--${id}__trigger`);

    if (!triggerDOMElement && process?.env?.NODE_ENV !== "test") {
      throw new Error(
        `Failed to render mt-tooltip; Could not find trigger element with id: "mt-tooltip--${id}__trigger"`,
      );
    }

    triggerRef.value = triggerDOMElement;
  });
});

const { isVisible, show, hide, setState } = useTooltipState();

function onBlur(event: FocusEvent) {
  const clickedOnTooltip = (event?.relatedTarget as HTMLElement)?.closest(`#${id}`);
  if (clickedOnTooltip) {
    (event.target as HTMLElement).focus();
    return;
  }

  setState({ isFocusingTrigger: false });
  hide();
}

const mouseoverTimeout = useTimeout(props.delayDurationInMs, {
  controls: true,
  callback: () => show({ gotOpenedBy: "hover" }),
});
const mouseLeaveTimeout = useTimeout(props.hideDelayDurationInMs, {
  controls: true,
  callback: hide,
});

function onMouseover() {
  setState({ isHoveringTrigger: true });
  mouseoverTimeout.start();
}

function onMouseleave() {
  mouseoverTimeout.stop();
  setState({ isHoveringTrigger: false });

  mouseLeaveTimeout.start();
}

function onMousedown() {
  mouseoverTimeout.stop();

  setState({ isPressingTrigger: true });
  hide();
}

function onMouseLeaveTooltip() {
  setState({ isHoveringTooltip: false });
  mouseLeaveTimeout.start();
}

const triggerRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);

const {
  floatingStyles,
  middlewareData,
  placement: calculatedPlacement,
} = useFloating(triggerRef, tooltipRef, {
  middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef, padding: 8 })],
  whileElementsMounted: autoUpdate,
  placement: props.placement,
});

const arrowOffset = computed<string>(() => {
  const side = calculatedPlacement.value.split("-")[0];

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[side];

  return staticSide ?? "";
});

provide(TooltipContext, true);

/**
 * This composable uses DOMPurify to sanitize HTML content.
 * It returns the value as a computed read-only property.
 * The sanitization is done using the `sanitize` function from DOMPurify.
 */
function useSanitizedHtml(html: string): ComputedRef<string> {
  return computed(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["a", "b", "i", "u", "s", "li", "ul", "img", "svg"],
    });
  });
}
</script>

<style scoped>
.tooltip {
  color: var(--color-text-inverse-default);
  font-feature-settings: "ss01" on;
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-2xs);
  background: var(--color-elevation-surface-floating);
  line-height: var(--font-family-line-height-2xs);
  padding: var(--scale-size-12);
  border-radius: var(--border-radius-overlay);
  width: max-content;
  overflow-wrap: break-word;
}

.mt-tooltip__content ul {
  list-style-position: inside;
}

.v-enter-active,
.v-leave-active {
  transition-duration: 0.15s;
  transition-property: opacity, margin;
}

.v-enter-active {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.v-leave-active {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-from[data-placement="top"],
.v-leave-to[data-placement="top"] {
  margin-bottom: var(--scale-size-5);
}

.v-enter-from[data-placement="bottom"],
.v-leave-to[data-placement="bottom"] {
  margin-top: var(--scale-size-5);
}

.v-enter-from[data-placement="left"],
.v-leave-to[data-placement="left"] {
  margin-right: var(--scale-size-5);
}

.v-enter-from[data-placement="right"],
.v-leave-to[data-placement="right"] {
  margin-left: var(--scale-size-5);
}
</style>
