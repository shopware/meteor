<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtEmptyState,
  MtPage,
  MtSearch,
} from "@shopware-ag/meteor-component-library";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import AppPagination from "../components/AppPagination.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useListing } from "../composables/useListing";

const { t } = useI18n();

const { items, total, isLoading, hasLoaded, page, limit, term, isFiltered } =
  useListing("order", { sortBy: "orderDateTime", sortDirection: "DESC" });

const breadcrumb = useBreadcrumb(() =>
  hasLoaded.value
    ? t("common.titleWithCount", { title: t("orders.title"), n: total.value })
    : t("orders.title"),
);

const columns = computed<GridColumn[]>(() => [
  { key: "orderNumber", label: t("orders.columns.orderNumber") },
  { key: "customer", label: t("orders.columns.customer") },
  { key: "address", label: t("orders.columns.deliveryAddress") },
  { key: "total", label: t("orders.columns.total"), align: "end" },
  { key: "state", label: t("orders.columns.state") },
  { key: "paymentState", label: t("orders.columns.paymentState") },
  { key: "deliveryState", label: t("orders.columns.deliveryState") },
  { key: "orderDate", label: t("orders.columns.orderDate") },
]);
</script>

<template>
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button variant="primary" size="default">
        {{ t("orders.add") }}
      </mt-button>
      <app-header-actions />
    </template>

    <div class="listing">
      <div class="listing__toolbar">
        <mt-search v-model="term" size="small" :placeholder="t('orders.search')" />
      </div>

      <app-grid
        :caption="t('orders.title')"
        :columns="columns"
        :rows="items"
        :is-loading="isLoading"
        selectable
        actions
      >
        <template #empty>
          <mt-empty-state
            icon="regular-shopping-bag"
            :headline="
              isFiltered ? t('common.nothingFound') : t('orders.empty.headline')
            "
            :description="
              isFiltered
                ? t('common.nothingFoundDescription')
                : t('orders.empty.description')
            "
          />
        </template>
      </app-grid>

      <app-pagination v-model:page="page" v-model:limit="limit" :total="total" />
    </div>
  </mt-page>
</template>
