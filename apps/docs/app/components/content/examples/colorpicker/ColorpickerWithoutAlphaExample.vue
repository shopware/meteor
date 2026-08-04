<script setup lang="ts">
import { ref } from "vue";
import MtColorpicker from "@shopware-ag/meteor-component-library/MtColorpicker";

const value = ref("#0fcff5");
</script>

<template>
  <mt-colorpicker label="Solid color" v-model="value" :alpha="false" />
</template>
