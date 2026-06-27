<script setup lang="ts">
// Overrides Docus' default AppHeaderBody (the mobile menu under the header),
// which renders the full content tree. Instead show only the top-level nav and
// the "Useful resources" links from app.config's toc.bottom.
const items = useMainNav();
const appConfig = useAppConfig();
const resources = computed(() => appConfig.toc?.bottom);
</script>

<template>
  <div class="flex flex-col gap-6">
    <UNavigationMenu
      :items="items"
      orientation="vertical"
      :highlight="false"
      color="neutral"
    />

    <div v-if="resources?.links?.length">
      <p class="mb-1 px-2.5 text-sm font-semibold text-highlighted">
        {{ resources.title }}
      </p>
      <UNavigationMenu
        :items="resources.links"
        orientation="vertical"
        :highlight="false"
        color="neutral"
      />
    </div>
  </div>
</template>
