<script setup lang="ts">
import { ref } from "vue";
import MtDatepicker from "@shopware-ag/meteor-component-library/MtDatepicker";

const value = ref("12:40");
</script>

<template>
  <mt-datepicker label="Reminder time" date-type="time" v-model="value" />
</template>
