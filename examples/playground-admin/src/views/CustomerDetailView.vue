<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtAvatar,
  MtBadge,
  MtButton,
  MtCard,
  MtEmptyState,
  MtLink,
  MtPage,
  MtSkeletonBar,
  MtTabs,
  MtText,
} from "@shopware-ag/meteor-component-library";
import type { Address, CustomerAccount, Order } from "../../shared/types";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useFormat } from "../composables/useFormat";
import { useRepository } from "../composables/useRepository";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const format = useFormat();
const customerRepository = useRepository("customer");
const orderRepository = useRepository("order");

const customer = shallowRef<CustomerAccount | null>(null);
const orders = shallowRef<Order[]>([]);
const isLoading = ref(true);
const activeTab = ref("general");

watch(
  () => route.params.id as string,
  async (id) => {
    if (!id) return;

    isLoading.value = true;
    activeTab.value = "general";

    const [loaded, customerOrders] = await Promise.all([
      customerRepository.get(id),
      orderRepository.search({
        page: 1,
        limit: 100,
        sortBy: "orderDateTime",
        sortDirection: "DESC",
        filters: { "customer.id": [id] },
      }),
    ]);

    customer.value = loaded;
    orders.value = customerOrders.data;
    isLoading.value = false;
  },
  { immediate: true },
);

const fullName = computed(() =>
  customer.value
    ? `${customer.value.firstName} ${customer.value.lastName}`
    : "",
);

const breadcrumb = useBreadcrumb(() => fullName.value);

const tabs = computed(() => [
  { name: "general", label: t("customers.tabs.general") },
  { name: "addresses", label: t("customers.tabs.addresses") },
  { name: "orders", label: t("customers.tabs.orders") },
]);

const orderColumns = computed<GridColumn[]>(() => [
  { key: "orderNumber", label: t("orders.columns.orderNumber") },
  { key: "amountTotal", label: t("orders.columns.total"), align: "end" },
  { key: "state", label: t("orders.columns.state") },
  { key: "paymentState", label: t("orders.columns.paymentState") },
  { key: "orderDateTime", label: t("orders.columns.orderDate") },
]);

function addressLines(address: Address) {
  return [
    address.company,
    `${address.firstName} ${address.lastName}`,
    address.street,
    `${address.zipcode} ${address.city}`,
    address.country,
  ].filter((line): line is string => Boolean(line));
}
</script>

