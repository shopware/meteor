<script setup lang="ts">
import {
  MtBadge,
  MtDataTableNext,
  type MtDataTableNextColumn,
} from "@shopware-ag/meteor-component-library";

type Product = {
  id: string;
  name: string;
  active: boolean;
  price: number;
};

const products: Product[] = [
  { id: "1", name: "Aviator shirt", active: true, price: 39.9 },
  { id: "2", name: "Canvas tote", active: false, price: 14 },
  { id: "3", name: "Linen cap", active: true, price: 19 },
  { id: "4", name: "Merino scarf", active: true, price: 59 },
];

const columns: MtDataTableNextColumn<Product>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "active", header: "Status" },
  { accessorKey: "price", header: "Price", meta: { align: "end" } },
];

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
});
</script>

<template>
  <mt-data-table-next aria-label="Products" :data="products" :columns="columns">
    <template #cell-active="{ row }">
      <mt-badge :variant="row.original.active ? 'positive' : 'neutral'">
        {{ row.original.active ? "Active" : "Inactive" }}
      </mt-badge>
    </template>

    <template #cell-price="{ row }">
      {{ currency.format(row.original.price) }}
    </template>
  </mt-data-table-next>
</template>
