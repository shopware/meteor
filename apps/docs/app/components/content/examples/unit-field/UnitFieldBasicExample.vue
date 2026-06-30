<script setup lang="ts">
  // @ts-nocheck -- demo SFC; the library component's dist types are incomplete for these props
import { ref } from "vue";
import MtUnitField from "@shopware-ag/meteor-component-library/MtUnitField";

const value = ref<number | null>(null);
const unit = ref("m");
</script>

<template>
  <mt-unit-field
    v-model="value"
    v-model:default-unit="unit"
    label="Length"
    measurement-type="length"
  />
</template>
