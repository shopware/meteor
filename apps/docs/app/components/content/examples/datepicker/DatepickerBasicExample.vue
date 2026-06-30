<script setup lang="ts">
import { ref } from "vue";
import MtDatepicker from "@shopware-ag/meteor-component-library/MtDatepicker";

const value = ref<string | null>(null);
</script>

<template>
  <mt-datepicker label="Datepicker" v-model="value" />
</template>
