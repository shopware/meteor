<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtActionMenuItem,
  MtButton,
  MtEmptyState,
  MtIcon,
  MtLink,
  MtPage,
  MtTooltip,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import type { Address, Order } from "../../shared/types";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppPagination from "../components/AppPagination.vue";
import LanguageSwitch from "../components/LanguageSwitch.vue";
import OrderStatus from "../components/OrderStatus.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useConfirm } from "../composables/useConfirm";
import { useFormat } from "../composables/useFormat";
import { useGlobalSearch } from "../composables/useGlobalSearch";
import { useListing } from "../composables/useListing";
import { useRepository } from "../composables/useRepository";

const { t } = useI18n();
const router = useRouter();
const format = useFormat();
const { term: searchTerm } = useGlobalSearch();
const { addSnackbar } = useSnackbar();
const { confirm } = useConfirm();
const orderRepository = useRepository("order");

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
} = useListing("order", {
  sortBy: "orderDateTime",
  sortDirection: "DESC",
  term: searchTerm,
});

const breadcrumb = useBreadcrumb(() =>
  hasLoaded.value
    ? t("common.titleWithCount", { title: t("orders.title"), n: total.value })
    : t("orders.title"),
);

const selection = ref<string[]>([]);

const columns = computed<GridColumn[]>(() => [
  {
    key: "orderNumber",
    label: t("orders.columns.orderNumber"),
    sortable: true,
  },
  {
    key: "customerName",
    label: t("orders.columns.customer"),
    sortable: true,
  },
  {
    key: "shippingAddress",
    label: t("orders.columns.deliveryAddress"),
  },
  {
    key: "amountTotal",
    label: t("orders.columns.total"),
    align: "end",
    sortable: true,
  },
  { key: "state", label: t("orders.columns.state"), sortable: true },
  {
    key: "paymentState",
    label: t("orders.columns.paymentState"),
    sortable: true,
  },
  {
    key: "deliveryState",
    label: t("orders.columns.deliveryState"),
    sortable: true,
  },
  {
    key: "orderDateTime",
    label: t("orders.columns.orderDate"),
    sortable: true,
  },
]);

function address(value: Address) {
  return `${value.street}, ${value.zipcode} ${value.city}`;
}

function openOrder(order: Order) {
  router.push({ name: "order-detail", params: { id: order.id } });
}

async function deleteOrder(order: Order) {
  const confirmed = await confirm({
    title: t("common.warning"),
    text: t("orders.deleteText", { number: order.orderNumber }),
    confirmLabel: t("common.delete"),
    cancelLabel: t("common.cancel"),
    variant: "critical",
  });
  if (!confirmed) return;

  await orderRepository.remove([order.id]);

  addSnackbar({ message: t("orders.deleted"), variant: "success" });
  load();
}
</script>

<template>
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
      <language-switch />
      <mt-button variant="primary" size="default">
        {{ t("orders.add") }}
      </mt-button>
    </template>

    <div class="listing">
      <app-grid
        v-model:selection="selection"
        :caption="t('orders.title')"
        :columns="columns"
        :rows="items"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        selectable
        clickable
        @sort="onSortChange"
        @open="openOrder"
      >
        <template #cell-orderNumber="{ row }">
          <span class="cluster">
            <mt-link :to="{ name: 'order-detail', params: { id: row.id } }">
              {{ row.orderNumber }}
            </mt-link>

            <mt-tooltip
              v-if="row.customerComment"
              :content="
                t('orders.additionalInformation', {
                  comment: row.customerComment,
                })
              "
            >
              <template #default="params">
                <mt-button
                  v-bind="params"
                  variant="secondary"
                  size="x-small"
                  square
                  :aria-label="t('orders.customerComment')"
                >
                  <mt-icon
                    name="regular-comments"
                    size="var(--scale-size-12)"
                    decorative
                  />
                </mt-button>
              </template>
            </mt-tooltip>
          </span>
        </template>

        <template #cell-customerName="{ row }">
          <mt-link
            :to="{ name: 'customer-detail', params: { id: row.customer.id } }"
          >
            {{ row.customerName }}
          </mt-link>
        </template>

        <template #cell-shippingAddress="{ row }">
          {{ address(row.shippingAddress) }}
        </template>

        <template #cell-amountTotal="{ row }">
          {{ format.currency(row.amountTotal) }}
        </template>

        <template #cell-state="{ row }">
          <order-status machine="order" :state="row.state" />
        </template>

        <template #cell-paymentState="{ row }">
          <order-status machine="payment" :state="row.paymentState" />
        </template>

        <template #cell-deliveryState="{ row }">
          <order-status machine="delivery" :state="row.deliveryState" />
        </template>

        <template #cell-orderDateTime="{ row }">
          {{ format.relativeTime(row.orderDateTime) }}
        </template>

        <template #actions="{ row }">
          <mt-action-menu-item icon="regular-eye" @select="openOrder(row)">
            {{ t("common.view") }}
          </mt-action-menu-item>
          <mt-action-menu-item
            icon="regular-trash"
            variant="critical"
            :disabled="row.documents.length > 0"
            @select="deleteOrder(row)"
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
        </template>

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
