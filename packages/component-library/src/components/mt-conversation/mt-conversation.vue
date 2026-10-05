<template>
  <div class="mt-conversation">
    <div class="mt-conversation__main">
      <div
        ref="viewport"
        class="mt-conversation__viewport"
        role="log"
        :aria-label="label ?? t('label')"
        tabindex="0"
        :data-overflow-start="hasContentBefore || undefined"
        :data-overflow-end="hasContentAfter || undefined"
        :style="{ '--mt-conversation-scrollbar-size': `${scrollbarSize}px` }"
        @scroll="onScroll"
        @wheel.passive="onWheel"
        @keydown="onKeydown"
        @touchstart.passive="onTouchstart"
        @touchmove.passive="onTouchmove"
        @pointerdown="onPointerdown"
      >
        <div ref="content" class="mt-conversation__content">
          <div v-if="hasSlotContent(slots.default)" class="mt-conversation__messages">
            <slot />
          </div>
          <div v-else-if="hasSlotContent(slots.empty)" class="mt-conversation__empty">
            <slot name="empty" />
          </div>

          <div v-if="slots.status" class="mt-conversation__status" role="status">
            <transition name="mt-conversation-fade" mode="out-in">
              <div v-if="hasSlotContent(slots.status)">
                <slot name="status" />
              </div>
            </transition>
          </div>
        </div>
      </div>

      <transition name="mt-conversation-fade">
        <div v-if="!isAtBottom" class="mt-conversation__jump">
          <mt-button
            variant="secondary"
            square
            :aria-label="t('scrollToBottom')"
            @click="jumpToBottom"
          >
            <template #iconFront>
              <mt-icon name="regular-long-arrow-down-xs" size="12" decorative />
            </template>
          </mt-button>
        </div>
      </transition>
    </div>

    <div v-if="hasSlotContent(slots.footer)" class="mt-conversation__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { usePreferredReducedMotion, useResizeObserver } from "@vueuse/core";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import { hasSlotContent } from "@/utils/slot";

/**
 * The scrolling message list of an AI conversation. It follows new content while the user is at
 * the end, reserves a status line after the messages and keeps a footer, such as the prompt,
 * below the list.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The accessible name of the message list. Defaults to a translated "Conversation". */
    label?: string;
  }>(),
  {
    label: undefined,
  },
);

const slots = defineSlots<{
  /** The messages, for example `mt-message`. */
  default?(): unknown;
  /** Shown instead of the messages while there are none. */
  empty?(): unknown;
  /**
   * A live status after the messages, for example a `mt-text-shimmer` with `size="xs"` while a
   * response is generated. One line of `xs` text is reserved while the slot is used, so a status
   * of that height never moves the messages.
   */
  status?(): unknown;
  /** Content below the list that never scrolls, for example `mt-prompt-field`. */
  footer?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { label: "Conversation", scrollToBottom: "Scroll to the latest message" },
    de: { label: "Unterhaltung", scrollToBottom: "Zur neuesten Nachricht scrollen" },
  },
});

/** How close to the end scrolling down has to come to follow new content again, in pixels. */
const NEAR_END = 24;

const viewport = useTemplateRef<HTMLElement>("viewport");
const content = useTemplateRef<HTMLElement>("content");
const reducedMotion = usePreferredReducedMotion();

/** Whether the list follows new content. */
const isAtBottom = ref(true);
const hasContentBefore = ref(false);
const hasContentAfter = ref(false);
const scrollbarSize = ref(0);

let lastScrollTop = 0;
let lastScrollHeight = 0;

function distanceToEnd(element: HTMLElement) {
  return element.scrollHeight - element.clientHeight - element.scrollTop;
}

function update(element: HTMLElement) {
  lastScrollTop = element.scrollTop;
  lastScrollHeight = element.scrollHeight;
  hasContentBefore.value = element.scrollTop > 1;
  hasContentAfter.value = distanceToEnd(element) > 1;
}

function onScroll() {
  const element = viewport.value;
  if (!element) return;

  const scrolledUp =
    element.scrollTop < lastScrollTop - 1 && element.scrollHeight === lastScrollHeight;
  const scrolledDown = element.scrollTop > lastScrollTop;

  // Shrinking content only clamps the position, so only a scroll up at an unchanged height leaves
  // the end. Coming back to the end follows new content again.
  if (scrolledUp) {
    isAtBottom.value = false;
  } else if (distanceToEnd(element) <= (scrolledDown ? NEAR_END : 1)) {
    isAtBottom.value = true;
  }

  update(element);
}

/*
 * Every way of scrolling up leaves the end right away, before new content of a streaming response
 * is followed again. The scroll event alone comes too late when the content grows in the same frame.
 */
function leaveEnd() {
  if (viewport.value && viewport.value.scrollTop > 0) isAtBottom.value = false;
}

