<script setup lang="ts">
// Curved "wheel" carousel: cards sit on the top arc of a large circle, the
// centered one upright and the rest fanning out with progressive rotation.
// Progressive enhancement: renders a plain responsive grid on the server and
// for reduced-motion / no-JS visitors, then upgrades to the draggable arc on
// the client. Card visuals come from the parent via the `#visual` scoped slot.

export interface DocCard {
  key: string;
  title: string;
  description: string;
  to: string;
}

const props = defineProps<{
  items: DocCard[];
}>();

// Arc geometry. R is the (virtual) circle radius; STEP the angle between cards;
// ADVANCE how many pixels of drag advance one card.
const R = 3550;
const STEP = 7;
const ADVANCE = 320;

// Start on the first card; the loop still fans cards out on both sides.
const activeIndex = ref(0);
const enhanced = ref(false);

const viewport = ref<HTMLElement | null>(null);
const wheel = ref<HTMLElement | null>(null);
const cardEls: HTMLElement[] = [];
const setCard = (el: Element | null, i: number) => {
  if (el) cardEls[i] = el as HTMLElement;
};

const wrapIndex = (v: number) => {
  const n = props.items.length;
  return ((v % n) + n) % n;
};

// Position every card for a given (possibly fractional) active position. Each
// card's offset is wrapped to the nearest equivalent so the arc loops endlessly;
// far cards (which are transparent) snap instead of animating across the seam.
function apply(effectiveActive: number) {
  const n = props.items.length;
  props.items.forEach((_, i) => {
    const el = cardEls[i];
    if (!el) return;
    let o = i - effectiveActive;
    o -= n * Math.round(o / n);
    const angle = o * STEP;
    const rad = (angle * Math.PI) / 180;
    const x = R * Math.sin(rad);
    const y = R * (1 - Math.cos(rad));
    const dist = Math.abs(o);
    const scale = Math.max(0.8, 1 - dist * 0.05);
    const opacity = Math.max(0, 1 - dist * 0.24);
    el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale})`;
    el.style.opacity = String(opacity);
    el.style.zIndex = String(1000 - Math.round(dist * 10));
    el.style.pointerEvents = dist < 3.5 ? "auto" : "none";
    el.style.transition = dist > 3.6 ? "none" : "";
  });
}

function go(dir: number) {
  activeIndex.value = wrapIndex(activeIndex.value + dir);
}

// Drag handling: transforms are written straight to the DOM (no reactive state
// per move), transitions disabled while dragging and restored on release.
let dragging = false;
let captured = false;
let pointerId = 0;
let startX = 0;
let moved = 0;
let dragFrac = 0;

function onPointerDown(event: PointerEvent) {
  if (!enhanced.value) return;
  dragging = true;
  captured = false;
  moved = 0;
  dragFrac = 0;
  startX = event.clientX;
  pointerId = event.pointerId;
  wheel.value?.classList.add("is-dragging");
}

function onPointerMove(event: PointerEvent) {
  if (!dragging) return;
  const dx = event.clientX - startX;
  moved = Math.max(moved, Math.abs(dx));
  // Capture only once a real drag begins; capturing on pointerdown would
  // retarget the click and stop the card links from navigating.
  if (!captured && moved > 4) {
    try {
      viewport.value?.setPointerCapture(pointerId);
    } catch {
      // Ignore: some environments reject capture; drag still works without it.
    }
    captured = true;
  }
  dragFrac = dx / ADVANCE;
  apply(activeIndex.value - dragFrac);
}

function onPointerUp() {
  if (!dragging) return;
  dragging = false;
  wheel.value?.classList.remove("is-dragging");
  const target = wrapIndex(Math.round(activeIndex.value - dragFrac));
  dragFrac = 0;
  if (target === activeIndex.value) apply(activeIndex.value);
  else activeIndex.value = target; // watcher re-applies with transition
}

function onCardClick(event: MouseEvent, index: number) {
  // A real drag shouldn't navigate.
  if (moved > 6) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  // Clicking a side card brings it to the center instead of following its link;
  // only the centered card navigates.
  if (index !== activeIndex.value) {
    event.preventDefault();
    event.stopPropagation();
    activeIndex.value = index;
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    go(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    go(1);
  }
}

let resizeRaf = 0;
function onResize() {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => apply(activeIndex.value));
}

watch(activeIndex, () => {
  if (enhanced.value) apply(activeIndex.value);
});

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; // keep the accessible grid
  enhanced.value = true;
  nextTick(() => {
    // Position without animating the jump from the grid layout.
    wheel.value?.classList.add("is-dragging");
    apply(activeIndex.value);
    requestAnimationFrame(() => wheel.value?.classList.remove("is-dragging"));
  });
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeRaf);
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div class="docs-carousel" :class="{ 'is-enhanced': enhanced }">
    <div
      ref="viewport"
      class="docs-carousel__viewport"
      :tabindex="enhanced ? 0 : -1"
      role="group"
      aria-roledescription="carousel"
      aria-label="Explore the docs. Use the arrow keys to move between cards."
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @dragstart.prevent
      @keydown="onKeydown"
    >
      <div ref="wheel" class="docs-carousel__wheel">
        <div
          v-for="(item, i) in items"
          :key="item.key"
          :ref="(el) => setCard(el as Element | null, i)"
          class="docs-carousel__card"
          :class="{ 'is-active': i === activeIndex }"
        >
          <NuxtLink
            :to="item.to"
            class="doc-slide"
            draggable="false"
            :tabindex="enhanced && i !== activeIndex ? -1 : 0"
            @click.capture="onCardClick($event, i)"
          >
            <div class="doc-slide__visual">
              <slot name="visual" :item="item" />
            </div>
            <div class="doc-slide__body">
              <h3 class="doc-slide__title">{{ item.title }}</h3>
              <p class="doc-slide__desc">{{ item.description }}</p>
              <div class="doc-slide__reveal">
                <div class="doc-slide__reveal-inner">
                  <span class="doc-slide__cta">
                    Read more
                    <UIcon name="i-lucide-arrow-right" class="size-4" />
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="enhanced" class="docs-carousel__controls">
      <button
        type="button"
        class="docs-carousel__nav"
        aria-label="Previous card"
        @click="go(-1)"
      >
        <UIcon name="i-lucide-chevron-left" class="size-5" />
      </button>
      <button
        type="button"
        class="docs-carousel__nav"
        aria-label="Next card"
        @click="go(1)"
      >
        <UIcon name="i-lucide-chevron-right" class="size-5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Own stacking context so the elevated cards can't paint over the site header. */
.docs-carousel {
  position: relative;
  isolation: isolate;
}

/* --- Fallback: responsive grid (server render, no-JS, reduced motion). Capped
   to the small container width so it matches the rest of the page. --- */
.docs-carousel__wheel {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: var(--ui-container-small, 80rem);
  margin-inline: auto;
  padding-inline: 1rem;
}
@media (min-width: 640px) {
  .docs-carousel__wheel {
    grid-template-columns: repeat(2, 1fr);
    padding-inline: 1.5rem;
  }
}
@media (min-width: 1024px) {
  .docs-carousel__wheel {
    grid-template-columns: repeat(3, 1fr);
    padding-inline: 2rem;
  }
}

/* --- Enhanced: the arc spans the full viewport width --- */
.is-enhanced .docs-carousel__viewport {
  cursor: grab;
  touch-action: pan-y;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
}
.is-enhanced .doc-slide {
  -webkit-user-drag: none;
}
.is-enhanced .docs-carousel__wheel {
  position: relative;
  display: block;
  height: 430px;
  max-width: none;
  margin-inline: 0;
  padding-inline: 0;
  /* Clip horizontally (no page scroll) but let cards spill downward so the
     lower cards in the arc aren't cut off. */
  overflow-x: clip;
  overflow-y: visible;
}
.is-enhanced .docs-carousel__wheel.is-dragging {
  cursor: grabbing;
}
.is-enhanced .docs-carousel__card {
  position: absolute;
  top: 45%;
  left: 50%;
  width: clamp(300px, 25vw, 390px);
  transition:
    transform 0.55s var(--ease-out),
    opacity 0.55s var(--ease-out);
  transform-origin: center center;
  will-change: transform;
}
.is-enhanced .docs-carousel__wheel.is-dragging .docs-carousel__card {
  transition: none;
}

/* --- Card --- */
.doc-slide {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 1.25rem;
  background: var(--ui-bg);
  /* Shared landing elevation (defined on .landing) so cards match the accordion
   * and copy line in both themes. */
  box-shadow: var(--landing-elev);
  height: 100%;
}

.doc-slide__visual {
  position: relative;
  height: 240px;
  overflow: hidden;
  border-bottom: 1px solid var(--ui-border);
  background-color: var(--ui-bg);
}
.dark .doc-slide__visual {
  background-color: var(--ui-bg-muted);
}
.doc-slide__body {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}
.doc-slide__title {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.doc-slide__desc {
  margin-top: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ui-text-muted);
}
/* "Read more" is hidden by default and slides up into view on hover: the grid
 * row expands (0fr -> 1fr) while the link fades and rises. */
.doc-slide__reveal {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s var(--ease-out);
}
.doc-slide__reveal-inner {
  min-height: 0;
  overflow: hidden;
}
.doc-slide__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ui-primary);
  opacity: 0;
  transform: translateY(6px);
  filter: blur(6px);
  transition:
    opacity 0.3s ease,
    transform 0.3s var(--ease-out),
    filter 0.3s ease;
}
.doc-slide__cta :deep(svg) {
  transition: transform 0.2s var(--ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .doc-slide:hover .doc-slide__reveal {
    grid-template-rows: 1fr;
  }
  .doc-slide:hover .doc-slide__cta {
    opacity: 1;
    transform: translateY(0);
    filter: none;
  }
  .doc-slide:hover .doc-slide__cta :deep(svg) {
    transform: translateX(0.15rem);
  }
}
/* No hover (touch) or reduced motion: keep the link visible and static. */
@media (hover: none), (prefers-reduced-motion: reduce) {
  .doc-slide__reveal {
    grid-template-rows: 1fr;
    transition: none;
  }
  .doc-slide__cta {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}

/* --- Controls --- */
.docs-carousel__controls {
  position: relative;
  z-index: 1001;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: -1.25rem;
}
.docs-carousel__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid var(--ui-border);
  border-radius: 16px;
  corner-shape: squircle;
  background: var(--ui-bg);
  color: var(--ui-text-muted);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.14s var(--ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .docs-carousel__nav:hover:not(:disabled) {
    color: var(--ui-text-highlighted);
    border-color: var(--ui-border-accented);
  }
}
.docs-carousel__nav:active:not(:disabled) {
  transform: scale(0.94);
}
.docs-carousel__nav:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
