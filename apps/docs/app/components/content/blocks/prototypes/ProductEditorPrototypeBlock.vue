<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtBadge,
  MtButton,
  MtCard,
  MtCheckbox,
  MtContentHeader,
  MtIcon,
  MtLayout,
  MtNumberField,
  MtPage,
  MtSelect,
  MtSwitch,
  MtText,
  MtTextEditor,
  MtTextField,
  MtUnitField,
  useUnsavedChanges,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

interface Variant {
  id: number;
  size: string;
  price: number;
  stock: number;
}

// Sample data. Replace it with the product your page loads.
const savedProduct = {
  name: "Running shoe Aero",
  productNumber: "SW-10042",
  description:
    "<p>A light running shoe with a breathable mesh upper and a cushioned sole for long distances.</p>",
  price: 129.95,
  listPrice: 149.95,
  chargeTax: true,
  inStock: true,
  status: "active",
  categories: ["running", "shoes"],
  tags: ["new"],
  weight: 640,
  weightUnit: "g",
  media: ["Side view", "Sole", "Detail", "On foot"],
  variants: [
    { id: 1, size: "41", price: 129.95, stock: 42 },
    { id: 2, size: "42", price: 129.95, stock: 18 },
    { id: 3, size: "43", price: 134.95, stock: 7 },
  ] as Variant[],
};

const product = ref(structuredClone(savedProduct));
const savedState = ref(JSON.stringify(product.value));
const isDirty = computed(() => JSON.stringify(product.value) !== savedState.value);
const isSaving = ref(false);

// Inside mt-app, this asks before a navigation or a reload discards the changes.
useUnsavedChanges(isDirty);

const breadcrumb = computed<BreadcrumbItem[]>(() => [
  { label: "Products", to: "/products", icon: "products" },
  { label: savedProduct.name },
]);

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const categoryOptions = [
  { value: "running", label: "Running" },
  { value: "shoes", label: "Shoes" },
  { value: "trail", label: "Trail" },
  { value: "sale", label: "Sale" },
];

const tagOptions = [
  { value: "new", label: "New" },
  { value: "bestseller", label: "Bestseller" },
  { value: "vegan", label: "Vegan" },
];

const sizeOptions = ["39", "40", "41", "42", "43", "44", "45"].map((size) => ({
  value: size,
  label: `EU ${size}`,
}));

function addVariant() {
  product.value.variants.push({ id: Date.now(), size: "44", price: product.value.price, stock: 0 });
}

function removeVariant(id: number) {
  product.value.variants = product.value.variants.filter((variant) => variant.id !== id);
}

