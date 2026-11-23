<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
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
  MtText,
  MtTooltip,
  useSnackbar,
  type MtDataTableNextColumn,
} from "@shopware-ag/meteor-component-library";
import type { Order } from "../../shared/types";
import OrderStatus from "../components/OrderStatus.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useConfirm } from "../composables/useConfirm";
import { useFormat } from "../composables/useFormat";
import { useListing } from "../composables/useListing";
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
  term,
  sorting,
  pagination,
  filterValues,
  isFiltered,
  load,
} = useListing("order", { sortBy: "orderDateTime", sortDirection: "DESC" });

const columns = computed<MtDataTableNextColumn<Order>[]>(() => [
  { accessorKey: "orderNumber", header: t("orders.columns.orderNumber") },
  { accessorKey: "customerName", header: t("orders.columns.customer") },
  {
    accessorKey: "amountTotal",
    header: t("orders.columns.total"),
    meta: { align: "end" },
  },
  { accessorKey: "state", header: t("orders.columns.state") },
  { accessorKey: "paymentState", header: t("orders.columns.paymentState") },
  { accessorKey: "deliveryState", header: t("orders.columns.deliveryState") },
  { accessorKey: "orderDateTime", header: t("orders.columns.orderDate") },
  { id: "actions", header: t("common.actions"), enableSorting: false },
]);

const filters = computed(() =>
  (
    [
      ["state", "order"],
      ["paymentState", "payment"],
      ["deliveryState", "delivery"],
    ] as [string, StateMachine][]
  ).map(([property, machine]) => ({
    id: property,
    label: t(`orders.columns.${property}`),
    options: states.options(machine),
  })),
);

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
    <div class="stack">
      <div class="grid" style="--grid-min: 12rem">
        <mt-search v-model="term" size="small" />

        <mt-select
          v-for="filter in filters"
          :key="filter.id"
          v-model="filterValues[filter.id]"
          :options="filter.options"
          :placeholder="filter.label"
          :aria-label="filter.label"
          enable-multi-selection
          small
        />
      </div>

      <mt-data-table-next
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        manual
        :aria-label="t('orders.title')"
        :data="items"
        :columns="columns"
        :row-count="total"
        :loading="isLoading"
      >
        <template #cell-orderNumber="{ row }">
          <span class="cluster">
            <mt-link
              :to="{ name: 'order-detail', params: { id: row.original.id } }"
            >
              {{ row.original.orderNumber }}
            </mt-link>

            <mt-tooltip
              v-if="row.original.customerComment"
              :content="row.original.customerComment"
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

        <template #cell-amountTotal="{ row }">
          {{ format.currency(row.original.amountTotal) }}
        </template>

        <template #cell-state="{ row }">
          <order-status machine="order" :state="row.original.state" />
        </template>

        <template #cell-paymentState="{ row }">
          <order-status machine="payment" :state="row.original.paymentState" />
        </template>

        <template #cell-deliveryState="{ row }">
          <order-status
            machine="delivery"
            :state="row.original.deliveryState"
          />
        </template>

        <template #cell-orderDateTime="{ row }">
          <mt-text size="xs">
            {{ format.relativeTime(row.original.orderDateTime) }}
          </mt-text>
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
                :aria-label="
                  t('common.rowActions', { name: row.original.orderNumber })
                "
              >
                <mt-icon name="regular-ellipsis-h-s" size="var(--scale-size-12)" />
              </mt-button>
            </mt-dropdown-menu-trigger>

            <mt-dropdown-menu-portal>
              <mt-action-menu>
                <mt-action-menu-item
                  icon="pencil-s"
                  @select="openOrder(row.original)"
                >
                  {{ t("common.edit") }}
                </mt-action-menu-item>
                <mt-action-menu-item
                  icon="trash"
                  variant="critical"
                  @select="deleteOrder(row.original)"
                >
                  {{ t("common.delete") }}
                </mt-action-menu-item>
              </mt-action-menu>
            </mt-dropdown-menu-portal>
          </mt-dropdown-menu-root>
        </template>

        <template #empty>
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
      </mt-data-table-next>
    </div>
  </mt-page>
</template>
