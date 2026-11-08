<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtBadge,
  MtButton,
  MtCard,
  MtContentHeader,
  MtLayout,
  MtDatepicker,
  MtEmptyState,
  MtNumberField,
  MtPage,
  MtSelect,
  MtSkeletonBar,
  MtStatusDot,
  MtSwitch,
  MtTabs,
  MtText,
  MtTextEditor,
  MtTextField,
  MtUnitField,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import type { Product } from "../../shared/types";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useDuplicateProduct } from "../composables/useDuplicateProduct";
import { useFormat } from "../composables/useFormat";
import { useRepository } from "../composables/useRepository";
import { useStockStatus } from "../composables/useStockStatus";
import { useDraft } from "../composables/useDraft";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const format = useFormat();
const { duplicateProduct } = useDuplicateProduct();
const stock = useStockStatus();
const { addSnackbar } = useSnackbar();
const productRepository = useRepository("product");

type Options = { value: string; label: string }[];
type FieldError = { detail: string } | undefined;

/** The units of `mt-unit-field`, such as "mm" or "kg". */
type Unit = NonNullable<
  InstanceType<typeof MtUnitField>["$props"]["defaultUnit"]
>;

const repositories = {
  manufacturer: useRepository("manufacturer"),
  category: useRepository("category"),
  salesChannel: useRepository("salesChannel"),
  deliveryTime: useRepository("deliveryTime"),
  tax: useRepository("tax"),
  tag: useRepository("tag"),
};

const options = shallowRef<Record<keyof typeof repositories, Options>>({
  manufacturer: [],
  category: [],
  salesChannel: [],
  deliveryTime: [],
  tax: [],
  tag: [],
});

/** The tax rates by tax id, for the net price. */
const taxRates = shallowRef<Record<string, number>>({});

async function loadOptions() {
  const criteria = { page: 1, limit: 100, sortBy: "name" };

  const [manufacturers, categories, salesChannels, deliveryTimes, taxes, tags] =
    await Promise.all([
      repositories.manufacturer.search(criteria),
      repositories.category.search(criteria),
      repositories.salesChannel.search(criteria),
      repositories.deliveryTime.search(criteria),
      repositories.tax.search(criteria),
      repositories.tag.search(criteria),
    ]);

  const toOptions = (entities: { id: string; name: string }[]) =>
    entities.map((entity) => ({ value: entity.id, label: entity.name }));

  options.value = {
    manufacturer: toOptions(manufacturers.data),
    category: toOptions(categories.data),
    salesChannel: toOptions(salesChannels.data),
    deliveryTime: toOptions(deliveryTimes.data),
    tax: taxes.data.map((tax) => ({
      value: tax.id,
      label: `${tax.name} (${format.percent(tax.rate)})`,
    })),
    // Products keep the tag names.
    tag: tags.data.map((tag) => ({ value: tag.name, label: tag.name })),
  };

  taxRates.value = Object.fromEntries(
    taxes.data.map((tax) => [tax.id, tax.rate]),
  );
}

const scaleUnitOptions = computed(() =>
  (["piece", "liter", "kilogram", "meter"] as const).map((unit) => ({
    value: unit,
    label: t(`products.scaleUnits.${unit}`),
  })),
);

const isNew = computed(() => route.name === "product-create");
const product = ref<Product | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);
const errors = ref<{
  name?: FieldError;
  productNumber?: FieldError;
  taxId?: FieldError;
}>({});

const { isDirty, markSaved, discard } = useDraft(product);

function discardChanges() {
  discard();
  errors.value = {};
}

function createProduct(): Product {
  return {
    id: "",
    name: "",
    productNumber: "",
    description: "",
    manufacturerId: null,
    manufacturerName: null,
    active: true,
    markAsTopseller: false,
    taxId: options.value.tax[0]?.value ?? "",
    price: { gross: 0, net: 0 },
    purchasePrice: null,
    listPrice: null,
    stock: 0,
    availableStock: 0,
    isCloseout: false,
    deliveryTimeId: null,
    restockTime: null,
    shippingFree: false,
    minPurchase: 1,
    maxPurchase: null,
    purchaseSteps: 1,
    salesChannelIds: [],
    categoryIds: [],
    tags: [],
    releaseDate: null,
    ean: "",
    manufacturerNumber: "",
    width: { unit: "mm" },
    height: { unit: "mm" },
    length: { unit: "mm" },
    weight: { unit: "kg" },
    scaleUnit: "piece",
    purchaseUnit: null,
    referenceUnit: null,
    packUnit: "",
    sales: 0,
    createdAt: "",
    updatedAt: null,
  };
}

let optionsLoaded: Promise<void> | undefined;

async function load() {
  // After creating, the route changes to the saved product, which is already shown.
  if (product.value && product.value.id === route.params.id) return;

  isLoading.value = true;
  errors.value = {};
  optionsLoaded ??= loadOptions();

  const [loaded] = await Promise.all([
    isNew.value ? null : productRepository.get(String(route.params.id)),
    optionsLoaded,
  ]);

  product.value = isNew.value ? createProduct() : loaded;
  markSaved();
  isLoading.value = false;
}

