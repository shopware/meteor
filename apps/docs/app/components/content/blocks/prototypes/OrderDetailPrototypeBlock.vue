<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtBadge,
  MtButton,
  MtCard,
  MtContentHeader,
  MtDataTable,
  MtIcon,
  MtLayout,
  MtLink,
  MtPage,
  MtSelect,
  MtText,
  MtUser,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

const breadcrumb: BreadcrumbItem[] = [
  { label: "Orders", to: "/orders", icon: "shopping-bag" },
  { label: "Order 10482" },
];

// Sample data. Replace it with the order your page loads.
const items = [
  { id: "1", product: "Running shoe Aero", number: "SW-10042", quantity: "1", price: "€129.95", total: "€129.95" },
  { id: "2", product: "Merino base layer", number: "SW-10318", quantity: "2", price: "€59.90", total: "€119.80" },
  { id: "3", product: "Hiking socks, 3 pack", number: "SW-10511", quantity: "1", price: "€19.95", total: "€19.95" },
];

const columns = [
  { label: "Product", property: "product", renderer: "text" as const, position: 0, width: 220 },
  { label: "Product number", property: "number", renderer: "text" as const, position: 100 },
  { label: "Quantity", property: "quantity", renderer: "text" as const, position: 200, width: 110 },
  { label: "Unit price", property: "price", renderer: "text" as const, position: 300 },
  { label: "Total", property: "total", renderer: "text" as const, position: 400 },
];

const summary = [
  { label: "Subtotal", value: "€269.70" },
  { label: "Shipping", value: "€4.95" },
  { label: "Tax (19%, included)", value: "€43.06" },
];

const orderStatus = ref("in-progress");
const paymentStatus = ref("paid");
const deliveryStatus = ref("open");

