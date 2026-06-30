<script setup lang="ts">
import { ref } from "vue";
import MtDatepicker from "@shopware-ag/meteor-component-library/MtDatepicker";

const value = ref(["2024-11-13T00:00:00.000Z", "2024-11-16T00:00:00.000Z"]);
</script>

<template>
  <mt-datepicker label="Campaign period" date-type="date" :range="true" v-model="value" />
</template>
