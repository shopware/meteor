<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MtText } from "@shopware-ag/meteor-component-library";
import { products } from "../../shared/products";

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
