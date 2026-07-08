<script setup lang="ts">
// Hand-rolled WebGL backdrop for the hero. Dark mode: a starfield with
// depth-based cursor/scroll parallax, twinkle, occasional meteors, and
// constellation lines that surface near the cursor. Light mode: the page's
// dot grid, aligned 1:1 with the CSS grid, gently pulled toward the cursor.
// The CSS starfield and dot grid stay as the SSR / no-WebGL / reduced-motion
// fallback; `active` tells the parent when the GL layer has taken over.

const emit = defineEmits<{ active: [on: boolean] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const running = ref(false);

// Star colors reuse the CSS starfield's dark palette (#8fb0e6 far, white near).
const COL_FAR: [number, number, number] = [0.561, 0.69, 0.902];
const COL_NEAR: [number, number, number] = [1, 1, 1];

const STAR_BASE = 320; // stars per ~1440x900; scaled with canvas area
const PARALLAX = 16; // max cursor shift in px for the nearest stars
const LINK_DIST = 110; // max constellation segment length in px
const MAX_METEORS = 2;
const TRAIL = 64; // points per meteor trail
const TRAIL_STEP = 2.2; // px between trail points; overlaps them into a streak
const GRID = 24; // light-mode dot spacing; must match the CSS grid on .landing
// Bottom fade, applied in the shaders. Masking the canvas via CSS instead
// would force the browser to re-composite the whole hero every frame; the
// stops match the hero-bg mask in index.vue.
const FADE_START = 900;
const FADE_END = 1700;

// The magnet pull ramps back to zero directly under the cursor: without the
// inner ramp, near-zero dots overshoot and flip sides on every small move.
const POINT_VERT = `
attribute vec2 aPos;
attribute float aDepth;
attribute float aSize;
attribute float aPhase;
attribute float aAlpha;
uniform vec2 uRes;
uniform vec2 uPar;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uTime;
uniform float uDpr;
uniform float uTwinkle;
uniform float uMagnet;
uniform vec2 uFade;
varying float vAlpha;
varying float vDepth;
void main() {
  vec2 p = aPos + uPar * aDepth + vec2(0.0, uScroll * 0.12 * aDepth);
  vec2 toMouse = uMouse - p;
  float md = length(toMouse);
  float pull = uMagnet * smoothstep(240.0, 0.0, md) * smoothstep(0.0, 70.0, md);
  p += toMouse / max(md, 1.0) * pull * 4.5;
  float boost = smoothstep(180.0, 20.0, md);
  float tw = mix(1.0, 0.65 + 0.35 * sin(uTime * (0.6 + aDepth) + aPhase), uTwinkle);
  float fade = 1.0 - clamp((p.y - uFade.x) / (uFade.y - uFade.x), 0.0, 1.0);
  vAlpha = aAlpha * tw * (1.0 + boost * 0.8) * fade;
  vDepth = aDepth;
  gl_PointSize = aSize * uDpr * (1.0 + boost * 0.35);
  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const POINT_FRAG = `
precision mediump float;
uniform vec3 uColFar;
uniform vec3 uColNear;
varying float vAlpha;
varying float vDepth;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = clamp(vAlpha, 0.0, 1.0) * smoothstep(1.0, 0.25, d);
  vec3 col = mix(uColFar, uColNear, vDepth);
  gl_FragColor = vec4(col * a, a);
}
`;

const LINE_VERT = `
attribute vec2 aPos;
attribute float aDepth;
uniform vec2 uRes;
uniform vec2 uPar;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec2 uFade;
varying float vA;
void main() {
  vec2 p = aPos + uPar * aDepth + vec2(0.0, uScroll * 0.12 * aDepth);
  float fade = 1.0 - clamp((p.y - uFade.x) / (uFade.y - uFade.x), 0.0, 1.0);
  vA = smoothstep(230.0, 60.0, distance(p, uMouse)) * fade;
  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const LINE_FRAG = `
precision mediump float;
uniform vec3 uCol;
varying float vA;
void main() {
  float a = vA * 0.22;
  gl_FragColor = vec4(uCol * a, a);
}
`;

interface Star {
  x: number;
  y: number;
  depth: number;
}

interface Meteor {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  age: number;
  life: number;
}

onMounted(() => {
  const el = canvas.value;
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Phones keep the cheaper CSS fallback (the hero is short there anyway).
  if (!window.matchMedia("(min-width: 640px)").matches) return;

  let gl: WebGLRenderingContext | null = null;
  let pointProg: WebGLProgram | null = null;
  let lineProg: WebGLProgram | null = null;
  let starBuf: WebGLBuffer | null = null;
  let lineBuf: WebGLBuffer | null = null;
  let meteorBuf: WebGLBuffer | null = null;
  let dotBuf: WebGLBuffer | null = null;
  let starTotal = 0;
  let lineVerts = 0;
  let dotTotal = 0;
  let dotColor: [number, number, number] = [0.118, 0.118, 0.141];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let failed = false;
  let inView = false;
  let raf = 0;
  let lastT = 0;
  let needsBuild = true;
  let parked = false;

  const par = { x: 0, y: 0 };
  const parTarget = { x: 0, y: 0 };
  const mouse = { x: -9999, y: -9999 };
  const mouseTarget = { x: -9999, y: -9999 };
  const meteors: Meteor[] = [];
  let meteorTimer = 2 + Math.random() * 3;
  const meteorData = new Float32Array(MAX_METEORS * TRAIL * 6);

  function compile(type: number, src: string) {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    gl!.shaderSource(shader, src);
    gl!.compileShader(shader);
    return shader;
  }

  function link(vert: string, frag: string) {
    const vs = compile(gl!.VERTEX_SHADER, vert);
    const fs = compile(gl!.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return null;
    const prog = gl!.createProgram();
    if (!prog) return null;
    gl!.attachShader(prog, vs);
    gl!.attachShader(prog, fs);
    gl!.linkProgram(prog);
    if (!gl!.getProgramParameter(prog, gl!.LINK_STATUS)) return null;
    return prog;
  }

  const isDark = () => document.documentElement.classList.contains("dark");

  // The dots reuse the CSS grid's ink color (zinc-900); read the token so the
  // shader stays in sync with the palette.
  function readDotColor() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-zinc-900")
      .trim();
    const hex = /^#([0-9a-f]{6})$/i.exec(raw)?.[1];
    if (!hex) return;
    const n = parseInt(hex, 16);
    dotColor = [
      ((n >> 16) & 255) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
    ];
  }

  function init(): boolean {
    gl = el!.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
    });
    if (!gl) return false;
    pointProg = link(POINT_VERT, POINT_FRAG);
    lineProg = link(LINE_VERT, LINE_FRAG);
    if (!pointProg || !lineProg) return false;
    starBuf = gl.createBuffer();
    lineBuf = gl.createBuffer();
    meteorBuf = gl.createBuffer();
    dotBuf = gl.createBuffer();
    readDotColor();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    return true;
  }

  // Geometry depends on the canvas size, so everything rebuilds together.
  function build() {
    const rect = el!.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    // Pixel budget: the canvas is tall, full retina would be needlessly big.
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    dpr = Math.max(1, Math.min(dpr, Math.sqrt(6_000_000 / (width * height))));
    el!.width = Math.round(width * dpr);
    el!.height = Math.round(height * dpr);
    gl!.viewport(0, 0, el!.width, el!.height);

    // Stars: density follows the area, depth is biased toward far stars.
    const count = Math.min(
      560,
      Math.max(200, Math.round((STAR_BASE * (width * height)) / (1440 * 900))),
    );
    const stars: Star[] = [];
    const data = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const star: Star = {
        x: Math.random() * width,
        y: Math.random() * height,
        depth: 0.12 + r * r * 0.88,
      };
      stars.push(star);
      const o = i * 6;
      data[o] = star.x;
      data[o + 1] = star.y;
      data[o + 2] = star.depth;
      data[o + 3] = (1.1 + star.depth * 2.1) * (0.75 + Math.random() * 0.5);
      data[o + 4] = Math.random() * Math.PI * 2;
      data[o + 5] = 0.3 + Math.random() * 0.55;
    }
    starTotal = count;
    gl!.bindBuffer(gl!.ARRAY_BUFFER, starBuf);
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);

    // Constellation segments: short links between nearby foreground stars,
    // capped per star and globally so the sky never turns into a mesh.
    const near = stars.filter((s) => s.depth > 0.5);
    const links: number[] = [];
    const used = new Map<Star, number>();
    let total = 0;
    for (let a = 0; a < near.length && total < 240; a++) {
      for (let b = a + 1; b < near.length && total < 240; b++) {
        const sa = near[a]!;
        const sb = near[b]!;
        if ((used.get(sa) ?? 0) >= 3 || (used.get(sb) ?? 0) >= 3) continue;
        const dx = sa.x - sb.x;
        const dy = sa.y - sb.y;
        if (dx * dx + dy * dy > LINK_DIST * LINK_DIST) continue;
        links.push(sa.x, sa.y, sa.depth, sb.x, sb.y, sb.depth);
        used.set(sa, (used.get(sa) ?? 0) + 1);
        used.set(sb, (used.get(sb) ?? 0) + 1);
        total++;
      }
    }
    lineVerts = total * 2;
    gl!.bindBuffer(gl!.ARRAY_BUFFER, lineBuf);
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(links), gl!.STATIC_DRAW);

    // Dot grid, aligned 1:1 with the CSS grid ("center top" puts dot centers
    // at x = width / 2 mod GRID, y = GRID / 2) so the hero mask crossfades
    // canvas dots seamlessly into CSS dots. Depth 0 exempts them from
    // parallax and scroll drift; only the magnet moves them.
    const x0 = ((width / 2) % GRID) - GRID;
    const cols = Math.ceil((width - x0) / GRID) + 1;
    const rows = Math.ceil(height / GRID) + 1;
    const dots = new Float32Array(cols * rows * 6);
    let d = 0;
    for (let cx = 0; cx < cols; cx++) {
      for (let cy = 0; cy < rows; cy++) {
        dots[d] = x0 + cx * GRID;
        dots[d + 1] = GRID / 2 + cy * GRID;
        dots[d + 2] = 0;
        dots[d + 3] = 3.1;
        dots[d + 4] = 0;
        dots[d + 5] = 0.09;
        d += 6;
      }
    }
    dotTotal = cols * rows;
    gl!.bindBuffer(gl!.ARRAY_BUFFER, dotBuf);
    gl!.bufferData(gl!.ARRAY_BUFFER, dots, gl!.STATIC_DRAW);
  }

  function updateMeteors(dt: number) {
    meteorTimer -= dt;
    if (meteorTimer <= 0 && meteors.length < MAX_METEORS) {
      // Head flies left to right (down-right), matching the CSS meteors;
      // spawns are biased left so most of the arc stays on screen.
      const jitter = ((Math.random() - 0.5) * Math.PI) / 12;
      const angle = (Math.PI * 3) / 4 + jitter;
      meteors.push({
        x: width * Math.random() * 0.7,
        y: Math.random() * Math.min(height, 900) * 0.35,
        dx: -Math.cos(angle),
        dy: Math.sin(angle),
        speed: 420 + Math.random() * 260,
        age: 0,
        life: 0.9 + Math.random() * 0.8,
      });
      meteorTimer = 4 + Math.random() * 6;
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]!;
      m.age += dt;
      if (m.age >= m.life) {
        meteors.splice(i, 1);
        continue;
      }
      m.x += m.dx * m.speed * dt;
      m.y += m.dy * m.speed * dt;
    }
  }

  // Each meteor is a head plus a trail of shrinking, fading points; depth
  // falls off along the trail, shifting the color from white to blue.
  function packMeteors(): number {
    let n = 0;
    for (const m of meteors) {
      const t = m.age / m.life;
      const env =
        Math.min(1, t / 0.15) * Math.min(1, Math.max(0, (1 - t) / 0.35));
      for (let i = 0; i < TRAIL; i++) {
        const o = n * 6;
        const f = 1 - i / TRAIL;
        meteorData[o] = m.x - m.dx * i * TRAIL_STEP;
        meteorData[o + 1] = m.y - m.dy * i * TRAIL_STEP;
        meteorData[o + 2] = 1 - (i / TRAIL) * 0.55;
        meteorData[o + 3] = i === 0 ? 4 : 2.2 + f * 2.4;
        meteorData[o + 4] = 0;
        meteorData[o + 5] = env * (i === 0 ? 1 : Math.pow(f, 1.4) * 0.55);
        n++;
      }
    }
    return n;
  }

  function setShared(prog: WebGLProgram, scroll: number) {
    gl!.useProgram(prog);
    gl!.uniform2f(gl!.getUniformLocation(prog, "uRes"), width, height);
    gl!.uniform2f(gl!.getUniformLocation(prog, "uPar"), par.x, par.y);
    gl!.uniform2f(gl!.getUniformLocation(prog, "uMouse"), mouse.x, mouse.y);
    gl!.uniform1f(gl!.getUniformLocation(prog, "uScroll"), scroll);
    gl!.uniform2f(gl!.getUniformLocation(prog, "uFade"), FADE_START, FADE_END);
  }

  function bindPointAttribs(buffer: WebGLBuffer) {
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    const stride = 6 * 4;
    const attrs: Array<[string, number, number]> = [
      ["aPos", 2, 0],
      ["aDepth", 1, 8],
      ["aSize", 1, 12],
      ["aPhase", 1, 16],
      ["aAlpha", 1, 20],
    ];
    for (const [name, size, offset] of attrs) {
      const loc = gl!.getAttribLocation(pointProg!, name);
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, stride, offset);
    }
  }

  function draw(t: number) {
    const scroll = Math.min(window.scrollY, 1600);
    gl!.clear(gl!.COLOR_BUFFER_BIT);

    // Light mode: only the dot grid, gently pulled toward the cursor.
    if (!isDark()) {
      setShared(pointProg!, scroll);
      gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uTime"), t);
      gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uDpr"), dpr);
      gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uTwinkle"), 0);
      gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uMagnet"), 1);
      gl!.uniform3f(gl!.getUniformLocation(pointProg!, "uColFar"), ...dotColor);
      gl!.uniform3f(
        gl!.getUniformLocation(pointProg!, "uColNear"),
        ...dotColor,
      );
      bindPointAttribs(dotBuf!);
      gl!.drawArrays(gl!.POINTS, 0, dotTotal);
      return;
    }

    if (lineVerts > 0) {
      setShared(lineProg!, scroll);
      gl!.uniform3f(gl!.getUniformLocation(lineProg!, "uCol"), ...COL_FAR);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, lineBuf);
      const posLoc = gl!.getAttribLocation(lineProg!, "aPos");
      const depthLoc = gl!.getAttribLocation(lineProg!, "aDepth");
      gl!.enableVertexAttribArray(posLoc);
      gl!.vertexAttribPointer(posLoc, 2, gl!.FLOAT, false, 12, 0);
      gl!.enableVertexAttribArray(depthLoc);
      gl!.vertexAttribPointer(depthLoc, 1, gl!.FLOAT, false, 12, 8);
      gl!.drawArrays(gl!.LINES, 0, lineVerts);
    }

    setShared(pointProg!, scroll);
    gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uTime"), t);
    gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uDpr"), dpr);
    gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uMagnet"), 0);
    gl!.uniform3f(gl!.getUniformLocation(pointProg!, "uColFar"), ...COL_FAR);
    gl!.uniform3f(gl!.getUniformLocation(pointProg!, "uColNear"), ...COL_NEAR);

    gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uTwinkle"), 1);
    bindPointAttribs(starBuf!);
    gl!.drawArrays(gl!.POINTS, 0, starTotal);

    const meteorPts = packMeteors();
    if (meteorPts > 0) {
      gl!.uniform1f(gl!.getUniformLocation(pointProg!, "uTwinkle"), 0);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, meteorBuf);
      gl!.bufferData(gl!.ARRAY_BUFFER, meteorData, gl!.DYNAMIC_DRAW);
      bindPointAttribs(meteorBuf!);
      gl!.drawArrays(gl!.POINTS, 0, meteorPts);
    }
  }

  function frame(now: number) {
    if (!running.value) return;
    if (needsBuild) {
      needsBuild = false;
      build();
    }
    const t = now / 1000;
    const dt = Math.min(0.05, t - lastT || 0.016);
    lastT = t;
    par.x += (parTarget.x - par.x) * 0.055;
    par.y += (parTarget.y - par.y) * 0.055;
    mouse.x += (mouseTarget.x - mouse.x) * 0.14;
    mouse.y += (mouseTarget.y - mouse.y) * 0.14;
    // Snap once the pointer has left, so the loop can park quickly.
    if (mouseTarget.x < -4000 && mouse.x < -4000) {
      mouse.x = mouseTarget.x;
      mouse.y = mouseTarget.y;
    }
    updateMeteors(dt);
    draw(t);
    // The dark sky animates continuously (twinkle, meteors); the light grid
    // is static once the cursor lerps settle, so park the loop until the
    // next pointer, resize, or theme event wakes it.
    if (!isDark()) {
      const settled =
        Math.abs(mouse.x - mouseTarget.x) < 0.3 &&
        Math.abs(mouse.y - mouseTarget.y) < 0.3 &&
        Math.abs(par.x - parTarget.x) < 0.05 &&
        Math.abs(par.y - parTarget.y) < 0.05;
      if (settled) {
        parked = true;
        return;
      }
    }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (!running.value || !parked) return;
    parked = false;
    lastT = performance.now() / 1000;
    raf = requestAnimationFrame(frame);
  }

  function maybeRun() {
    const should = inView && !document.hidden && !failed;
    if (should && !running.value) {
      if (!gl) {
        if (!init()) {
          failed = true;
          return;
        }
        emit("active", true);
      }
      running.value = true;
      parked = false;
      lastT = performance.now() / 1000;
      raf = requestAnimationFrame(frame);
    } else if (!should && running.value) {
      running.value = false;
      cancelAnimationFrame(raf);
    }
  }

  function onPointerMove(e: PointerEvent) {
    const rect = el!.getBoundingClientRect();
    mouseTarget.x = e.clientX - rect.left;
    mouseTarget.y = e.clientY - rect.top;
    parTarget.x = ((e.clientX / window.innerWidth) * 2 - 1) * PARALLAX;
    parTarget.y = ((e.clientY / window.innerHeight) * 2 - 1) * PARALLAX;
    wake();
  }

  function onPointerLeave() {
    mouseTarget.x = -9999;
    mouseTarget.y = -9999;
    parTarget.x = 0;
    parTarget.y = 0;
    wake();
  }

  function onVisibility() {
    maybeRun();
  }

  function onContextLost() {
    // No restore handling: fall back to the CSS layers for the session.
    failed = true;
    running.value = false;
    cancelAnimationFrame(raf);
    emit("active", false);
  }

  // Pause the loop while the hero is scrolled off screen.
  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry?.isIntersecting ?? false;
      maybeRun();
    },
    { rootMargin: "80px" },
  );
  io.observe(el);

  const ro = new ResizeObserver(() => {
    if (gl) needsBuild = true;
    wake();
  });
  ro.observe(el);

  // A theme switch must wake a parked light-mode loop so the stars render.
  const mo = new MutationObserver(wake);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const hero = el.closest("section") ?? el.parentElement;
  hero?.addEventListener("pointermove", onPointerMove);
  hero?.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  el.addEventListener("webglcontextlost", onContextLost);

  onBeforeUnmount(() => {
    running.value = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    mo.disconnect();
    hero?.removeEventListener("pointermove", onPointerMove);
    hero?.removeEventListener("pointerleave", onPointerLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    el.removeEventListener("webglcontextlost", onContextLost);
  });
});
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="hero-canvas"
    :class="{ 'is-on': running }"
  />
</template>

<style scoped>
/* Covers the hero down to where the parent's mask has fully faded it out
 * (--hero-fade-end), so the canvas edge is never visible while the buffer
 * stays far smaller than the full hero (which includes the showcase). */
.hero-canvas {
  position: absolute;
  inset-inline: 0;
  top: 0;
  width: 100%;
  height: min(100%, 1700px);
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero-canvas.is-on {
  opacity: 1;
}
</style>
