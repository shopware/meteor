<script setup lang="ts">
import { ref } from "vue";
import MtSelect from "@shopware-ag/meteor-component-library/MtSelect";

const options = [
  { id: 1, label: "Option A", value: "a" },
  { id: 2, label: "Option B", value: "b" },
  { id: 3, label: "Option C", value: "c" },
];

const selectedValues = ref(["a", "c"]);
</script>

<template>
  <mt-select
    v-model="selectedValues"
    label="Select multiple options"
    :enable-multi-selection="true"
    :options="options"
  />
</template>
