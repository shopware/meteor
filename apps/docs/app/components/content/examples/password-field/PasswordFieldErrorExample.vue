<script setup lang="ts">
import { ref } from "vue";
import MtPasswordField from "@shopware-ag/meteor-component-library/MtPasswordField";

const value = ref("");
</script>

<template>
  <mt-password-field
    v-model="value"
    label="Password"
    placeholder="Enter a password"
    :error="{ code: 0, detail: 'Password is required.' }"
  />
</template>