watch(() => route.params.id, load, { immediate: true });

const netPrice = computed(() => {
  if (!product.value) return 0;

  const rate = taxRates.value[product.value.taxId] ?? 0;

  return Math.round((product.value.price.gross / (1 + rate / 100)) * 100) / 100;
});

function validate(entity: Product) {
  const required = { detail: t("common.required") };

  errors.value = {
    name: entity.name.trim() ? undefined : required,
    productNumber: entity.productNumber.trim() ? undefined : required,
    taxId: entity.taxId ? undefined : required,
  };

  return !Object.values(errors.value).some(Boolean);
}

async function save() {
  if (!product.value) return;

  if (!validate(product.value)) {
    activeTab.value = "general";
    return;
  }

  isSaving.value = true;

  try {
    const saved = await productRepository.save({
      ...product.value,
      price: { gross: product.value.price.gross, net: netPrice.value },
    });

    product.value = saved;
    markSaved();
    addSnackbar({ message: t("products.saved"), variant: "success" });

    if (isNew.value) {
      router.replace({ name: "product-detail", params: { id: saved.id } });
    }
  } finally {
    isSaving.value = false;
  }
}

const title = computed(() => {
  if (isNew.value) return product.value?.name || t("products.newTitle");

  return product.value?.name ?? "";
});

const breadcrumb = useBreadcrumb(() => title.value);

const activeTab = ref("general");

const tabs = computed(() => [
  {
    name: "general",
    label: t("products.tabs.general"),
    hasError: Object.values(errors.value).some(Boolean),
  },
  { name: "specifications", label: t("products.tabs.specifications") },
]);
</script>

