<template>
  <slot />
</template>

<script setup lang="ts">
import { provideFutureFlags } from "../../composables/useFutureFlags";

const props = withDefaults(
  defineProps<{
    removeDefaultMargin?: boolean;
  }>(),
  {
    removeDefaultMargin: false,
  },
);

defineSlots<{
  default(): any;
}>();

provideFutureFlags({
  removeDefaultMargin: props.removeDefaultMargin,
  removeCardWidth: false,
});
</script>
