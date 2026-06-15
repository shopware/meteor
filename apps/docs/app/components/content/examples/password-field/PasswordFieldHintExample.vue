<script setup lang="ts">
import { ref } from "vue";
import MtPasswordField from "@shopware-ag/meteor-component-library/MtPasswordField";

const value = ref("");
</script>

<template>
  <mt-password-field v-model="value" label="Password" placeholder="Enter a password">
    <template #hint>Use at least 8 characters.</template>
  </mt-password-field>
</template>
