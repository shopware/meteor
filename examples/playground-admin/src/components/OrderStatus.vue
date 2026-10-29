<script setup lang="ts">
import { MtStatusDot, MtText } from "@shopware-ag/meteor-component-library";
import {
  useOrderStates,
  type StateMachine,
} from "../composables/useOrderStates";

/** An order, payment or delivery state: a colored dot and its name. */
defineProps<{
  machine: StateMachine;
  state: string;
}>();

const { variant, label } = useOrderStates();
</script>

<template>
  <div class="cluster">
    <mt-status-dot :variant="variant(machine, state)" />
    <mt-text size="xs">{{ label(machine, state) }}</mt-text>
  </div>
</template>
