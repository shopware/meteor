<script setup lang="ts">
import MtThemeProvider from "@shopware-ag/meteor-component-library/MtThemeProvider";
import MtSnackbar from "@shopware-ag/meteor-component-library/MtSnackbar";
import ProductSpecificationCard from "./showcase/ProductSpecificationCard.vue";
import StoreAnalyticsCard from "./showcase/StoreAnalyticsCard.vue";
import ShippingRateCard from "./showcase/ShippingRateCard.vue";
import ShareInviteCard from "./showcase/ShareInviteCard.vue";
import ConnectNexusCard from "./showcase/ConnectNexusCard.vue";
import PlanUsageCard from "./showcase/PlanUsageCard.vue";
import AppearanceCard from "./showcase/AppearanceCard.vue";
import ProductDetailCard from "./showcase/ProductDetailCard.vue";
import CampaignCard from "./showcase/CampaignCard.vue";
import CustomDomainCard from "./showcase/CustomDomainCard.vue";
import PaymentsCard from "./showcase/PaymentsCard.vue";
import PlaceholderCard from "./showcase/PlaceholderCard.vue";

// removeCardWidth drops MtCard's max-width so cards fill the columns;
// removeDefaultMargin drops its bottom margin (the grid controls the gutter).
// Set on the wrapping provider so every card inherits it.
const futureFlags = {
  removeCardWidth: true,
  removeDefaultMargin: true,
};

// Approximate rendered heights (px) per column so the client-only fallback
// reserves space and hydration doesn't shift the layout.
const skeletonColumns = [
  [317, 398, 164, 90],
  [283, 373, 202, 90],
  [516, 432, 90],
  [462, 303, 180, 90],
];
</script>

<template>
  <section class="showcase-section pt-[120px]">
    <UContainer>
      <ClientOnly>
        <MtThemeProvider :future="futureFlags">
          <!-- Explicit 4-column layout: each column stacks its assigned cards. -->
          <div class="showcase-grid">
            <div class="showcase-col">
              <ProductSpecificationCard class="mt-showcase-item" />
              <ShareInviteCard class="mt-showcase-item" />
              <AppearanceCard class="mt-showcase-item" />
              <PlaceholderCard class="mt-showcase-item" />
            </div>
            <div class="showcase-col">
              <StoreAnalyticsCard class="mt-showcase-item" />
              <ShippingRateCard class="mt-showcase-item" />
              <ProductDetailCard class="mt-showcase-item" />
              <PlaceholderCard class="mt-showcase-item" />
            </div>
            <div class="showcase-col">
              <ConnectNexusCard class="mt-showcase-item" />
              <PlanUsageCard class="mt-showcase-item" />
              <PlaceholderCard class="mt-showcase-item" />
            </div>
            <div class="showcase-col">
              <CampaignCard class="mt-showcase-item" />
              <CustomDomainCard class="mt-showcase-item" />
              <PaymentsCard class="mt-showcase-item" />
              <PlaceholderCard class="mt-showcase-item" />
            </div>
          </div>

          <!-- Single global snackbar host: cards fire toasts via useSnackbar(). -->
          <MtSnackbar />
        </MtThemeProvider>

        <template #fallback>
          <div class="showcase-grid">
            <div
              v-for="(col, ci) in skeletonColumns"
              :key="ci"
              class="showcase-col"
            >
              <!-- bg-elevated: one step off the zinc-50 page background. -->
              <div
                v-for="(h, i) in col"
                :key="i"
                class="mt-showcase-item animate-pulse rounded-xl bg-elevated"
                :style="{ height: `${h}px` }"
              />
            </div>
          </div>
        </template>
      </ClientOnly>
    </UContainer>

    <!-- Fades the bottom of the cards into the page background. -->
    <div aria-hidden="true" class="showcase-fade" />
  </section>
</template>

<style scoped>
/* The landing page narrows UContainer to 1280px; the showcase grid wants the
 * full default width back (1680px, see main.css). */
.showcase-section {
  --ui-container: 1680px;
  position: relative;
}
/* Gradient overlay fading the cards down into the page background
   (--landing-bg) so the masonry dissolves into the next section. */
.showcase-fade {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 640px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--landing-bg, var(--ui-bg)) 75%
  );
  pointer-events: none;
}

/* Explicit 4-column grid; --showcase-gutter is both the column gap and the
 * vertical gap between stacked cards. */
.showcase-grid {
  --showcase-gutter: var(--scale-size-20);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--showcase-gutter);
}

/* Narrower viewports drop whole curated columns (4 -> 3 -> 2) instead of
 * reflowing everything; the skeleton shares the classes and follows. */
@media (max-width: 1439.98px) {
  .showcase-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .showcase-col:nth-child(4) {
    display: none;
  }
}

@media (max-width: 1023.98px) {
  .showcase-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .showcase-col:nth-child(3) {
    display: none;
  }
}

/* Smartphones skip the showcase entirely; the hero hands over to the next
 * section directly (the hero fade shortens to match, see index.vue). */
@media (max-width: 639.98px) {
  .showcase-section {
    display: none;
  }
}

/* A column stacks its cards top-to-bottom with the gutter between them. Each
 * column carries a base entrance delay so the columns cascade left-to-right. */
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--showcase-gutter);
  min-width: 0;
  --col-rise-delay: 0ms;
}
.showcase-col:nth-child(2) {
  --col-rise-delay: 60ms;
}
.showcase-col:nth-child(3) {
  --col-rise-delay: 120ms;
}
.showcase-col:nth-child(4) {
  --col-rise-delay: 180ms;
}

/* Forwarded onto each card's root MtCard; the two-class specificity beats
 * MtCard's own margin modifier. Cards blur-fade in, staggered by column base
 * delay plus row. */
.showcase-col :deep(.mt-showcase-item) {
  display: block;
  width: 100%;
  animation: card-rise 0.8s var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1)) both;
  animation-delay: calc(var(--col-rise-delay) + var(--row-rise-delay, 0ms));
}
.showcase-col :deep(.mt-showcase-item:nth-child(2)) {
  --row-rise-delay: 90ms;
}
.showcase-col :deep(.mt-showcase-item:nth-child(3)) {
  --row-rise-delay: 180ms;
}
.showcase-col :deep(.mt-showcase-item:nth-child(4)) {
  --row-rise-delay: 270ms;
}

@keyframes card-rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
    filter: blur(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .showcase-col :deep(.mt-showcase-item) {
    animation: none;
  }
}
</style>
