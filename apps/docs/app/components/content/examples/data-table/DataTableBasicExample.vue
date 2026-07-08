<script setup lang="ts">
import { computed, ref } from "vue";
import MtDataTable from "@shopware-ag/meteor-component-library/MtDataTable";

const dataSource = [
  {
    id: "1",
    name: "Fantastic Cotton Sausages",
    manufacturer: { name: "McDermott, Walsh and McGlynn" },
    active: true,
    price: [{ currencyId: "EUR", gross: "708.00", net: "171.00", linked: true }],
    available: 2067,
  },
  {
    id: "2",
    name: "Awesome Concrete Chair",
    manufacturer: { name: "Hauck Group" },
    active: true,
    price: [{ currencyId: "EUR", gross: "129.90", net: "109.16", linked: true }],
    available: 540,
  },
  {
    id: "3",
    name: "Gorgeous Wooden Ball",
    manufacturer: { name: "Konopelski Inc" },
    active: false,
    price: [{ currencyId: "EUR", gross: "42.50", net: "35.71", linked: true }],
    available: 0,
  },
  {
    id: "4",
    name: "Rustic Steel Keyboard",
    manufacturer: { name: "Hettinger LLC" },
    active: true,
    price: [{ currencyId: "EUR", gross: "89.00", net: "74.79", linked: true }],
    available: 318,
  },
  {
    id: "5",
    name: "Handcrafted Frozen Cheese",
    manufacturer: { name: "Rowe and Sons" },
    active: true,
    price: [{ currencyId: "EUR", gross: "24.99", net: "20.98", linked: true }],
    available: 1284,
  },
  {
    id: "6",
    name: "Ergonomic Granite Table",
    manufacturer: { name: "Bahringer LLC" },
    active: false,
    price: [{ currencyId: "EUR", gross: "349.00", net: "293.28", linked: true }],
    available: 0,
  },
  {
    id: "7",
    name: "Sleek Plastic Shoes",
    manufacturer: { name: "Kihn and Daughters" },
    active: true,
    price: [{ currencyId: "EUR", gross: "59.95", net: "50.38", linked: true }],
    available: 742,
  },
  {
    id: "8",
    name: "Incredible Bronze Lamp",
    manufacturer: { name: "Cormier Group" },
    active: true,
    price: [{ currencyId: "EUR", gross: "112.00", net: "94.12", linked: true }],
    available: 96,
  },
  {
    id: "9",
    name: "Refined Rubber Gloves",
    manufacturer: { name: "Schiller and Sons" },
    active: false,
    price: [{ currencyId: "EUR", gross: "14.50", net: "12.18", linked: true }],
    available: 3510,
  },
  {
    id: "10",
    name: "Practical Wooden Hat",
    manufacturer: { name: "Wintheiser Inc" },
    active: true,
    price: [{ currencyId: "EUR", gross: "37.25", net: "31.30", linked: true }],
    available: 214,
  },
  {
    id: "11",
    name: "Tasty Metal Bacon",
    manufacturer: { name: "Predovic and Sons" },
    active: true,
    price: [{ currencyId: "EUR", gross: "18.75", net: "15.76", linked: true }],
    available: 890,
  },
  {
    id: "12",
    name: "Modern Cotton Pants",
    manufacturer: { name: "Klein Group" },
    active: false,
    price: [{ currencyId: "EUR", gross: "64.00", net: "53.78", linked: true }],
    available: 0,
  },
  {
    id: "13",
    name: "Elegant Wooden Clock",
    manufacturer: { name: "Reichel Inc" },
    active: true,
    price: [{ currencyId: "EUR", gross: "155.00", net: "130.25", linked: true }],
    available: 47,
  },
  {
    id: "14",
    name: "Gorgeous Steel Knife",
    manufacturer: { name: "Turner and Daughters" },
    active: true,
    price: [{ currencyId: "EUR", gross: "29.90", net: "25.13", linked: true }],
    available: 1622,
  },
  {
    id: "15",
    name: "Rustic Plastic Bottle",
    manufacturer: { name: "Feeney LLC" },
    active: false,
    price: [{ currencyId: "EUR", gross: "9.99", net: "8.40", linked: true }],
    available: 5104,
  },
  {
    id: "16",
    name: "Handmade Bronze Chair",
    manufacturer: { name: "Larson Group" },
    active: true,
    price: [{ currencyId: "EUR", gross: "279.00", net: "234.45", linked: true }],
    available: 132,
  },
  {
    id: "17",
    name: "Awesome Frozen Salad",
    manufacturer: { name: "Bode and Sons" },
    active: true,
    price: [{ currencyId: "EUR", gross: "12.49", net: "10.50", linked: true }],
    available: 764,
  },
  {
    id: "18",
    name: "Incredible Granite Mouse",
    manufacturer: { name: "Hilll Inc" },
    active: false,
    price: [{ currencyId: "EUR", gross: "48.00", net: "40.34", linked: true }],
    available: 0,
  },
  {
    id: "19",
    name: "Sleek Cotton Towels",
    manufacturer: { name: "Mraz Group" },
    active: true,
    price: [{ currencyId: "EUR", gross: "22.90", net: "19.24", linked: true }],
    available: 2380,
  },
  {
    id: "20",
    name: "Practical Steel Table",
    manufacturer: { name: "Gislason and Sons" },
    active: true,
    price: [{ currencyId: "EUR", gross: "410.00", net: "344.54", linked: true }],
    available: 58,
  },
  {
    id: "21",
    name: "Refined Wooden Soap",
    manufacturer: { name: "Kuhn LLC" },
    active: true,
    price: [{ currencyId: "EUR", gross: "7.50", net: "6.30", linked: true }],
    available: 6210,
  },
  {
    id: "22",
    name: "Fantastic Rubber Shoes",
    manufacturer: { name: "Wisozk Group" },
    active: false,
    price: [{ currencyId: "EUR", gross: "74.99", net: "63.02", linked: true }],
    available: 0,
  },
  {
    id: "23",
    name: "Ergonomic Metal Keyboard",
    manufacturer: { name: "Osinski Inc" },
    active: true,
    price: [{ currencyId: "EUR", gross: "134.00", net: "112.61", linked: true }],
    available: 415,
  },
  {
    id: "24",
    name: "Gorgeous Cotton Cheese",
    manufacturer: { name: "Boyer and Daughters" },
    active: true,
    price: [{ currencyId: "EUR", gross: "16.25", net: "13.66", linked: true }],
    available: 1048,
  },
  {
    id: "25",
    name: "Modern Granite Gloves",
    manufacturer: { name: "Windler Group" },
    active: true,
    price: [{ currencyId: "EUR", gross: "31.99", net: "26.88", linked: true }],
    available: 327,
  },
];

const columns = [
  {
    label: "Name",
    property: "name",
    renderer: "text",
    position: 0,
    sortable: true,
  },
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
  {
    label: "Price",
    property: "price",
    renderer: "price",
    rendererOptions: { currencyISOCode: "EUR", source: "gross" },
    position: 300,
    width: 150,
  },
  {
    label: "Available",
    property: "available",
    renderer: "number",
    position: 400,
    sortable: true,
  },
];

const currentPage = ref(1);
const paginationLimit = ref(10);

const paginatedDataSource = computed(() => {
  const start = (currentPage.value - 1) * paginationLimit.value;
  return dataSource.slice(start, start + paginationLimit.value);
});

function onPageChange(page: number) {
  currentPage.value = page;
}

function onLimitChange(limit: number) {
  paginationLimit.value = limit;
  currentPage.value = 1;
}
</script>

<template>
  <mt-data-table
    title="Products"
    subtitle="An overview of your product catalog"
    :data-source="paginatedDataSource"
    :columns="columns"
    :pagination-limit="paginationLimit"
    :current-page="currentPage"
    :pagination-total-items="dataSource.length"
    @pagination-current-page-change="onPageChange"
    @pagination-limit-change="onLimitChange"
  />
</template>
