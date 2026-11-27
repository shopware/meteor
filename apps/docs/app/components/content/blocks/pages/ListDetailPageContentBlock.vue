<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtBadge,
  MtButton,
  MtCard,
  MtContentHeader,
  MtNav,
  MtPage,
  MtPanel,
  MtSearch,
  MtText,
  type BreadcrumbItem,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// Sample data. Replace it with the records your page loads.
const customers = [
  {
    id: "1",
    name: "Anna Schmidt",
    email: "anna.schmidt@example.com",
    phone: "+49 30 1234567",
    city: "Berlin",
    since: "March 2023",
    active: true,
  },
  {
    id: "2",
    name: "Jonas Becker",
    email: "jonas.becker@example.com",
    phone: "+49 40 7654321",
    city: "Hamburg",
    since: "July 2024",
    active: true,
  },
  {
    id: "3",
    name: "Lea Hoffmann",
    email: "lea.hoffmann@example.com",
    phone: "+49 89 2468135",
    city: "Munich",
    since: "January 2022",
    active: false,
  },
  {
    id: "4",
    name: "Paul Wagner",
    email: "paul.wagner@example.com",
    phone: "+49 221 1357924",
    city: "Cologne",
    since: "October 2025",
    active: true,
  },
];

const term = ref("");
const selectedId = ref("1");
const customer = computed(() => customers.find(({ id }) => id === selectedId.value)!);

// The list of the panel, filtered by the search.
const list = computed<NavSection[]>(() => [
  {
    items: customers
      .filter(({ name }) => name.toLowerCase().includes(term.value.trim().toLowerCase()))
      .map(({ id, name }) => ({ id, label: name, to: `/customers/${id}` })),
  },
]);

const breadcrumb = computed<BreadcrumbItem[]>(() => [
  { label: "Customers", to: "/customers", icon: "users" },
  { label: customer.value.name },
]);

// With Vue Router, each record is a route: remove `select()` and `isActive`, and mt-nav finds the
// current record from the route on its own.
function isActive(item: NavItem) {
  return item.id === selectedId.value;
}

function select(item: NavItem) {
  if (item.id) selectedId.value = item.id;
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page :breadcrumb="breadcrumb">
      <template #actions>
        <mt-button variant="secondary" size="default">Edit</mt-button>
      </template>

      <template #start>
        <mt-panel label="Customers" resizable>
          <aside class="list" aria-label="Customers">
            <mt-search v-model="term" size="small" placeholder="Search customers" />
            <mt-nav :sections="list" label="Customers" :is-active="isActive" @navigate="select" />
          </aside>
        </mt-panel>
      </template>

      <div class="stack">
        <mt-content-header :title="customer.name">
          <mt-badge :variant="customer.active ? 'positive' : 'neutral'">
            {{ customer.active ? "Active" : "Inactive" }}
          </mt-badge>
        </mt-content-header>

        <mt-card title="Contact">
          <dl class="facts">
            <mt-text as="dt" size="xs" color="color-text-secondary-default">Email address</mt-text>
            <mt-text as="dd" size="xs">{{ customer.email }}</mt-text>
            <mt-text as="dt" size="xs" color="color-text-secondary-default">Phone</mt-text>
            <mt-text as="dd" size="xs">{{ customer.phone }}</mt-text>
            <mt-text as="dt" size="xs" color="color-text-secondary-default">City</mt-text>
            <mt-text as="dd" size="xs">{{ customer.city }}</mt-text>
            <mt-text as="dt" size="xs" color="color-text-secondary-default">Customer since</mt-text>
            <mt-text as="dd" size="xs">{{ customer.since }}</mt-text>
          </dl>
        </mt-card>

        <mt-card title="Orders">
          <placeholder-slot style="height: 12rem" />
        </mt-card>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.list {
  display: grid;
  gap: var(--scale-size-8);
  align-content: start;
  padding: var(--scale-size-8);
}

.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.facts {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  gap: var(--scale-size-8) var(--scale-size-16);
  margin: 0;
}

.facts dd {
  margin: 0;
}
</style>
