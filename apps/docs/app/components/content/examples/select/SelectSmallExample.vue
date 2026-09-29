<script setup lang="ts">
import { ref } from "vue";
import MtSelect from "@shopware-ag/meteor-component-library/MtSelect";

const options = [
  { id: 1, label: "Shoes", value: "shoes" },
  { id: 2, label: "Clothing", value: "clothing" },
  { id: 3, label: "Accessories", value: "accessories" },
  { id: 4, label: "Sportswear", value: "sportswear" },
  { id: 5, label: "Bags", value: "bags" },
];

const selectedValues = ref(["shoes", "accessories"]);
</script>

<template>
  <mt-select
    v-model="selectedValues"
    label="Categories"
    small
    :enable-multi-selection="true"
    :options="options"
  />
</template>
