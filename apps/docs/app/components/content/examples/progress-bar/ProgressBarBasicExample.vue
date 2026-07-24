<script setup lang="ts">
import { ref } from "vue";
import MtProgressBar from "@shopware-ag/meteor-component-library/MtProgressBar";

const value = ref(45);
</script>

<template>
  <mt-progress-bar v-model="value" :max-value="100" label="Upload progress" />
</template>
