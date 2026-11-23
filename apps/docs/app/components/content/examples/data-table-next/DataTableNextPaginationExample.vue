<script setup lang="ts">
import { ref } from "vue";
import {
  MtDataTableNext,
  type MtDataTableNextColumn,
  type MtDataTableNextPaginationState,
} from "@shopware-ag/meteor-component-library";

type Product = {
  id: string;
  name: string;
  stock: number;
};

const products: Product[] = [
  { id: "1", name: "Aviator shirt", stock: 12 },
  { id: "2", name: "Canvas tote", stock: 0 },
  { id: "3", name: "Linen cap", stock: 7 },
  { id: "4", name: "Merino scarf", stock: 24 },
  { id: "5", name: "Leather wallet", stock: 3 },
  { id: "6", name: "Wool beanie", stock: 18 },
  { id: "7", name: "Denim jacket", stock: 5 },
  { id: "8", name: "Silk tie", stock: 9 },
  { id: "9", name: "Cotton socks", stock: 42 },
  { id: "10", name: "Suede boots", stock: 2 },
  { id: "11", name: "Rain poncho", stock: 15 },
  { id: "12", name: "Travel mug", stock: 31 },
];

const columns: MtDataTableNextColumn<Product>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "stock", header: "Stock", meta: { align: "end" } },
];

const pagination = ref<MtDataTableNextPaginationState>({
  pageIndex: 0,
  pageSize: 5,
});
</script>

<template>
  <mt-data-table-next
    v-model:pagination="pagination"
    aria-label="Products"
    :data="products"
    :columns="columns"
  />
</template>
