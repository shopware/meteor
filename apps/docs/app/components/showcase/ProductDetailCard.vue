<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtBadge from "@shopware-ag/meteor-component-library/MtBadge";

const muted = "color-text-secondary-default";
// Bound src (not a static `src="…"`) so Vue's compiler doesn't run
// transformAssetUrls on it — that rewrite mangles this public-root path.
const productImage = "/showcase-headset.jpg";
</script>

<template>
  <!-- Wrapper carries the scope id so the :deep rule can reach .mt-card__content. -->
  <div>
    <mt-card>
      <div class="profile-card">
        <div class="flex items-center gap-4">
          <div class="product-tile">
            <img :src="productImage" alt="Aeonic Quiet Studio 2" />
          </div>
          <div class="min-w-0 flex-1">
            <mt-text size="s" weight="semibold">Aeonic Quiet Studio 2</mt-text>
            <mt-text size="2xs" :color="muted">STK · QUIET-ST2</mt-text>
          </div>
          <mt-button
            variant="tertiary"
            square
            size="default"
            aria-label="Product options"
          >
            <template #iconFront>
              <mt-icon name="solid-ellipsis-h" size="14" />
            </template>
          </mt-button>
        </div>
        <mt-text size="xs" :color="muted" class="product-desc"
          >Premium over-ear wireless headphones with active noise cancellation,
          40-hour battery life, and plush memory-foam cushions. Bluetooth 5.3
          multipoint pairing keeps you connected to every device,
          effortlessly.</mt-text
        >
        <div class="row">
          <div class="inline-start">
            <mt-icon
              name="solid-star"
              size="14"
              color="var(--color-icon-attention-default)"
            />
            <mt-text size="xs" weight="medium">4.8</mt-text>
            <mt-text size="xs" :color="muted">(824 reviews)</mt-text>
          </div>
          <mt-badge variant="neutral" size="s">In stock</mt-badge>
        </div>
      </div>
    </mt-card>
  </div>
</template>

<style scoped>
/* This card uses tighter 16px padding. `.mt-card` lifts specificity above
   MtCard's own padding rule. */
:deep(.mt-card .mt-card__content) {
  --mt-card-content-padding: var(--scale-size-16);
}
/* Header row, a clamped description, and a review/stock row. */
.profile-card {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
.product-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
/* A label/value or status/action row. */
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-12);
}
.inline-start {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
}
/* Bordered, squared 48×48 tile holding the product photo. */
.product-tile {
  display: grid;
  place-items: center;
  width: var(--scale-size-48);
  height: var(--scale-size-48);
  overflow: hidden;
  border-radius: var(--border-radius-s);
  border: 1px solid var(--color-border-primary-default);
  background: var(--color-background-secondary-default);
  flex-shrink: 0;
}
.product-tile img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
