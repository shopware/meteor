<script setup lang="ts">
import MtChart from "@shopware-ag/meteor-component-library/MtChart";

const series = [
  {
    name: "Sample Data",
    data: [30, 55, 65, 60, 45, 40, 55, 80],
  },
];

const options = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: "smooth" as const,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  },
};
</script>

<template>
  <mt-chart
    type="area"
    :series="series"
    :options="options"
    width="100%"
    :height="300"
  />
</template>
