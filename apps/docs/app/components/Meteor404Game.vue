<script setup lang="ts">
// A meteor-shooting arcade mini-game for the 404 page. Pure canvas 2D, no
// engine, no sound. Colors are resolved at runtime from the design system's CSS custom
// properties (--ui-*), so the game follows light and dark mode automatically.
//
// Performance notes:
// - Fixed simulation timestep decoupled from requestAnimationFrame.
// - All entities (bullets, meteors, particles, popups) live in preallocated
//   pools, so the render/update hot path avoids per-frame allocation (score
//   popups build a short label string only on the event that spawns them).
// - Canvas is sized for devicePixelRatio (capped at 2) for crisp rendering
//   without over-rendering on high-density displays.
import { useClipboard } from "@vueuse/core";

type GamePhase = "playing" | "paused" | "dying" | "over";

interface Bullet {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Meteor {
  active: boolean;
  tier: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  spin: number;
  // Radial jitter per polygon vertex, refilled on spawn (no reallocation).
  verts: Float32Array;
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  color: number;
}

interface Glyph {
  char: string;
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  radius: number;
  hp: number;
  flash: number;
}

interface Popup {
  active: boolean;
  x: number;
  y: number;
  life: number;
  ttl: number;
  text: string;
}

interface MenuItem {
  id: "resume" | "restart" | "copy";
  label: string;
}

const TAU = Math.PI * 2;
const STEP = 1 / 60;
const MAX_FRAME_DELTA = 0.1;

const MAX_BULLETS = 12;
// The trickle spawner caps the live field at maxField() (<= 18), but each
// destroyed large/medium rock adds two fragments on top of that, so the pool
// needs headroom above the field cap or splits get silently dropped when full.
const MAX_METEORS = 48;
const MAX_PARTICLES = 180;
const MAX_POPUPS = 6;
const METEOR_VERTS = 11;
const STAR_COUNT = 70;
const GLYPH_HP = 4;

const SHIP = {
  radius: 11,
  turnSpeed: 3.8,
  thrust: 340,
  maxSpeed: 420,
  damping: 0.55,
  fireCooldown: 0.16,
  bulletSpeed: 540,
  bulletLife: 1.05,
  spawnShield: 2.4,
};

// Large, medium, small. Smaller pieces are faster and worth more.
const TIERS = [
  { radius: 34, speed: 55, score: 20 },
  { radius: 20, speed: 90, score: 50 },
  { radius: 11, speed: 130, score: 100 },
];

// Each "4 0 4" glyph pays out a flat 404: the pun outranks the difficulty
// scaling here. Only the full-set bonus scales with the level.
const GLYPH_SCORE = 404;
const GLYPH_SET_BONUS = 1000;

// Difficulty ramp: every LEVEL_SECONDS of survival raises the level, which
// speeds meteors up, allows more of them, spawns them more often, and
// scales all score values up in step.
const LEVEL_SECONDS = 25;
const speedScale = (lvl: number) => Math.min(1 + 0.1 * (lvl - 1), 2);
const maxField = (lvl: number) => Math.min(6 + 2 * (lvl - 1), 18);
const trickleDelay = (lvl: number) => Math.max(4.5 - 0.35 * (lvl - 1), 1.5);
const scoreScale = (lvl: number) => 1 + 0.25 * (lvl - 1);

// Increasingly broken outline as a glyph takes hits (setLineDash patterns).
const GLYPH_DASHES: number[][] = [[], [10, 3], [6, 4], [3, 4]];

// Keys the game claims. During play they steer the ship; on the pause and
// game-over screens Up/Down/W/S move the menu and Enter/Space select.
const GAME_CODES = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "KeyA",
  "KeyD",
  "KeyW",
  "KeyS",
  "Space",
  "Enter",
  "Escape",
]);

// Shown as the game-over headline; rotates so repeat runs stay fresh.
const GAME_OVER_MESSAGES = [
  "Your ship is space dust",
  "That meteor had your name on it",
  "The debris field wins this round",
  "Signal lost in sector 404",
  "A bold flight path, pilot",
  "The vacuum claims another explorer",
];

// interactive=false runs the game as an ambient background (used on touch
// devices and small viewports): no ship, controls, HUD, or scoring, just the
// 404 glyphs and meteors drifting forever. See error.vue for the gate.
const props = withDefaults(defineProps<{ interactive?: boolean }>(), {
  interactive: true,
});

// Reactive state consumed by the template. Everything the frame loop touches
// per-frame lives in plain variables instead.
const phase = ref<GamePhase>("playing");
const score = ref(0);
const level = ref(1);
const gameOverTitle = ref(GAME_OVER_MESSAGES[0]!);

// @vueuse/core clipboard, the same primitive the docs' other copy affordances
// use. It provides the `copied` state (auto-resets after copiedDuring) and a
// legacy execCommand fallback for non-secure contexts, so we don't hand-roll
// either.
const { copy: writeToClipboard, copied } = useClipboard({
  copiedDuring: 2000,
  legacy: true,
});

// Text-only arcade menu on the pause and game-over screens. The selected item
// is marked with >>> <<< instead of a button treatment.
const menuIndex = ref(0);
const menuItems = computed<MenuItem[]>(() => {
  if (phase.value === "paused") {
    return [{ id: "resume", label: "Resume" }];
  }
  if (phase.value === "over") {
    const items: MenuItem[] = [{ id: "restart", label: "Play again" }];
    if (score.value > 0) {
      items.push({
        id: "copy",
        label: copied.value ? "Copied!" : "Copy message",
      });
    }
    return items;
  }
  return [];
});

