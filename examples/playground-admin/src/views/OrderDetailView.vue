<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtButton,
  MtCard,
  MtDivider,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmailField,
  MtEmptyState,
  MtIcon,
  MtLink,
  MtNumberField,
  MtPage,
  MtSearch,
  MtSelect,
  MtSkeletonBar,
  MtStatusDot,
  MtTabs,
  MtText,
  MtTextField,
  MtTextarea,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import type { Address, Order } from "../../shared/types";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppHeaderActions from "../components/AppHeaderActions.vue";
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

/** Discards the changes, or goes back to the list when there are none, as in the Administration. */
function cancel() {
  if (isDirty.value) discard();
  else router.push({ name: "order-list" });
}

const tabs = computed(() => [
  { name: "general", label: t("orders.tabs.general") },
  { name: "details", label: t("orders.tabs.details") },
  { name: "documents", label: t("orders.tabs.documents") },
]);

/** The state selects of the info card, in the order of the Administration. */
const stateFields = [
  { property: "paymentState", machine: "payment" },
  { property: "deliveryState", machine: "delivery" },
  { property: "state", machine: "order" },
] as const;

/** "Street, Zip City, Country" in one line, as the address selects show it. */
function addressLine(address: Address) {
  return [
    `${address.firstName} ${address.lastName}`,
    address.company,
    address.street,
    `${address.zipcode} ${address.city}`,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

const itemSearch = ref("");

const lineItems = computed(() => {
  const term = itemSearch.value.trim().toLowerCase();
  const items = order.value?.lineItems ?? [];

  return term
    ? items.filter((item) => item.label.toLowerCase().includes(term))
    : items;
});

const itemColumns = computed<GridColumn[]>(() => [
  {
    key: "quantity",
    label: t("orders.items.quantity"),
    align: "end",
    width: "6rem",
  },
  { key: "label", label: t("orders.items.name") },
  {
    key: "unitPrice",
    label: t("orders.items.unitPrice"),
    align: "end",
    width: "9rem",
  },
  { key: "taxRate", label: t("orders.items.tax"), align: "end", width: "6rem" },
  {
    key: "totalPrice",
    label: t("orders.items.total"),
    align: "end",
    width: "9rem",
  },
]);

const documentColumns = computed<GridColumn[]>(() => [
  { key: "createdAt", label: t("orders.documents.columns.date") },
  { key: "number", label: t("orders.documents.columns.number") },
  { key: "type", label: t("orders.documents.columns.type") },
  { key: "formats", label: t("orders.documents.columns.formats") },
  {
    key: "sent",
    label: t("orders.documents.columns.sent"),
    align: "center",
  },
]);



</script>

<template>
  <mt-page width="m" :is-loading="isLoading" :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button variant="secondary" size="default" @click="cancel">
        {{ t("common.cancel") }}
      </mt-button>
      <mt-button
        variant="primary"
        size="default"
        :disabled="!order"
        :is-loading="isSaving"
        @click="save"
      >
        {{ t("common.save") }}
      </mt-button>
      <app-header-actions />
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
        <mt-tabs
          :items="tabs"
          :default-item="activeTab"
          @new-item-active="activeTab = $event"
        />

        <template v-if="activeTab === 'general'">
          <mt-card :title="t('orders.info.title')">
            <div class="stack">
              <div class="order-detail__summary">
                <mt-text size="s" weight="semibold">
                  {{ order.orderNumber }} -
                  <mt-link
                    :to="{
                      name: 'customer-detail',
                      params: { id: order.customer.id },
                    }"
                  >
                    {{ order.customer.firstName }} {{ order.customer.lastName
                    }}<template v-if="order.customer.company">
                      - {{ order.customer.company }}</template
                    >
                  </mt-link>
                  <span class="order-detail__email">
                    ({{ order.customer.email }})
                  </span>
                </mt-text>
                <mt-text size="l" weight="semibold">
                  {{ format.currency(order.amountTotal) }}
                </mt-text>
              </div>

              <mt-text size="xs" color="color-text-secondary-default">
                {{
                  t("orders.info.placed", {
                    time: format.relativeTime(order.orderDateTime),
                    payment: order.paymentMethod,
                    shipping: order.shippingMethod,
                  })
                }}
              </mt-text>

              <mt-divider />

              <div class="grid" style="--grid-min: 10rem">
                <mt-select
                  v-for="field in stateFields"
                  :key="field.property"
                  v-model="order[field.property]"
                  :label="t(`orders.columns.${field.property}`)"
                  :options="states.options(field.machine)"
                  :enable-search="false"
                  hide-clearable-button
                >
                  <template #prefix>
                    <mt-status-dot
                      :variant="
                        states.variant(field.machine, order[field.property])
                      "
                    />
                  </template>
                </mt-select>
              </div>

              <mt-select
                v-model="order.tags"
                :aria-label="t('orders.fields.tags')"
                :placeholder="t('orders.fields.tagsPlaceholder')"
                :options="tagOptions"
                enable-multi-selection
              />
            </div>
          </mt-card>

          <mt-card :title="t('orders.items.title')">
            <template #grid>
              <div class="order-detail__toolbar">
                <mt-search
                  v-model="itemSearch"
                  size="small"
                  :placeholder="t('orders.items.search')"
                />

                <div class="split-button">
                  <mt-button variant="secondary" size="small">
                    {{ t("orders.items.addProduct") }}
                  </mt-button>
                  <mt-dropdown-menu-root>
                    <mt-dropdown-menu-trigger as-child>
                      <mt-button
                        variant="secondary"
                        size="small"
                        square
                        :aria-label="t('common.moreActions')"
                      >
                        <mt-icon
                          name="regular-chevron-down-xs"
                          size="var(--scale-size-12)"
                          decorative
                        />
                      </mt-button>
                    </mt-dropdown-menu-trigger>
                    <mt-dropdown-menu-portal>
                      <mt-action-menu>
                        <mt-action-menu-item>
                          {{ t("orders.items.addCustom") }}
                        </mt-action-menu-item>
                        <mt-action-menu-item>
                          {{ t("orders.items.addCredit") }}
                        </mt-action-menu-item>
                      </mt-action-menu>
                    </mt-dropdown-menu-portal>
                  </mt-dropdown-menu-root>
                </div>
              </div>

              <app-grid
                plain
                :caption="t('orders.items.title')"
                :columns="itemColumns"
                :rows="lineItems"
                actions
              ></app-grid>

              <dl class="order-detail__totals">
                <dt>{{ t("orders.summary.subtotal") }}</dt>
                <dd>{{ format.currency(order.positionPrice) }}</dd>

                <dt>{{ t("orders.summary.shipping") }}</dt>
                <dd>{{ format.currency(order.shippingCosts) }}</dd>

                <mt-divider class="order-detail__totals-divider" />

                <dt>{{ t("orders.summary.totalNet") }}</dt>
                <dd>{{ format.currency(order.amountNet) }}</dd>

                <template v-for="tax in order.taxes" :key="tax.rate">
                  <dt>
                    {{
                      t("orders.summary.tax", {
                        rate: format.percent(tax.rate),
                      })
                    }}
                  </dt>
                  <dd>{{ format.currency(tax.amount) }}</dd>
                </template>

                <mt-divider class="order-detail__totals-divider" />

                <dt class="order-detail__grand-total">
                  {{ t("orders.summary.total") }}
                </dt>
                <dd class="order-detail__grand-total">
                  {{ format.currency(order.amountTotal) }}
                </dd>
              </dl>
            </template>
          </mt-card>

          <mt-card :title="t('orders.promotions.title')">
            <div class="stack">
              <mt-text-field
                :label="t('orders.promotions.code')"
                :placeholder="t('orders.promotions.codePlaceholder')"
              />
              <div class="order-detail__promotion-update">
                <div>
                  <mt-text size="xs" weight="semibold">
                    {{ t("orders.promotions.update") }}
                  </mt-text>
                  <p class="card-text">
                    {{ t("orders.promotions.updateText") }}
                  </p>
                </div>
                <mt-button variant="secondary" size="small">
                  {{ t("orders.promotions.update") }}
                </mt-button>
              </div>
            </div>
          </mt-card>
        </template>

        <template v-else-if="activeTab === 'details'">
          <mt-card :title="t('orders.details.payment')">
            <div class="stack">
              <mt-select
                v-model="order.paymentState"
                :label="t('orders.columns.paymentState')"
                :options="states.options('payment')"
                :enable-search="false"
                hide-clearable-button
              >
                <template #prefix>
                  <mt-status-dot
                    :variant="states.variant('payment', order.paymentState)"
                  />
                </template>
              </mt-select>

              <mt-divider />

              <mt-text-field
                :model-value="addressLine(order.billingAddress)"
                :label="t('orders.details.billingAddress')"
                disabled
              />

              <mt-divider />

              <div class="grid">
                <mt-text-field
                  :model-value="order.paymentMethod"
                  :label="t('orders.details.paymentMethod')"
                  disabled
                />
              </div>
            </div>
          </mt-card>

          <mt-card :title="t('orders.details.shipping')">
            <div class="stack">
              <mt-select
                v-model="order.deliveryState"
                :label="t('orders.columns.deliveryState')"
                :options="states.options('delivery')"
                :enable-search="false"
                hide-clearable-button
              >
                <template #prefix>
                  <mt-status-dot
                    :variant="states.variant('delivery', order.deliveryState)"
                  />
                </template>
              </mt-select>

              <mt-divider />

              <mt-text-field
                :model-value="addressLine(order.shippingAddress)"
                :label="t('orders.details.shippingAddress')"
                disabled
              />

              <mt-divider />

              <div class="grid">
                <mt-text-field
                  :model-value="order.shippingMethod"
                  :label="t('orders.details.shippingMethod')"
                  disabled
                />
                <mt-number-field
                  v-model="order.shippingCosts"
                  :label="t('orders.details.shippingCosts')"
                  :min="0"
                >
                  <template #suffix><mt-text size="xs">€</mt-text></template>
                </mt-number-field>
                <mt-text-field
                  :model-value="format.date(order.orderDateTime)"
                  :label="t('orders.details.deliveryDate')"
                  disabled
                />
                <mt-text-field
                  :model-value="order.trackingCodes.join(', ')"
                  :label="t('orders.details.tracking')"
                  :placeholder="t('orders.details.trackingPlaceholder')"
                  @update:model-value="
                    order.trackingCodes = String($event)
                      .split(',')
                      .map((code) => code.trim())
                      .filter(Boolean)
                  "
                />
              </div>
            </div>
          </mt-card>

          <mt-card :title="t('orders.details.order')">
            <div class="stack">
              <mt-select
                v-model="order.state"
                :label="t('orders.columns.state')"
                :options="states.options('order')"
                :enable-search="false"
                hide-clearable-button
              >
                <template #prefix>
                  <mt-status-dot :variant="states.variant('order', order.state)" />
                </template>
              </mt-select>

              <mt-divider />

              <div class="grid">
                <mt-email-field
                  v-model="order.customer.email"
                  :label="t('orders.details.email')"
                  required
                />
                <mt-text-field
                  v-model="order.customer.phone"
                  :label="t('orders.details.phone')"
                />
                <mt-text-field
                  :model-value="order.salesChannel"
                  :label="t('orders.details.salesChannel')"
                  disabled
                />
                <mt-text-field
                  model-value="English"
                  :label="t('orders.details.language')"
                  disabled
                />
                <mt-text-field :label="t('orders.details.affiliateCode')" />
                <mt-text-field :label="t('orders.details.campaignCode')" />
              </div>

              <mt-textarea
                :model-value="order.customerComment ?? ''"
                :label="t('orders.details.additionalInformation')"
                :hint="t('orders.details.additionalInformationHint')"
                @update:model-value="order.customerComment = $event || null"
              />
              <mt-textarea
                v-model="order.internalComment"
                :label="t('orders.fields.internalComment')"
                :hint="t('orders.details.internalCommentHint')"
              />
            </div>
          </mt-card>
        </template>

        <mt-card v-else :title="t('orders.documents.title')">
          <template #grid>
            <div class="order-detail__toolbar">
              <mt-search
                size="small"
                :placeholder="t('orders.documents.search')"
              />
              <mt-button variant="secondary" size="small">
                {{ t("orders.documents.create") }}
              </mt-button>
            </div>

            <app-grid
              plain
              :caption="t('orders.documents.title')"
              :columns="documentColumns"
              :rows="order.documents"
              actions
            >
              <template #empty>
                <mt-empty-state
                  icon="regular-file-text"
                  :headline="t('orders.documents.empty')"
                  :description="t('orders.documents.emptyDescription')"
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
.order-detail__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--scale-size-8) var(--scale-size-16);
}

.order-detail__email {
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary-default);
}

.order-detail__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16) var(--scale-size-24);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.order-detail__toolbar > .mt-search {
  flex: 0 1 20rem;
}

.order-detail__totals {
  display: grid;
  grid-template-columns: auto minmax(8rem, auto);
  justify-content: end;
  gap: var(--scale-size-8) var(--scale-size-32);
  margin: 0;
  padding: var(--scale-size-24);
  font-size: var(--font-size-xs);
  font-variant-numeric: tabular-nums;
  border-block-start: 1px solid var(--color-border-secondary-default);
}

.order-detail__totals dt {
  text-align: end;
  color: var(--color-text-secondary-default);
}

.order-detail__totals dd {
  margin: 0;
  text-align: end;
}

.order-detail__totals-divider {
  grid-column: 1 / -1;
}

.order-detail__totals .order-detail__grand-total {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
}

.order-detail__promotion-update {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-16);
  padding: var(--scale-size-16);
  background-color: var(--color-background-secondary-default);
  border-radius: var(--border-radius-m);
}

.order-detail__yes {
  color: var(--color-icon-positive-default);
}

.order-detail__no {
  color: var(--color-icon-critical-default);
}
</style>
