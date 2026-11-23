<script setup lang="ts">
import {
  MtDataTableNext,
  type MtDataTableNextColumn,
} from "@shopware-ag/meteor-component-library";

type Product = {
  id: string;
  name: string;
  productNumber: string;
  stock: number;
};

const products: Product[] = [];

const columns: MtDataTableNextColumn<Product>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "productNumber", header: "Product number" },
  { accessorKey: "stock", header: "Stock", meta: { align: "end" } },
];
</script>

<template>
  <mt-data-table-next
    loading
    aria-label="Products"
    :data="products"
    :columns="columns"
  />
</template>
