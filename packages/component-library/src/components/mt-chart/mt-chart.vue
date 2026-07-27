<template>
  <div
    ref="chartContainer"
    data-testid="mt-chart"
    :class="`mt-chart mt-chart-${props.type}`"
    :style="{ width: sizeToCss(props.width), height: sizeToCss(props.height) }"
  >
    <canvas ref="canvasEl"></canvas>

    <div
      v-if="tooltip.visible"
      class="mt-chart__tooltip"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
    >
      <div v-if="tooltip.title" class="mt-chart__tooltip-title">{{ tooltip.title }}</div>
      <div v-for="(row, index) in tooltip.rows" :key="index" class="mt-chart__tooltip-row">
        <span class="mt-chart__tooltip-marker" :style="{ background: row.color }" />
        <span class="mt-chart__tooltip-value">{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables, type ChartConfiguration } from "chart.js";
import { getDefaultOptions } from "./mt-chart-default-options";
import { toChartConfig } from "./mt-chart-adapter";
import { createTooltipHandler, hiddenTooltip } from "./mt-chart-tooltip";
import type { ChartOptions } from "./mt-chart-types";
import { deepMergeObjects } from "@/utils/object";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { templateRef } from "@vueuse/core";

export type { ChartOptions };

Chart.register(...registerables);

const props = withDefaults(
  defineProps<{
    series: any[];
    options?: ChartOptions;
    type?: string;
    width?: string | number;
    height?: string | number;
  }>(),
  {
    options: () => ({}),
    type: () => "area",
    width: () => "100%",
    height: () => "300px",
  },
);

const chartContainer = templateRef<HTMLElement>("chartContainer");
const canvasEl = templateRef<HTMLCanvasElement>("canvasEl");

// plain variable on purpose: a reactive ref would proxy the Chart.js instance
// and break its identity-based internals (blank charts)
let chart: Chart | undefined;

const sizeToCss = (value: string | number) => (typeof value === "number" ? `${value}px` : value);

const resolveCssVar = (value?: string) => {
  const token = value?.match(/var\((--[^)]+)\)/)?.[1];
  if (!token || !chartContainer.value) return value;
  return getComputedStyle(chartContainer.value).getPropertyValue(token).trim() || value;
};

const chartOptions = computed<ChartOptions>(() =>
  deepMergeObjects<ChartOptions>(getDefaultOptions(props.type), props.options),
);

const tooltip = ref(hiddenTooltip());
const tooltipHandler = createTooltipHandler(tooltip);

const buildConfig = (): ChartConfiguration => {
  const config = toChartConfig(props.type, props.series, chartOptions.value, resolveCssVar);
  config.options ??= {};
  config.options.plugins ??= {};
  config.options.plugins.tooltip =
    chartOptions.value.tooltip?.enabled === false
      ? { enabled: false }
      : { enabled: false, external: tooltipHandler };
  return config;
};

const createChart = () => {
  if (!canvasEl.value) return;
  chart?.destroy();
  chart = new Chart(canvasEl.value, buildConfig());
};

let themeObserver: MutationObserver | undefined;

onMounted(() => {
  createChart();

  // colors are baked into the canvas, so recreate when the theme changes
  themeObserver = new MutationObserver(createChart);
  themeObserver.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
  chart?.destroy();
  chart = undefined;
});

watch(
  () => props.series,
  () => {
    if (!chart) return;
    chart.data = buildConfig().data;
    chart.update();
  },
  { deep: true },
);

watch([() => props.options, () => props.type, () => props.width, () => props.height], createChart, {
  deep: true,
});
</script>

<style scoped>
.mt-chart {
  position: relative;
}

.mt-chart__tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: none;
  overflow: hidden;
  background-color: var(--color-elevation-surface-overlay);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-l);
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 10%);
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  z-index: 1;
}

.mt-chart__tooltip-title {
  font-weight: var(--font-weight-bold);
  background-color: var(--color-interaction-secondary-default);
  border-bottom: 1px solid var(--color-border-primary-default);
  padding: var(--scale-size-10) var(--scale-size-16);
}

.mt-chart__tooltip-row {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  padding: var(--scale-size-10) var(--scale-size-16);
}

.mt-chart__tooltip-marker {
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  border-radius: var(--border-radius-round);
}

.mt-chart__tooltip-value {
  font-weight: var(--font-weight-medium);
}
</style>
