<script setup lang="ts">
import { ref } from "vue";
import MtDatepicker from "@shopware-ag/meteor-component-library/MtDatepicker";

const value = ref("2000-01-15");
</script>

<template>
  <mt-datepicker label="Birthday" date-type="date" plain-date v-model="value" />
</template>
