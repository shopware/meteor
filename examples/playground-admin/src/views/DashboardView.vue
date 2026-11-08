<script setup lang="ts">
import { computed, ref, shallowRef, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtCard,
  MtChart,
  MtDataTable,
  MtEmptyState,
  MtHelpText,
  MtPage,
  MtSelect,
  MtText,
  type ChartOptions,
} from "@shopware-ag/meteor-component-library";
import type { Order, OrderStatistics } from "../../shared/types";
import { orderStatistics } from "../../server/repository";
import OrderStatus from "../components/OrderStatus.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useCurrentUser } from "../composables/useCurrentUser";
import { useFormat } from "../composables/useFormat";
import type { DataTableColumn } from "../composables/useListing";
import { useRepository } from "../composables/useRepository";
import { useRequest } from "../composables/useRequest";

const { t } = useI18n();
const router = useRouter();
const format = useFormat();
const { request } = useRequest();
const orderRepository = useRepository("order");
const user = useCurrentUser();

const greeting = computed(() => {
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return t(`dashboard.greeting.${time}`, { name: user.firstName });
});

const breadcrumb = useBreadcrumb(() => greeting.value);

const isLoading = ref(true);
const statistics = shallowRef<OrderStatistics | null>(null);
const todaysOrders = shallowRef<Order[]>([]);

async function load() {
  const [loadedStatistics, latestOrders] = await Promise.all([
    request(() => orderStatistics(30)),
    orderRepository.search({
      page: 1,
      limit: 10,
      sortBy: "orderDateTime",
      sortDirection: "DESC",
    }),
  ]);

  const today = new Date().toDateString();

  statistics.value = loadedStatistics;
  todaysOrders.value = latestOrders.data.filter(
    (order) => new Date(order.orderDateTime).toDateString() === today,
  );
  isLoading.value = false;
}

load();

const orderColumns = computed<DataTableColumn[]>(() => [
  {
    label: t("dashboard.columns.orderNumber"),
    property: "orderNumber",
    renderer: "text",
    position: 100,
    clickable: true,
    sortable: false,
  },
  {
    label: t("dashboard.columns.time"),
    property: "orderDateTime",
    renderer: "text",
    position: 200,
    sortable: false,
  },
  {
    label: t("dashboard.columns.customer"),
    property: "customerName",
    renderer: "text",
    position: 300,
    sortable: false,
  },
  {
    label: t("dashboard.columns.state"),
    property: "state",
    renderer: "text",
    position: 400,
    sortable: false,
  },
  {
    label: t("dashboard.columns.total"),
    property: "amountTotal",
    renderer: "number",
    position: 500,
    sortable: false,
  },
]);

function openOrder(order: Order) {
  router.push({ name: "order-detail", params: { id: order.id } });
}

const rangeOptions = computed(() =>
  [30, 14, 7].map((days) => ({
    value: days,
    label: t("dashboard.ranges.days", { n: days }),
  })),
);

/** The days of one chart card's range, its subtitle and its x-axis. */
function createChartRange(range: Ref<number>) {
  const days = computed(() => statistics.value?.days.slice(-range.value) ?? []);

  // The days are local dates, so they are read as local midnight.
  const labels = computed(() =>
    days.value.map((day) => format.shortDate(`${day.date}T00:00:00`)),
  );

  const subtitle = computed(() =>
    labels.value.length > 0
      ? `${labels.value[0]} – ${labels.value[labels.value.length - 1]}`
      : "",
  );

  // About six evenly spaced, horizontal labels instead of one per day.
  const xaxis = computed(() => ({
    categories: labels.value,
    tickAmount: Math.min(6, Math.max(labels.value.length - 1, 1)),
    labels: { rotate: 0 },
  }));

  return { days, subtitle, xaxis };
}

const ordersRange = ref(30);
const turnoverRange = ref(30);

const {
  days: ordersDays,
  subtitle: ordersSubtitle,
  xaxis: ordersAxis,
} = createChartRange(ordersRange);

