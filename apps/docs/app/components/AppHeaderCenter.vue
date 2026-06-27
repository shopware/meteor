<script setup lang="ts">
const items = useMainNav();
</script>

<template>
  <div class="flex w-full justify-center">
    <UNavigationMenu
      :items="items"
      :highlight="false"
      color="neutral"
      :ui="{ list: 'gap-1' }"
    />
  </div>
</template>
