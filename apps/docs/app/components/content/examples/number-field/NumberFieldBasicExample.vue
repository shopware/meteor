<script setup lang="ts">
import { ref } from "vue";
import MtNumberField from "@shopware-ag/meteor-component-library/MtNumberField";

const quantity = ref(0);
</script>

<template>
  <mt-number-field v-model="quantity" label="Quantity" :step="1" number-type="int" />
</template>