const multiplierLabel = computed(() =>
  scoreScale(level.value)
    .toFixed(2)
    .replace(/\.?0+$/, ""),
);

// Grouped with thousands separators, pinned to en-US so it always reads with
// commas regardless of the visitor's locale.
const formattedScore = computed(() => score.value.toLocaleString("en-US"));

const wrapperRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let viewW = 0;
let viewH = 0;
let dpr = 1;

let rafId = 0;
let lastTime = 0;
let accumulator = 0;
let renderT = 0;

let elapsed = 0;
let currentLevel = 1;
let trickleTimer = 0;
let glyphRespawn = 0;
let shakeTime = 0;
let shakeDuration = 1;
let shakeMag = 0;
let dieTimer = 0;
let reducedMotion = false;
let messageIndex = -1;

// Palette resolved from the design system tokens. Fallbacks only matter for
// the first frames before readPalette() runs.
const palette = {
  bg: "#ffffff",
  fg: "#18181b",
  accent: "#0870ff",
  warn: "#f97316",
  muted: "#71717a",
};
const particleColors = [palette.fg, palette.accent, palette.warn];
let fontFamily = "Inter, sans-serif";
let glyphSize = 80;
let glyphFont = "";
let popupFont = "";

const ship = {
  alive: false,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  angle: -Math.PI / 2,
  thrusting: false,
  cooldown: 0,
  shield: 0,
  thrustEmit: 0,
};

const keys = { left: false, right: false, thrust: false, fire: false };

const bullets: Bullet[] = Array.from({ length: MAX_BULLETS }, () => ({
  active: false,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  life: 0,
}));

const meteors: Meteor[] = Array.from({ length: MAX_METEORS }, () => ({
  active: false,
  tier: 0,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 0,
  angle: 0,
  spin: 0,
  verts: new Float32Array(METEOR_VERTS),
}));

const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
  active: false,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  life: 0,
  ttl: 1,
  size: 2,
  color: 0,
}));
let particleCursor = 0;

const popups: Popup[] = Array.from({ length: MAX_POPUPS }, () => ({
  active: false,
  x: 0,
  y: 0,
  life: 0,
  ttl: 1,
  text: "",
}));

const glyphs: Glyph[] = ["4", "0", "4"].map((char) => ({
  char,
  alive: false,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  angle: 0,
  spin: 0,
  radius: 0,
  hp: GLYPH_HP,
  flash: 0,
}));

// x, y, size triplets. Values are refilled on resize.
const stars = new Float32Array(STAR_COUNT * 3);

// --- Theme -----------------------------------------------------------------

function readPalette() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const styles = getComputedStyle(canvas);
  const read = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;

  palette.bg = read("--ui-bg", palette.bg);
  palette.fg = read("--ui-text", palette.fg);
  palette.accent = read("--ui-primary", palette.accent);
  palette.warn = read("--ui-warning", palette.warn);
  palette.muted = read("--ui-text-muted", palette.muted);
  particleColors[0] = palette.fg;
  particleColors[1] = palette.accent;
  particleColors[2] = palette.warn;

  fontFamily = styles.fontFamily || fontFamily;
  rebuildFonts();
}

function rebuildFonts() {
  glyphFont = `700 ${Math.round(glyphSize)}px ${fontFamily}`;
  popupFont = `600 14px ${fontFamily}`;
}

// --- Geometry helpers ------------------------------------------------------

function wrapAround(entity: { x: number; y: number }, radius: number) {
  if (entity.x < -radius) entity.x = viewW + radius;
  else if (entity.x > viewW + radius) entity.x = -radius;
  if (entity.y < -radius) entity.y = viewH + radius;
  else if (entity.y > viewH + radius) entity.y = -radius;
}

function hits(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  range: number,
): boolean {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy <= range * range;
}

// --- Spawning --------------------------------------------------------------

// Returns the first inactive slot in a pool, or null when the pool is full.
// An indexed scan instead of Array.find avoids allocating a closure on every
// bullet fired and every meteor spawned.
function firstFree<T extends { active: boolean }>(pool: T[]): T | null {
  for (let i = 0; i < pool.length; i++) {
    if (!pool[i]!.active) return pool[i]!;
  }
  return null;
}

function spawnParticle(
  x: number,
  y: number,
  vx: number,
  vy: number,
  ttl: number,
  size: number,
  color: number,
) {
  // Ring buffer: when the pool is full the oldest particle is recycled, which
  // doubles as the particle cap.
  const p = particles[particleCursor]!;
  particleCursor = (particleCursor + 1) % MAX_PARTICLES;
  p.active = true;
  p.x = x;
  p.y = y;
  p.vx = vx;
  p.vy = vy;
  p.life = ttl;
  p.ttl = ttl;
  p.size = size;
  p.color = color;
}

function burst(
  x: number,
  y: number,
  count: number,
  minSpeed: number,
  maxSpeed: number,
  ttl: number,
  color: number,
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * TAU;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    spawnParticle(
      x,
      y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      ttl * (0.5 + Math.random() * 0.5),
      1.5 + Math.random() * 2.5,
      color < 0 ? Math.floor(Math.random() * 3) : color,
    );
  }
}

function spawnPopup(x: number, y: number, text: string) {
  for (const popup of popups) {
    if (popup.active) continue;
    popup.active = true;
    popup.x = x;
    popup.y = y;
    popup.life = 1.1;
    popup.ttl = 1.1;
    popup.text = text;
    return;
  }
}

