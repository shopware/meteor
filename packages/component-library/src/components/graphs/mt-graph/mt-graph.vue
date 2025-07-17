<template>
  <div
    ref="chartContainer"
    :class="`mt-graph mt-graph-${props.type}`"
    :style="{ width: props.width, height: props.height }"
  ></div>
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { getDefaultOptions } from "./mt-graph-default-options";
import { deepCopyObject, deepMergeObjects } from "@/utils/object";
import { computed, defineProps, onMounted, ref, watch, onBeforeUnmount } from "vue";
import { templateRef } from "@vueuse/core";

export type GraphOptions = ApexOptions;

const props = withDefaults(
  defineProps<{
    series: any[];
    options?: GraphOptions;
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