function onWheel(event: WheelEvent) {
  if (event.deltaY < 0) leaveEnd();
}

const SCROLL_UP_KEYS = ["ArrowUp", "PageUp", "Home"];

function onKeydown(event: KeyboardEvent) {
  if (SCROLL_UP_KEYS.includes(event.key) || (event.key === " " && event.shiftKey)) leaveEnd();
}

let touchY: number | undefined;

function onTouchstart(event: TouchEvent) {
  touchY = event.touches[0]?.clientY;
}

function onTouchmove(event: TouchEvent) {
  const y = event.touches[0]?.clientY;
  // A finger moving down scrolls the list up.
  if (y !== undefined && touchY !== undefined && y > touchY) leaveEnd();
  touchY = y;
}

function onPointerdown(event: PointerEvent) {
  // The content covers the whole list, so a press on the list itself is a press on its scrollbar.
  if (event.target === viewport.value) leaveEnd();
}

/** Scrolls to the latest message and follows new content again. */
function scrollToBottom(behavior?: ScrollBehavior) {
  const element = viewport.value;
  if (!element) return;

  isAtBottom.value = true;
  element.scrollTo({
    top: element.scrollHeight,
    behavior: behavior ?? (reducedMotion.value === "reduce" ? "instant" : "smooth"),
  });
  update(element);
}

function jumpToBottom() {
  scrollToBottom();
  // The button disappears, so the focus moves to the list instead of getting lost.
  viewport.value?.focus({ preventScroll: true });
}

// New content and a smaller list, for example while the prompt grows, keep the end in view.
useResizeObserver([content, viewport], () => {
  const element = viewport.value;
  if (!element) return;

  scrollbarSize.value = element.offsetWidth - element.clientWidth;

  if (isAtBottom.value) scrollToBottom("instant");
  else update(element);
});

onMounted(() => scrollToBottom("instant"));

defineExpose({ scrollToBottom });
</script>

<style>
@property --mt-conversation-fade-start {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}

@property --mt-conversation-fade-end {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}

/* the gap keeps the scrollbar and the fading edge clear of the footer's focus ring */
.mt-conversation {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
  min-height: 0;
}

.mt-conversation__main {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  border-radius: var(--border-radius-xs);
}

/* on the list's parent, because the fading edges of the list would fade the focus ring as well */
.mt-conversation__main:has(> .mt-conversation__viewport:focus-visible) {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(var(--scale-size-2) * -1);
}

/*
 * The edges fade where more messages are scrolled out of view. The second mask layer keeps a
 * classic scrollbar from fading.
 */
.mt-conversation__viewport {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: none;
  outline: none;
  mask-image: linear-gradient(
      to bottom,
      transparent,
      #000 var(--mt-conversation-fade-start),
      #000 calc(100% - var(--mt-conversation-fade-end)),
      transparent
    ),
    linear-gradient(#000, #000);
  mask-position:
    left top,
    right top;
  mask-repeat: no-repeat;
  mask-size:
    calc(100% - var(--mt-conversation-scrollbar-size, 0px)) 100%,
    var(--mt-conversation-scrollbar-size, 0px) 100%;
  transition:
    --mt-conversation-fade-start 0.15s ease-out,
    --mt-conversation-fade-end 0.15s ease-out;
}

.mt-conversation__viewport[data-overflow-start] {
  --mt-conversation-fade-start: var(--scale-size-32);
}

.mt-conversation__viewport[data-overflow-end] {
  --mt-conversation-fade-end: var(--scale-size-32);
}

.mt-conversation__content {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
  box-sizing: border-box;
  min-height: 100%;
  padding: var(--scale-size-16);
}

/* keeps few messages at the end; justify-content would make overflowing messages unreachable */
.mt-conversation__messages {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
  margin-block-start: auto;
}

.mt-conversation__empty {
  display: grid;
  justify-items: center;
  margin-block: auto;
  text-align: center;
}

.mt-conversation__status {
  min-height: var(--font-line-height-xs);
}

/* an overlay of its own, so showing the button never changes the height of the list */
.mt-conversation__jump {
  position: absolute;
  inset-block-end: var(--scale-size-8);
  inset-inline-start: 50%;
  translate: -50% 0;
}

.mt-conversation__footer {
  flex: none;
}

.mt-conversation-fade-enter-active {
  transition: opacity 0.2s ease-out;
}

.mt-conversation-fade-leave-active {
  transition: opacity 0.15s ease-in;
}

.mt-conversation-fade-enter-from,
.mt-conversation-fade-leave-to {
  opacity: 0;
}

@media (forced-colors: active), (prefers-contrast: more) {
  .mt-conversation__viewport {
    mask-image: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-conversation__viewport,
  .mt-conversation-fade-enter-active,
  .mt-conversation-fade-leave-active {
    transition: none;
  }
}
</style>