function spawnMeteor(
  tier: number,
  x: number,
  y: number,
  speedBoost: number,
): Meteor | null {
  const slot = firstFree(meteors);
  if (!slot) return null;
  const spec = TIERS[tier]!;
  const direction = Math.random() * TAU;
  const speed = spec.speed * speedBoost * (0.7 + Math.random() * 0.6);
  slot.active = true;
  slot.tier = tier;
  slot.x = x;
  slot.y = y;
  slot.vx = Math.cos(direction) * speed;
  slot.vy = Math.sin(direction) * speed;
  slot.radius = spec.radius;
  slot.angle = Math.random() * TAU;
  slot.spin = (Math.random() - 0.5) * 1.6;
  for (let i = 0; i < METEOR_VERTS; i++) {
    slot.verts[i] = 0.72 + Math.random() * 0.42;
  }
  return slot;
}

// Spawns a large meteor on a random edge, away from the ship.
function spawnEdgeMeteor(speedBoost: number) {
  for (let attempt = 0; attempt < 8; attempt++) {
    let x: number;
    let y: number;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -TIERS[0]!.radius : viewW + TIERS[0]!.radius;
      y = Math.random() * viewH;
    } else {
      x = Math.random() * viewW;
      y = Math.random() < 0.5 ? -TIERS[0]!.radius : viewH + TIERS[0]!.radius;
    }
    if (!hits(x, y, ship.x, ship.y, 160)) {
      spawnMeteor(0, x, y, speedBoost);
      return;
    }
  }
}

function respawnGlyphs() {
  const anchors = [0.28, 0.5, 0.72];
  // The three glyphs share one horizontal row. Put that row on whichever band
  // sits farther from the ship, so a respawn never drops a glyph onto the
  // player: mid-run respawns grant no spawn shield, so an overlap would be an
  // unfair instant kill. Clearing the row of the ship's Y keeps it safe
  // regardless of the ship's X.
  const topBand = viewH * 0.26;
  const bottomBand = viewH * 0.74;
  const bandY =
    Math.abs(topBand - ship.y) >= Math.abs(bottomBand - ship.y)
      ? topBand
      : bottomBand;
  glyphs.forEach((glyph, index) => {
    glyph.alive = true;
    glyph.hp = GLYPH_HP;
    glyph.flash = 0;
    glyph.x = viewW * anchors[index]! + (Math.random() - 0.5) * 40;
    glyph.y = bandY + (Math.random() - 0.5) * 30;
    glyph.vx = (Math.random() - 0.5) * 44;
    glyph.vy = (Math.random() - 0.5) * 44;
    glyph.angle = 0;
    glyph.spin = (Math.random() < 0.5 ? -1 : 1) * (0.15 + Math.random() * 0.2);
    glyph.radius = glyphSize * 0.38;
  });
}

// --- Run control -----------------------------------------------------------

function reset() {
  score.value = 0;
  level.value = 1;
  currentLevel = 1;
  elapsed = 0;
  trickleTimer = trickleDelay(1);
  glyphRespawn = 0;
  shakeTime = 0;
  dieTimer = 0;

  for (const bullet of bullets) bullet.active = false;
  for (const meteor of meteors) meteor.active = false;
  for (const particle of particles) particle.active = false;
  for (const popup of popups) popup.active = false;

  ship.alive = props.interactive;
  ship.x = viewW / 2;
  ship.y = viewH * 0.62;
  ship.vx = 0;
  ship.vy = 0;
  ship.angle = -Math.PI / 2;
  ship.cooldown = 0;
  ship.shield = SHIP.spawnShield;
  ship.thrustEmit = 0;
  keys.left = keys.right = keys.thrust = keys.fire = false;

  for (let i = 0; i < 4; i++) spawnEdgeMeteor(1);
  respawnGlyphs();

  phase.value = "playing";
}

function pauseGame() {
  if (phase.value !== "playing") return;
  phase.value = "paused";
  menuIndex.value = 0;
  keys.left = keys.right = keys.thrust = keys.fire = false;
}

function resumeGame() {
  if (phase.value !== "paused") return;
  phase.value = "playing";
}

function restart() {
  if (phase.value !== "over") return;
  reset();
}

// Controls becoming available (a small viewport resized wider, so the ambient
// background upgrades to the playable game) needs a fresh run so the ship
// actually spawns. Only act on the ambient -> playable transition: downgrading
// back to ambient is left alone so it can't wipe a game already in progress.
watch(
  () => props.interactive,
  (isInteractive, wasInteractive) => {
    if (isInteractive && !wasInteractive) reset();
  },
);

function addScore(points: number, x: number, y: number, label = true) {
  const scaled = Math.round(points * scoreScale(currentLevel));
  score.value += scaled;
  if (label) spawnPopup(x, y, `+${scaled}`);
}

function killShip() {
  ship.alive = false;
  // First death picks a random headline, later ones rotate through the list.
  messageIndex =
    messageIndex < 0
      ? Math.floor(Math.random() * GAME_OVER_MESSAGES.length)
      : (messageIndex + 1) % GAME_OVER_MESSAGES.length;
  gameOverTitle.value = GAME_OVER_MESSAGES[messageIndex]!;
  burst(ship.x, ship.y, 30, 40, 280, 0.9, -1);
  startShake(0.35, 6);
  dieTimer = 1;
  phase.value = "dying";
}

