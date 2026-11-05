<script setup lang="ts">
import { computed, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtDataTable,
  MtEmptyState,
  MtPage,
  MtStatusDot,
  MtText,
  useSnackbar,
  type Filter,
} from "@shopware-ag/meteor-component-library";
import type { Manufacturer, Product } from "../../shared/types";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useConfirm } from "../composables/useConfirm";
import { useDuplicateProduct } from "../composables/useDuplicateProduct";
import { useFormat } from "../composables/useFormat";
import { useListing, type DataTableColumn } from "../composables/useListing";
import { useRepository } from "../composables/useRepository";
import { useStockStatus } from "../composables/useStockStatus";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb(() => t("products.title"));
const format = useFormat();
const { addSnackbar } = useSnackbar();
const { confirm } = useConfirm();
const { duplicateProduct } = useDuplicateProduct();
const stock = useStockStatus();
const productRepository = useRepository("product");
const manufacturerRepository = useRepository("manufacturer");

const {
  items,
  total,
  isLoading,
  page,
  limit,
  term,
  sortBy,
  sortDirection,
  appliedFilters,
  selection,
  isFiltered,
  load,
  onSortChange,
  onSelectionChange,
  onMultipleSelectionChange,
} = useListing("product", { sortBy: "createdAt", sortDirection: "DESC" });

const manufacturers = shallowRef<Manufacturer[]>([]);

manufacturerRepository
  .search({ page: 1, limit: 100, sortBy: "name" })
  .then((result) => (manufacturers.value = result.data));

const columns = computed<DataTableColumn[]>(() => [
  {
    label: t("products.columns.name"),
    property: "name",
    renderer: "text",
    position: 100,
    clickable: true,
    width: 280,
  },
  {
    label: t("products.columns.productNumber"),
    property: "productNumber",
    renderer: "text",
    position: 200,
  },
  {
    label: t("products.columns.manufacturer"),
    property: "manufacturerName",
    renderer: "text",
    position: 300,
  },
  {
    label: t("products.columns.active"),
    property: "active",
    renderer: "badge",
    position: 400,
    rendererOptions: {
      renderItemBadge: (data: Product) =>
        data.active
          ? { label: t("common.active"), variant: "positive" }
          : { label: t("common.inactive"), variant: "default" },
    },
  },
  {
    label: t("products.columns.price"),
    property: "price.gross",
    renderer: "number",
    position: 500,
  },
  {
    label: t("products.columns.stock"),
    property: "stock",
    renderer: "number",
    position: 600,
  },
  {
    label: t("products.columns.availableStock"),
    property: "availableStock",
    renderer: "number",
    position: 700,
  },
  {
    label: t("products.columns.createdAt"),
    property: "createdAt",
    renderer: "text",
    position: 800,
    visible: false,
  },
]);

const filters = computed<Filter[]>(() => [
  {
    id: "active",
    label: t("products.columns.active"),
    type: {
      id: "options",
      options: [
        { id: "true", label: t("common.active") },
        { id: "false", label: t("common.inactive") },
      ],
    },
  },
  {
    id: "manufacturerId",
    label: t("products.columns.manufacturer"),
    type: {
      id: "options",
      options: manufacturers.value.map((manufacturer) => ({
        id: manufacturer.id,
        label: manufacturer.name,
      })),
    },
  },
]);

/** The property contains a dot, which a static slot name would read as a modifier. */
const priceSlot = "column-price.gross";

function openProduct(product: Product) {
  router.push({ name: "product-detail", params: { id: product.id } });
}

function onContextSelect({ key, data }: { key: string; data: Product }) {
  if (key === "duplicate") duplicateProduct(data);
}

function deleteSelectedProducts() {
  deleteProducts(
    items.value.filter((product) => selection.value.includes(product.id)),
  );
}

async function deleteProducts(products: Product[]) {
  const confirmed = await confirm({
    title: t("products.deleteTitle", products.length),
    text: t(
      "products.deleteText",
      { name: products[0]?.name ?? "", n: products.length },
      products.length,
    ),
    confirmLabel: t("common.delete"),
    cancelLabel: t("common.cancel"),
    variant: "critical",
  });
  if (!confirmed) return;

  const ids = products.map((product) => product.id);
  await productRepository.remove(ids);

  selection.value = selection.value.filter((id) => !ids.includes(id));
  addSnackbar({
    message: t("products.deleted", ids.length),
    variant: "success",
  });
  load();
}
</script>

<template>
  <mt-page :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button
        variant="primary"
        size="default"
        @click="router.push({ name: 'product-create' })"
      >
        {{ t("products.add") }}
      </mt-button>
    </template>

    <mt-data-table
      :caption="t('products.title')"
      layout="full"
      :data-source="items"
      :columns="columns"
      :is-loading="isLoading"
      :current-page="page"
      :pagination-limit="limit"
      :pagination-total-items="total"
      :sort-by="sortBy"
      :sort-direction="sortDirection"
      :search-value="term"
      :filters="filters"
      v-model:applied-filters="appliedFilters"
      :number-of-results="total"
      :selected-rows="selection"
      :additional-context-buttons="[
        { key: 'duplicate', label: t('common.duplicate') },
      ]"
      allow-row-selection
      allow-bulk-delete
      @pagination-current-page-change="page = $event"
      @pagination-limit-change="limit = $event"
      @search-value-change="term = $event"
      @sort-change="onSortChange"
      @selection-change="onSelectionChange"
      @multiple-selection-change="onMultipleSelectionChange"
      @open-details="openProduct"
      @context-select="onContextSelect"
      @item-delete="deleteProducts([$event])"
      @bulk-delete="deleteSelectedProducts"
    >
      <template #[priceSlot]="{ data }">
        <mt-text size="xs">{{ format.currency(data.price.gross) }}</mt-text>
      </template>

      <template #column-stock="{ data }">
        <div class="cluster">
          <mt-status-dot :variant="stock.variant(data.stock)" />
          <mt-text size="xs">{{ format.number(data.stock) }}</mt-text>
        </div>
      </template>

      <template #column-createdAt="{ data }">
        <mt-text size="xs">{{ format.relativeTime(data.createdAt) }}</mt-text>
      </template>

      <template #empty-state>
        <mt-empty-state
          icon="regular-products"
          :headline="
            isFiltered
              ? t('products.empty.filteredHeadline')
              : t('products.empty.headline')
          "
          :description="
            isFiltered
              ? t('products.empty.filteredDescription')
              : t('products.empty.description')
          "
        />
      </template>
    </mt-data-table>
  </mt-page>
</template>
