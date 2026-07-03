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

// Match the docs' other live examples: removeCardWidth drops MtCard's max-width
// so cards fill the columns; removeDefaultMargin drops its bottom margin (the
// grid controls the gutter). Applied on the provider that wraps the grid, so
// every card inherits it — cards don't set future flags themselves.
const futureFlags = {
  removeCardWidth: true,
  removeDefaultMargin: true,
};

// Approximate rendered heights (px) per column so the client-only fallback
// reserves space and the section doesn't shift when the cards hydrate. Each
// inner array matches one column's cards below, in order.
const skeletonColumns = [
  [340, 470, 340, 60],
  [260, 280, 340, 60],
  [400, 240, 60],
  [360, 320, 200, 60],
];
</script>

<template>
  <section
    class="showcase-section hero-rise pt-[120px]"
    :style="{ animationDelay: '300ms' }"
  >
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
              <div
                v-for="(h, i) in col"
                :key="i"
                class="mt-showcase-item animate-pulse rounded-xl border border-default bg-muted"
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
/* The landing page narrows UContainer to --ui-container-small (1280px); the
 * showcase grid wants the full width, so restore the default --ui-container
 * (1680px, defined in main.css) for this section's UContainer. */
.showcase-section {
  --ui-container: 1680px;
  position: relative;
}
/* Fixed-height gradient overlay on top of the cards: transparent at the top,
   fading down to the page background so the masonry dissolves into the next
   section. */
.showcase-fade {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 800px;
  background: linear-gradient(to bottom, transparent, var(--ui-bg-muted) 90%);
  pointer-events: none;
}

/* Explicit 4-column grid: card placement per column is decided in the template
 * (each .showcase-col stacks its cards). Collapses to 2 then 1 column on
 * narrower viewports. --showcase-gutter is both the column gap and the vertical
 * gap between stacked cards. */
.showcase-grid {
  --showcase-gutter: var(--scale-size-20);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--showcase-gutter);
}

@media (max-width: 1024px) {
  .showcase-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .showcase-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* A column stacks its cards top-to-bottom with the gutter between them. */
.showcase-col {
  display: flex;
  flex-direction: column;
  gap: var(--showcase-gutter);
  min-width: 0;
}

/* `mt-showcase-item` is forwarded onto each card's root MtCard. The two-class
 * specificity (0,2,0) beats MtCard's `.mt-card--future-remove-default-margin`
 * (0,1,0). */
.showcase-col :deep(.mt-showcase-item) {
  display: block;
  width: 100%;
}
</style>