// Kicks off a screen shake of the given duration and magnitude. render()
// normalizes by shakeDuration so any shake source ramps from full strength.
function startShake(duration: number, magnitude: number) {
  shakeTime = duration;
  shakeDuration = duration;
  shakeMag = magnitude;
}

// --- Simulation ------------------------------------------------------------

function update(dt: number) {
  const playing = phase.value === "playing";

  // Ambient mode never ramps: it stays at level 1 (calm, steady field) with no
  // "Level N" popups.
  if (playing && props.interactive) {
    elapsed += dt;
    const lvl = Math.floor(elapsed / LEVEL_SECONDS) + 1;
    if (lvl !== currentLevel) {
      currentLevel = lvl;
      level.value = lvl;
      spawnPopup(viewW / 2, viewH * 0.2, `Level ${lvl}`);
    }
  }

  updateShip(dt, playing);
  updateBullets(dt);
  updateMeteors(dt);
  updateGlyphs(dt, playing);
  updateParticles(dt);
  updatePopups(dt);

  if (playing) {
    handleCollisions();
    handleSpawning(dt);
  }

  if (phase.value === "dying") {
    dieTimer -= dt;
    if (dieTimer <= 0) {
      phase.value = "over";
      menuIndex.value = 0;
    }
  }

  if (shakeTime > 0) shakeTime -= dt;
}

function updateShip(dt: number, playing: boolean) {
  if (!playing || !ship.alive) return;

  if (keys.left) ship.angle -= SHIP.turnSpeed * dt;
  if (keys.right) ship.angle += SHIP.turnSpeed * dt;

  ship.thrusting = keys.thrust;
  if (ship.thrusting) {
    ship.vx += Math.cos(ship.angle) * SHIP.thrust * dt;
    ship.vy += Math.sin(ship.angle) * SHIP.thrust * dt;

    // Emit exhaust particles at a fixed rate, independent of frame rate.
    ship.thrustEmit += dt;
    while (ship.thrustEmit >= 1 / 45) {
      ship.thrustEmit -= 1 / 45;
      const back = ship.angle + Math.PI + (Math.random() - 0.5) * 0.7;
      spawnParticle(
        ship.x + Math.cos(ship.angle + Math.PI) * 10,
        ship.y + Math.sin(ship.angle + Math.PI) * 10,
        ship.vx * 0.3 + Math.cos(back) * (60 + Math.random() * 70),
        ship.vy * 0.3 + Math.sin(back) * (60 + Math.random() * 70),
        0.3 + Math.random() * 0.2,
        1.5 + Math.random() * 1.5,
        2,
      );
    }
  }

  // Inertia with gentle damping and a top speed keeps drift controllable.
  const damping = Math.exp(-SHIP.damping * dt);
  ship.vx *= damping;
  ship.vy *= damping;
  const speedSq = ship.vx * ship.vx + ship.vy * ship.vy;
  if (speedSq > SHIP.maxSpeed * SHIP.maxSpeed) {
    const factor = SHIP.maxSpeed / Math.sqrt(speedSq);
    ship.vx *= factor;
    ship.vy *= factor;
  }

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
  wrapAround(ship, SHIP.radius);

  if (ship.shield > 0) ship.shield -= dt;

  ship.cooldown -= dt;
  if (keys.fire && ship.cooldown <= 0) fireBullet();
}

function fireBullet() {
  const bullet = firstFree(bullets);
  if (!bullet) return;
  const cos = Math.cos(ship.angle);
  const sin = Math.sin(ship.angle);
  bullet.active = true;
  bullet.x = ship.x + cos * 14;
  bullet.y = ship.y + sin * 14;
  bullet.vx = ship.vx + cos * SHIP.bulletSpeed;
  bullet.vy = ship.vy + sin * SHIP.bulletSpeed;
  bullet.life = SHIP.bulletLife;
  ship.cooldown = SHIP.fireCooldown;

  // Small muzzle flash.
  for (let i = 0; i < 3; i++) {
    spawnParticle(
      bullet.x,
      bullet.y,
      cos * 90 + (Math.random() - 0.5) * 80,
      sin * 90 + (Math.random() - 0.5) * 80,
      0.14,
      1.5,
      1,
    );
  }
}

function updateBullets(dt: number) {
  for (const bullet of bullets) {
    if (!bullet.active) continue;
    bullet.life -= dt;
    if (bullet.life <= 0) {
      bullet.active = false;
      continue;
    }
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    wrapAround(bullet, 2);
  }
}

function updateMeteors(dt: number) {
  for (const meteor of meteors) {
    if (!meteor.active) continue;
    meteor.x += meteor.vx * dt;
    meteor.y += meteor.vy * dt;
    meteor.angle += meteor.spin * dt;
    wrapAround(meteor, meteor.radius);
  }
}

function updateGlyphs(dt: number, playing: boolean) {
  for (const glyph of glyphs) {
    if (!glyph.alive) continue;
    glyph.x += glyph.vx * dt;
    glyph.y += glyph.vy * dt;
    // Gentle wobble instead of a full spin, so the glyphs stay legible.
    glyph.angle += glyph.spin * dt;
    if (glyph.angle > 0.22 || glyph.angle < -0.22) glyph.spin *= -1;
    if (glyph.flash > 0) glyph.flash -= dt;
    wrapAround(glyph, glyph.radius);
  }

  if (playing && glyphRespawn > 0) {
    glyphRespawn -= dt;
    if (glyphRespawn <= 0) respawnGlyphs();
  }
}

