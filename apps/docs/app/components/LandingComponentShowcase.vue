<script setup lang="ts">
import MtThemeProvider from "@shopware-ag/meteor-component-library/MtThemeProvider";
import ProductSpecificationCard from "./showcase/ProductSpecificationCard.vue";
import StoreAnalyticsCard from "./showcase/StoreAnalyticsCard.vue";
import ShippingRateCard from "./showcase/ShippingRateCard.vue";
import ShareInviteCard from "./showcase/ShareInviteCard.vue";
import ConnectNexusCard from "./showcase/ConnectNexusCard.vue";
import PlanUsageCard from "./showcase/PlanUsageCard.vue";
import AppearanceCard from "./showcase/AppearanceCard.vue";
import ProductDetailCard from "./showcase/ProductDetailCard.vue";
import CampaignCard from "./showcase/CampaignCard.vue";
import InvoicesCard from "./showcase/InvoicesCard.vue";
import CustomDomainCard from "./showcase/CustomDomainCard.vue";

// Match the docs' other live examples: removeCardWidth drops MtCard's max-width
// so cards fill the columns; removeDefaultMargin drops its bottom margin (the
// grid controls the gutter). Applied on the provider that wraps the grid, so
// every card inherits it — cards don't set future flags themselves.
const futureFlags = {
  removeCardWidth: true,
  removeDefaultMargin: true,
};

// Approximate rendered heights (px) so the client-only fallback reserves space
// and the section doesn't shift when the cards hydrate. Ordered to match the
// cards below.
const skeletonHeights = [340, 260, 280, 470, 400, 240, 340, 340, 360, 340, 320];
</script>

<template>
  <section
    class="hero-rise py-20 sm:py-28"
    :style="{ animationDelay: '300ms' }"
  >
    <UContainer>
      <ClientOnly>
        <MtThemeProvider :future="futureFlags">
          <div class="showcase-grid">
            <ProductSpecificationCard class="mt-showcase-item" />
            <StoreAnalyticsCard class="mt-showcase-item" />
            <ShippingRateCard class="mt-showcase-item" />
            <ShareInviteCard class="mt-showcase-item" />
            <ConnectNexusCard class="mt-showcase-item" />
            <PlanUsageCard class="mt-showcase-item" />
            <AppearanceCard class="mt-showcase-item" />
            <ProductDetailCard class="mt-showcase-item" />
            <CampaignCard class="mt-showcase-item" />
            <InvoicesCard class="mt-showcase-item" />
            <CustomDomainCard class="mt-showcase-item" />
          </div>
        </MtThemeProvider>

        <template #fallback>
          <div class="showcase-grid">
            <div
              v-for="(h, i) in skeletonHeights"
              :key="i"
              class="mt-showcase-item animate-pulse rounded-xl border border-default bg-muted"
              :style="{ height: `${h}px` }"
            />
          </div>
        </template>
      </ClientOnly>

      <div class="mt-10 text-center">
        <NuxtLink
          to="/components"
          class="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          Browse all components
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
/* Masonry via CSS multi-column: cards keep their natural height and pack into
 * 1/2/3/4 responsive columns. column-gap is the horizontal gutter; the matching
 * vertical gutter is the cards' margin-bottom below. */
.showcase-grid {
  --showcase-gutter: var(--scale-size-16);
  column-count: 1;
  column-gap: var(--showcase-gutter);
}

@media (min-width: 640px) {
  .showcase-grid {
    column-count: 2;
  }
}

@media (min-width: 1024px) {
  .showcase-grid {
    column-count: 3;
  }
}

@media (min-width: 1280px) {
  .showcase-grid {
    column-count: 4;
  }
}

/* Each card is a multi-column item: a full-width block, kept whole within its
 * column, with a vertical gutter equal to column-gap. `mt-showcase-item` is
 * forwarded from here onto each card's root MtCard. The two-class specificity
 * (0,2,0) beats MtCard's `.mt-card--future-remove-default-margin` (0,1,0). */
.showcase-grid :deep(.mt-showcase-item) {
  display: block;
  width: 100%;
  margin-bottom: var(--showcase-gutter);
  break-inside: avoid;
}
</style>
