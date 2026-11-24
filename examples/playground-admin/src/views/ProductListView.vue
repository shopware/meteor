<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmptyState,
  MtIcon,
  MtLink,
  MtPage,
  MtStatusDot,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import type { Product } from "../../shared/types";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppPagination from "../components/AppPagination.vue";
import LanguageSwitch from "../components/LanguageSwitch.vue";
import MediaThumbnail from "../components/MediaThumbnail.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useConfirm } from "../composables/useConfirm";
import { useDuplicateProduct } from "../composables/useDuplicateProduct";
import { useFormat } from "../composables/useFormat";
import { useGlobalSearch } from "../composables/useGlobalSearch";
import { useListing } from "../composables/useListing";
import { useRepository } from "../composables/useRepository";
import { useStockStatus } from "../composables/useStockStatus";

const { t } = useI18n();
const router = useRouter();
const format = useFormat();
const { addSnackbar } = useSnackbar();
const { confirm } = useConfirm();
const { duplicateProduct } = useDuplicateProduct();
const stock = useStockStatus();
const productRepository = useRepository("product");
const { term: searchTerm } = useGlobalSearch();

const {
  items,
  total,
  isLoading,
  hasLoaded,
  page,
  limit,
  sortBy,
  sortDirection,
  isFiltered,
  load,
  onSortChange,
} = useListing("product", {
  sortBy: "createdAt",
  sortDirection: "DESC",
  term: searchTerm,
});

// The Administration shows the number of results next to the title once they are loaded.
const breadcrumb = useBreadcrumb(() =>
  hasLoaded.value
    ? t("common.titleWithCount", { title: t("products.title"), n: total.value })
    : t("products.title"),
);

const selection = ref<string[]>([]);

const columns = computed<GridColumn[]>(() => [
  { key: "name", label: t("products.columns.name"), sortable: true },
  {
    key: "productNumber",
    label: t("products.columns.productNumber"),
    align: "end",
    sortable: true,
  },
  {
    key: "manufacturerName",
    label: t("products.columns.manufacturer"),
    sortable: true,
  },
  {
    key: "active",
    label: t("products.columns.active"),
    align: "center",
    sortable: true,
  },
  {
    key: "sales",
    label: t("products.columns.sales"),
    align: "end",
    sortable: true,
  },
  {
    key: "price.gross",
    label: t("products.columns.price"),
    align: "end",
    sortable: true,
  },
  {
    key: "stock",
    label: t("products.columns.stock"),
    align: "end",
    sortable: true,
  },
  {
    key: "availableStock",
    label: t("products.columns.availableStock"),
    align: "end",
    sortable: true,
  },
  {
    key: "createdAt",
    label: t("products.columns.createdAt"),
    sortable: true,
  },
]);

/** The property contains a dot, which a static slot name would read as a modifier. */
const priceSlot = "cell-price.gross";

function openProduct(product: Product) {
  router.push({ name: "product-detail", params: { id: product.id } });
}

function deleteSelectedProducts() {
  deleteProducts(
    items.value.filter((product) => selection.value.includes(product.id)),
  );
}

async function deleteProducts(products: Product[]) {
  const confirmed = await confirm({
    title: t("common.warning"),
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
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
      <language-switch />
      <div class="split-button">
        <mt-button
          variant="primary"
          size="default"
          @click="router.push({ name: 'product-create' })"
        >
          {{ t("products.add") }}
        </mt-button>

        <mt-dropdown-menu-root>
          <mt-dropdown-menu-trigger as-child>
            <mt-button
              variant="primary"
              size="default"
              square
              :aria-label="t('common.moreActions')"
            >
              <mt-icon
                name="regular-chevron-down-xs"
                size="var(--scale-size-12)"
                decorative
              />
            </mt-button>
          </mt-dropdown-menu-trigger>
          <mt-dropdown-menu-portal>
            <mt-action-menu>
              <mt-action-menu-item
                @select="router.push({ name: 'product-create' })"
              >
                {{ t("products.addDigital") }}
              </mt-action-menu-item>
            </mt-action-menu>
          </mt-dropdown-menu-portal>
        </mt-dropdown-menu-root>
      </div>
    </template>

    <div class="listing">
      <app-grid
        v-model:selection="selection"
        :caption="t('products.title')"
        :columns="columns"
        :rows="items"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        selectable
        clickable
        @sort="onSortChange"
        @open="openProduct"
      >
        <template #cell-name="{ row }">
          <div class="cell-media">
            <media-thumbnail />
            <mt-link
              :to="{ name: 'product-detail', params: { id: row.id } }"
            >
              {{ row.name }}
            </mt-link>
          </div>
        </template>

        <template #cell-manufacturerName="{ row }">
          {{ row.manufacturerName ?? "" }}
        </template>

        <template #cell-active="{ row }">
          <mt-icon
            v-if="row.active"
            class="product-list__active"
            name="regular-checkmark-xs"
            size="var(--scale-size-12)"
            :aria-label="t('common.active')"
          />
          <mt-icon
            v-else
            class="product-list__inactive"
            name="regular-times-s"
            size="var(--scale-size-12)"
            :aria-label="t('common.inactive')"
          />
        </template>

        <template #cell-sales="{ row }">
          {{ format.number(row.sales) }}
        </template>

        <template #[priceSlot]="{ row }">
          {{ format.currency(row.price.gross) }}
        </template>

        <template #cell-stock="{ row }">
          <span class="product-list__stock">
            {{ format.number(row.stock) }}
            <mt-status-dot :variant="stock.variant(row.stock)" />
          </span>
        </template>

        <template #cell-availableStock="{ row }">
          {{ format.number(row.availableStock) }}
        </template>

        <template #cell-createdAt="{ row }">
          {{ format.relativeTime(row.createdAt) }}
        </template>

        <template #actions="{ row }">
          <mt-action-menu-item icon="regular-pencil-s" @select="openProduct(row)">
            {{ t("common.edit") }}
          </mt-action-menu-item>
          <mt-action-menu-item
            icon="regular-duplicate"
            @select="duplicateProduct(row)"
          >
            {{ t("common.duplicate") }}
          </mt-action-menu-item>
          <mt-action-menu-item
            icon="regular-trash"
            variant="critical"
            @select="deleteProducts([row])"
          >
            {{ t("common.delete") }}
          </mt-action-menu-item>
        </template>

        <template #bulk>
          <mt-button variant="tertiary" size="small" @click="selection = []">
            {{ t("grid.deselectAll") }}
          </mt-button>
          <mt-button variant="secondary" size="small">
            {{ t("grid.bulkEdit") }}
          </mt-button>
          <mt-button
            variant="critical"
            size="small"
            @click="deleteSelectedProducts"
          >
            {{ t("common.delete") }}
          </mt-button>
        </template>

        <template #empty>
          <mt-empty-state
            icon="regular-products"
            :headline="
              isFiltered
                ? t('common.nothingFound')
                : t('products.empty.headline')
            "
            :description="
              isFiltered
                ? t('common.nothingFoundDescription')
                : t('products.empty.description')
            "
          />
        </template>
      </app-grid>

      <app-pagination v-model:page="page" v-model:limit="limit" :total="total" />
    </div>
  </mt-page>
</template>

<style scoped>
.product-list__active {
  color: var(--color-icon-positive-default);
}

.product-list__inactive {
  color: var(--color-icon-critical-default);
}

.product-list__stock {
  display: inline-flex;
  align-items: center;
  gap: var(--scale-size-8);
}
</style>