function updateParticles(dt: number) {
  for (const particle of particles) {
    if (!particle.active) continue;
    particle.life -= dt;
    if (particle.life <= 0) {
      particle.active = false;
      continue;
    }
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.98;
    particle.vy *= 0.98;
  }
}

function updatePopups(dt: number) {
  for (const popup of popups) {
    if (!popup.active) continue;
    popup.life -= dt;
    if (popup.life <= 0) {
      popup.active = false;
      continue;
    }
    popup.y -= 26 * dt;
  }
}

function destroyMeteor(meteor: Meteor) {
  const spec = TIERS[meteor.tier]!;
  addScore(spec.score, meteor.x, meteor.y);
  burst(meteor.x, meteor.y, 8 + (2 - meteor.tier) * 5, 30, 180, 0.6, -1);

  if (meteor.tier < 2) {
    const boost = speedScale(currentLevel);
    spawnMeteor(meteor.tier + 1, meteor.x, meteor.y, boost);
    spawnMeteor(meteor.tier + 1, meteor.x, meteor.y, boost);
  }
  meteor.active = false;
}

function hitGlyph(glyph: Glyph, bullet: Bullet) {
  glyph.hp -= 1;
  glyph.flash = 0.12;
  // Slight knockback in the bullet's direction of travel.
  glyph.vx = (glyph.vx + bullet.vx * 0.02) * 0.9;
  glyph.vy = (glyph.vy + bullet.vy * 0.02) * 0.9;
  burst(bullet.x, bullet.y, 5, 30, 140, 0.35, 1);

  if (glyph.hp > 0) return;

  glyph.alive = false;
  score.value += GLYPH_SCORE;
  spawnPopup(glyph.x, glyph.y, "+404");
  burst(glyph.x, glyph.y, 40, 50, 320, 1, -1);
  startShake(0.3, 4);

  if (glyphs.every((g) => !g.alive)) {
    const bonus = Math.round(GLYPH_SET_BONUS * scoreScale(currentLevel));
    score.value += bonus;
    spawnPopup(viewW / 2, viewH * 0.35, `404 destroyed! +${bonus}`);
    glyphRespawn = 8;
  }
}

function handleCollisions() {
  for (const bullet of bullets) {
    if (!bullet.active) continue;

    for (const meteor of meteors) {
      if (!meteor.active) continue;
      if (hits(bullet.x, bullet.y, meteor.x, meteor.y, meteor.radius)) {
        bullet.active = false;
        destroyMeteor(meteor);
        break;
      }
    }
    if (!bullet.active) continue;

    for (const glyph of glyphs) {
      if (!glyph.alive) continue;
      if (hits(bullet.x, bullet.y, glyph.x, glyph.y, glyph.radius * 0.85)) {
        bullet.active = false;
        hitGlyph(glyph, bullet);
        break;
      }
    }
  }

  if (!ship.alive || ship.shield > 0) return;

  for (const meteor of meteors) {
    if (!meteor.active) continue;
    const range = meteor.radius * 0.8 + SHIP.radius * 0.7;
    if (hits(ship.x, ship.y, meteor.x, meteor.y, range)) {
      killShip();
      return;
    }
  }
  for (const glyph of glyphs) {
    if (!glyph.alive) continue;
    const range = glyph.radius * 0.75 + SHIP.radius * 0.7;
    if (hits(ship.x, ship.y, glyph.x, glyph.y, range)) {
      killShip();
      return;
    }
  }
}

function handleSpawning(dt: number) {
  let activeCount = 0;
  for (const meteor of meteors) {
    if (meteor.active) activeCount++;
  }

  // Field cleared: launch a fresh wave immediately.
  if (activeCount === 0) {
    const count = Math.min(3 + currentLevel, 6);
    for (let i = 0; i < count; i++) spawnEdgeMeteor(speedScale(currentLevel));
    return;
  }

  // Trickle in extra rocks over time, up to the level's field cap.
  trickleTimer -= dt;
  if (trickleTimer <= 0) {
    trickleTimer = trickleDelay(currentLevel);
    if (activeCount < maxField(currentLevel)) {
      spawnEdgeMeteor(speedScale(currentLevel));
    }
  }
}

// --- Rendering -------------------------------------------------------------

function render() {
  const c = ctx;
  if (!c) return;

  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = palette.bg;
  c.fillRect(0, 0, viewW, viewH);

  if (shakeTime > 0 && !reducedMotion) {
    const strength = shakeMag * (shakeTime / shakeDuration);
    c.translate(
      (Math.random() - 0.5) * strength,
      (Math.random() - 0.5) * strength,
    );
  }

  renderStars(c);
  renderParticles(c);
  renderMeteors(c);
  renderGlyphs(c);
  renderBullets(c);
  renderShip(c);
  renderPopups(c);

  c.globalAlpha = 1;
}

function renderStars(c: CanvasRenderingContext2D) {
  c.fillStyle = palette.muted;
  for (let i = 0; i < STAR_COUNT; i++) {
    const size = stars[i * 3 + 2]!;
    const twinkle = 0.65 + 0.35 * Math.sin(renderT * 0.8 + i * 7);
    c.globalAlpha = 0.35 * twinkle;
    c.fillRect(stars[i * 3]!, stars[i * 3 + 1]!, size, size);
  }
  c.globalAlpha = 1;
}

