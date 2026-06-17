<script setup lang="ts">
// A shy little UFO for the hero (dark mode only, while hovered). It is afraid of
// an active cursor and only dares to show itself when the cursor has been still
// for a moment: it scales in a short distance away, curiously creeps over to just
// above the cursor, and once the cursor stays put it runs a green scan. The
// instant the cursor moves it gets spooked and shrinks away.

const root = ref<HTMLElement | null>(null);
const ufo = ref<HTMLElement | null>(null);
const show = ref(false);
const scanning = ref(false);

let hero: HTMLElement | null = null;
let raf = 0;
let running = false;
let reduced = false;
let hovering = false;

// Coordinates are relative to the hero's top-left.
const target = { x: 0, y: 0 }; // cursor position, offset to sit above the cursor
const pos = { x: 0, y: 0 }; // current position
const from = { x: 0, y: 0 }; // where the current creep started
const dest = { x: 0, y: 0 }; // where the current creep ends

const OFFSET_X = -4; // sit a tiny bit to the left of the cursor
const OFFSET_Y = -26; // hover a bit above the cursor
const IDLE_DELAY = 1600; // cursor must be still this long before it dares appear
const MOVE_EPS = 5; // movement under this counts as "still"
const SWAY_AMP = 2; // tiny left-right sway while scanning

type Phase = "hidden" | "appear" | "approach" | "scan" | "flee";
let phase: Phase = "hidden";
let gliding = false;
let scaleVal = 0;
let scaleFrom = 0;
let tStart = 0;
let tDur = 320;
let moveStart = 0;
let moveDur = 800;
let prevX = 0;
let lastMoveTime = 0;
let dismissAfterFlee = false;
let leaveTimer: ReturnType<typeof setTimeout> | null = null;
let scanRestX = 0;
let scanRestY = 0;
let scanStart = 0;

const dist = (ax: number, ay: number, bx: number, by: number) =>
  Math.hypot(ax - bx, ay - by);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const isDark = () => document.documentElement.classList.contains("dark");

// Just for fun: while scanning, rapidly cycle the page cursor through every CSS
// cursor keyword via an injected global !important rule. Torn down when scanning
// stops.
const CURSORS = [
  "cell",
  "crosshair",
  "text",
  "vertical-text",
  "alias",
  "move",
  "grab",
  "grabbing",
  "all-scroll",
  "col-resize",
  "row-resize",
];
let cursorTimer: ReturnType<typeof setInterval> | null = null;
let cursorStyle: HTMLStyleElement | null = null;
let cursorIdx = 0;

function startCursorCycle() {
  if (cursorTimer) return;
  cursorStyle = document.createElement("style");
  document.head.appendChild(cursorStyle);
  cursorTimer = setInterval(() => {
    cursorIdx = (cursorIdx + 1) % CURSORS.length;
    if (cursorStyle) {
      cursorStyle.textContent = `* { cursor: ${CURSORS[cursorIdx] ?? "default"} !important; }`;
    }
  }, 70);
}

function stopCursorCycle() {
  if (cursorTimer) {
    clearInterval(cursorTimer);
    cursorTimer = null;
  }
  if (cursorStyle) {
    cursorStyle.remove();
    cursorStyle = null;
  }
}

watch(scanning, (on) => (on ? startCursorCycle() : stopCursorCycle()));

function glideTo(x: number, y: number, dur: number | null, now: number) {
  from.x = pos.x;
  from.y = pos.y;
  dest.x = x;
  dest.y = y;
  moveStart = now;
  moveDur =
    dur ?? Math.min(1700, Math.max(700, dist(from.x, from.y, x, y) * 5));
  gliding = true;
}

function startAppear(now: number) {
  // Pop in a short, random distance away from the cursor (peeking).
  const ang = Math.random() * Math.PI * 2;
  const d = 70 + Math.random() * 45;
  pos.x = target.x + Math.cos(ang) * d;
  pos.y = target.y + Math.sin(ang) * d;
  scaleVal = 0;
  phase = "appear";
  tStart = now;
  tDur = 320;
}

function startFlee(now: number) {
  phase = "flee";
  scanning.value = false;
  gliding = false;
  scaleFrom = scaleVal;
  tStart = now;
  tDur = 240;
}