const orderOptions = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];
const paymentOptions = [
  { value: "open", label: "Open" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];
const deliveryOptions = [
  { value: "open", label: "Open" },
  { value: "shipped", label: "Shipped" },
  { value: "returned", label: "Returned" },
];

const history = ref([
  { status: "Payment received", detail: "PayPal, €274.65", when: "Nov 24, 9:12" },
  { status: "Order placed", detail: "Storefront, by Anna Schmidt", when: "Nov 24, 9:10" },
]);

const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

const isShipped = computed(() => deliveryStatus.value === "shipped");

const { addSnackbar } = useSnackbar();

// Replace it with the request that ships the order.
function ship() {
  deliveryStatus.value = "shipped";
  history.value.unshift({ status: "Shipped", detail: "DHL, tracking 00340434161094", when: "Just now" });
  addSnackbar({ message: "Order marked as shipped" });
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <placeholder-slot name="App: navigation" style="width: 280px" />
    </template>

    <!-- The page: copy it into a route of your application, without the shell around it. -->
    <mt-page width="l" :breadcrumb="breadcrumb">
      <template #actions>
        <mt-button variant="secondary" size="default" @click="addSnackbar({ message: 'Invoice would print' })">
          <template #iconFront>
            <mt-icon name="regular-printer" size="var(--scale-size-16)" decorative />
          </template>
          Print invoice
        </mt-button>
        <mt-button variant="primary" size="default" :disabled="isShipped" @click="ship">
          Mark as shipped
        </mt-button>
      </template>

      <div class="stack">
        <mt-content-header title="Order 10482">
          <div class="meta">
            <mt-badge :variant="paymentStatus === 'paid' ? 'positive' : 'attention'">
              Payment: {{ labelOf(paymentOptions, paymentStatus) }}
            </mt-badge>
            <mt-badge :variant="isShipped ? 'positive' : 'info'">
              Delivery: {{ labelOf(deliveryOptions, deliveryStatus) }}
            </mt-badge>
            <mt-text size="xs" color="color-text-secondary-default" as="span">
              Placed on Nov 24, 2026 in Storefront
            </mt-text>
          </div>
        </mt-content-header>

        <mt-layout>
          <mt-data-table
            title="Line items"
            layout="full"
            caption="Line items"
            :data-source="items"
            :columns="columns"
            :current-page="1"
            :pagination-limit="10"
            :pagination-total-items="items.length"
            disable-search
            disable-edit
            disable-delete
            disable-settings-table
          />

          <missing-feature title="Compact table" kind="prop" inline>
            Data Table always shows its pagination footer, also for three line items.
          </missing-feature>

          <mt-card title="Summary">
            <missing-feature title="Price summary">
              No component lists the parts of a price with their amounts and the total below a
              line. The rows stand in for it.

              <template #stand-in>
                <dl class="summary">
                  <template v-for="row in summary" :key="row.label">
                    <mt-text as="dt" size="xs" color="color-text-secondary-default">
                      {{ row.label }}
                    </mt-text>
                    <mt-text as="dd" size="xs">{{ row.value }}</mt-text>
                  </template>
                  <mt-text as="dt" size="s" weight="semibold" class="summary__total">Total</mt-text>
                  <mt-text as="dd" size="s" weight="semibold" class="summary__total">
                    €274.65
                  </mt-text>
                </dl>
              </template>
            </missing-feature>
          </mt-card>

          <mt-card title="History">
            <missing-feature title="Timeline">
              No component shows the events of a record in order, with a marker for each. The
              entries stand in for it.

              <template #stand-in>
                <ol class="timeline">
                  <li v-for="entry in history" :key="entry.status + entry.when" class="timeline__entry">
                    <mt-text size="xs" weight="semibold" as="span">{{ entry.status }}</mt-text>
                    <mt-text size="xs" color="color-text-secondary-default" as="span">
                      {{ entry.detail }}
                    </mt-text>
                    <mt-text size="2xs" color="color-text-secondary-default" as="span">
                      {{ entry.when }}
                    </mt-text>
                  </li>
                </ol>
              </template>
            </missing-feature>
          </mt-card>

          <template #end>
            <mt-card title="Status">
              <div class="stack">
                <mt-select
                  v-model="orderStatus"
                  label="Order"
                  :options="orderOptions"
                  :enable-search="false"
                  hide-clearable-button
                />
                <mt-select
                  v-model="paymentStatus"
                  label="Payment"
                  :options="paymentOptions"
                  :enable-search="false"
                  hide-clearable-button
                />
                <mt-select
                  v-model="deliveryStatus"
                  label="Delivery"
                  :options="deliveryOptions"
                  :enable-search="false"
                  hide-clearable-button
                />
              </div>
            </mt-card>

            <mt-card title="Customer">
              <div class="stack">
                <mt-user name="Anna Schmidt" subtitle="anna.schmidt@example.com" />
                <mt-link to="/customers/1">View customer</mt-link>
              </div>
            </mt-card>

            <mt-card title="Shipping address">
              <address class="address">
                <mt-text size="xs" as="span">Anna Schmidt</mt-text>
                <mt-text size="xs" as="span">Torstraße 12</mt-text>
                <mt-text size="xs" as="span">10119 Berlin</mt-text>
                <mt-text size="xs" as="span">Germany</mt-text>
              </address>
            </mt-card>
          </template>
        </mt-layout>
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

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-8);
}

.summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--scale-size-8) var(--scale-size-16);
  margin: 0;
}

.summary dd {
  margin: 0;
  text-align: end;
}

.summary__total {
  padding-block-start: var(--scale-size-8);
  border-block-start: 1px solid var(--color-border-secondary-default);
}

.timeline {
  display: grid;
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__entry {
  position: relative;
  display: grid;
  gap: var(--scale-size-2);
  padding-inline-start: var(--scale-size-24);
}

.timeline__entry::before {
  position: absolute;
  inset-block-start: var(--scale-size-4);
  inset-inline-start: var(--scale-size-4);
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  content: "";
  background-color: var(--color-interaction-primary-default);
  border-radius: 50%;
}

.timeline__entry:not(:last-child)::after {
  position: absolute;
  inset-block: var(--scale-size-16) calc(var(--scale-size-16) * -1);
  inset-inline-start: calc(var(--scale-size-8) - 0.5px);
  width: 1px;
  content: "";
  background-color: var(--color-border-secondary-default);
}

.address {
  display: grid;
  font-style: normal;
}
</style>
