<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
import MtNumberField from "@shopware-ag/meteor-component-library/MtNumberField";

// Figma node 3466-33258. Editing the fields updates the header live.
const productName = ref("Flowsphere No. 1");
const productPrice = ref(54.95);
const muted = "color-text-secondary-default";
// Bound (not a static `src="…"`) so Vue's compiler doesn't run transformAssetUrls
// on it — that rewrite mangles this public-root path in a sub-component.
const productImage = "/showcase-product.jpg";
</script>

<template>
  <!-- The plain wrapper carries this component's scope id, which the root
       MtCard would not — so the :deep rule below can reach .mt-card__content. -->
  <div>
    <mt-card>
      <div class="product-head">
        <div class="product-stack">
          <div class="product-stack__back product-stack__back--far"></div>
          <div class="product-stack__back product-stack__back--near"></div>
          <div class="product-stack__photo">
            <img :src="productImage" alt="Flowsphere No. 1" />
          </div>
        </div>
        <div class="product-meta">
          <div class="product-titles">
            <mt-text size="2xs" :color="muted" class="product-clip">
              Lamps
            </mt-text>
            <mt-text
              size="m"
              weight="semibold"
              :color="productName ? 'color-text-primary-default' : muted"
              class="product-clip"
            >
              {{ productName || "Product name" }}
            </mt-text>
          </div>
          <div class="product-price">
            <mt-text size="xs" weight="semibold" class="product-clip">
              {{ productPrice }} €
            </mt-text>
          </div>
        </div>
      </div>
      <div class="product-fields">
        <mt-text-field
          v-model="productName"
          label="Product name"
          size="small"
        />
        <mt-number-field
          v-model="productPrice"
          label="Price"
          size="small"
          :min="0"
          :digits="2"
          :show-controls="false"
        >
          <template #suffix>€</template>
        </mt-number-field>
      </div>
    </mt-card>
  </div>
</template>

<style scoped>
/* Figma "Card": a header strip on a sunken surface with a stacked product photo
   + title + price pill, then two fields below. Card padding is zeroed so each
   section owns its 24px padding (and the header strip bleeds edge-to-edge).
   The `.mt-card` in the selector lifts specificity above MtCard's own
   `.mt-card__content` var declaration so the override wins. */
:deep(.mt-card .mt-card__content) {
  --mt-card-content-padding: 0;
}
.product-head {
  display: flex;
  align-items: center;
  gap: var(--scale-size-32);
  padding: var(--scale-size-24);
  background: var(--color-elevation-surface-sunken);
  border-bottom: 1px solid var(--color-border-secondary-default);
}
.product-stack {
  position: relative;
  isolation: isolate;
  flex-shrink: 0;
  width: 88px;
  height: 88px;
}
.product-stack__photo {
  position: relative;
  z-index: 3;
  width: 88px;
  height: 88px;
  overflow: hidden;
  border-radius: var(--border-radius-l);
  box-shadow: 0 12px 20px -8px var(--color-elevation-shadow-default);
}
.product-stack__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* The two tinted cards fanned out behind the photo. */
.product-stack__back {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 88px;
  height: 88px;
  border-radius: var(--border-radius-l);
  background: var(--color-background-tertiary-default);
  border: 1px solid var(--color-border-secondary-default);
}
.product-stack__back--near {
  z-index: 2;
  transform: translate(calc(-50% + 4px), calc(-50% + 4px)) rotate(2deg);
}
.product-stack__back--far {
  z-index: 1;
  transform: translate(calc(-50% + 8px), calc(-50% + 8px)) rotate(4deg);
}
.product-meta {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  gap: var(--scale-size-8);
}
.product-titles {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-2);
  min-width: 0;
}
/* Clamp the category + title to one line with an ellipsis when they overflow. */
.product-clip {
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-price {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  /* Cap the pill at the meta column width so a long price truncates inside it. */
  max-width: 100%;
  padding: var(--scale-size-2) var(--scale-size-12);
  border-radius: var(--border-radius-round);
  background: var(--color-background-tertiary-default);
}
.product-fields {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
  padding: var(--scale-size-24);
}
</style>
