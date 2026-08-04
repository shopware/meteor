<script setup lang="ts">
import { ref } from "vue";
import MtUrlField from "@shopware-ag/meteor-component-library/MtUrlField";

const url = ref("https://shopware.com");
</script>

<template>
  <mt-url-field v-model="url" label="Website" />
</template>
