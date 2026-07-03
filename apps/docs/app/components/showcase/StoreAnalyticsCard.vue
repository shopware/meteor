<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtHelpText from "@shopware-ag/meteor-component-library/MtHelpText";
import MtInset from "@shopware-ag/meteor-component-library/MtInset";
import MtChart from "@shopware-ag/meteor-component-library/MtChart";
import type { ChartOptions } from "@shopware-ag/meteor-component-library/MtChart";

const revenueSeries = [
  { name: "Revenue", data: [28.2, 31.5, 30.1, 38.4, 42.8, 40.2, 46.1, 48.2] },
];
const revenueChartOptions: ChartOptions = {
  xaxis: {
    categories: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  stroke: { curve: "smooth" },
  tooltip: {
    y: { formatter: (val: number) => `€${val.toFixed(1)}k` },
  },
  yaxis: {
    labels: { formatter: (val: number) => `€${Math.round(val)}k` },
  },
};
</script>

<template>
  <!-- Wrapper carries the scope id so the :deep rule can reach .mt-card__content. -->
  <div>
    <mt-card>
      <div class="flex flex-col gap-0">
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col gap-1">
            <div class="inline-start">
              <mt-text size="s" weight="semibold">Total revenue</mt-text>
              <mt-help-text
                text="Net revenue across all sales channels, updated hourly."
              />
            </div>
            <mt-text size="2xl" weight="bold">€48.2k</mt-text>
          </div>
          <mt-button
            variant="secondary"
            square
            size="small"
            aria-label="Analytics options"
          >
            <template #iconFront>
              <mt-icon name="solid-ellipsis-h" size="14" />
            </template>
          </mt-button>
        </div>
        <mt-inset class="chart-inset">
          <mt-chart
            type="area"
            :series="revenueSeries"
            :options="revenueChartOptions"
            height="180px"
          />
        </mt-inset>
      </div>
    </mt-card>
  </div>
</template>

<style scoped>
/* The chart bleeds to the bottom edge, so drop this card's bottom padding.
   `.mt-card` lifts specificity above MtCard's own padding rule. */
:deep(.mt-card .mt-card__content) {
  padding-bottom: 0;
}
/* Bleed the chart toward the card's side edges (no top/bottom bleed); small
   asymmetric inline padding keeps the axis labels off the very edge. */
.chart-inset {
  --mt-inset-block-start: 0;
  --mt-inset-block-end: 0;
  padding-inline-end: var(--scale-size-16);
  padding-inline-start: var(--scale-size-6);
}
.inline-start {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
}
</style>
