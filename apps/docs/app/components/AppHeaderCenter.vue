<script setup lang="ts">
// Full search bar in the header center, but only on the landing page. Docs
// pages leave the center empty and use the compact search icon button in the
// right section instead (see AppHeaderCTA).
const route = useRoute();
const isLanding = computed(() => route.path === "/");
</script>

<template>
  <UContentSearchButton
    v-if="isLanding"
    :collapsed="false"
    variant="soft"
    class="w-full"
    :ui="{ leadingIcon: 'size-4 mr-1' }"
  />
</template>
