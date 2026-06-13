<script setup lang="ts">
import { ref } from "vue";
import MtSelect from "@shopware-ag/meteor-component-library/MtSelect";

const options = [
  { id: 1, label: "Option A", value: "a" },
  { id: 2, label: "Option B", value: "b" },
  { id: 3, label: "Option C", value: "c" },
];

const selectedValue = ref("b");
</script>

<template>
  <mt-select v-model="selectedValue" label="Select" :options="options" />
</template>
