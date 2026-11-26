<script setup lang="ts">
import { ref } from "vue";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtStepper from "@shopware-ag/meteor-component-library/MtStepper";

const steps = [
  { label: "Account" },
  { label: "Shipping" },
  { label: "Payment" },
  { label: "Review" },
];

const currentStep = ref(0);
</script>

<template>
  <div class="example-stepper">
    <mt-stepper :steps="steps" :current-step="currentStep" />

    <div class="example-stepper__actions">
      <mt-button variant="secondary" :disabled="currentStep === 0" @click="currentStep--">
        Back
      </mt-button>

      <mt-button variant="primary" :disabled="currentStep === steps.length" @click="currentStep++">
        {{ currentStep < steps.length - 1 ? "Next" : "Finish" }}
      </mt-button>
    </div>
  </div>
</template>

<style scoped>
.example-stepper {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}

.example-stepper__actions {
  display: flex;
  gap: var(--scale-size-8);
}
</style>