const {
  days: turnoverDays,
  subtitle: turnoverSubtitle,
  xaxis: turnoverAxis,
} = createChartRange(turnoverRange);

const ordersSeries = computed(() => [
  {
    name: t("dashboard.ordersChart"),
    data: ordersDays.value.map((day) => day.orders),
  },
]);

const turnoverSeries = computed(() => [
  {
    name: t("dashboard.turnoverChart"),
    data: turnoverDays.value.map((day) => Math.round(day.turnover * 100) / 100),
  },
]);

const ordersOptions = computed<ChartOptions>(() => ({
  xaxis: ordersAxis.value,
  yaxis: {
    labels: { formatter: (value: number) => format.number(Math.round(value)) },
  },
}));

const turnoverOptions = computed<ChartOptions>(() => ({
  xaxis: turnoverAxis.value,
  yaxis: { labels: { formatter: (value: number) => format.currency(value) } },
}));
</script>

<template>
  <mt-page width="l" :breadcrumb="breadcrumb">
    <div class="stack">
      <div class="grid" style="--grid-min: 20rem">
        <mt-card :title="t('dashboard.ordersToday')" :is-loading="isLoading">
          <mt-text size="2xl" weight="semibold">
            {{ format.number(statistics?.today.orders ?? 0) }}
          </mt-text>
        </mt-card>

        <mt-card :title="t('dashboard.totalToday')" :is-loading="isLoading">
          <mt-text size="2xl" weight="semibold">
            {{ format.currency(statistics?.today.total ?? 0) }}
          </mt-text>
        </mt-card>
      </div>

      <mt-data-table
        :title="t('dashboard.todaysOrders')"
        :caption="t('dashboard.todaysOrders')"
        layout="full"
        :data-source="todaysOrders"
        :columns="orderColumns"
        :is-loading="isLoading"
        :current-page="1"
        :pagination-limit="10"
        :pagination-options="[10]"
        :pagination-total-items="todaysOrders.length"
        disable-search
        disable-settings-table
        disable-delete
        @open-details="openOrder"
      >
        <template #column-orderDateTime="{ data }">
          <mt-text size="xs">{{ format.time(data.orderDateTime) }}</mt-text>
        </template>

        <template #column-state="{ data }">
          <order-status machine="order" :state="data.state" />
        </template>

        <template #column-amountTotal="{ data }">
          <mt-text size="xs">{{ format.currency(data.amountTotal) }}</mt-text>
        </template>

        <template #empty-state>
          <mt-empty-state
            icon="regular-shopping-bag"
            :headline="t('dashboard.noOrders')"
            :description="t('dashboard.noOrdersDescription')"
          />
        </template>
      </mt-data-table>

      <div class="grid" style="--grid-min: 20rem">
        <mt-card
          :title="t('dashboard.ordersChart')"
          :subtitle="ordersSubtitle"
          :is-loading="isLoading"
        >
          <template #headerRight>
            <mt-select
              v-model="ordersRange"
              :aria-label="t('dashboard.range')"
              :options="rangeOptions"
              :enable-search="false"
              hide-clearable-button
              small
            />
          </template>

          <mt-chart
            v-if="statistics"
            :series="ordersSeries"
            :options="ordersOptions"
          />
        </mt-card>

        <mt-card
          :title="t('dashboard.turnoverChart')"
          :subtitle="turnoverSubtitle"
          :is-loading="isLoading"
        >
          <template #title>
            <div class="cluster">
              <mt-text as="h3" size="m" weight="semibold">
                {{ t("dashboard.turnoverChart") }}
              </mt-text>
              <mt-help-text :text="t('dashboard.turnoverHelp')" />
            </div>
          </template>

          <template #headerRight>
            <mt-select
              v-model="turnoverRange"
              :aria-label="t('dashboard.range')"
              :options="rangeOptions"
              :enable-search="false"
              hide-clearable-button
              small
            />
          </template>

          <mt-chart
            v-if="statistics"
            :series="turnoverSeries"
            :options="turnoverOptions"
          />
        </mt-card>
      </div>
    </div>
  </mt-page>
</template>
