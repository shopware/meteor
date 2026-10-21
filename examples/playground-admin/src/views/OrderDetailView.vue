<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtBadge,
  MtBanner,
  MtButton,
  MtCard,
  MtContentHeader,
  MtDivider,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmptyState,
  MtIcon,
  MtLink,
  MtPage,
  MtSelect,
  MtSkeletonBar,
  MtTabs,
  MtText,
  MtTextarea,
  MtUser,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import type { Address, Order, OrderDocument } from "../../shared/types";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useFormat } from "../composables/useFormat";
import { useOrderStates } from "../composables/useOrderStates";
import { useRepository } from "../composables/useRepository";
import { useDraft } from "../composables/useDraft";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const format = useFormat();
const states = useOrderStates();
const { addSnackbar } = useSnackbar();
const orderRepository = useRepository("order");
const tagRepository = useRepository("tag");

const order = ref<Order | null>(null);
const tagOptions = shallowRef<{ value: string; label: string }[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);

const { isDirty, markSaved, discard } = useDraft(order);

async function load() {
  isLoading.value = true;

  const [loaded, tags] = await Promise.all([
    orderRepository.get(String(route.params.id)),
    tagRepository.search({ page: 1, limit: 100, sortBy: "name" }),
  ]);

  order.value = loaded;
  markSaved();
  tagOptions.value = tags.data.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));
  isLoading.value = false;
}

watch(() => route.params.id, load, { immediate: true });

async function save() {
  if (!order.value) return;

  isSaving.value = true;

  try {
    const saved = await orderRepository.save(order.value);

    order.value = saved;
    markSaved();
    addSnackbar({ message: t("orders.saved"), variant: "success" });
  } finally {
    isSaving.value = false;
  }
}

const title = computed(() =>
  order.value
    ? t("orders.detailTitle", { number: order.value.orderNumber })
    : "",
);

const breadcrumb = useBreadcrumb(() => title.value);

const activeTab = ref("general");

const tabs = computed(() => [
  { name: "general", label: t("orders.tabs.general") },
  { name: "documents", label: t("orders.tabs.documents") },
]);

function addressLines(address: Address) {
  return [
    `${address.firstName} ${address.lastName}`,
    address.company,
    address.street,
    `${address.zipcode} ${address.city}`,
    address.country,
  ].filter((line): line is string => Boolean(line));
}

/** Most orders ship to the billing address, which the panel then doesn't repeat. */
const shipsToBillingAddress = computed(
  () =>
    !!order.value &&
    addressLines(order.value.shippingAddress).join() ===
      addressLines(order.value.billingAddress).join(),
);

function documentName(document: OrderDocument) {
  return t("orders.documents.name", {
    type: t(`orders.documents.types.${document.type}`),
    number: document.number,
  });
}

function toggleSent(document: OrderDocument) {
  document.sent = !document.sent;
}

function removeDocument(document: OrderDocument) {
  if (!order.value) return;

  order.value.documents = order.value.documents.filter(
    (entry) => entry.id !== document.id,
  );
}
</script>

