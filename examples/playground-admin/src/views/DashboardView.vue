<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtCard,
  MtChart,
  MtHelpText,
  MtPage,
  MtText,
  type ChartOptions,
} from "@shopware-ag/meteor-component-library";
import type { OrderStatistics } from "../../shared/types";
import { orderStatistics } from "../../server/repository";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useCurrentUser } from "../composables/useCurrentUser";
import { useFormat } from "../composables/useFormat";
import { useRequest } from "../composables/useRequest";

const { t } = useI18n();
const format = useFormat();
const { request } = useRequest();
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

const isLoading = ref(true);
const statistics = shallowRef<OrderStatistics | null>(null);
async function load() {
  statistics.value = await request(() => orderStatistics(30));
  isLoading.value = false;
}

load();

/** The last 30 days, which both charts show. */
const days = computed(() => statistics.value?.days.slice(-30) ?? []);

// About six evenly spaced, horizontal date labels instead of one per day. The days are local
// dates, so they are read as local midnight.
const xaxis = computed(() => {
  const labels = days.value.map((day) => format.shortDate(`${day.date}T00:00:00`));

  return {
    categories: labels,
    tickAmount: Math.min(6, Math.max(labels.length - 1, 1)),
    labels: { rotate: 0 },
  };
});

const ordersSeries = computed(() => [
  {
    name: t("dashboard.ordersSeries"),
    data: days.value.map((day) => day.orders),
  },
]);

const turnoverSeries = computed(() => [
  {
    name: t("dashboard.turnoverSeries"),
    data: days.value.map((day) => Math.round(day.turnover * 100) / 100),
  },
]);

const ordersOptions = computed<ChartOptions>(() => ({
  stroke: { curve: "smooth" },
  xaxis: xaxis.value,
  yaxis: {
    labels: { formatter: (value: number) => format.number(Math.round(value)) },
  },
}));

const turnoverOptions = computed<ChartOptions>(() => ({
  stroke: { curve: "smooth" },
  xaxis: xaxis.value,
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
          <!-- Placeholder lines where the help links would be. -->
          <div class="dashboard__lines" aria-hidden="true">
            <span class="skeleton-line" style="width: 45%" />
            <span class="skeleton-line" style="width: 60%" />
            <span class="skeleton-line" style="width: 50%" />
          </div>
        </mt-card>

        <mt-card :title="t('dashboard.feedback.title')">
          <div class="stack">
            <!-- Placeholder lines where the text would be. -->
            <div class="dashboard__lines" aria-hidden="true">
              <span class="skeleton-line" style="width: 90%" />
              <span class="skeleton-line" style="width: 65%" />
            </div>
            <!-- Placeholder where the feedback button would be. -->
            <span class="skeleton-line dashboard__button" aria-hidden="true" />
          </div>
        </mt-card>
      </div>

      <mt-card
        :title="t('dashboard.ordersChart')"
        :is-loading="isLoading"
      >
        <!-- Placeholders where the date range and the range select would be. -->
        <template #subtitle>
          <span class="skeleton-line dashboard__subtitle" aria-hidden="true" />
        </template>

        <template #headerRight>
          <span class="skeleton-line dashboard__range" aria-hidden="true" />
        </template>

        <mt-chart
          v-if="statistics"
          :series="ordersSeries"
          :options="ordersOptions"
        />
      </mt-card>

      <mt-card
        :title="t('dashboard.turnoverChart')"
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

        <template #subtitle>
          <span class="skeleton-line dashboard__subtitle" aria-hidden="true" />
        </template>

        <template #headerRight>
          <span class="skeleton-line dashboard__range" aria-hidden="true" />
        </template>

        <mt-chart
          v-if="statistics"
          :series="turnoverSeries"
          :options="turnoverOptions"
        />
      </mt-card>
    </div>
  </mt-page>
</template>

<style scoped>
.dashboard__subtitle {
  width: 7rem;
  margin-block-start: var(--scale-size-8);
}

.dashboard__range {
  width: 12.75rem;
  height: var(--scale-size-32);
}

.dashboard__button {
  width: 8rem;
  height: var(--scale-size-32);
}

.dashboard__lines {
  display: grid;
  gap: var(--scale-size-12);
}

.dashboard {
  gap: var(--scale-size-24);
}

.dashboard__welcome {
  display: grid;
  gap: var(--scale-size-4);
  padding-block: var(--scale-size-8);
}






</style>