<template>
  <mt-page width="m" :is-loading="isLoading" :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button variant="primary" size="default" :disabled="!customer">
        {{ t("common.edit") }}
      </mt-button>
      <app-header-actions />
    </template>

    <div class="stack">
      <mt-card v-if="isLoading" :title="t('customers.cards.account')">
        <div class="stack">
          <mt-skeleton-bar v-for="row in 4" :key="row" />
        </div>
      </mt-card>

      <mt-empty-state
        v-else-if="!customer"
        icon="regular-users"
        :headline="t('customers.notFound.headline')"
        :description="t('customers.notFound.description')"
      >
        <template #button>
          <mt-button
            variant="secondary"
            size="default"
            @click="router.push({ name: 'customer-list' })"
          >
            {{ t("customers.notFound.back") }}
          </mt-button>
        </template>
      </mt-empty-state>

      <template v-else>
        <mt-tabs
          :items="tabs"
          :default-item="activeTab"
          @new-item-active="activeTab = $event"
        />

        <template v-if="activeTab === 'general'">
          <mt-card :title="t('customers.cards.account')">
            <template #headerRight>
              <mt-button variant="secondary" size="small">
                {{ t("customers.loginAs") }}
              </mt-button>
            </template>

            <div class="stack">
              <div class="customer-detail__identity">
                <mt-avatar
                  size="l"
                  :first-name="customer.firstName"
                  :last-name="customer.lastName"
                />
                <div>
                  <div class="cluster">
                    <mt-text size="m" weight="semibold">{{ fullName }}</mt-text>
                    <mt-badge v-if="customer.guest" variant="neutral">
                      {{ t("customers.guest") }}
                    </mt-badge>
                  </div>
                  <mt-link as="a" :href="`mailto:${customer.email}`">
                    {{ customer.email }}
                  </mt-link>
                </div>
              </div>

              <div class="grid" style="--grid-min: 18rem">
                <dl class="description-list">
                  <template v-if="customer.company">
                    <dt>{{ t("customers.fields.company") }}</dt>
                    <dd>{{ customer.company }}</dd>
                  </template>
                  <dt>{{ t("customers.fields.group") }}</dt>
                  <dd>{{ customer.group }}</dd>
                  <dt>{{ t("customers.fields.status") }}</dt>
                  <dd>
                    {{
                      customer.active ? t("common.active") : t("common.inactive")
                    }}
                  </dd>
                  <dt>{{ t("customers.fields.language") }}</dt>
                  <dd>English</dd>
                  <dt>{{ t("customers.fields.affiliateCode") }}</dt>
                  <dd>-</dd>
                  <dt>{{ t("customers.fields.campaignCode") }}</dt>
                  <dd>-</dd>
                </dl>

                <dl class="description-list">
                  <dt>{{ t("customers.fields.customerNumber") }}</dt>
                  <dd>{{ customer.customerNumber }}</dd>
                  <dt>{{ t("customers.fields.salesChannel") }}</dt>
                  <dd>{{ customer.salesChannel }}</dd>
                  <dt>{{ t("customers.fields.lastLogin") }}</dt>
                  <dd>
                    {{
                      customer.lastLogin
                        ? format.date(customer.lastLogin)
                        : t("customers.noLogin")
                    }}
                  </dd>
                  <dt>{{ t("customers.fields.turnover") }}</dt>
                  <dd>{{ format.currency(customer.turnover) }}</dd>
                  <dt>{{ t("customers.fields.orderCount") }}</dt>
                  <dd>{{ format.number(customer.orderCount) }}</dd>
                  <dt>{{ t("customers.fields.birthday") }}</dt>
                  <dd>{{ t("customers.noInformation") }}</dd>
                </dl>
              </div>
            </div>
          </mt-card>

          <mt-card :title="t('customers.cards.addresses')">
            <div class="grid" style="--grid-min: 14rem">
              <section class="stack">
                <h3 class="card-heading">
                  {{ t("customers.defaultShipping") }}
                </h3>
                <mt-text size="xs">
                  <template
                    v-for="line in addressLines(customer.address)"
                    :key="line"
                  >
                    {{ line }}<br />
                  </template>
                </mt-text>
              </section>
              <section class="stack">
                <h3 class="card-heading">
                  {{ t("customers.defaultBilling") }}
                </h3>
                <mt-text size="xs">
                  <template
                    v-for="line in addressLines(customer.address)"
                    :key="line"
                  >
                    {{ line }}<br />
                  </template>
                </mt-text>
              </section>
            </div>
          </mt-card>
        </template>

        <mt-card
          v-else-if="activeTab === 'addresses'"
          :title="t('customers.cards.addresses')"
        >
          <template #headerRight>
            <mt-button variant="secondary" size="small">
              {{ t("customers.addAddress") }}
            </mt-button>
          </template>

          <div class="grid" style="--grid-min: 14rem">
            <div class="customer-detail__address">
              <div class="cluster">
                <mt-badge variant="info">
                  {{ t("customers.defaultShipping") }}
                </mt-badge>
                <mt-badge variant="info">
                  {{ t("customers.defaultBilling") }}
                </mt-badge>
              </div>
              <mt-text size="xs">
                <template
                  v-for="line in addressLines(customer.address)"
                  :key="line"
                >
                  {{ line }}<br />
                </template>
              </mt-text>
            </div>
          </div>
        </mt-card>

        <mt-card v-else :title="t('customers.cards.orders')">
          <template #grid>
            <app-grid
              plain
              :caption="t('customers.cards.orders')"
              :columns="orderColumns"
              :rows="orders"
            >
              <template #empty>
                <mt-empty-state
                  icon="regular-shopping-bag"
                  :headline="t('customers.noOrders.headline')"
                  :description="t('customers.noOrders.description')"
                />
              </template>
            </app-grid>
          </template>
        </mt-card>
      </template>
    </div>
  </mt-page>
</template>

<style scoped>
.customer-detail__identity {
  display: flex;
  align-items: center;
  gap: var(--scale-size-16);
}

.customer-detail__address {
  display: grid;
  gap: var(--scale-size-12);
  padding: var(--scale-size-16);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}
</style>
