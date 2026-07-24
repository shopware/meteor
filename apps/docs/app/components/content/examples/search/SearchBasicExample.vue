<script setup lang="ts">
import { ref } from "vue";
import MtSearch from "@shopware-ag/meteor-component-library/MtSearch";

const term = ref("");
</script>

<template>
  <mt-search v-model="term" placeholder="Search" />
</template>
