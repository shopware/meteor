<script setup lang="ts">
import { ref } from "vue";
import {
  MtDataTableNext,
  type MtDataTableNextColumn,
  type MtDataTableNextSortingState,
} from "@shopware-ag/meteor-component-library";

type Product = {
  id: string;
  name: string;
  productNumber: string;
  stock: number;
};

const products: Product[] = [
  { id: "1", name: "Aviator shirt", productNumber: "SW10001", stock: 12 },
  { id: "2", name: "Canvas tote", productNumber: "SW10002", stock: 0 },
  { id: "3", name: "Linen cap", productNumber: "SW10003", stock: 7 },
  { id: "4", name: "Merino scarf", productNumber: "SW10004", stock: 24 },
  { id: "5", name: "Leather wallet", productNumber: "SW10005", stock: 3 },
];

const columns: MtDataTableNextColumn<Product>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "productNumber",
    header: "Product number",
    enableSorting: false,
  },
  { accessorKey: "stock", header: "Stock", meta: { align: "end" } },
];

const sorting = ref<MtDataTableNextSortingState>([{ id: "name", desc: false }]);
</script>

<template>
  <mt-data-table-next
    v-model:sorting="sorting"
    aria-label="Products"
    :data="products"
    :columns="columns"
  />
</template>
