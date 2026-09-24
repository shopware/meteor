<script setup lang="ts">
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtText from "@shopware-ag/meteor-component-library/MtText";
</script>

<template>
  <mt-app>
    <template #header>
      <mt-text as="span" size="s" weight="bold">Meteor Shop</mt-text>
    </template>

    <template #sidebar-start>
      <nav aria-label="Main">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/orders">Orders</router-link>
      </nav>
    </template>

    <template #content>
      <router-view />
    </template>

    <template #sidebar-end>
      <section aria-label="Assistant">
        <mt-text size="xs">Assistant</mt-text>
      </section>
    </template>
  </mt-app>
</template>
