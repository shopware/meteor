<script setup lang="ts">
import { computed, ref, shallowRef, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtCard,
  MtChart,
  MtHelpText,
  MtIcon,
  MtPage,
  MtSelect,
  MtText,
  type ChartOptions,
} from "@shopware-ag/meteor-component-library";
import type { Order, OrderStatistics } from "../../shared/types";
import { orderStatistics } from "../../server/repository";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useCurrentUser } from "../composables/useCurrentUser";
import { useFormat } from "../composables/useFormat";
import { useRepository } from "../composables/useRepository";
import { useRequest } from "../composables/useRequest";

const { t } = useI18n();
const format = useFormat();
const { request } = useRequest();
const orderRepository = useRepository("order");
const user = useCurrentUser();

/** The part of the day, which picks the greeting and its subline, as in the Administration. */
const daytime = computed(() => {
  const hour = new Date().getHours();

  if (hour >= 23 || hour < 5) return "night";
  if (hour < 11) return "morning";
  if (hour < 18) return "day";

  return "evening";
});

const greeting = computed(() =>
  t(`dashboard.greeting.${daytime.value}`, { name: user.firstName }),
);


const breadcrumb = useBreadcrumb(() => t("nav.dashboard"));

/** The help links of the "Get ready to sell" card. */
const getReadyLinks = ["helpCenter", "firstSale", "salesChannels"] as const;

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

const orderColumns = computed<GridColumn[]>(() => [
  { key: "orderNumber", label: t("dashboard.columns.orderNumber") },
  { key: "orderDateTime", label: t("dashboard.columns.time") },
  { key: "customerName", label: t("dashboard.columns.customer") },
  { key: "state", label: t("dashboard.columns.state") },
  { key: "amountTotal", label: t("dashboard.columns.total"), align: "end" },
]);

const today = computed(() =>
  format.shortDate(new Date().toISOString()),
);

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
    name: t("dashboard.ordersSeries"),
    data: ordersDays.value.map((day) => day.orders),
  },
]);

const turnoverSeries = computed(() => [
  {
    name: t("dashboard.turnoverSeries"),
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
  <mt-page width="m" :breadcrumb="breadcrumb">
    <template #actions>
      <app-header-actions />
    </template>

    <div class="stack dashboard">
      <header class="dashboard__welcome">
        <mt-text as="h2" size="2xl" weight="semibold">{{ greeting }}</mt-text>
        <mt-text size="s" color="color-text-secondary-default">
          {{ t(`dashboard.subline.${daytime}`) }}
        </mt-text>
      </header>

      <div class="grid" style="--grid-min: 18rem">
        <mt-card :title="t('dashboard.getReady.title')">
          <ul class="dashboard__links">
            <li v-for="entry in getReadyLinks" :key="entry">
              <a
                class="dashboard__link"
                href="https://docs.shopware.com/en"
                target="_blank"
                rel="noopener"
              >
                {{ t(`dashboard.getReady.${entry}`) }}
                <mt-icon
                  name="regular-external-link-s"
                  size="var(--scale-size-12)"
                  decorative
                />
              </a>
            </li>
          </ul>
        </mt-card>

        <mt-card :title="t('dashboard.feedback.title')">
          <div class="stack">
            <mt-text size="xs" color="color-text-secondary-default">
              {{ t("dashboard.feedback.text") }}
            </mt-text>
            <div>
              <mt-button variant="secondary" size="small">
                {{ t("dashboard.feedback.button") }}
                <template #iconBack>
                  <mt-icon
                    name="regular-external-link-s"
                    size="var(--scale-size-12)"
                    decorative
                  />
                </template>
              </mt-button>
            </div>
          </div>
        </mt-card>
      </div>

      <template v-if="isLoading || todaysOrders.length > 0">
        <div class="dashboard__section-title">
          <mt-text as="h2" size="l" weight="semibold">
            {{ t("dashboard.todaysStatistics") }}
          </mt-text>
          <mt-text size="s" color="color-text-secondary-default">
            {{ today }}
          </mt-text>
        </div>

        <mt-card :is-loading="isLoading">
          <template #grid>
            <div class="dashboard__kpis">
              <div>
                <mt-text size="xs" color="color-text-secondary-default">
                  {{ t("dashboard.ordersToday") }}
                </mt-text>
                <mt-text size="2xl" weight="semibold">
                  {{ format.number(statistics?.today.orders ?? 0) }}
                </mt-text>
              </div>
              <div>
                <mt-text size="xs" color="color-text-secondary-default">
                  {{ t("dashboard.totalToday") }}
                </mt-text>
                <mt-text size="2xl" weight="semibold">
                  {{ format.currency(statistics?.today.total ?? 0) }}
                </mt-text>
              </div>
            </div>

            <app-grid
              plain
              :caption="t('dashboard.todaysOrders')"
              :columns="orderColumns"
              :rows="todaysOrders"
              :is-loading="isLoading"
              :skeleton-rows="3"
              actions
            ></app-grid>
          </template>
        </mt-card>
      </template>

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
          type="line"
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
          type="line"
          :series="turnoverSeries"
          :options="turnoverOptions"
        />
      </mt-card>
    </div>
  </mt-page>
</template>

<style scoped>
.dashboard {
  gap: var(--scale-size-24);
}

.dashboard__welcome {
  display: grid;
  gap: var(--scale-size-4);
  padding-block: var(--scale-size-8);
}

.dashboard__links {
  display: grid;
  gap: var(--scale-size-12);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--font-size-xs);
}

.dashboard__link {
  display: inline-flex;
  align-items: center;
  gap: var(--scale-size-4);
  color: var(--color-text-brand-default);
  text-decoration: none;
}

.dashboard__link:hover {
  text-decoration: underline;
}

.dashboard__section-title {
  display: flex;
  align-items: baseline;
  gap: var(--scale-size-12);
  margin-block-start: var(--scale-size-8);
}

.dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--scale-size-24);
  padding: var(--scale-size-24);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.dashboard__kpis > div {
  display: grid;
  gap: var(--scale-size-4);
}
</style>
