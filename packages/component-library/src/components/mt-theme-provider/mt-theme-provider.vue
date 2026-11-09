<template>
  <slot />
</template>

<script setup lang="ts">
import { type FutureFlagsInput, provideFutureFlags } from "@/composables/_internal/useFutureFlags";

const props = defineProps<{
  future?: FutureFlagsInput;
}>();

provideFutureFlags(props.future);
</script>
