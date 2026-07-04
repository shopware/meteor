<script setup lang="ts">
// Curved "wheel" carousel: cards sit on the top arc of a large circle, the
// centered one upright and the rest fanning out with progressive rotation.
// Cards are positioned with a reactive :style so the arc renders correctly on
// the server too; dragging writes transforms straight to the DOM for smoothness.
// Card visuals come from the parent via the `#visual` scoped slot.

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

// Where card `i` sits for a given (possibly fractional) active position. The
// offset is wrapped to the nearest equivalent so the arc loops endlessly.
function place(i: number, effectiveActive: number) {
  const n = props.items.length;
  let o = i - effectiveActive;
  o -= n * Math.round(o / n);
  const angle = o * STEP;
  const rad = (angle * Math.PI) / 180;
  return {
    transform: `translate(-50%, -50%) translate(${R * Math.sin(rad)}px, ${
      R * (1 - Math.cos(rad))
    }px) rotate(${angle}deg) scale(${Math.max(0.8, 1 - Math.abs(o) * 0.05)})`,
    opacity: Math.max(0, 1 - Math.abs(o) * 0.24),
    dist: Math.abs(o),
  };
}

// Reactive settled style, used for the server render and whenever the active
// card changes (CSS transitions animate the move).
function cardStyle(i: number) {
  const p = place(i, activeIndex.value);
  return {
    transform: p.transform,
    opacity: String(p.opacity),
    zIndex: String(1000 - Math.round(p.dist * 10)),
    pointerEvents: p.dist < 3.5 ? "auto" : "none",
  } as Record<string, string>;
}

// Far cards are transparent; snapping them across the loop seam avoids a ghost
// flying across the screen when the active card wraps.
function isFar(i: number) {
  return place(i, activeIndex.value).dist > 3.6;
}

// Write transforms straight to the DOM (no reactive churn per pointer move).
function apply(effectiveActive: number) {
  props.items.forEach((_, i) => {
    const el = cardEls[i];
    if (!el) return;
    const p = place(i, effectiveActive);
    el.style.transform = p.transform;
    el.style.opacity = String(p.opacity);
    el.style.zIndex = String(1000 - Math.round(p.dist * 10));
    el.style.pointerEvents = p.dist < 3.5 ? "auto" : "none";
  });
}

function go(dir: number) {
  activeIndex.value = wrapIndex(activeIndex.value + dir);
}

// Drag handling: transitions are disabled while dragging (is-dragging) and
// restored on release.
let dragging = false;
let captured = false;
let pointerId = 0;
let startX = 0;
let moved = 0;
let dragFrac = 0;

function onPointerDown(event: PointerEvent) {
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
  // Changing activeIndex re-renders :style (with transition); when it doesn't
  // change, snap the dragged transforms back to the settled position ourselves.
  if (target === activeIndex.value) apply(activeIndex.value);
  else activeIndex.value = target;
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
</script>

<template>
  <div class="docs-carousel">
    <div
      ref="viewport"
      class="docs-carousel__viewport"
      tabindex="0"
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
          :class="{ 'is-active': i === activeIndex, 'is-far': isFar(i) }"
          :style="cardStyle(i)"
        >
          <NuxtLink
            :to="item.to"
            class="doc-slide"
            draggable="false"
            :tabindex="i === activeIndex ? 0 : -1"
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

    <div class="docs-carousel__controls">
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

.docs-carousel__viewport {
  touch-action: pan-y;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  /* Contain the arc horizontally (so the off-screen cards never create a page
     scrollbar). The clip box is grown with padding, then handed back to the
     layout via matching negative margins, because WebKit clips BOTH axes when
     either one is clipped: without the headroom, the side cards curving down
     the arc (and the hovered card's top) get cut at the box edge. */
  overflow-x: clip;
  padding-top: 32px;
  margin-top: -32px;
  padding-bottom: 240px;
  margin-bottom: -240px;
}
.doc-slide {
  -webkit-user-drag: none;
}

/* The arc spans the full viewport width. The height leaves room below the
   centered card for its hover expansion ("Read more" growing the card
   downward); the side cards' arc drop spills into the viewport's padding
   headroom above. No edge-fade mask: the per-card opacity falloff already
   fades the arc out toward the sides, and a mask would put a visible cut
   through the slides where they curve toward the edges. */
/* The grab cursor lives on the wheel (not the viewport) so the viewport's
   clip-headroom padding below the arc doesn't advertise dragging. */
.docs-carousel__wheel {
  position: relative;
  height: 460px;
  cursor: grab;
}
/* One card at a time on phones (and its "Read more" is always expanded there),
   so the wheel doesn't need the desktop headroom; tighten the gap down to the
   controls. */
@media (max-width: 639.98px) {
  .docs-carousel__wheel {
    height: 420px;
  }
}
.docs-carousel__wheel.is-dragging {
  cursor: grabbing;
}
.docs-carousel__card {
  position: absolute;
  top: 45%;
  left: 50%;
  /* Desktop width everywhere; on small screens the card just caps at 90% of
     the viewport instead of shrinking early. */
  width: 390px;
  max-width: 90vw;
  max-width: 90dvw;
  transition:
    transform 0.55s var(--ease-out),
    opacity 0.55s var(--ease-out);
  transform-origin: center center;
  will-change: transform;
}
/* Snap far (transparent) cards instead of animating them across the loop seam. */
.docs-carousel__card.is-far {
  transition: none;
}
.docs-carousel__wheel.is-dragging .docs-carousel__card {
  transition: none;
}

/* --- Card --- */
.doc-slide {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  /* 1rem matches the landing page's other card surfaces (accordion items and
     the copy-command line). */
  border-radius: 1rem;
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

@media (prefers-reduced-motion: reduce) {
  .docs-carousel__card {
    transition: none;
  }
}
</style>
