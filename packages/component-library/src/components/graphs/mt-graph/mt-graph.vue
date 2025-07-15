<template>
  <apexchart
    :type="type"
    :series="series"
    :options="chartOptions"
    :width="width"
    :height="height"
    :class="`mt-graph-${type}`"
  />
</template>

<script lang="ts">
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import defaultOptions from "./mt-graph-default-options";

function merge<T extends object>(defaultObj: T, customObj: Partial<T>): T {
  for (const key in customObj) {
    if (customObj[key] instanceof Object && key in defaultObj) {
      defaultObj[key] = merge<any>(defaultObj[key], customObj[key]);
    } else {
      defaultObj[key] = customObj[key] as any;
    }
  }
  return defaultObj;
}

export default {
  name: "MtGraph",

  components: {
    apexchart: VueApexCharts,
  },

  props: {
    series: {
      type: Array,
      required: true,
    },
    options: {
      type: Object as ApexOptions,
    },
    type: {
      type: String,
      default: "area",
    },
    width: {
      type: [String, Number],
    },
    height: {
      type: [String, Number],
    },
  },

  computed: {
    chartOptions(): ApexOptions {
      // @ts-ignore
      const defaultOptionsCopy = JSON.parse(JSON.stringify(defaultOptions[this.type] || {}));
      // @ts-ignore
      return merge<ApexOptions>(defaultOptionsCopy, this.options);
    },
  },
};
</script>