function removeImage(name: string) {
  product.value.media = product.value.media.filter((image) => image !== name);
}

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
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
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
          <mt-badge :variant="product.status === 'active' ? 'positive' : 'neutral'">
            {{ statusOptions.find(({ value }) => value === product.status)?.label }}
          </mt-badge>
        </mt-content-header>

        <mt-layout>
          <mt-card title="General information">
            <div class="stack">
              <div class="grid">
                <mt-text-field v-model="product.name" label="Name" required />
                <mt-text-field v-model="product.productNumber" label="Product number" required />
              </div>
              <mt-text-editor v-model="product.description" label="Description" />
            </div>
          </mt-card>

          <mt-card title="Media" subtitle="The first image is the cover of the product.">
            <missing-feature title="Upload and gallery">
              No component to upload files or to show, order and remove images. The tiles stand
              in for both.

              <template #stand-in>
                <ul class="gallery">
                  <li v-for="(image, index) in product.media" :key="image" class="gallery__tile">
                    <mt-icon name="regular-image" size="var(--scale-size-24)" decorative />
                    <mt-text size="2xs" color="color-text-secondary-default" as="span">
                      {{ index === 0 ? `${image} (cover)` : image }}
                    </mt-text>
                    <mt-button
                      variant="tertiary"
                      size="x-small"
                      square
                      class="gallery__remove"
                      :aria-label="`Remove ${image}`"
                      @click="removeImage(image)"
                    >
                      <template #iconFront>
                        <mt-icon name="regular-times-xs" size="var(--scale-size-10)" decorative />
                      </template>
                    </mt-button>
                  </li>
                  <li class="gallery__tile gallery__tile--drop">
                    <mt-icon name="regular-cloud-upload" size="var(--scale-size-24)" decorative />
                    <mt-text size="2xs" color="color-text-secondary-default" as="span">
                      Drop images here
                    </mt-text>
                  </li>
                </ul>
              </template>
            </missing-feature>
          </mt-card>

          <mt-card title="Variants" subtitle="One row per size, with its own price and stock.">
            <div class="stack">
              <div v-for="variant in product.variants" :key="variant.id" class="variant">
                <mt-select
                  v-model="variant.size"
                  label="Size"
                  :options="sizeOptions"
                  :enable-search="false"
                  hide-clearable-button
                />
                <mt-number-field v-model="variant.price" label="Price" :min="0">
                  <template #suffix><mt-text size="xs">€</mt-text></template>
                </mt-number-field>
                <mt-number-field v-model="variant.stock" label="Stock" number-type="int" :min="0" />
                <mt-button
                  variant="tertiary"
                  size="default"
                  square
                  class="variant__remove"
                  :aria-label="`Remove size ${variant.size}`"
                  @click="removeVariant(variant.id)"
                >
                  <template #iconFront>
                    <mt-icon name="regular-trash" size="var(--scale-size-16)" decorative />
                  </template>
                </mt-button>
              </div>

              <div class="row">
                <mt-button variant="secondary" size="default" @click="addVariant">
                  Add variant
                </mt-button>
                <missing-feature title="Editable table" inline>
                  No table with editable cells or a repeater that can reorder its rows, so each
                  variant is a row of fields.
                </missing-feature>
              </div>
            </div>
          </mt-card>

          <template #end>
            <mt-card title="Pricing">
              <div class="stack">
                <mt-number-field v-model="product.price" label="Price (gross)" :min="0" required>
                  <template #suffix><mt-text size="xs">€</mt-text></template>
                </mt-number-field>
                <mt-number-field
                  v-model="product.listPrice"
                  label="List price"
                  help-text="Shown crossed out when it is higher than the price."
                  :min="0"
                >
                  <template #suffix><mt-text size="xs">€</mt-text></template>
                </mt-number-field>
                <mt-checkbox v-model="product.chargeTax" label="Charge tax on this product" />
                <mt-switch v-model="product.inStock" label="In stock" />
              </div>
            </mt-card>

            <mt-card title="Status">
              <mt-select
                v-model="product.status"
                label="Status"
                :options="statusOptions"
                :enable-search="false"
                hide-clearable-button
              />
            </mt-card>

            <mt-card title="Organization">
              <div class="stack">
                <mt-select
                  v-model="product.categories"
                  label="Categories"
                  :options="categoryOptions"
                  enable-multi-selection
                />
                <mt-select
                  v-model="product.tags"
                  label="Tags"
                  :options="tagOptions"
                  enable-multi-selection
                />
                <missing-feature title="Tag input" inline>
                  Select can only choose existing options. A field that creates new tags while
                  typing is missing.
                </missing-feature>
              </div>
            </mt-card>

            <mt-card title="Shipping">
              <mt-unit-field
                v-model="product.weight"
                v-model:default-unit="product.weightUnit"
                label="Weight"
                measurement-type="mass"
              />
            </mt-card>
          </template>
        </mt-layout>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--scale-size-16);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-12);
}

.variant {
  display: grid;
  grid-template-columns: minmax(6rem, 1fr) minmax(7rem, 1fr) minmax(6rem, 1fr) auto;
  align-items: end;
  gap: var(--scale-size-12);
}

/* Lines the button up with the fields, which have their label above them. */
.variant__remove {
  margin-block-end: var(--scale-size-4);
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  gap: var(--scale-size-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

.gallery__tile {
  position: relative;
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--scale-size-4);
  aspect-ratio: 1;
  padding: var(--scale-size-8);
  color: var(--color-icon-secondary-default);
  text-align: center;
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

.gallery__tile--drop {
  border-style: dashed;
}

.gallery__remove {
  position: absolute;
  inset-block-start: var(--scale-size-4);
  inset-inline-end: var(--scale-size-4);
}
</style>