function renderParticles(c: CanvasRenderingContext2D) {
  for (const particle of particles) {
    if (!particle.active) continue;
    c.globalAlpha = Math.max(particle.life / particle.ttl, 0);
    c.fillStyle = particleColors[particle.color]!;
    const half = particle.size / 2;
    c.fillRect(
      particle.x - half,
      particle.y - half,
      particle.size,
      particle.size,
    );
  }
  c.globalAlpha = 1;
}

function renderMeteors(c: CanvasRenderingContext2D) {
  c.strokeStyle = palette.muted;
  c.lineWidth = 1.5;
  c.lineJoin = "round";
  for (const meteor of meteors) {
    if (!meteor.active) continue;
    c.save();
    c.translate(meteor.x, meteor.y);
    c.rotate(meteor.angle);
    c.beginPath();
    for (let i = 0; i < METEOR_VERTS; i++) {
      const theta = (i / METEOR_VERTS) * TAU;
      const radius = meteor.radius * meteor.verts[i]!;
      const px = Math.cos(theta) * radius;
      const py = Math.sin(theta) * radius;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
    c.stroke();
    c.restore();
  }
}

function renderGlyphs(c: CanvasRenderingContext2D) {
  c.font = glyphFont;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.lineWidth = 2;
  for (const glyph of glyphs) {
    if (!glyph.alive) continue;
    c.save();
    c.translate(glyph.x, glyph.y);
    c.rotate(glyph.angle);
    const damage = GLYPH_HP - glyph.hp;
    c.setLineDash(GLYPH_DASHES[damage]!);
    c.globalAlpha = 0.55 + 0.45 * (glyph.hp / GLYPH_HP);
    if (glyph.flash > 0) {
      c.fillStyle = palette.fg;
      c.globalAlpha = 1;
      c.fillText(glyph.char, 0, 0);
    } else {
      c.strokeStyle = palette.accent;
      c.strokeText(glyph.char, 0, 0);
    }
    c.restore();
  }
  c.setLineDash(GLYPH_DASHES[0]!);
  c.globalAlpha = 1;
}

function renderBullets(c: CanvasRenderingContext2D) {
  c.strokeStyle = palette.accent;
  c.fillStyle = palette.accent;
  c.lineWidth = 1.5;
  for (const bullet of bullets) {
    if (!bullet.active) continue;
    c.globalAlpha = 0.45;
    c.beginPath();
    c.moveTo(bullet.x - bullet.vx * 0.016, bullet.y - bullet.vy * 0.016);
    c.lineTo(bullet.x, bullet.y);
    c.stroke();
    c.globalAlpha = 1;
    c.fillRect(bullet.x - 1.5, bullet.y - 1.5, 3, 3);
  }
}

function renderShip(c: CanvasRenderingContext2D) {
  if (!ship.alive) return;
  c.save();
  c.translate(ship.x, ship.y);
  c.rotate(ship.angle);

  if (ship.thrusting) {
    const flicker = 8 + Math.random() * 8;
    c.strokeStyle = palette.warn;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-8, -4);
    c.lineTo(-8 - flicker, 0);
    c.lineTo(-8, 4);
    c.stroke();
  }

  // Blink while the spawn shield is active.
  if (ship.shield > 0) {
    c.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(renderT * 10));
  }
  c.strokeStyle = palette.fg;
  c.lineWidth = 2;
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(14, 0);
  c.lineTo(-10, -9);
  c.lineTo(-6, 0);
  c.lineTo(-10, 9);
  c.closePath();
  c.stroke();
  c.restore();
  c.globalAlpha = 1;
}

function renderPopups(c: CanvasRenderingContext2D) {
  c.font = popupFont;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = palette.fg;
  for (const popup of popups) {
    if (!popup.active) continue;
    c.globalAlpha = Math.max(popup.life / popup.ttl, 0);
    c.fillText(popup.text, popup.x, popup.y);
  }
  c.globalAlpha = 1;
}

// --- Frame loop ------------------------------------------------------------

function frame(now: number) {
  rafId = requestAnimationFrame(frame);
  // Clamp long gaps (background tab, debugger) to avoid a catch-up spiral.
  const dt = Math.min((now - lastTime) / 1000, MAX_FRAME_DELTA);
  lastTime = now;
  renderT += dt;

  // While paused the scene keeps rendering (stars still twinkle behind the
  // overlay) but the simulation does not advance.
  if (phase.value === "paused") {
    accumulator = 0;
  } else {
    accumulator += dt;
    while (accumulator >= STEP) {
      update(STEP);
      accumulator -= STEP;
    }
  }
  render();
}

// --- Sizing ----------------------------------------------------------------

