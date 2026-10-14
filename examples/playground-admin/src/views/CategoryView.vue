<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtButton,
  MtCard,
  MtContentHeader,
  MtDataTable,
  MtEmptyState,
  MtLink,
  MtPage,
  MtText,
} from "@shopware-ag/meteor-component-library";
import type { Category, Product } from "../../shared/types";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useFormat } from "../composables/useFormat";
import { useListing, type DataTableColumn } from "../composables/useListing";
import { useRepository } from "../composables/useRepository";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const format = useFormat();
const categoryRepository = useRepository("category");

const categories = shallowRef<Category[]>([]);
const isLoading = ref(true);

categoryRepository
  .search({ page: 1, limit: 500, sortBy: "name" })
  .then((result) => {
    categories.value = result.data;
    isLoading.value = false;
  });

/** The open category, or `null` on the main categories. */
const categoryId = computed(
  () => (route.params.id as string | undefined) || null,
);

function findCategory(id: string | null) {
  return categories.value.find((category) => category.id === id) ?? null;
}

const category = computed(() => findCategory(categoryId.value));

const subcategories = computed(() =>
  categories.value.filter((entry) => entry.parentId === categoryId.value),
);

/** The categories above the open one, from the main category down. */
const parents = computed(() => {
  const chain: Category[] = [];

  for (
    let parent = findCategory(category.value?.parentId ?? null);
    parent;
    parent = findCategory(parent.parentId)
  ) {
    chain.unshift(parent);
  }

  return chain;
});

const title = computed(() =>
  categoryId.value ? (category.value?.name ?? "") : t("categories.title"),
);

const breadcrumb = useBreadcrumb(
  () => title.value,
  () =>
    parents.value.map((parent) => ({
      label: parent.name,
      to: { name: "category", params: { id: parent.id } },
    })),
);

/** The open category and every category below it, whose products the page lists. */
const categoryIds = computed(() => {
  const ids: string[] = [];
  const collect = (id: string) => {
    ids.push(id);
    categories.value
      .filter((entry) => entry.parentId === id)
      .forEach((entry) => collect(entry.id));
  };

  if (categoryId.value) collect(categoryId.value);

  return ids;
});

const {
  items: products,
  total,
  isLoading: isLoadingProducts,
  page,
  limit,
  term,
  sortBy,
  sortDirection,
  onSortChange,
} = useListing("product", {
  sortBy: "name",
  filters: () => ({ categoryIds: categoryIds.value }),
});

const columns = computed<DataTableColumn[]>(() => [
  {
    label: t("products.columns.name"),
    property: "name",
    renderer: "text",
    position: 100,
    clickable: true,
  },
  {
    label: t("products.columns.productNumber"),
    property: "productNumber",
    renderer: "text",
    position: 200,
  },
  {
    label: t("products.columns.price"),
    property: "price.gross",
    renderer: "number",
    position: 300,
  },
  {
    label: t("products.columns.stock"),
    property: "stock",
    renderer: "number",
    position: 400,
  },
]);

/** The property contains a dot, which a static slot name would read as a modifier. */
const priceSlot = "column-price.gross";

function openProduct(product: Product) {
  router.push({ name: "product-detail", params: { id: product.id } });
}
</script>

<template>
  <mt-page :loading="isLoading" :breadcrumb="breadcrumb">
    <mt-empty-state
      v-if="!isLoading && categoryId && !category"
      icon="regular-folder"
      :headline="t('categories.notFound.headline')"
      :description="t('categories.notFound.description')"
    >
      <template #button>
        <mt-button
          variant="secondary"
          size="default"
          @click="router.push({ name: 'category' })"
        >
          {{ t("categories.notFound.back") }}
        </mt-button>
      </template>
    </mt-empty-state>

    <div v-else class="stack">
      <mt-content-header v-if="category" :title="category.name">
        <div class="cluster">
          <mt-text size="xs" color="color-text-secondary-default">
            {{ t("categories.subcategoryCount", subcategories.length) }}
          </mt-text>
          <mt-text
            v-if="!isLoadingProducts"
            size="xs"
            color="color-text-secondary-default"
          >
            {{ t("categories.productCount", total) }}
          </mt-text>
        </div>
      </mt-content-header>

      <mt-card
        v-if="subcategories.length > 0"
        :title="
          categoryId ? t('categories.subcategories') : t('categories.main')
        "
      >
        <ul class="stack">
          <li v-for="entry in subcategories" :key="entry.id">
            <mt-link :to="{ name: 'category', params: { id: entry.id } }">
              {{ entry.name }}
            </mt-link>
          </li>
        </ul>
      </mt-card>

      <mt-data-table
        v-if="categoryId"
        :title="t('categories.products')"
        :caption="t('categories.products')"
        layout="full"
        :data-source="products"
        :columns="columns"
        :is-loading="isLoadingProducts"
        :current-page="page"
        :pagination-limit="limit"
        :pagination-total-items="total"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        :search-value="term"
        disable-settings-table
        disable-delete
        @pagination-current-page-change="page = $event"
        @pagination-limit-change="limit = $event"
        @search-value-change="term = $event"
        @sort-change="onSortChange"
        @open-details="openProduct"
      >
        <template #[priceSlot]="{ data }">
          <mt-text size="xs">{{ format.currency(data.price.gross) }}</mt-text>
        </template>

        <template #empty-state>
          <mt-empty-state
            icon="regular-products"
            :headline="t('categories.noProducts.headline')"
            :description="t('categories.noProducts.description')"
          />
        </template>
      </mt-data-table>
    </div>
  </mt-page>
</template>