function frame(now: number) {
  if (!running) return;
  prevX = pos.x;

  if (phase === "hidden") {
    scaleVal = 0;
    if (hovering && now - lastMoveTime > IDLE_DELAY) startAppear(now);
  } else if (phase === "appear") {
    const t = clamp01((now - tStart) / tDur);
    scaleVal = easeOut(t);
    if (t >= 1) {
      scaleVal = 1;
      phase = "approach";
      glideTo(
        target.x + (Math.random() - 0.5) * 24,
        target.y + (Math.random() - 0.5) * 14,
        null,
        now,
      );
    }
  } else if (phase === "flee") {
    const t = clamp01((now - tStart) / tDur);
    scaleVal = scaleFrom * (1 - easeOut(t));
    if (t >= 1) {
      scaleVal = 0;
      if (dismissAfterFlee) {
        dismissAfterFlee = false;
        show.value = false;
        stop();
        return;
      }
      phase = "hidden";
    }
  } else if (gliding) {
    // approach: cautiously creep over to just above the cursor
    const t = clamp01((now - moveStart) / moveDur);
    const e = easeInOut(t);
    pos.x = from.x + (dest.x - from.x) * e;
    pos.y = from.y + (dest.y - from.y) * e;
    if (t >= 1) {
      gliding = false;
      phase = "scan";
      scanning.value = true;
      scanRestX = pos.x;
      scanRestY = pos.y;
      scanStart = now;
    }
  } else if (phase === "scan") {
    // tiny left-right sway while it scans
    pos.x = scanRestX + Math.sin((now - scanStart) * 0.004) * SWAY_AMP;
    pos.y = scanRestY;
  }

  const tilt =
    phase === "approach" || phase === "scan"
      ? Math.max(-14, Math.min(14, (pos.x - prevX) * 1.6))
      : 0;
  if (ufo.value) {
    ufo.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tilt}deg) scale(${scaleVal})`;
  }
  raf = requestAnimationFrame(frame);
}

function start() {
  if (running) return;
  running = true;
  raf = requestAnimationFrame(frame);
}

function stop() {
  running = false;
  cancelAnimationFrame(raf);
  gliding = false;
  scanning.value = false;
  phase = "hidden";
  scaleVal = 0;
  show.value = false;
}

function onMove(e: PointerEvent) {
  if (!hero) return;
  const r = hero.getBoundingClientRect();
  const nx = e.clientX - r.left + OFFSET_X;
  const ny = e.clientY - r.top + OFFSET_Y;
  const moved = dist(nx, ny, target.x, target.y) > MOVE_EPS;
  target.x = nx;
  target.y = ny;
  if (moved) {
    lastMoveTime = performance.now();
    // An active cursor scares it off.
    if (phase !== "hidden" && phase !== "flee") startFlee(performance.now());
  }
}

function onEnter(e: PointerEvent) {
  if (reduced || !isDark()) return;
  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
  hovering = true;
  dismissAfterFlee = false;
  onMove(e);
  lastMoveTime = performance.now(); // entering counts as activity
  show.value = true;
  if (!running) {
    phase = "hidden";
    scaleVal = 0;
    start();
  }
}

function onLeave() {
  hovering = false;
  if (!running || leaveTimer) return;
  // Linger a few seconds before it leaves, in case the cursor comes back.
  leaveTimer = setTimeout(() => {
    leaveTimer = null;
    if (!running) return;
    if (phase === "hidden") {
      show.value = false;
      stop();
    } else {
      dismissAfterFlee = true;
      startFlee(performance.now());
    }
  }, 3000);
}

onMounted(() => {
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  hero = root.value?.parentElement ?? null;
  if (!hero) return;
  hero.addEventListener("pointermove", onMove);
  hero.addEventListener("pointerenter", onEnter);
  hero.addEventListener("pointerleave", onLeave);
});

onBeforeUnmount(() => {
  if (hero) {
    hero.removeEventListener("pointermove", onMove);
    hero.removeEventListener("pointerenter", onEnter);
    hero.removeEventListener("pointerleave", onLeave);
  }
  if (leaveTimer) clearTimeout(leaveTimer);
  stopCursorCycle();
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div
    ref="root"
    aria-hidden="true"
    class="ufo-root pointer-events-none absolute inset-0 z-10 hidden overflow-hidden dark:block"
    :class="{ 'is-on': show, 'is-scan': scanning }"
  >
    <div ref="ufo" class="ufo">
      <div class="ufo-bob">
        <svg width="38" height="27" viewBox="0 0 38 27" fill="none">
          <g class="ufo-cone">
            <g class="cone-layer cone-blue">
              <path
                class="cone-pulse cone-pulse-idle"
                d="M14 17 L24 17 L28 26 L10 26 Z"
                fill="url(#ufoBeam)"
              />
            </g>
            <g class="cone-layer cone-green">
              <path
                class="cone-pulse cone-pulse-scan"
                d="M11 17 L27 17 L37 44 L1 44 Z"
                fill="url(#ufoScan)"
              />
            </g>
          </g>
          <ellipse
            cx="19"
            cy="16"
            rx="16"
            ry="5.2"
            fill="url(#ufoBody)"
            stroke="#ffffff"
            stroke-opacity="0.06"
            stroke-width="0.6"
          />
          <ellipse
            cx="19"
            cy="14.2"
            rx="13"
            ry="3.2"
            fill="url(#ufoRim)"
            opacity="0.55"
          />
          <path
            d="M10 14 A9 8.5 0 0 1 28 14 Z"
            fill="url(#ufoDome)"
            stroke="#ffffff"
            stroke-opacity="0.06"
            stroke-width="0.6"
          />
          <ellipse
            cx="15"
            cy="9"
            rx="2.2"
            ry="1.3"
            fill="#ffffff"
            opacity="0.6"
          />
          <circle class="ufo-light l1" cx="10.5" cy="17.4" r="1.6" />
          <circle class="ufo-light l2" cx="19" cy="18.6" r="1.6" />
          <circle class="ufo-light l3" cx="27.5" cy="17.4" r="1.6" />
          <defs>
            <linearGradient id="ufoBody" x1="0" y1="11" x2="0" y2="21">
              <stop offset="0" stop-color="#2a2f37" />
              <stop offset="1" stop-color="#090b0e" />
            </linearGradient>
            <linearGradient id="ufoRim" x1="0" y1="11" x2="0" y2="17">
              <stop offset="0" stop-color="#aeb9cd" />
              <stop offset="1" stop-color="#aeb9cd" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="ufoDome" x1="0" y1="5" x2="0" y2="14">
              <stop offset="0" stop-color="#232831" />
              <stop offset="1" stop-color="#08090c" />
            </linearGradient>
            <linearGradient id="ufoBeam" x1="19" y1="17" x2="19" y2="26">
              <stop offset="0" stop-color="#9fb6d8" stop-opacity="0.55" />
              <stop offset="1" stop-color="#9fb6d8" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="ufoScan" x1="19" y1="17" x2="19" y2="44">
              <stop offset="0" stop-color="#4ade80" stop-opacity="0.85" />
              <stop offset="1" stop-color="#4ade80" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ufo-root {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ufo-root.is-on {
  opacity: 1;
}

.ufo {
  position: absolute;
  top: 0;
  left: 0;
  width: 38px;
  height: 27px;
  margin: -13.5px 0 0 -19px;
  will-change: transform;
}

.ufo-bob {
  animation: ufo-bob 2.6s ease-in-out infinite;
}

.ufo-bob svg {
  display: block;
  overflow: visible;
  filter: drop-shadow(0 0 6px rgba(150, 180, 235, 0.4));
  transition: filter 0.7s ease;
}

.ufo-light {
  fill: #60a5fa;
  transition: fill 0.7s ease;
  animation: ufo-blink 1.3s ease-in-out infinite;
}

.ufo-light.l2 {
  animation-delay: 0.42s;
}

.ufo-light.l3 {
  animation-delay: 0.84s;
}

.is-scan .ufo-light {
  fill: #4ade80;
}

.ufo-cone {
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 28%,
    transparent 100%
  );
  mask-image: linear-gradient(to bottom, #000 0%, #000 28%, transparent 100%);
}

.cone-layer {
  transition: opacity 0.7s ease;
}

.cone-blue {
  opacity: 1;
}

.cone-green {
  opacity: 0;
}

.is-scan .cone-blue {
  opacity: 0;
}

.is-scan .cone-green {
  opacity: 1;
}

.cone-pulse-idle {
  animation: cone-pulse 2.4s ease-in-out infinite;
}

.cone-pulse-scan {
  animation: cone-pulse 1.1s ease-in-out infinite;
}

.is-scan .ufo-bob svg {
  filter: drop-shadow(0 0 10px rgba(74, 222, 128, 0.6));
}

@keyframes ufo-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes ufo-blink {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@keyframes cone-pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.95;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ufo-root {
    display: none;
  }
}
</style>
