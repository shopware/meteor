<script setup lang="ts">
import { ref, watch } from "vue";
import {
  MtDataTableNext,
  type MtDataTableNextColumn,
  type MtDataTableNextPaginationState,
  type MtDataTableNextSortingState,
} from "@shopware-ag/meteor-component-library";

type Product = {
  id: string;
  name: string;
  stock: number;
};

const columns: MtDataTableNextColumn<Product>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "stock", header: "Stock", meta: { align: "end" } },
];

const sorting = ref<MtDataTableNextSortingState>([]);
const pagination = ref<MtDataTableNextPaginationState>({
  pageIndex: 0,
  pageSize: 5,
});

const products = ref<Product[]>([]);
const total = ref(0);
const loading = ref(false);

async function loadProducts() {
  loading.value = true;

  const result = await fetchProducts(sorting.value, pagination.value);

  products.value = result.items;
  total.value = result.total;
  loading.value = false;
}

watch([sorting, pagination], loadProducts, { immediate: true });

// Stands in for a request to your API, which sorts and pages the products
const allProducts: Product[] = [
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

function fetchProducts(
  sort: MtDataTableNextSortingState,
  page: MtDataTableNextPaginationState,
): Promise<{ items: Product[]; total: number }> {
  const [order] = sort;
  const sorted = [...allProducts];

  if (order) {
    const key = order.id as keyof Product;

    sorted.sort((a, b) => {
      const result = String(a[key]).localeCompare(String(b[key]), "en", {
        numeric: true,
      });

      return order.desc ? -result : result;
    });
  }

  const start = page.pageIndex * page.pageSize;
  const items = sorted.slice(start, start + page.pageSize);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ items, total: allProducts.length }), 600);
  });
}
</script>

<template>
  <mt-data-table-next
    v-model:sorting="sorting"
    v-model:pagination="pagination"
    manual
    aria-label="Products"
    :data="products"
    :columns="columns"
    :row-count="total"
    :loading="loading"
  />
</template>