function resize() {
  const wrapper = wrapperRef.value;
  const canvas = canvasRef.value;
  if (!wrapper || !canvas || !ctx) return;

  const width = Math.max(Math.floor(wrapper.clientWidth), 1);
  const height = Math.max(Math.floor(wrapper.clientHeight), 1);
  const firstSize = viewW === 0 || viewH === 0;
  const sizeChanged = width !== viewW || height !== viewH;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  // Keep everything in proportional positions when the canvas actually
  // changes size (the ResizeObserver also fires at unchanged size).
  if (!firstSize && sizeChanged) {
    const sx = width / viewW;
    const sy = height / viewH;
    ship.x *= sx;
    ship.y *= sy;
    for (const bullet of bullets) {
      bullet.x *= sx;
      bullet.y *= sy;
    }
    for (const meteor of meteors) {
      meteor.x *= sx;
      meteor.y *= sy;
    }
    for (const glyph of glyphs) {
      glyph.x *= sx;
      glyph.y *= sy;
    }
    for (const particle of particles) {
      particle.x *= sx;
      particle.y *= sy;
    }
    for (let i = 0; i < STAR_COUNT; i++) {
      stars[i * 3] = stars[i * 3]! * sx;
      stars[i * 3 + 1] = stars[i * 3 + 1]! * sy;
    }
  }
  viewW = width;
  viewH = height;

  glyphSize = Math.min(Math.max(viewH * 0.18, 56), 110);
  for (const glyph of glyphs) glyph.radius = glyphSize * 0.38;
  rebuildFonts();

  // Seed the star field once; afterwards it is rescaled above rather than
  // re-scattered, so the stars don't jump on every resize callback.
  if (firstSize) {
    for (let i = 0; i < STAR_COUNT; i++) {
      stars[i * 3] = Math.random() * width;
      stars[i * 3 + 1] = Math.random() * height;
      stars[i * 3 + 2] = Math.random() * 1.6 + 0.6;
    }
  }
}

// --- Input -----------------------------------------------------------------

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  // The arcade menu entries are buttons for click and focus semantics, but
  // their keyboard handling belongs to the game (preventDefault below also
  // stops the browser from re-triggering a focused entry on Enter/Space).
  if (target.classList.contains("game__menu-item")) return false;
  return (
    target.closest("input, textarea, select, button, a, [contenteditable]") !==
    null
  );
}

function moveMenu(delta: number) {
  const count = menuItems.value.length;
  if (count === 0) return;
  menuIndex.value = (menuIndex.value + delta + count) % count;
}

function menuLabel(index: number): string {
  const item = menuItems.value[index];
  if (!item) return "";
  return index === menuIndex.value ? `>>> ${item.label} <<<` : item.label;
}

function activateMenuItem(index = menuIndex.value) {
  menuIndex.value = index;
  const item = menuItems.value[index];
  if (!item) return;
  switch (item.id) {
    case "resume":
      resumeGame();
      break;
    case "restart":
      restart();
      break;
    case "copy":
      void copyResult();
      break;
  }
}

function onKeyDown(event: KeyboardEvent) {
  // Ambient mode has no controls, so it never claims keys (page stays fully
  // keyboard-navigable).
  if (!props.interactive) return;
  // Leave focused controls (buttons, links, inputs) alone so keyboard
  // navigation keeps working; the game never traps focus.
  if (isInteractiveTarget(event.target)) return;
  if (!GAME_CODES.has(event.code)) return;
  event.preventDefault();
  if (event.repeat) return;

  // Pause and game-over screens are keyboard menus, not flight controls.
  if (phase.value === "paused" || phase.value === "over") {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveMenu(-1);
        break;
      case "ArrowDown":
      case "KeyS":
        moveMenu(1);
        break;
      case "Enter":
      case "Space":
        activateMenuItem();
        break;
      case "Escape":
        if (phase.value === "over") restart();
        else resumeGame();
        break;
    }
    return;
  }

  switch (event.code) {
    case "ArrowLeft":
    case "KeyA":
      keys.left = true;
      break;
    case "ArrowRight":
    case "KeyD":
      keys.right = true;
      break;
    case "ArrowUp":
    case "KeyW":
      keys.thrust = true;
      break;
    case "Space":
      keys.fire = true;
      break;
    case "Escape":
      pauseGame();
      break;
  }
}

function onKeyUp(event: KeyboardEvent) {
  switch (event.code) {
    case "ArrowLeft":
    case "KeyA":
      keys.left = false;
      break;
    case "ArrowRight":
    case "KeyD":
      keys.right = false;
      break;
    case "ArrowUp":
    case "KeyW":
      keys.thrust = false;
      break;
    case "Space":
      keys.fire = false;
      break;
  }
}

function onWindowBlur() {
  keys.left = keys.right = keys.thrust = keys.fire = false;
}

function onCanvasClick() {
  if (phase.value === "paused") resumeGame();
}

// --- Share -----------------------------------------------------------------

// The comet emoji is a deliberate exception to the no-emoji docs rule: this
// string leaves the site as a chat message.
const shareMessage = computed(
  () =>
    `☄️ I scored ${formattedScore.value} on Meteor's 404 game. Beat me: https://meteor.shopware.com/404`,
);

function copyResult() {
  // useClipboard handles the Clipboard API, the legacy fallback, and flips
  // `copied` (which the menu label reads) back on its own.
  void writeToClipboard(shareMessage.value);
}

// --- Lifecycle -------------------------------------------------------------

let resizeObserver: ResizeObserver | undefined;
let themeObserver: MutationObserver | undefined;
let motionQuery: MediaQueryList | undefined;

function onMotionChange(event: MediaQueryListEvent) {
  reducedMotion = event.matches;
}

onMounted(() => {
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;
  if (!canvas || !wrapper) return;

  // Opaque context: skips compositing the page behind the canvas.
  ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion = motionQuery.matches;
  motionQuery.addEventListener("change", onMotionChange);

  resize();
  readPalette();
  reset();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(wrapper);

  // Color mode switches toggle `class` (Nuxt UI) and `data-theme` (Meteor
  // tokens) on <html>; re-resolve the palette whenever either changes.
  themeObserver = new MutationObserver(readPalette);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onWindowBlur);

  lastTime = performance.now();
  rafId = requestAnimationFrame(frame);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  motionQuery?.removeEventListener("change", onMotionChange);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  window.removeEventListener("blur", onWindowBlur);
  ctx = null;
});
</script>

