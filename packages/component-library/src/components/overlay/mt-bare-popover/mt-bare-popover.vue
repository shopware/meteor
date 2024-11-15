<template>
  <slot name="trigger" v-bind="{ onClick: () => (show = !show) }" />

  <div v-if="show" role="dialog">
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const show = ref(false);
</script>
