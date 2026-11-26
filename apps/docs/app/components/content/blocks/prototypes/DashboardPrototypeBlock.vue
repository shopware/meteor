<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtBadge,
  MtCard,
  MtChart,
  MtContentHeader,
  MtDataTable,
  MtPage,
  MtProgressBar,
  MtSelect,
  MtText,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];

// Sample data. Replace it with the figures of the selected period.
const kpis = [
  { label: "Revenue", value: "€48,290", change: "+12.4%", up: true },
  { label: "Orders", value: "1,284", change: "+8.1%", up: true },
  { label: "Average order value", value: "€37.61", change: "+3.9%", up: true },
  { label: "Returns", value: "2.3%", change: "-0.4%", up: false },
];

const period = ref("8-months");
const periodOptions = [
  { value: "7-days", label: "Last 7 days" },
  { value: "30-days", label: "Last 30 days" },
  { value: "8-months", label: "Last 8 months" },
];

const revenue = [
  { name: "Revenue", data: [31200, 35800, 33400, 39100, 41700, 40200, 44900, 48290] },
];

const chartOptions = {
  xaxis: { categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"] },
  yaxis: { labels: { formatter: (value: number) => `€${Math.round(value / 1000)}k` } },
};

const topProducts = [
  { name: "Running shoe Aero", share: 34 },
  { name: "Trail jacket Nordwand", share: 22 },
  { name: "Merino base layer", share: 17 },
  { name: "Hiking socks, 3 pack", share: 11 },
];

const orders = [
  { id: "10482", number: "10482", customer: "Anna Schmidt", date: "Nov 24", status: "Paid", total: "€129.95" },
  { id: "10481", number: "10481", customer: "Jonas Becker", date: "Nov 24", status: "Open", total: "€64.00" },
  { id: "10480", number: "10480", customer: "Lea Hoffmann", date: "Nov 23", status: "Paid", total: "€219.40" },
  { id: "10479", number: "10479", customer: "Paul Wagner", date: "Nov 23", status: "Cancelled", total: "€39.90" },
  { id: "10478", number: "10478", customer: "Mia Schulz", date: "Nov 22", status: "Paid", total: "€89.00" },
  { id: "10477", number: "10477", customer: "Felix Koch", date: "Nov 22", status: "Open", total: "€154.20" },
  { id: "10476", number: "10476", customer: "Emma Richter", date: "Nov 21", status: "Paid", total: "€72.50" },
  { id: "10475", number: "10475", customer: "Leon Klein", date: "Nov 21", status: "Paid", total: "€310.00" },
];

const statusVariants = {
  Paid: "positive",
  Open: "warning",
  Cancelled: "critical",
} as const;

const columns = [
  { label: "Order", property: "number", renderer: "text" as const, position: 0 },
  { label: "Customer", property: "customer", renderer: "text" as const, position: 100 },
  { label: "Date", property: "date", renderer: "text" as const, position: 200 },
  {
    label: "Status",
    property: "status",
    renderer: "badge" as const,
    position: 300,
    rendererOptions: {
      renderItemBadge: (data: (typeof orders)[number]) => ({
        label: data.status,
        variant: statusVariants[data.status as keyof typeof statusVariants],
      }),
    },
  },
  { label: "Total", property: "total", renderer: "text" as const, position: 400 },
];

const currentPage = ref(1);
const limit = ref(5);
const pagedOrders = computed(() =>
  orders.slice((currentPage.value - 1) * limit.value, currentPage.value * limit.value),
);
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page width="l" :breadcrumb="breadcrumb">
      <div class="stack">
        <mt-content-header title="Dashboard">
          <template #actions>
            <mt-select
              v-model="period"
              :options="periodOptions"
              :enable-search="false"
              hide-clearable-button
              small
              aria-label="Period"
            />
          </template>

          <missing-feature title="Segmented control" inline>
            A segmented control for the period exists inside Data Table but is not exported, so the
            period is a select.
          </missing-feature>
        </mt-content-header>

        <missing-feature title="Stat tile">
          No component shows a key figure with its change and a sparkline. The tiles below are
          built from Card, Text and Badge, without the sparkline.
        </missing-feature>

        <div class="kpis">
          <mt-card v-for="kpi in kpis" :key="kpi.label" :title="kpi.label">
            <div class="kpi">
              <mt-text size="2xl" weight="semibold" as="p">{{ kpi.value }}</mt-text>
              <mt-badge :variant="kpi.up ? 'positive' : 'critical'" size="s">
                {{ kpi.change }}
              </mt-badge>
            </div>
          </mt-card>
        </div>

        <div class="charts">
          <mt-card title="Revenue" subtitle="Gross revenue per month">
            <mt-chart type="area" :series="revenue" :options="chartOptions" :height="280" />

            <missing-feature title="Chart theming" kind="prop" inline>
              Only the area chart has Meteor styling. Other chart types and further series fall
              back to the colors of ApexCharts.
            </missing-feature>
          </mt-card>

          <mt-card title="Top products" subtitle="Share of revenue">
            <div class="stack">
              <mt-progress-bar
                v-for="product in topProducts"
                :key="product.name"
                :model-value="product.share"
                :max-value="100"
                :label="product.name"
              />
            </div>
          </mt-card>
        </div>

        <mt-data-table
          title="Recent orders"
          layout="full"
          caption="Recent orders"
          :data-source="pagedOrders"
          :columns="columns"
          :current-page="currentPage"
          :pagination-limit="limit"
          :pagination-total-items="orders.length"
          :pagination-options="[5, 10]"
          disable-search
          disable-edit
          disable-delete
          disable-settings-table
          @pagination-current-page-change="currentPage = $event"
          @pagination-limit-change="
            (value: number) => {
              limit = value;
              currentPage = 1;
            }
          "
        />

        <missing-feature title="Compact table" kind="prop">
          Data Table always shows its pagination footer and items-per-page select. A short list of
          recent orders with a "View all" link has no compact mode.
        </missing-feature>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--scale-size-16);
}

.kpi {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--scale-size-8);
}

.kpi > p {
  margin: 0;
}

.charts {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  gap: var(--scale-size-16);
}

@media (width < 960px) {
  .charts {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
