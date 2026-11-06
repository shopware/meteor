<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtBadge,
  MtButton,
  MtCard,
  MtContentHeader,
  MtLayout,
  MtNav,
  MtNumberField,
  MtPage,
  MtSelect,
  MtSwitch,
  MtTabs,
  MtText,
  MtTextField,
  MtTextarea,
  useUnsavedChanges,
  type BreadcrumbItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The main navigation of the application. Mark the current page as active, or
// pass `is-active` to mt-nav to compare the rows with the current route.
const navigation: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: "/" },
      {
        label: "Products",
        icon: "regular-products",
        children: [
          { label: "Overview", to: "/products", active: true },
          { label: "Categories", to: "/categories" },
        ],
      },
      { label: "Orders", icon: "regular-shopping-bag", to: "/orders" },
      { label: "Settings", icon: "regular-cog", to: "/settings" },
    ],
  },
];

const breadcrumb: BreadcrumbItem[] = [
  { label: "Products", to: "/products", icon: "products" },
  { label: "Running shoe Aero" },
];

// Sample data. Replace it with the record your page loads.
const savedProduct = {
  name: "Running shoe Aero",
  productNumber: "SW-10042",
  manufacturer: "aerofoot",
  description:
    "A light running shoe with a breathable mesh upper and a cushioned sole for long distances.",
  tax: "standard",
  price: 129.95,
  purchasePrice: 54.5,
  stock: 318,
  minPurchase: 1,
  active: true,
  salesChannels: ["storefront"],
  categories: ["running", "shoes"],
  ean: "4006381333931",
  metaTitle: "Running shoe Aero",
  metaDescription: "",
};

const product = ref(structuredClone(savedProduct));
const savedState = ref(JSON.stringify(product.value));
const isDirty = computed(() => JSON.stringify(product.value) !== savedState.value);
const isSaving = ref(false);

// Inside mt-app, this asks before a navigation or a reload discards the changes.
useUnsavedChanges(isDirty);

const manufacturerOptions = [
  { value: "aerofoot", label: "aerofoot" },
  { value: "trailworks", label: "Trailworks" },
  { value: "northpeak", label: "Northpeak" },
];

const taxOptions = [
  { value: "standard", label: "Standard rate (19%)" },
  { value: "reduced", label: "Reduced rate (7%)" },
];

const salesChannelOptions = [
  { value: "storefront", label: "Storefront" },
  { value: "headless", label: "Headless" },
  { value: "b2b", label: "B2B shop" },
];

const categoryOptions = [
  { value: "running", label: "Running" },
  { value: "shoes", label: "Shoes" },
  { value: "sale", label: "Sale" },
];

const tabs = [
  { name: "general", label: "General" },
  { name: "seo", label: "SEO" },
];
const activeTab = ref("general");

function discard() {
  product.value = JSON.parse(savedState.value);
}

function save() {
  isSaving.value = true;

  // Replace the timeout with the request that saves the product.
  setTimeout(() => {
    savedState.value = JSON.stringify(product.value);
    isSaving.value = false;
  }, 800);
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <mt-nav class="navigation" :sections="navigation" />
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <template #actions>
        <mt-button variant="secondary" size="default" :disabled="!isDirty" @click="discard">
          Cancel
        </mt-button>
        <mt-button
          variant="primary"
          size="default"
          :disabled="!isDirty"
          :is-loading="isSaving"
          @click="save"
        >
          Save
        </mt-button>
      </template>

      <div class="stack">
        <mt-content-header :title="product.name">
          <mt-badge :variant="product.active ? 'positive' : 'neutral'">
            {{ product.active ? "Active" : "Inactive" }}
          </mt-badge>
        </mt-content-header>

        <mt-tabs :items="tabs" :default-item="activeTab" @new-item-active="activeTab = $event" />

        <mt-layout v-if="activeTab === 'general'">
          <mt-card title="General information">
            <div class="stack">
              <div class="grid">
                <mt-text-field v-model="product.name" label="Name" required />
                <mt-select
                  v-model="product.manufacturer"
                  label="Manufacturer"
                  :options="manufacturerOptions"
                />
              </div>
              <mt-text-field v-model="product.productNumber" label="Product number" required />
              <mt-textarea v-model="product.description" label="Description" />
            </div>
          </mt-card>

          <mt-card title="Prices">
            <div class="grid">
              <mt-select
                v-model="product.tax"
                label="Tax rate"
                :options="taxOptions"
                :enable-search="false"
                hide-clearable-button
                required
              />
              <mt-number-field v-model="product.price" label="Price (gross)" :min="0" required>
                <template #suffix><mt-text size="xs">€</mt-text></template>
              </mt-number-field>
              <mt-number-field v-model="product.purchasePrice" label="Purchase price" :min="0">
                <template #suffix><mt-text size="xs">€</mt-text></template>
              </mt-number-field>
            </div>
          </mt-card>

          <mt-card title="Stock">
            <div class="grid">
              <mt-number-field v-model="product.stock" label="Stock" number-type="int" />
              <mt-number-field
                v-model="product.minPurchase"
                label="Minimum order quantity"
                number-type="int"
                :min="1"
              />
            </div>
          </mt-card>

          <template #end>
            <mt-card title="Visibility">
              <div class="stack">
                <mt-switch v-model="product.active" label="Active" />
                <mt-select
                  v-model="product.salesChannels"
                  label="Sales channels"
                  :options="salesChannelOptions"
                  enable-multi-selection
                />
                <mt-select
                  v-model="product.categories"
                  label="Categories"
                  :options="categoryOptions"
                  enable-multi-selection
                />
              </div>
            </mt-card>

            <mt-card title="Labelling">
              <mt-text-field v-model="product.ean" label="EAN" />
            </mt-card>
          </template>
        </mt-layout>

        <mt-layout v-else>
          <mt-card title="Search engines">
            <div class="stack">
              <mt-text-field v-model="product.metaTitle" label="Meta title" />
              <mt-textarea v-model="product.metaDescription" label="Meta description" />
            </div>
          </mt-card>
        </mt-layout>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.navigation {
  width: 15rem;
}

.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: var(--scale-size-16);
}
</style>
