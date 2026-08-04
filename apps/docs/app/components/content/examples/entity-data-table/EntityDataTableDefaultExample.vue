<script setup lang="ts">
import MtEntityDataTable from "@shopware-ag/meteor-component-library/MtEntityDataTable";

// In-memory product records that stand in for an Admin SDK entity store.
const products = [
  {
    id: "1",
    name: "Fantastic Cotton Sausages",
    manufacturer: { id: "m1", name: "McDermott, Walsh and McGlynn" },
    active: true,
  },
  {
    id: "2",
    name: "Awesome Concrete Chair",
    manufacturer: { id: "m2", name: "Hauck Group" },
    active: true,
  },
  {
    id: "3",
    name: "Gorgeous Wooden Ball",
    manufacturer: { id: "m3", name: "Konopelski Inc" },
    active: false,
  },
  {
    id: "4",
    name: "Rustic Steel Keyboard",
    manufacturer: { id: "m4", name: "Hettinger LLC" },
    active: true,
  },
  {
    id: "5",
    name: "Handcrafted Frozen Cheese",
    manufacturer: { id: "m2", name: "Hauck Group" },
    active: false,
  },
];

const getValue = (record: Record<string, any>, path: string) =>
  path.split(".").reduce((value, key) => value?.[key], record);

// A repository factory that reads the criteria and serves the in-memory data.
// It mirrors the search, sort, filter, and pagination handling that a real
// Admin SDK repository performs on the server.
const repository = () => ({
  async search(criteria: any) {
    let rows = [...products];

    const term = criteria.term;
    if (term) {
      rows = rows.filter((row) => row.name.toLowerCase().includes(term.toLowerCase()));
    }

    if (criteria.filters?.length) {
      rows = rows.filter((row) =>
        criteria.filters.every((filter: any) => {
          const value = getValue(row, filter.field);
          if (filter.type === "equals") {
            if (typeof value === "boolean" && (filter.value === "true" || filter.value === "false")) {
              return value === (filter.value === "true");
            }
            return value === filter.value;
          }
          if (filter.type === "equalsAny") {
            return Array.isArray(filter.value) && filter.value.includes(value);
          }
          return true;
        }),
      );
    }

    const sorting = criteria.sortings?.[0];
    if (sorting?.field) {
      rows.sort((a, b) => {
        const valA = getValue(a, sorting.field);
        const valB = getValue(b, sorting.field);
        const comparison = String(valA).localeCompare(String(valB));
        return sorting.order === "DESC" ? comparison * -1 : comparison;
      });
    }

    const total = rows.length;
    const page = criteria.getPage?.() ?? 1;
    const limit = criteria.getLimit?.() ?? rows.length;
    const paged = rows.slice((page - 1) * limit, (page - 1) * limit + limit);

    // The data table consumes an array with a `total` property.
    const result = paged as any[] & { total: number };
    result.total = total;
    return result;
  },
  async delete() {},
});

const columns = [
  {
    label: "Name",
    property: "name",
    renderer: "text",
    position: 100,
    sortable: true,
    clickable: true,
  },
  {
    label: "Manufacturer",
    property: "manufacturer.name",
    renderer: "text",
    position: 200,
    sortable: true,
  },
  {
    label: "Active",
    property: "active",
    renderer: "badge",
    position: 300,
    rendererOptions: {
      renderItemBadge: (data: { active: boolean }) =>
        data.active
          ? { variant: "positive", label: "Active" }
          : { variant: "critical", label: "Inactive" },
    },
  },
];

const availableFilters = [
  { filterType: "boolean", id: "active", label: "Active" },
];
</script>

<template>
  <MtEntityDataTable
    entity="product"
    title="Products"
    subtitle="Example with products"
    :repository="(repository as any)"
    :columns="columns"
    :available-filters="availableFilters"
    allow-row-selection
    allow-bulk-edit
    allow-bulk-delete
    force-real-modal
  />
</template>
