<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtActionMenuItem,
  MtAvatar,
  MtBadge,
  MtButton,
  MtEmptyState,
  MtLink,
  MtPage,
} from "@shopware-ag/meteor-component-library";
import type { CustomerAccount } from "../../shared/types";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppPagination from "../components/AppPagination.vue";
import LanguageSwitch from "../components/LanguageSwitch.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useFormat } from "../composables/useFormat";
import { useGlobalSearch } from "../composables/useGlobalSearch";
import { useListing } from "../composables/useListing";

const { t } = useI18n();
const router = useRouter();
const format = useFormat();
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
  onSortChange,
} = useListing("customer", {
  sortBy: "createdAt",
  sortDirection: "DESC",
  term: searchTerm,
});

const breadcrumb = useBreadcrumb(() =>
  hasLoaded.value
    ? t("common.titleWithCount", {
        title: t("customers.title"),
        n: total.value,
      })
    : t("customers.title"),
);

const selection = ref<string[]>([]);

const columns = computed<GridColumn[]>(() => [
  { key: "lastName", label: t("customers.columns.name"), sortable: true },
  { key: "address.street", label: t("customers.columns.street") },
  {
    key: "address.zipcode",
    label: t("customers.columns.zipcode"),
    align: "end",
  },
  { key: "address.city", label: t("customers.columns.city") },
  {
    key: "customerNumber",
    label: t("customers.columns.customerNumber"),
    align: "end",
    sortable: true,
  },
  {
    key: "group",
    label: t("customers.columns.group"),
    align: "end",
    sortable: true,
  },
  { key: "email", label: t("customers.columns.email"), sortable: true },
  {
    key: "createdAt",
    label: t("customers.columns.createdAt"),
    sortable: true,
  },
]);

/** Slot names for the dotted address properties. */
const streetSlot = "cell-address.street";
const zipcodeSlot = "cell-address.zipcode";
const citySlot = "cell-address.city";

function openCustomer(customer: CustomerAccount) {
  router.push({ name: "customer-detail", params: { id: customer.id } });
}
</script>

<template>
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
      <language-switch />
      <mt-button variant="primary" size="default">
        {{ t("customers.add") }}
      </mt-button>
    </template>

    <div class="listing">
      <app-grid
        v-model:selection="selection"
        :caption="t('customers.title')"
        :columns="columns"
        :rows="items"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        selectable
        clickable
        @sort="onSortChange"
        @open="openCustomer"
      >
        <template #cell-lastName="{ row }">
          <div class="cell-media">
            <mt-avatar
              size="xs"
              :first-name="row.firstName"
              :last-name="row.lastName"
            />
            <mt-link
              :to="{ name: 'customer-detail', params: { id: row.id } }"
            >
              {{ row.lastName }}, {{ row.firstName }}
            </mt-link>
            <mt-badge v-if="row.guest" variant="neutral">
              {{ t("customers.guest") }}
            </mt-badge>
          </div>
        </template>

        <template #[streetSlot]="{ row }">{{ row.address.street }}</template>
        <template #[zipcodeSlot]="{ row }">{{ row.address.zipcode }}</template>
        <template #[citySlot]="{ row }">{{ row.address.city }}</template>

        <template #cell-group="{ row }">
          <mt-badge :variant="row.group === 'VIP' ? 'info' : 'neutral'">
            {{ row.group }}
          </mt-badge>
        </template>

        <template #cell-createdAt="{ row }">
          {{ format.relativeTime(row.createdAt) }}
        </template>

        <template #actions="{ row }">
          <mt-action-menu-item icon="regular-eye" @select="openCustomer(row)">
            {{ t("common.view") }}
          </mt-action-menu-item>
          <mt-action-menu-item
            icon="regular-pencil-s"
            @select="openCustomer(row)"
          >
            {{ t("common.edit") }}
          </mt-action-menu-item>
          <mt-action-menu-item icon="regular-trash" variant="critical">
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
        </template>

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
