<script setup lang="ts">
import { computed } from "vue";
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
  MtPage,
  MtSearch,
} from "@shopware-ag/meteor-component-library";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import AppPagination from "../components/AppPagination.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useListing } from "../composables/useListing";

const { t } = useI18n();
const router = useRouter();

const { items, total, isLoading, hasLoaded, page, limit, term, isFiltered } =
  useListing("product", { sortBy: "createdAt", sortDirection: "DESC" });

// The Administration shows the number of results next to the title once they are loaded.
const breadcrumb = useBreadcrumb(() =>
  hasLoaded.value
    ? t("common.titleWithCount", { title: t("products.title"), n: total.value })
    : t("products.title"),
);

const columns = computed<GridColumn[]>(() => [
  { key: "name", label: t("products.columns.name") },
  {
    key: "productNumber",
    label: t("products.columns.productNumber"),
    align: "end",
  },
  { key: "manufacturer", label: t("products.columns.manufacturer") },
  { key: "active", label: t("products.columns.active"), align: "center" },
  { key: "sales", label: t("products.columns.sales"), align: "end" },
  { key: "price", label: t("products.columns.price"), align: "end" },
  { key: "stock", label: t("products.columns.stock"), align: "end" },
  {
    key: "availableStock",
    label: t("products.columns.availableStock"),
    align: "end",
  },
  { key: "createdAt", label: t("products.columns.createdAt") },
]);
</script>

<template>
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
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
      <app-header-actions />
    </template>

    <div class="listing">
      <div class="listing__toolbar">
        <mt-search v-model="term" size="small" :placeholder="t('products.search')" />
      </div>

      <app-grid
        :caption="t('products.title')"
        :columns="columns"
        :rows="items"
        :is-loading="isLoading"
        selectable
        actions
      >
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
