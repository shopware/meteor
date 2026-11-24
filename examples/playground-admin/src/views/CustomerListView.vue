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
  useListing("customer", { sortBy: "createdAt", sortDirection: "DESC" });

const breadcrumb = useBreadcrumb(() =>
  hasLoaded.value
    ? t("common.titleWithCount", {
        title: t("customers.title"),
        n: total.value,
      })
    : t("customers.title"),
);

const columns = computed<GridColumn[]>(() => [
  { key: "name", label: t("customers.columns.name") },
  { key: "street", label: t("customers.columns.street") },
  { key: "zipcode", label: t("customers.columns.zipcode"), align: "end" },
  { key: "city", label: t("customers.columns.city") },
  {
    key: "customerNumber",
    label: t("customers.columns.customerNumber"),
    align: "end",
  },
  { key: "group", label: t("customers.columns.group"), align: "end" },
  { key: "email", label: t("customers.columns.email") },
  { key: "createdAt", label: t("customers.columns.createdAt") },
]);
</script>

<template>
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button variant="primary" size="default">
        {{ t("customers.add") }}
      </mt-button>
      <app-header-actions />
    </template>

    <div class="listing">
      <div class="listing__toolbar">
        <mt-search v-model="term" size="small" :placeholder="t('customers.search')" />
      </div>

      <app-grid
        :caption="t('customers.title')"
        :columns="columns"
        :rows="items"
        :is-loading="isLoading"
        selectable
        actions
      >
        <template #empty>
          <mt-empty-state
            icon="regular-users"
            :headline="
              isFiltered
                ? t('common.nothingFound')
                : t('customers.empty.headline')
            "
            :description="
              isFiltered
                ? t('common.nothingFoundDescription')
                : t('customers.empty.description')
            "
          />
        </template>
      </app-grid>

      <app-pagination v-model:page="page" v-model:limit="limit" :total="total" />
    </div>
  </mt-page>
</template>
