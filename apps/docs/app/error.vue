<script setup lang="ts">
// Overrides the Docus layer's app/error.vue. Keeps the regular site chrome
// (header, footer, search). For 404s the Meteor canvas game fills the viewport
// below the header: playable on desktop, an ambient background on touch and
// small viewports. Every other error falls back to Nuxt UI's standard view.
import type { NuxtError } from "#app";
import type { ContentNavigationItem, PageCollections } from "@nuxt/content";

const props = defineProps<{
  error: NuxtError;
}>();

const isNotFound = computed(() => props.error.statusCode === 404);

useHead({
  htmlAttrs: { lang: "en" },
  // The canvas game replaces the static hero on JS clients. The hero is hidden
  // from the first paint (scoped CSS) so it never flashes before the game
  // mounts; this <noscript> re-reveals it when JS is unavailable.
  noscript: [
    { innerHTML: "<style>.notfound__hero{opacity:1 !important}</style>" },
  ],
});

useSeoMeta({
  title: () => (isNotFound.value ? "Page not found" : "Something went wrong"),
  description: () =>
    isNotFound.value
      ? "This page drifted off into space. Head back to the Meteor docs or stay for a round of meteors."
      : "An unexpected error occurred.",
});

// Same navigation the Docus error page provides: AppHeader (mobile menu) and
// AppSearch consume it via inject.
const { data: navigation } = await useAsyncData(
  "navigation_docs",
  () => queryCollectionNavigation("docs" as keyof PageCollections),
  {
    transform: (data: ContentNavigationItem[]) =>
      transformNavigation(data, false),
  },
);

provide("navigation", navigation);

// The canvas game is client-only (SSR renders the plain 404 hero below for
// crawlers and no-JS visitors). Once mounted it always shows, but only devices
// with a keyboard and room to fly get the *playable* game; touch devices and
// small viewports get it as an ambient background (the interactive prop).
// Playability upgrades on media changes but never downgrades, so a window
// resize does not kill a running game.
const GAME_MEDIA =
  "(min-width: 768px) and (min-height: 480px) and (pointer: fine)";
const mounted = ref(false);
const canPlay = ref(false);
let gameMedia: MediaQueryList | undefined;

function onGameMediaChange(event: MediaQueryListEvent) {
  if (event.matches) canPlay.value = true;
}

onMounted(() => {
  gameMedia = window.matchMedia(GAME_MEDIA);
  canPlay.value = gameMedia.matches;
  gameMedia.addEventListener("change", onGameMediaChange);
  mounted.value = true;
});

onBeforeUnmount(() => {
  gameMedia?.removeEventListener("change", onGameMediaChange);
});
</script>

<template>
  <UApp>
    <div :class="{ 'notfound-shell': isNotFound }">
      <AppHeader />

      <main v-if="isNotFound" class="notfound">
        <!-- Real 404 content for crawlers, screen readers, and no-JS visitors.
             Hidden from first paint (see scoped CSS + the noscript above) so
             JS clients go straight to the game with no static-page flash. -->
        <section class="notfound__hero">
          <p class="notfound__code">404</p>
          <h1 class="notfound__heading">Page not found</h1>
          <p class="notfound__text">
            The page you are looking for burned up on entry, moved, or never
            existed.
          </p>
        </section>

        <Transition name="notfound__fade">
          <Meteor404Game
            v-if="mounted"
            :interactive="canPlay"
            class="notfound__game"
          />
        </Transition>
      </main>

      <UError v-else :error="error" />

      <AppFooter />
    </div>

    <ClientOnly>
      <AppSearch :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>

<style scoped>
/* Header, content, and footer share exactly one viewport height, so the page
 * itself never scrolls; the game or hero gets whatever the header and footer
 * leave over. The min-height floor brings scrolling back on very short
 * viewports instead of squashing the content. */
.notfound-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
}

.notfound {
  position: relative;
  flex: 1;
  min-height: 360px;
  /* Matches the game canvas, so the pre-mount state reads as the game loading
   * rather than an empty page. */
  background: var(--ui-bg);
}

/* Hidden by default (the game takes over on JS clients); the noscript block in
 * useHead re-reveals it when JS is unavailable. Absolutely positioned so it
 * shares the box with the game overlay without affecting layout. */
.notfound__hero {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  text-align: center;
  opacity: 0;
}

.notfound__game {
  position: absolute;
  inset: 0;
}

/* Fade the game in over the (opaque, same-colored) background so it appears
 * rather than popping. */
.notfound__fade-enter-active {
  transition: opacity 0.4s ease;
}

.notfound__fade-enter-from {
  opacity: 0;
}

.notfound__code {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ui-text-muted);
}

.notfound__heading {
  font-size: clamp(28px, 8vw, 40px);
  font-weight: 700;
  line-height: 1.15;
  color: var(--ui-text-highlighted);
}

.notfound__text {
  max-width: 480px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
</style>