<template>
  <div ref="wrapperRef" class="game">
    <canvas
      ref="canvasRef"
      class="game__canvas"
      role="img"
      :aria-label="
        interactive
          ? 'Meteor 404 mini-game: pilot a ship, shoot meteors and the 404 glyphs'
          : 'Decorative animation: 404 glyphs and meteors drifting through space'
      "
      @click="onCanvasClick"
    />

    <div v-if="interactive" class="game__hud">
      <span>Score ..... {{ formattedScore }}</span>
      <span>Level {{ level }} ... x{{ multiplierLabel }}</span>
    </div>

    <div v-if="phase === 'paused'" class="game__overlay game__overlay--paused">
      <p class="game__screen-title">Paused</p>
      <p class="game__screen-line">Score ... {{ formattedScore }}</p>
      <button
        v-for="(item, index) in menuItems"
        :key="item.id"
        type="button"
        class="game__menu-item"
        :class="{ 'is-selected': index === menuIndex }"
        @mouseenter="menuIndex = index"
        @focus="menuIndex = index"
        @click="activateMenuItem(index)"
      >
        {{ menuLabel(index) }}
      </button>
      <p class="game__screen-hint">Esc or click to resume</p>
    </div>

    <div v-else-if="phase === 'over'" class="game__overlay">
      <p class="game__screen-title">Game over</p>
      <p class="game__screen-sub">{{ gameOverTitle }}</p>
      <p class="game__screen-line">Final score ... {{ formattedScore }}</p>
      <!-- The share message sits directly above the Copy entry; that entry only
           exists in menuItems when score > 0, so the message shows in step. -->
      <template v-for="(item, index) in menuItems" :key="item.id">
        <p v-if="item.id === 'copy'" class="game__screen-share">
          {{ shareMessage }}
        </p>
        <button
          type="button"
          class="game__menu-item"
          :class="{ 'is-selected': index === menuIndex }"
          @mouseenter="menuIndex = index"
          @focus="menuIndex = index"
          @click="activateMenuItem(index)"
        >
          {{ menuLabel(index) }}
        </button>
      </template>
    </div>

    <div v-if="interactive" class="game__legend">
      <span
        ><kbd>&larr;</kbd><kbd>&rarr;</kbd> or <kbd>A</kbd
        ><kbd>D</kbd> rotate</span
      >
      <span><kbd>&uarr;</kbd> or <kbd>W</kbd> thrust</span>
      <span><kbd>Space</kbd> fire</span>
      <span><kbd>Esc</kbd> pause</span>
    </div>
  </div>
</template>

<style scoped>
/* Fills its parent: the 404 page gives it the full viewport below the header. */
.game {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--ui-bg);

  --game-font-mono: var(
    --font-mono,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace
  );
}

.game__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.game__hud {
  position: absolute;
  top: 14px;
  left: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  font-family: var(--game-font-mono);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
  pointer-events: none;
}

/* Pause and game-over are arcade screens: everything mono and uppercase,
 * emphasis comes from "..." and ">>> <<<" markers, not from type changes. */
.game__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
  font-family: var(--game-font-mono);
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--ui-bg) 72%, transparent);
}

/* Clicking anywhere on the paused scene resumes (the canvas click handler);
 * the menu entries opt back in to their own pointer events. */
.game__overlay--paused {
  pointer-events: none;
}

.game__overlay--paused :where(button) {
  pointer-events: auto;
}

.game__screen-title {
  font-size: clamp(24px, 3.4vw, 34px);
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--ui-text-highlighted);
}

.game__screen-sub {
  font-size: 15px;
  letter-spacing: 0.18em;
  color: var(--ui-text-muted);
}

/* Extra breathing room sets the score apart from the headline block above. */
.game__screen-line {
  margin-top: 36px;
  font-size: 15px;
  letter-spacing: 0.18em;
  color: var(--ui-text);
}

/* No vertical padding or margin: the overlay's flex gap alone spaces the
 * screen lines, so the rhythm stays even. */
.game__menu-item {
  padding: 0 10px;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.game__menu-item.is-selected {
  color: var(--ui-text-highlighted);
}

/* The share message keeps its natural casing (it contains a URL). Squared
 * border box; the border color is white in dark mode and flips with the
 * theme (a literal white would vanish on the light background). */
.game__screen-share {
  max-width: min(100%, 640px);
  margin-top: 36px;
  padding: 10px 14px;
  border: 1px solid var(--ui-text-highlighted);
  border-radius: 0;
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: normal;
  text-transform: none;
  color: var(--ui-text);
}

.game__screen-hint {
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--ui-text-dimmed);
}

.game__legend {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 18px;
  padding: 0 24px;
  font-family: var(--game-font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
  pointer-events: none;
}

/* Squared, themed-white bordered keys, matching the share box and HUD instead
 * of the rounded elevated pills. */
.game__legend kbd {
  display: inline-block;
  min-width: 18px;
  margin: 0 2px;
  padding: 1px 5px;
  border: 1px solid var(--ui-text-highlighted);
  border-radius: 0;
  background: none;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: normal;
  text-align: center;
  color: var(--ui-text);
}

/* On the smaller end of the playable range (the game starts at 768x480) the
 * keymap crowds the field, so hide it on narrow or short viewports. */
@media (max-width: 900px), (max-height: 560px) {
  .game__legend {
    display: none;
  }
}
</style>
