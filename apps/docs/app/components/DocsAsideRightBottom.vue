<script setup lang="ts">
import type { PageLink } from "@nuxt/ui";

const links: PageLink[] = [
  {
    label: "Shopware docs",
    icon: "i-lucide-book-open",
    to: "https://developer.shopware.com/",
    target: "_blank",
  },
  {
    label: "Brand guidelines",
    icon: "i-lucide-palette",
    to: "https://brand.shopware.com/",
    target: "_blank",
  },
];
</script>

<template>
  <div class="space-y-6">
    <USeparator type="dashed" />

    <UPageLinks title="Useful resources" :links="links" />
  </div>
</template>
