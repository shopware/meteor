<script setup lang="ts">
// On docs pages, surface search as a compact icon button here (the center
// search bar is hidden there). The landing page keeps the center bar instead,
// and on mobile the default header already provides a search button.
const route = useRoute();
const isLanding = computed(() => route.path === "/");
</script>

<template>
  <UContentSearchButton v-if="!isLanding" class="max-lg:hidden" />
</template>
