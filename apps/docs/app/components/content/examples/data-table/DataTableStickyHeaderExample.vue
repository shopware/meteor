<script setup lang="ts">
import MtDataTable from "@shopware-ag/meteor-component-library/MtDataTable";

const dataSource = [
  { id: "1", name: "Fantastic Cotton Sausages", available: 2067 },
  { id: "2", name: "Awesome Concrete Chair", available: 540 },
  { id: "3", name: "Gorgeous Wooden Ball", available: 0 },
  { id: "4", name: "Rustic Steel Keyboard", available: 318 },
  { id: "5", name: "Handmade Granite Shoes", available: 91 },
  { id: "6", name: "Ergonomic Plastic Table", available: 1204 },
  { id: "7", name: "Sleek Bronze Lamp", available: 47 },
  { id: "8", name: "Practical Rubber Gloves", available: 880 },
  { id: "9", name: "Refined Cotton Hat", available: 12 },
  { id: "10", name: "Incredible Wooden Bike", available: 305 },
];

const columns = [
  { label: "Name", property: "name", renderer: "text", position: 0, sortable: true },
  { label: "Available", property: "available", renderer: "number", position: 100, sortable: true },
];
</script>

<template>
  <mt-data-table
    class="data-table-sticky-header-example"
    title="Products"
    :data-source="dataSource"
    :columns="columns"
    :pagination-limit="25"
    :current-page="1"
    :pagination-total-items="dataSource.length"
  />
</template>

<style scoped>
.data-table-sticky-header-example {
  max-height: 320px;
}
</style>
