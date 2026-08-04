<script setup lang="ts">
import MtDataTable from "@shopware-ag/meteor-component-library/MtDataTable";

const dataSource = [
  {
    id: "1",
    name: "Fantastic Cotton Sausages",
    manufacturer: { name: "McDermott, Walsh and McGlynn" },
    active: true,
    available: 2067,
  },
  {
    id: "2",
    name: "Awesome Concrete Chair",
    manufacturer: { name: "Hauck Group" },
    active: true,
    available: 540,
  },
  {
    id: "3",
    name: "Gorgeous Wooden Ball",
    manufacturer: { name: "Konopelski Inc" },
    active: false,
    available: 0,
  },
  {
    id: "4",
    name: "Rustic Steel Keyboard",
    manufacturer: { name: "Hettinger LLC" },
    active: true,
    available: 318,
  },
];

const columns = [
  { label: "Name", property: "name", renderer: "text", position: 0, sortable: true },
  {
    label: "Manufacturer",
    property: "manufacturer.name",
    renderer: "text",
    position: 100,
    sortable: true,
  },
  {
    label: "Active",
    property: "active",
    renderer: "badge",
    position: 200,
    rendererOptions: {
      renderItemBadge: (data: { active: boolean }) => {
        return data.active
          ? { variant: "positive", label: "Active" }
          : { variant: "critical", label: "Inactive" };
      },
    },
  },
  { label: "Available", property: "available", renderer: "number", position: 300, sortable: true },
];
</script>

<template>
  <mt-data-table
    title="Products"
    layout="full"
    :data-source="dataSource"
    :columns="columns"
    :pagination-limit="10"
    :current-page="1"
    :pagination-total-items="dataSource.length"
  />
</template>
