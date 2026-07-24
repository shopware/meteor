<script setup lang="ts">
  // @ts-nocheck -- demo SFC; the library component's dist types are incomplete for these props
import { ref } from "vue";
import MtSlider from "@shopware-ag/meteor-component-library/MtSlider";

const value = ref(50);
</script>

<template>
  <mt-slider v-model="value" label="Slider" :min="0" :max="100" :step="1" />
</template>
