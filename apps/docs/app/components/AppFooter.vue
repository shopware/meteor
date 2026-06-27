<script setup lang="ts">
const legalLinks = [
  { name: "Terms & Conditions", to: "https://www.shopware.com/gtc/" },
  { name: "Privacy", to: "https://www.shopware.com/privacy/" },
  { name: "Legal notice", to: "https://www.shopware.com/legal-notice/" },
];
</script>

<template>
  <footer class="border-t border-[var(--color-border-secondary-default)]">
    <UContainer class="py-6">
      <div
        class="flex flex-col items-center gap-4 text-center text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:text-left"
      >
        <p>Copyright © shopware AG - All rights reserved</p>
        <ul
          class="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start"
        >
          <li v-for="link in legalLinks" :key="link.name">
            <NuxtLink
              :to="link.to"
              target="_blank"
              class="transition-colors hover:text-highlighted"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </UContainer>
  </footer>
</template>
