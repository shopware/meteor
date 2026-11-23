<script setup lang="ts">
import { computed, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtBadge,
  MtButton,
  MtDataTableNext,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmptyState,
  MtIcon,
  MtLink,
  MtPage,
  MtSearch,
  MtSelect,
  MtStatusDot,
  MtText,
  useSnackbar,
  type MtDataTableNextColumn,
} from "@shopware-ag/meteor-component-library";
import type { Manufacturer, Product } from "../../shared/types";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useConfirm } from "../composables/useConfirm";
import { useDuplicateProduct } from "../composables/useDuplicateProduct";
import { useFormat } from "../composables/useFormat";
import { useListing } from "../composables/useListing";
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
  term,
  sorting,
  pagination,
  filterValues,
  rowSelection,
  selectedIds,
  isFiltered,
  load,
  deselect,
} = useListing("product", { sortBy: "createdAt", sortDirection: "DESC" });

const manufacturers = shallowRef<Manufacturer[]>([]);

manufacturerRepository
  .search({ page: 1, limit: 100, sortBy: "name" })
  .then((result) => (manufacturers.value = result.data));

const columns = computed<MtDataTableNextColumn<Product>[]>(() => [
  { accessorKey: "name", header: t("products.columns.name") },
  { accessorKey: "productNumber", header: t("products.columns.productNumber") },
  {
    accessorKey: "manufacturerName",
    header: t("products.columns.manufacturer"),
  },
  { accessorKey: "active", header: t("products.columns.active") },
  {
    accessorKey: "price.gross",
    header: t("products.columns.price"),
    meta: { align: "end" },
  },
  { accessorKey: "stock", header: t("products.columns.stock") },
  {
    accessorKey: "availableStock",
    header: t("products.columns.availableStock"),
    meta: { align: "end" },
  },
  { id: "actions", header: t("common.actions"), enableSorting: false },
]);

const activeOptions = computed(() => [
  { label: t("common.active"), value: "true" },
  { label: t("common.inactive"), value: "false" },
]);

const manufacturerOptions = computed(() =>
  manufacturers.value.map((manufacturer) => ({
    label: manufacturer.name,
    value: manufacturer.id,
  })),
);

function openProduct(product: Product) {
  router.push({ name: "product-detail", params: { id: product.id } });
}

function deleteSelectedProducts() {
  deleteProducts(
    items.value.filter((product) => selectedIds.value.includes(product.id)),
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

  deselect(ids);
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

    <div class="stack">
      <!-- While rows are selected, their actions take the place of search and filters -->
      <div v-if="selectedIds.length > 0" class="cluster">
        <mt-text size="xs" color="color-text-secondary-default">
          {{ t("common.selected", { n: selectedIds.length }) }}
        </mt-text>

        <mt-button variant="critical" size="small" @click="deleteSelectedProducts">
          {{ t("common.delete") }}
        </mt-button>

        <mt-button variant="tertiary" size="small" @click="rowSelection = {}">
          {{ t("common.clearSelection") }}
        </mt-button>
      </div>

      <div v-else class="grid" style="--grid-min: 12rem">
        <mt-search v-model="term" size="small" />

        <mt-select
          v-model="filterValues.active"
          :options="activeOptions"
          :placeholder="t('products.columns.active')"
          :aria-label="t('products.columns.active')"
          enable-multi-selection
          small
        />

        <mt-select
          v-model="filterValues.manufacturerId"
          :options="manufacturerOptions"
          :placeholder="t('products.columns.manufacturer')"
          :aria-label="t('products.columns.manufacturer')"
          enable-multi-selection
          small
        />
      </div>

      <mt-data-table-next
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        v-model:row-selection="rowSelection"
        manual
        :aria-label="t('products.title')"
        :data="items"
        :columns="columns"
        :row-count="total"
        :loading="isLoading"
      >
        <template #cell-name="{ row }">
          <mt-link
            :to="{ name: 'product-detail', params: { id: row.original.id } }"
          >
            {{ row.original.name }}
          </mt-link>
        </template>

        <template #cell-active="{ row }">
          <mt-badge :variant="row.original.active ? 'positive' : 'neutral'">
            {{ row.original.active ? t("common.active") : t("common.inactive") }}
          </mt-badge>
        </template>

        <template #cell-price_gross="{ row }">
          {{ format.currency(row.original.price.gross) }}
        </template>

        <template #cell-stock="{ row }">
          <div class="cluster">
            <mt-status-dot :variant="stock.variant(row.original.stock)" />
            <mt-text size="xs">{{ format.number(row.original.stock) }}</mt-text>
          </div>
        </template>

        <template #header-actions>
          <span class="visually-hidden">{{ t("common.actions") }}</span>
        </template>

        <template #cell-actions="{ row }">
          <mt-dropdown-menu-root>
            <mt-dropdown-menu-trigger as-child>
              <mt-button
                variant="tertiary"
                size="small"
                square
                :aria-label="t('common.rowActions', { name: row.original.name })"
              >
                <mt-icon name="regular-ellipsis-h-s" size="var(--scale-size-12)" />
              </mt-button>
            </mt-dropdown-menu-trigger>

            <mt-dropdown-menu-portal>
              <mt-action-menu>
                <mt-action-menu-item
                  icon="pencil-s"
                  @select="openProduct(row.original)"
                >
                  {{ t("common.edit") }}
                </mt-action-menu-item>
                <mt-action-menu-item
                  icon="duplicate"
                  @select="duplicateProduct(row.original)"
                >
                  {{ t("common.duplicate") }}
                </mt-action-menu-item>
                <mt-action-menu-item
                  icon="trash"
                  variant="critical"
                  @select="deleteProducts([row.original])"
                >
                  {{ t("common.delete") }}
                </mt-action-menu-item>
              </mt-action-menu>
            </mt-dropdown-menu-portal>
          </mt-dropdown-menu-root>
        </template>

        <template #empty>
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
      </mt-data-table-next>
    </div>
  </mt-page>
</template>
