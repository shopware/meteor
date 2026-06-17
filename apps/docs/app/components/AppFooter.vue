<script setup lang="ts">
const npm = (pkg: string) =>
  `https://www.npmjs.com/package/@shopware-ag/${pkg}`;

const legalLinks = [
  { name: "Terms & Conditions", to: "https://www.shopware.com/gtc/" },
  { name: "Privacy", to: "https://www.shopware.com/privacy/" },
  { name: "Legal notice", to: "https://www.shopware.com/legal-notice/" },
];

const sections = [
  {
    title: "Documentation",
    links: [
      { name: "Getting started", to: "/getting-started/introduction" },
      { name: "Foundations", to: "/foundations/design-principles" },
      { name: "Design", to: "/design/tokens" },
      { name: "Content", to: "/content/wording" },
      { name: "Agents", to: "/agents/mcp" },
      { name: "Components", to: "/components/action-menu" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Changelog", to: "https://github.com/shopware/meteor/releases" },
      { name: "Shopware docs", to: "https://developer.shopware.com/" },
      { name: "Brand guidelines", to: "https://brand.shopware.com/" },
      { name: "Contributing", to: "/getting-started/contributing" },
    ],
  },
  {
    title: "Packages",
    links: [
      { name: "Component library", to: npm("meteor-component-library") },
      { name: "Tokens", to: npm("meteor-tokens") },
      { name: "Icon kit", to: npm("meteor-icon-kit") },
    ],
  },
];
</script>

<template>
  <footer class="border-t border-default">
    <UContainer class="pt-12 sm:pt-16">
      <div class="grid grid-cols-2 gap-8 lg:grid-cols-5">
        <div class="col-span-2">
          <NuxtLink to="/" aria-label="Meteor home" class="inline-flex">
            <AppHeaderLogo />
          </NuxtLink>
          <p class="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            Shopware's open-source design system.
          </p>
        </div>

        <div v-for="section in sections" :key="section.title">
          <h3 class="text-sm font-semibold text-highlighted">
            {{ section.title }}
          </h3>
          <ul class="mt-4 flex flex-col gap-3 text-sm">
            <li v-for="link in section.links" :key="link.name">
              <NuxtLink
                :to="link.to"
                :target="link.to.startsWith('http') ? '_blank' : undefined"
                class="text-muted transition-colors hover:text-highlighted"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-4 border-t border-default py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <p>Copyright © shopware AG - All rights reserved</p>
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
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
