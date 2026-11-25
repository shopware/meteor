<script setup lang="ts">
import MtStepper from "@shopware-ag/meteor-component-library/MtStepper";

const steps = [
  { label: "Account" },
  { label: "Shipping" },
  { label: "Payment" },
  { label: "Review" },
];
</script>

<template>
  <mt-stepper :steps="steps" :current-step="1" />
</template>
