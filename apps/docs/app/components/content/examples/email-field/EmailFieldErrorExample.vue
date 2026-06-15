<script setup lang="ts">
import { ref } from "vue";
import MtEmailField from "@shopware-ag/meteor-component-library/MtEmailField";

const value = ref("");
</script>

<template>
  <mt-email-field
    v-model="value"
    label="Email address"
    placeholder="name@example.com"
    :error="{ detail: 'Enter a valid email address.' }"
  />
</template>
