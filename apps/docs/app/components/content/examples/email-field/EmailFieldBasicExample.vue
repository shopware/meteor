<script setup lang="ts">
import { ref } from "vue";
import MtEmailField from "@shopware-ag/meteor-component-library/MtEmailField";

const email = ref("");
</script>

<template>
  <mt-email-field v-model="email" label="Email address" />
</template>
