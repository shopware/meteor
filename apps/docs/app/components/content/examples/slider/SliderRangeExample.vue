<script setup lang="ts">
  // @ts-nocheck -- demo SFC; the library component's dist types are incomplete for these props
import { ref } from "vue";
import MtSlider from "@shopware-ag/meteor-component-library/MtSlider";

const range = ref([20, 80]);
</script>

<template>
  <mt-slider
    v-model="range"
    label="Price range"
    :min="0"
    :max="100"
    :step="5"
    :is-range="true"
    :min-distance="10"
  />
</template>