<template>
  <mt-page width="l" :is-loading="isLoading" :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button
        variant="secondary"
        size="default"
        :disabled="!isDirty"
        @click="discardChanges"
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
      <mt-card v-if="isLoading" :title="t('products.cards.general')">
        <div class="stack">
          <mt-skeleton-bar v-for="row in 4" :key="row" />
        </div>
      </mt-card>

      <mt-empty-state
        v-else-if="!product"
        icon="regular-products"
        :headline="t('products.notFound.headline')"
        :description="t('products.notFound.description')"
      >
        <template #button>
          <mt-button
            variant="secondary"
            size="default"
            @click="router.push({ name: 'product-list' })"
          >
            {{ t("products.notFound.back") }}
          </mt-button>
        </template>
      </mt-empty-state>

      <template v-else>
        <mt-content-header v-if="!isNew" :title="product.name">
          <template #actions>
            <mt-button
              variant="secondary"
              size="default"
              @click="duplicateProduct(product)"
            >
              {{ t("common.duplicate") }}
            </mt-button>
          </template>

          <div class="cluster">
            <mt-badge :variant="product.active ? 'positive' : 'neutral'">
              {{ product.active ? t("common.active") : t("common.inactive") }}
            </mt-badge>
            <mt-text size="xs" color="color-text-secondary-default">
              {{ product.productNumber }}
            </mt-text>
            <mt-text
              v-if="product.manufacturerName"
              size="xs"
              color="color-text-secondary-default"
            >
              {{ product.manufacturerName }}
            </mt-text>
            <mt-text size="xs">{{
              format.currency(product.price.gross)
            }}</mt-text>
            <div class="cluster">
              <mt-status-dot :variant="stock.variant(product.stock)" />
              <mt-text size="xs">
                {{ t("products.inStock", { n: format.number(product.stock) }) }}
              </mt-text>
            </div>
          </div>
        </mt-content-header>

        <mt-tabs
          :items="tabs"
          :default-item="activeTab"
          @new-item-active="activeTab = $event"
        />

        <mt-layout v-if="activeTab === 'general'">
          <mt-card :title="t('products.cards.general')">
            <div class="stack">
              <div class="grid">
                <mt-text-field
                  v-model="product.name"
                  :label="t('products.fields.name')"
                  :error="errors.name"
                  required
                />
                <mt-select
                  v-model="product.manufacturerId"
                  :label="t('products.fields.manufacturer')"
                  :options="options.manufacturer"
                />
              </div>

              <mt-text-field
                v-model="product.productNumber"
                :label="t('products.fields.productNumber')"
                :help-text="t('products.fields.productNumberHelp')"
                :error="errors.productNumber"
                required
              />

              <mt-text-editor
                v-model="product.description"
                :label="t('products.fields.description')"
              />

              <mt-switch
                v-model="product.markAsTopseller"
                :label="t('products.fields.topseller')"
              />
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.prices')">
            <div class="grid">
              <mt-select
                v-model="product.taxId"
                :label="t('products.fields.tax')"
                :options="options.tax"
                :error="errors.taxId"
                :enable-search="false"
                hide-clearable-button
                required
              />
              <mt-number-field
                v-model="product.price.gross"
                :label="t('products.fields.priceGross')"
                :min="0"
                required
              >
                <template #suffix><mt-text size="xs">€</mt-text></template>
              </mt-number-field>
              <mt-number-field
                :model-value="netPrice"
                :label="t('products.fields.priceNet')"
                disabled
              >
                <template #suffix><mt-text size="xs">€</mt-text></template>
              </mt-number-field>
              <mt-number-field
                v-model="product.purchasePrice"
                :label="t('products.fields.purchasePrice')"
                :min="0"
              >
                <template #suffix><mt-text size="xs">€</mt-text></template>
              </mt-number-field>
              <mt-number-field
                v-model="product.listPrice"
                :label="t('products.fields.listPrice')"
                :min="0"
              >
                <template #suffix><mt-text size="xs">€</mt-text></template>
              </mt-number-field>
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.deliverability')">
            <div class="stack">
              <div class="grid">
                <mt-number-field
                  v-model="product.stock"
                  :label="t('products.fields.stock')"
                  number-type="int"
                />
                <mt-number-field
                  :model-value="product.availableStock"
                  :label="t('products.fields.availableStock')"
                  number-type="int"
                  disabled
                />
                <mt-select
                  v-model="product.deliveryTimeId"
                  :label="t('products.fields.deliveryTime')"
                  :options="options.deliveryTime"
                  :enable-search="false"
                />
                <mt-number-field
                  v-model="product.restockTime"
                  :label="t('products.fields.restockTime')"
                  number-type="int"
                  :min="0"
                />
                <mt-number-field
                  v-model="product.minPurchase"
                  :label="t('products.fields.minPurchase')"
                  number-type="int"
                  :min="1"
                />
                <mt-number-field
                  v-model="product.purchaseSteps"
                  :label="t('products.fields.purchaseSteps')"
                  number-type="int"
                  :min="1"
                />
                <mt-number-field
                  v-model="product.maxPurchase"
                  :label="t('products.fields.maxPurchase')"
                  number-type="int"
                  :min="1"
                />
              </div>

              <mt-switch
                v-model="product.isCloseout"
                :label="t('products.fields.closeout')"
              />
              <mt-switch
                v-model="product.shippingFree"
                :label="t('products.fields.shippingFree')"
              />
            </div>
          </mt-card>

          <template #end>
            <mt-card :title="t('products.cards.visibility')">
              <div class="stack">
                <mt-switch
                  v-model="product.active"
                  :label="t('products.fields.active')"
                />
                <mt-select
                  v-model="product.salesChannelIds"
                  :label="t('products.fields.salesChannels')"
                  :options="options.salesChannel"
                  enable-multi-selection
                />
                <mt-select
                  v-model="product.categoryIds"
                  :label="t('products.fields.categories')"
                  :options="options.category"
                  enable-multi-selection
                />
                <mt-select
                  v-model="product.tags"
                  :label="t('products.fields.tags')"
                  :options="options.tag"
                  enable-multi-selection
                />
              </div>
            </mt-card>

            <mt-card :title="t('products.cards.labelling')">
              <div class="grid">
                <mt-datepicker
                  v-model="product.releaseDate"
                  :label="t('products.fields.releaseDate')"
                  :locale="locale"
                  date-type="date"
                />
                <mt-text-field
                  v-model="product.ean"
                  :label="t('products.fields.ean')"
                />
                <mt-text-field
                  v-model="product.manufacturerNumber"
                  :label="t('products.fields.manufacturerNumber')"
                />
              </div>
            </mt-card>
          </template>
        </mt-layout>

        <mt-layout v-else>
          <mt-card :title="t('products.cards.measurements')">
            <div class="grid">
              <mt-unit-field
                v-model="product.width.value"
                :default-unit="product.width.unit as Unit"
                @update:default-unit="product.width.unit = $event"
                :label="t('products.fields.width')"
                measurement-type="length"
              />
              <mt-unit-field
                v-model="product.height.value"
                :default-unit="product.height.unit as Unit"
                @update:default-unit="product.height.unit = $event"
                :label="t('products.fields.height')"
                measurement-type="length"
              />
              <mt-unit-field
                v-model="product.length.value"
                :default-unit="product.length.unit as Unit"
                @update:default-unit="product.length.unit = $event"
                :label="t('products.fields.length')"
                measurement-type="length"
              />
              <mt-unit-field
                v-model="product.weight.value"
                :default-unit="product.weight.unit as Unit"
                @update:default-unit="product.weight.unit = $event"
                :label="t('products.fields.weight')"
                measurement-type="mass"
              />
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.packaging')">
            <div class="grid">
              <mt-select
                v-model="product.scaleUnit"
                :label="t('products.fields.scaleUnit')"
                :options="scaleUnitOptions"
                :enable-search="false"
                hide-clearable-button
              />
              <mt-number-field
                v-model="product.purchaseUnit"
                :label="t('products.fields.purchaseUnit')"
                :min="0"
              />
              <mt-number-field
                v-model="product.referenceUnit"
                :label="t('products.fields.referenceUnit')"
                :min="0"
              />
              <mt-text-field
                v-model="product.packUnit"
                :label="t('products.fields.packUnit')"
              />
            </div>
          </mt-card>
        </mt-layout>
      </template>
    </div>
  </mt-page>
</template>
