<template>
  <slot />
</template>

<script setup lang="ts">
import { type FutureFlags, provideFutureFlags } from "../../composables/useFutureFlags";

const props = defineProps<{
  future?: FutureFlags;
}>();

provideFutureFlags(props.future);
</script>