<template>
  <mt-page
    width="m"
    :is-loading="isLoading"
    :breadcrumb="breadcrumb"
    :end-label="t('orders.details.customer')"
  >
    <template #actions>
      <mt-button
        variant="secondary"
        size="default"
        :disabled="!isDirty"
        @click="discard"
      >
        {{ t("common.cancel") }}
      </mt-button>
      <mt-button
        variant="primary"
        size="default"
        :disabled="!isDirty"
        :is-loading="isSaving"
        @click="save"
      >
        {{ t("common.save") }}
      </mt-button>
    </template>

    <div class="stack">
      <mt-card v-if="isLoading" :title="t('orders.info.title')">
        <div class="stack">
          <mt-skeleton-bar v-for="row in 4" :key="row" />
        </div>
      </mt-card>

      <mt-empty-state
        v-else-if="!order"
        icon="regular-shopping-bag"
        :headline="t('orders.notFound.headline')"
        :description="t('orders.notFound.description')"
      >
        <template #button>
          <mt-button
            variant="secondary"
            size="default"
            @click="router.push({ name: 'order-list' })"
          >
            {{ t("orders.notFound.back") }}
          </mt-button>
        </template>
      </mt-empty-state>

      <template v-else>
        <mt-content-header :title="title">
          <div class="cluster">
            <mt-text size="xs" color="color-text-secondary-default">
              {{
                t("orders.info.placed", {
                  time: format.relativeTime(order.orderDateTime),
                  salesChannel: order.salesChannel,
                })
              }}
            </mt-text>
            <mt-text size="xs" weight="semibold">
              {{ format.currency(order.amountTotal) }}
            </mt-text>
          </div>
        </mt-content-header>

        <mt-tabs
          :items="tabs"
          :default-item="activeTab"
          @new-item-active="activeTab = $event"
        />

        <template v-if="activeTab === 'general'">
          <mt-card :title="t('orders.info.title')">
            <div class="grid" style="--grid-min: 10rem">
              <mt-select
                v-model="order.state"
                :label="t('orders.fields.state')"
                :options="states.options('order')"
                :enable-search="false"
                hide-clearable-button
              />
              <mt-select
                v-model="order.paymentState"
                :label="t('orders.fields.paymentState')"
                :options="states.options('payment')"
                :enable-search="false"
                hide-clearable-button
              />
              <mt-select
                v-model="order.deliveryState"
                :label="t('orders.fields.deliveryState')"
                :options="states.options('delivery')"
                :enable-search="false"
                hide-clearable-button
              />
            </div>
          </mt-card>

          <mt-card :title="t('orders.items.title')">
            <div class="stack">
              <ul class="order-detail__items">
                <li v-for="item in order.lineItems" :key="item.id">
                  <div>
                    <mt-link
                      v-if="item.productId"
                      :to="{
                        name: 'product-detail',
                        params: { id: item.productId },
                      }"
                    >
                      {{ item.label }}
                    </mt-link>
                    <mt-text v-else size="xs">{{ item.label }}</mt-text>
                    <mt-text size="xs" color="color-text-secondary-default">
                      {{
                        t("orders.items.details", {
                          number: item.productNumber,
                          rate: format.percent(item.taxRate),
                        })
                      }}
                    </mt-text>
                  </div>
                  <mt-text size="xs" color="color-text-secondary-default">
                    {{
                      t("orders.items.price", {
                        quantity: format.number(item.quantity),
                        price: format.currency(item.unitPrice),
                      })
                    }}
                  </mt-text>
                  <mt-text size="xs">{{
                    format.currency(item.totalPrice)
                  }}</mt-text>
                </li>
              </ul>

              <mt-divider />

              <dl class="order-detail__values">
                <mt-text as="dt" size="xs">{{
                  t("orders.summary.subtotal")
                }}</mt-text>
                <mt-text as="dd" size="xs">{{
                  format.currency(order.positionPrice)
                }}</mt-text>

                <mt-text as="dt" size="xs">{{
                  t("orders.summary.shipping")
                }}</mt-text>
                <mt-text as="dd" size="xs">{{
                  format.currency(order.shippingCosts)
                }}</mt-text>

                <mt-text as="dt" size="xs">{{
                  t("orders.summary.totalNet")
                }}</mt-text>
                <mt-text as="dd" size="xs">{{
                  format.currency(order.amountNet)
                }}</mt-text>

                <template v-for="tax in order.taxes" :key="tax.rate">
                  <mt-text as="dt" size="xs">
                    {{
                      t("orders.summary.tax", {
                        rate: format.percent(tax.rate),
                      })
                    }}
                  </mt-text>
                  <mt-text as="dd" size="xs">{{
                    format.currency(tax.amount)
                  }}</mt-text>
                </template>
              </dl>

              <mt-divider />

              <dl class="order-detail__values">
                <mt-text as="dt" size="xs" weight="semibold">
                  {{ t("orders.summary.total") }}
                </mt-text>
                <mt-text as="dd" size="xs" weight="semibold">
                  {{ format.currency(order.amountTotal) }}
                </mt-text>
              </dl>
            </div>
          </mt-card>
        </template>

        <mt-card v-else>
          <mt-empty-state
            v-if="order.documents.length === 0"
            icon="regular-file-text"
            :headline="t('orders.documents.empty')"
            :description="t('orders.documents.emptyDescription')"
          />

          <ul v-else class="stack">
            <li
              v-for="document in order.documents"
              :key="document.id"
              class="cluster"
            >
              <mt-icon name="regular-file-text" size="var(--scale-size-16)" />

              <div class="order-detail__document-name">
                <mt-text size="xs" weight="semibold">{{
                  documentName(document)
                }}</mt-text>
                <mt-text size="xs" color="color-text-secondary-default">
                  {{ format.date(document.createdAt) }}
                </mt-text>
              </div>

              <mt-badge :variant="document.sent ? 'positive' : 'neutral'">
                {{
                  document.sent
                    ? t("orders.documents.sent")
                    : t("orders.documents.notSent")
                }}
              </mt-badge>

              <mt-dropdown-menu-root>
                <mt-dropdown-menu-trigger as-child>
                  <mt-button
                    variant="tertiary"
                    size="small"
                    square
                    :aria-label="
                      t('orders.documents.actions', {
                        document: documentName(document),
                      })
                    "
                  >
                    <mt-icon
                      name="regular-ellipsis-h-s"
                      size="var(--scale-size-12)"
                    />
                  </mt-button>
                </mt-dropdown-menu-trigger>

                <mt-dropdown-menu-portal>
                  <mt-action-menu>
                    <mt-action-menu-item
                      icon="envelope"
                      @select="toggleSent(document)"
                    >
                      {{
                        document.sent
                          ? t("orders.documents.markNotSent")
                          : t("orders.documents.markSent")
                      }}
                    </mt-action-menu-item>
                    <mt-action-menu-item
                      icon="trash"
                      variant="critical"
                      @select="removeDocument(document)"
                    >
                      {{ t("common.delete") }}
                    </mt-action-menu-item>
                  </mt-action-menu>
                </mt-dropdown-menu-portal>
              </mt-dropdown-menu-root>
            </li>
          </ul>
        </mt-card>
      </template>
    </div>

    <template v-if="order || isLoading" #end>
      <div class="stack order-detail__panel">
        <template v-if="order">
          <section class="stack">
            <mt-text
              as="h2"
              size="xs"
              weight="semibold"
              color="color-text-secondary-default"
            >
              {{ t("orders.details.customer") }}
            </mt-text>
            <mt-user
              :name="`${order.customer.firstName} ${order.customer.lastName}`"
              :subtitle="order.customer.email"
            />
            <mt-text size="xs">{{ order.customer.phone }}</mt-text>
          </section>

          <mt-divider />

          <section class="stack">
            <mt-text
              as="h2"
              size="xs"
              weight="semibold"
              color="color-text-secondary-default"
            >
              {{ t("orders.details.billingAddress") }}
            </mt-text>
            <mt-text size="xs">
              <template
                v-for="line in addressLines(order.billingAddress)"
                :key="line"
              >
                {{ line }}<br />
              </template>
            </mt-text>
          </section>

          <section class="stack">
            <mt-text
              as="h2"
              size="xs"
              weight="semibold"
              color="color-text-secondary-default"
            >
              {{ t("orders.details.shippingAddress") }}
            </mt-text>
            <mt-text
              v-if="shipsToBillingAddress"
              size="xs"
              color="color-text-secondary-default"
            >
              {{ t("orders.details.sameAddress") }}
            </mt-text>
            <mt-text v-else size="xs">
              <template
                v-for="line in addressLines(order.shippingAddress)"
                :key="line"
              >
                {{ line }}<br />
              </template>
            </mt-text>
          </section>

          <mt-divider />

          <dl class="order-detail__values">
            <mt-text as="dt" size="xs" color="color-text-secondary-default">
              {{ t("orders.details.payment") }}
            </mt-text>
            <mt-text as="dd" size="xs">{{ order.paymentMethod }}</mt-text>

            <mt-text as="dt" size="xs" color="color-text-secondary-default">
              {{ t("orders.details.shipping") }}
            </mt-text>
            <mt-text as="dd" size="xs">{{ order.shippingMethod }}</mt-text>

            <mt-text as="dt" size="xs" color="color-text-secondary-default">
              {{ t("orders.details.tracking") }}
            </mt-text>
            <mt-text as="dd" size="xs">
              {{
                order.trackingCodes.join(", ") || t("orders.details.noTracking")
              }}
            </mt-text>
          </dl>

          <mt-divider />

          <mt-banner
            v-if="order.customerComment"
            variant="info"
            :title="t('orders.customerComment')"
          >
            {{ order.customerComment }}
          </mt-banner>

          <mt-select
            v-model="order.tags"
            :label="t('orders.fields.tags')"
            :options="tagOptions"
            enable-multi-selection
          />

          <mt-textarea
            v-model="order.internalComment"
            :label="t('orders.fields.internalComment')"
          />
        </template>
        <template v-else>
          <mt-skeleton-bar v-for="row in 6" :key="row" />
        </template>
      </div>
    </template>
  </mt-page>
</template>

<style scoped>
.order-detail__values {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--scale-size-8) var(--scale-size-16);
  font-variant-numeric: tabular-nums;
}

.order-detail__values dd {
  text-align: end;
}

/* Name, quantity and price, total: the totals end on the same edge as the summary's values. */
.order-detail__items {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: var(--scale-size-16);
  font-variant-numeric: tabular-nums;
}

.order-detail__items > li {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: baseline;
}

.order-detail__items > li > :last-child {
  text-align: end;
}

.order-detail__document-name {
  flex: 1;
  min-width: 0;
}

.order-detail__panel {
  width: 20rem;
  padding: var(--scale-size-16);
}
</style>
