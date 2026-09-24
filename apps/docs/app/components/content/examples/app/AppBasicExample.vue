<script setup lang="ts">
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";

const navigation = ["Dashboard", "Orders", "Customers", "Products", "Settings"];
</script>

<template>
  <mt-app
    class="app-example"
    :mobile-breakpoint="0"
    :apply-theme="false"
    :lock-document="false"
  >
    <template #header>
      <div class="app-example__header">
        <mt-text as="span" size="s" weight="bold">Meteor Shop</mt-text>
        <mt-button variant="secondary" size="small">Jane Doe</mt-button>
      </div>
    </template>

    <template #sidebar-start>
      <nav class="app-example__nav" aria-label="Main">
        <a v-for="entry in navigation" :key="entry" href="#" @click.prevent>{{
          entry
        }}</a>
      </nav>
    </template>

    <template #content>
      <div class="app-example__content">
        <mt-card title="Orders" subtitle="Today">
          <mt-text size="xs"
            >The content region scrolls on its own; the shell never
            does.</mt-text
          >
        </mt-card>
      </div>
    </template>

    <template #sidebar-end>
      <div class="app-example__details">
        <mt-text as="h2" size="s" weight="semibold">Details</mt-text>
        <mt-text size="xs">Contextual tools for the current page.</mt-text>
      </div>
    </template>
  </mt-app>
</template>

<style scoped>
.app-example {
  --mt-app-height: 420px;

  border-radius: var(--border-radius-m);
}

.app-example__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--scale-size-48);
  padding-inline: var(--scale-size-16);
}

.app-example__nav {
  display: grid;
  gap: var(--scale-size-4);
  width: var(--scale-size-192);
  padding: var(--scale-size-16);
}

.app-example__nav a {
  padding: var(--scale-size-8);
  border-radius: var(--border-radius-xs);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  text-decoration: none;
}

.app-example__content {
  padding: var(--scale-size-24);
}

.app-example__details {
  display: grid;
  gap: var(--scale-size-8);
  width: var(--scale-size-224);
  padding: var(--scale-size-16);
}
</style>
