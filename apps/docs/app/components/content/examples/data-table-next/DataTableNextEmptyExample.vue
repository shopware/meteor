<script setup lang="ts">
import {
  MtDataTableNext,
  MtText,
  type MtDataTableNextColumn,
} from "@shopware-ag/meteor-component-library";

type Product = {
  id: string;
  name: string;
  stock: number;
};

const products: Product[] = [];

const columns: MtDataTableNextColumn<Product>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "stock", header: "Stock", meta: { align: "end" } },
];
</script>

<template>
  <mt-data-table-next aria-label="Products" :data="products" :columns="columns">
    <template #empty>
      <mt-text size="xs" color="color-text-secondary-default">
        No products match your search.
      </mt-text>
    </template>
  </mt-data-table-next>
</template>
