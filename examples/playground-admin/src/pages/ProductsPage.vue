<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MtText } from "@shopware-ag/meteor-component-library";

type Category =
  | "lighting"
  | "textiles"
  | "kitchen"
  | "apparel"
  | "footwear"
  | "accessories";

const baseProducts: { name: string; category: Category; price: number }[] = [
  { name: "Aurora desk lamp", category: "lighting", price: 89.9 },
  { name: "Halo pendant light", category: "lighting", price: 149 },
  { name: "Linen throw pillow", category: "textiles", price: 34.5 },
  { name: "Wool blend blanket", category: "textiles", price: 79 },
  { name: "Ceramic pour-over set", category: "kitchen", price: 49 },
  { name: "Walnut cutting board", category: "kitchen", price: 59 },
  { name: "Merino wool beanie", category: "apparel", price: 29.9 },
  { name: "Organic cotton hoodie", category: "apparel", price: 69 },
  { name: "Trail running shoes", category: "footwear", price: 139.95 },
  { name: "Leather chelsea boots", category: "footwear", price: 189 },
  { name: "Canvas weekender bag", category: "accessories", price: 119 },
  { name: "Recycled glass carafe", category: "accessories", price: 32 },
];

const variants = ["Black", "Sand", "Forest", "Slate"];

const products = baseProducts.flatMap((product, productIndex) =>
  variants.map((variant, variantIndex) => ({
    sku: `SW-${String(1000 + productIndex * 10 + variantIndex)}`,
    name: `${product.name}, ${variant}`,
    category: product.category,
    stock: (productIndex * 37 + variantIndex * 13) % 120,
    price: product.price,
  })),
);

const { t, locale } = useI18n();

const currency = computed(
  () =>
    new Intl.NumberFormat(locale.value, { style: "currency", currency: "EUR" }),
);
const number = computed(() => new Intl.NumberFormat(locale.value));
</script>

<template>
  <div class="page">
    <div class="page__content">
      <mt-text as="h1" size="l" weight="semibold">{{
        t("products.title")
      }}</mt-text>

      <table class="products">
        <thead>
          <tr>
            <th scope="col">{{ t("products.name") }}</th>
            <th scope="col">{{ t("products.sku") }}</th>
            <th scope="col">{{ t("products.category") }}</th>
            <th scope="col" class="products__number">
              {{ t("products.stock") }}
            </th>
            <th scope="col" class="products__number">
              {{ t("products.price") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.sku">
            <td>{{ product.name }}</td>
            <td>{{ product.sku }}</td>
            <td>{{ t(`products.categories.${product.category}`) }}</td>
            <td class="products__number">{{ number.format(product.stock) }}</td>
            <td class="products__number">
              {{ currency.format(product.price) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.products {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-default);
}

.products th,
.products td {
  padding: var(--scale-size-8) var(--scale-size-12);
  border-bottom: 1px solid var(--color-border-secondary-default);
  text-align: start;
}

.products th {
  color: var(--color-text-secondary-default);
  font-weight: var(--font-weight-semibold);
}

.products .products__number {
  text-align: end;
  font-variant-numeric: tabular-nums;
}
</style>
