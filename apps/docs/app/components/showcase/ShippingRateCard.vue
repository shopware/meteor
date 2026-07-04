<script setup lang="ts">
import type { Component } from "vue";
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtBadge from "@shopware-ag/meteor-component-library/MtBadge";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtSelect from "@shopware-ag/meteor-component-library/MtSelect";
import MtInset from "@shopware-ag/meteor-component-library/MtInset";
import MtUnitFieldComponent from "@shopware-ag/meteor-component-library/MtUnitField";

// MtUnitField ships broken dist types (it leaks a required internal `hasFocus`;
// its own examples use `// @ts-nocheck`). Cast it to a generic component so the
// template type-checker doesn't enforce the broken prop shape.
const MtUnitField = MtUnitFieldComponent as Component;

const width = ref(64);
const widthUnit = ref("cm");
const height = ref(48);
const heightUnit = ref("cm");
const packageType = ref("box-m");
const packageTypes = [
  { id: 1, label: "Small box", value: "box-s" },
  { id: 2, label: "Medium box", value: "box-m" },
  { id: 3, label: "Pallet", value: "pallet" },
];
const muted = "color-text-secondary-default";

// A per-package base rate; larger formats cost more to handle.
const baseRates: Record<string, number> = {
  "box-s": 4.9,
  "box-m": 6.99,
  pallet: 24.9,
};
// Normalize whatever length unit the fields use down to centimeters.
const lengthToCm: Record<string, number> = {
  mm: 0.1,
  cm: 1,
  dm: 10,
  m: 100,
  in: 2.54,
  ft: 30.48,
};

// Keep the demo dimensions within 5 m per side, whatever unit is active
// (also re-clamped when switching units, e.g. 400 cm -> m becomes 5 m).
const MAX_SIDE_CM = 500;
watch([width, widthUnit], () => {
  const factor = lengthToCm[widthUnit.value] ?? 1;
  if ((width.value || 0) * factor > MAX_SIDE_CM) {
    width.value = Math.floor((MAX_SIDE_CM / factor) * 100) / 100;
  }
});
watch([height, heightUnit], () => {
  const factor = lengthToCm[heightUnit.value] ?? 1;
  if ((height.value || 0) * factor > MAX_SIDE_CM) {
    height.value = Math.floor((MAX_SIDE_CM / factor) * 100) / 100;
  }
});

// Made-up tariff: base rate + a size surcharge of €1.20 per 1000 cm² of
// footprint (width x height), recomputed live from the inputs.
const shippingPrice = computed(() => {
  const base = baseRates[packageType.value] ?? 6.99;
  const w = (width.value || 0) * (lengthToCm[widthUnit.value] ?? 1);
  const h = (height.value || 0) * (lengthToCm[heightUnit.value] ?? 1);
  const sizeSurcharge = ((w * h) / 1000) * 1.2;
  return `€${(base + sizeSurcharge).toFixed(2).replace(".", ",")}`;
});
</script>

<template>
  <mt-card>
    <div class="stack">
      <div class="row">
        <mt-text size="s" weight="semibold">Calculate shipping</mt-text>
        <mt-badge variant="positive" size="s" :status-indicator="true"
          >Ready to ship</mt-badge
        >
      </div>
      <div class="ship-summary">
        <div class="ship-line">
          <mt-text size="2xs" :color="muted">From:</mt-text>
          <mt-text size="2xs" :color="muted"
            >Lindenstraße 24, 10115 Berlin, Germany</mt-text
          >
        </div>
        <div class="ship-line">
          <mt-icon
            name="regular-long-arrow-down-right-s"
            size="12"
            color="var(--color-text-secondary-default)"
            class="ship-arrow"
          />
          <mt-text size="2xs" :color="muted">To:</mt-text>
          <mt-text size="2xs" :color="muted"
            >Seefeldstrasse 18, 8008 Zürich, Switzerland</mt-text
          >
        </div>
      </div>
      <div class="section">
        <mt-select
          v-model="packageType"
          label="Package type"
          :options="packageTypes"
          hideClearableButton
          small
        />
        <div class="grid grid-cols-2 gap-4">
          <mt-unit-field
            v-model="width"
            v-model:default-unit="widthUnit"
            label="Width"
            measurement-type="length"
            size="small"
          />
          <mt-unit-field
            v-model="height"
            v-model:default-unit="heightUnit"
            label="Height"
            measurement-type="length"
            size="small"
          />
        </div>
      </div>
      <mt-inset class="ship-inset">
        <div class="flex items-center gap-3">
          <div class="ship-tile">
            <mt-icon
              name="regular-truck"
              size="16"
              color="var(--color-icon-primary-default)"
            />
          </div>
          <div class="min-w-0 flex-1">
            <mt-text size="xs" weight="semibold">Express shipping</mt-text>
            <mt-text size="2xs" :color="muted">1–2 business days</mt-text>
          </div>
          <mt-text size="m" weight="semibold" class="ship-price">
            {{ shippingPrice }}
          </mt-text>
        </div>
      </mt-inset>
    </div>
  </mt-card>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}
.section {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
/* A status/action header row. */
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-12);
}
/* From/to summary, pulled up toward the header row (trims the 24px stack gap). */
.ship-summary {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  margin-top: calc(var(--scale-size-12) * -1);
}
.ship-line {
  display: flex;
  align-items: baseline;
  gap: var(--scale-size-8);
  min-width: 0;
}
.ship-arrow {
  padding-bottom: 1px;
  /* The line's flex gap is 8px; trim 5px so the arrow sits 3px from "To:". */
  margin-right: -5px;
}
/* Full-bleed footer (no top bleed, so the stack gap above is kept), padded to
   the card and recessed a step below the surface. */
.ship-inset {
  --mt-inset-block-start: 0;
  padding: var(--mt-card-content-padding);
  background: var(--color-elevation-surface-sunken);
  border-top: 1px solid var(--color-border-secondary-default);
}
/* The computed price can grow arbitrarily long with extreme dimensions;
   truncate it instead of letting it overflow or squash the label column. */
.ship-price {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Bordered, squared 40×40 icon tile. */
.ship-tile {
  display: grid;
  place-items: center;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  border-radius: var(--border-radius-s);
  border: 1px solid var(--color-border-primary-default);
  background: var(--color-background-tertiary-default);
  flex-shrink: 0;
}
</style>
