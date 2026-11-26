<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtDataTable,
  MtEmptyState,
  MtIcon,
  MtLink,
  MtPage,
  MtText,
  MtTooltip,
  useSnackbar,
  type Filter,
} from "@shopware-ag/meteor-component-library";
import type { Order } from "../../shared/types";
import OrderStatus from "../components/OrderStatus.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useConfirm } from "../composables/useConfirm";
import { useFormat } from "../composables/useFormat";
import { useListing, type DataTableColumn } from "../composables/useListing";
import {
  useOrderStates,
  type StateMachine,
} from "../composables/useOrderStates";
import { useRepository } from "../composables/useRepository";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb(() => t("orders.title"));
const format = useFormat();
const states = useOrderStates();
const { addSnackbar } = useSnackbar();
const { confirm } = useConfirm();
const orderRepository = useRepository("order");

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
  isFiltered,
  load,
  onSortChange,
} = useListing("order", { sortBy: "orderDateTime", sortDirection: "DESC" });

const columns = computed<DataTableColumn[]>(() => [
  {
    label: t("orders.columns.orderNumber"),
    property: "orderNumber",
    renderer: "text",
    position: 100,
  },
  {
    label: t("orders.columns.customer"),
    property: "customerName",
    renderer: "text",
    position: 200,
  },
  {
    label: t("orders.columns.deliveryAddress"),
    property: "shippingAddress.city",
    renderer: "text",
    position: 300,
    visible: false,
  },
  {
    label: t("orders.columns.total"),
    property: "amountTotal",
    renderer: "number",
    position: 400,
  },
  {
    label: t("orders.columns.state"),
    property: "state",
    renderer: "text",
    position: 500,
  },
  {
    label: t("orders.columns.paymentState"),
    property: "paymentState",
    renderer: "text",
    position: 600,
  },
  {
    label: t("orders.columns.deliveryState"),
    property: "deliveryState",
    renderer: "text",
    position: 700,
  },
  {
    label: t("orders.columns.orderDate"),
    property: "orderDateTime",
    renderer: "text",
    position: 800,
  },
]);

const filters = computed<Filter[]>(() =>
  (
    [
      ["state", "order"],
      ["paymentState", "payment"],
      ["deliveryState", "delivery"],
    ] as [string, StateMachine][]
  ).map(([property, machine]) => ({
    id: property,
    label: t(`orders.columns.${property}`),
    type: {
      id: "options",
      options: states.options(machine).map((option) => ({
        id: option.value,
        label: option.label,
      })),
    },
  })),
);

/** The address property contains a dot, which a static slot name would read as a modifier. */
const addressSlot = "column-shippingAddress.city";

function openOrder(order: Order) {
  router.push({ name: "order-detail", params: { id: order.id } });
}

async function deleteOrder(order: Order) {
  const confirmed = await confirm({
    title: t("orders.deleteTitle"),
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
  <mt-page :breadcrumb="breadcrumb">
    <mt-data-table
      :caption="t('orders.title')"
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
      @pagination-current-page-change="page = $event"
      @pagination-limit-change="limit = $event"
      @search-value-change="term = $event"
      @sort-change="onSortChange"
      @open-details="openOrder"
      @item-delete="deleteOrder"
    >
      <template #column-orderNumber="{ data }">
        <span class="cluster">
          <mt-link :to="{ name: 'order-detail', params: { id: data.id } }">
            {{ data.orderNumber }}
          </mt-link>

          <mt-tooltip
            v-if="data.customerComment"
            :content="data.customerComment"
          >
            <template #default="params">
              <mt-button
                v-bind="params"
                variant="tertiary"
                size="x-small"
                square
                :aria-label="t('orders.customerComment')"
              >
                <mt-icon name="regular-comment" size="var(--scale-size-12)" />
              </mt-button>
            </template>
          </mt-tooltip>
        </span>
      </template>

      <template #[addressSlot]="{ data }">
        <mt-text size="xs">
          {{ data.shippingAddress.street }},
          {{ data.shippingAddress.zipcode }}
          {{ data.shippingAddress.city }}
        </mt-text>
      </template>

      <template #column-amountTotal="{ data }">
        <mt-text size="xs">{{ format.currency(data.amountTotal) }}</mt-text>
      </template>

      <template #column-state="{ data }">
        <order-status machine="order" :state="data.state" />
      </template>

      <template #column-paymentState="{ data }">
        <order-status machine="payment" :state="data.paymentState" />
      </template>

      <template #column-deliveryState="{ data }">
        <order-status machine="delivery" :state="data.deliveryState" />
      </template>

      <template #column-orderDateTime="{ data }">
        <mt-text size="xs">{{
          format.relativeTime(data.orderDateTime)
        }}</mt-text>
      </template>

      <template #empty-state>
        <mt-empty-state
          icon="regular-shopping-bag"
          :headline="
            isFiltered
              ? t('orders.empty.filteredHeadline')
              : t('orders.empty.headline')
          "
          :description="
            isFiltered
              ? t('orders.empty.filteredDescription')
              : t('orders.empty.description')
          "
        />
      </template>
    </mt-data-table>
  </mt-page>
</template>
