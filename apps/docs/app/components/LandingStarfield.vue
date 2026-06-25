<script setup lang="ts">
// Positions come from a seeded PRNG so server and client render identical
// markup (no hydration mismatch).

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  duration: number;
  delay: number;
}

const props = withDefaults(
  defineProps<{
    starCount?: number;
    meteorCount?: number;
  }>(),
  {
    starCount: 220,
    meteorCount: 2,
  },
);

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

const stars = computed<Star[]>(() => {
  const rand = createRandom(0x5eed);
  return Array.from({ length: props.starCount }, () => ({
    x: round(rand() * 100, 3),
    y: round(rand() * 100, 3),
    size: round(rand() * 1.7 + 0.7),
    opacity: round(rand() * 0.5 + 0.35),
    duration: round(rand() * 3 + 2.5),
    delay: round(rand() * 6),
  }));
});

const meteors = computed<Meteor[]>(() => {
  const rand = createRandom(0xc0ffee);
  // Spread start positions evenly across the width (one per band, with jitter)
  // so a handful of meteors still cover the full hero, not just the left side.
  return Array.from({ length: props.meteorCount }, (_, i) => ({
    x: round(8 + ((i + rand()) / props.meteorCount) * 84, 3),
    y: round(rand() * 45 - 8, 3),
    length: round(rand() * 150 + 130, 1),
    duration: round(rand() * 2.5 + 3),
    delay: round(rand() * 13),
  }));
});
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <span
      v-for="(star, index) in stars"
      :key="`star-${index}`"
      class="starfield__star"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        '--star-opacity': star.opacity,
        '--twinkle-duration': `${star.duration}s`,
        '--twinkle-delay': `${star.delay}s`,
      }"
    />

    <span
      v-for="(meteor, index) in meteors"
      :key="`meteor-${index}`"
      class="starfield__meteor"
      :style="{
        left: `${meteor.x}%`,
        top: `${meteor.y}%`,
        width: `${meteor.length}px`,
        '--meteor-duration': `${meteor.duration}s`,
        '--meteor-delay': `${meteor.delay}s`,
      }"
    />
  </div>
</template>

<style scoped>
.starfield {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  --star-color: var(--color-brand-700);
  --star-base: 0.45;
  --meteor-head: var(--color-brand-500);
  --meteor-trail: rgba(8, 112, 255, 0.35);
}

.dark .starfield {
  --star-color: #8fb0e6;
  --star-base: 1;
  --meteor-head: #ffffff;
  --meteor-trail: rgba(160, 196, 255, 0.65);
}

.starfield__star {
  position: absolute;
  border-radius: 50%;
  background: var(--star-color);
  opacity: calc(var(--star-opacity) * var(--star-base));
  box-shadow: 0 0 4px 0 var(--star-color);
  animation: twinkle var(--twinkle-duration) ease-in-out var(--twinkle-delay)
    infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: calc(var(--star-opacity) * var(--star-base) * 0.3);
    transform: scale(0.85);
  }
  50% {
    opacity: calc(var(--star-opacity) * var(--star-base));
    transform: scale(1);
  }
}

.starfield__meteor {
  position: absolute;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    transparent,
    var(--meteor-trail) 55%,
    var(--meteor-head)
  );
  filter: drop-shadow(0 0 6px var(--meteor-head));
  opacity: 0;
  /* Head (the bright right end) leads down-left; trail follows up-right. */
  transform: rotate(135deg) translateX(0) scale(0.3);
  animation: meteor var(--meteor-duration) linear var(--meteor-delay) infinite;
}

/* Grows from small to full size mid-flight, then shrinks away. */
@keyframes meteor {
  0% {
    opacity: 0;
    transform: rotate(135deg) translateX(0) scale(0.3);
  }
  8% {
    opacity: 0.45;
  }
  50% {
    transform: rotate(135deg) translateX(360px) scale(1);
  }
  62% {
    opacity: 0.45;
  }
  100% {
    opacity: 0;
    transform: rotate(135deg) translateX(720px) scale(0.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .starfield__star {
    animation: none;
    opacity: calc(var(--star-opacity) * var(--star-base));
    transform: none;
  }

  .starfield__meteor {
    display: none;
  }
}
</style>
