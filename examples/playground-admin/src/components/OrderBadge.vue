<script setup lang="ts">
import { MtBadge } from "@shopware-ag/meteor-component-library";
import {
  useOrderStates,
  type StateMachine,
} from "../composables/useOrderStates";

/** An order, payment or delivery state as a colored badge, as the dashboard shows it. */
defineProps<{
  machine: StateMachine;
  state: string;
}>();

const { variant, label } = useOrderStates();
</script>

<template>
  <mt-badge :variant="variant(machine, state)" status-indicator>
    {{ label(machine, state) }}
  </mt-badge>
</template>
