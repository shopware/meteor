<script setup lang="ts">
import MtDataTable from "@shopware-ag/meteor-component-library/MtDataTable";

const dataSource: { id: string; name: string }[] = [];

const columns = [
  { label: "Name", property: "name", renderer: "text", position: 0, sortable: true },
  {
    label: "Manufacturer",
    property: "manufacturer.name",
    renderer: "text",
    position: 100,
    sortable: true,
  },
];
</script>

<template>
  <mt-data-table
    title="Products"
    :data-source="dataSource"
    :columns="columns"
    :pagination-limit="10"
    :current-page="1"
    :pagination-total-items="0"
  />
</template>
