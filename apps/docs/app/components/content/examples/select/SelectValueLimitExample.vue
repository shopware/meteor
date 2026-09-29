<script setup lang="ts">
import { ref } from "vue";
import MtSelect from "@shopware-ag/meteor-component-library/MtSelect";

const options = [
  { id: 1, label: "Shoes", value: "shoes" },
  { id: 2, label: "Clothing", value: "clothing" },
  { id: 3, label: "Accessories", value: "accessories" },
  { id: 4, label: "Sportswear", value: "sportswear" },
  { id: 5, label: "Bags", value: "bags" },
  { id: 6, label: "Jewelry", value: "jewelry" },
  { id: 7, label: "Watches", value: "watches" },
  { id: 8, label: "Eyewear", value: "eyewear" },
];

const selectedValues = ref([
  "shoes",
  "clothing",
  "accessories",
  "sportswear",
  "bags",
  "jewelry",
]);
</script>

<template>
  <mt-select
    v-model="selectedValues"
    label="Categories"
    :enable-multi-selection="true"
    :value-limit="3"
    :options="options"
  />
</template>
