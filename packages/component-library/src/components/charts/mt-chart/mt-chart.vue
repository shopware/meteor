<template>
  <div
    ref="chartContainer"
    :class="`mt-chart mt-chart-${props.type}`"
    :style="{ width: props.width, height: props.height }"
  ></div>
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { getDefaultOptions } from "./mt-chart-default-options";
import { deepMergeObjects } from "@/utils/object";
import { computed, defineProps, onMounted, ref, watch, onBeforeUnmount } from "vue";
import { templateRef } from "@vueuse/core";

export type ChartOptions = ApexOptions;

const props = withDefaults(
  defineProps<{
    series: any[];
    options?: ChartOptions;
    type?: ApexChart["type"];
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

const chartContainer = templateRef("chartContainer");
const chart = ref<ApexCharts>();

const init = async () => {
  const ApexCharts = (await import("apexcharts")).default;
  if (!chartContainer.value) {
    throw new Error("Chart container is not defined");
  }
  if (!chartOptions.value) {
    throw new Error("Chart options are not defined");
  }
  if (chart.value) {
    chart.value.destroy();
  }
  chart.value = new ApexCharts(chartContainer.value, { ...chartOptions.value, series: [] });
  chart.value.render();
  chart.value.updateSeries(props.series);
};

const destroy = () => {
  if (chart.value) {
    chart.value.destroy();
    chart.value = undefined;
  }
};

onMounted(init);
onBeforeUnmount(destroy);

const chartOptions = computed<ApexOptions>(() => {
  const options = props.options;
  const defaultOptions = getDefaultOptions(props.type);

  const mergedOptions = deepMergeObjects<ApexOptions>(defaultOptions, options);

  return {
    ...mergedOptions,
    chart: {
      type: props.type,
      width: props.width,
      height: props.height,
      ...mergedOptions.chart,
    },
  };
});

watch(
  () => props.options,
  () => {
    if (chart.value) {
      chart.value.updateOptions(chartOptions.value);
    }
  },
  { deep: true },
);

watch(
  () => props.series,
  () => {
    if (chart.value) {
      chart.value.updateSeries(props.series);
    }
  },
  { deep: true },
);

watch([() => props.type, () => props.width, () => props.height], init);
</script>

<style scoped>
.mt-chart :deep(.apexcharts-text) {
  fill: var(--color-text-secondary-default) !important;
}

.mt-chart-area :deep(.apexcharts-tooltip) {
  background-color: var(--color-elevation-surface-overlay);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-l);
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 10%);
  color: var(--color-text-primary-default);

  .apexcharts-tooltip-title {
    font-family: var(--font-family-body) !important;
    font-size: var(--font-size-xs) !important;
    font-weight: var(--font-weight-bold);
    background: var(--color-interaction-secondary-default) !important;
    border-bottom: 1px solid var(--color-border-primary-default);
    padding: 10px 16px;
    margin-bottom: 0;
  }

  .apexcharts-tooltip-series-group {
    padding: 10px 16px;
  }

  .apexcharts-tooltip-marker {
    margin-right: 0;
  }

  .apexcharts-tooltip-text-y-label {
    display: none;
  }

  .apexcharts-tooltip-text-y-value {
    font-family: var(--font-family-body);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }

  .apexcharts-tooltip-y-group {
    padding: 0;
  }
}
</style>
