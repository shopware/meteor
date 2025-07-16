<template>
  <apexchart
    :type="type"
    :series="series"
    :options="chartOptions"
    :width="width"
    :height="height"
    :class="`mt-graph-${type}`"
    data-testid="mt-graph"
  />
</template>

<script setup lang="ts">
import apexchart from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import { getDefaultOptions } from "./mt-graph-default-options";
import { deepCopyObject, deepMergeObjects } from "@/utils/object";
import { defineProps, computed } from "vue";

export type GraphOptions = ApexOptions;

const props = defineProps<{
  series: any[];
  options?: GraphOptions;
  type?: string;
  width?: string | number;
  height?: string | number;
}>();

const chartOptions = computed<ApexOptions>(() => {
  const type = props.type ?? "area";
  const options = props.options;
  const defaultOptions = getDefaultOptions(type);
  const defaultOptionsCopy = deepCopyObject(defaultOptions);

  if (!options || !(options instanceof Object)) {
    return defaultOptionsCopy;
  }
  return deepMergeObjects<ApexOptions>(defaultOptionsCopy, options);
});
</script>
