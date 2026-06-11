<template>
  <mt-card
    title="Product settings"
    subtitle="Inherited from parent configuration"
    :inheritance="inheritance"
    @update:inheritance="inheritance = $event"
  >
    <p>
      Use the inheritance toggle when a card represents values that can be
      linked or overridden.
    </p>
  </mt-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MtCard from "@shopware-ag/meteor-component-library/MtCard";

const inheritance = ref(true);
</script>
