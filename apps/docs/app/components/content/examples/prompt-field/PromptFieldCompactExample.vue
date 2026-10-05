<script setup lang="ts">
import { MtPromptField } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-prompt-field
    label="Ask about your orders"
    placeholder="Ask about your orders…"
    :rows="{ min: 1, max: 3 }"
  />
</template>
