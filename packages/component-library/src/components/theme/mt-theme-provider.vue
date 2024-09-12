<template>
  <slot />
</template>

<script setup lang="ts">
import { type FutureFlags, provideFutureFlags } from "../../composables/useFutureFlags";

type Props = {
  future?: FutureFlags;
};

const props = defineProps<Props>();

provideFutureFlags(props.future);
</script>
