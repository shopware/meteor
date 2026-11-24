<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtBanner,
  MtButton,
  MtCard,
  MtDatepicker,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmptyState,
  MtIcon,
  MtLink,
  MtNumberField,
  MtPage,
  MtSearch,
  MtSelect,
  MtSkeletonBar,
  MtSwitch,
  MtTabs,
  MtText,
  MtTextEditor,
  MtTextField,
  MtTextarea,
  MtUnitField,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import type { Product } from "../../shared/types";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import LanguageSwitch from "../components/LanguageSwitch.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useDuplicateProduct } from "../composables/useDuplicateProduct";
import { useFormat } from "../composables/useFormat";
import { useRepository } from "../composables/useRepository";
import { useDraft } from "../composables/useDraft";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const format = useFormat();
const { duplicateProduct } = useDuplicateProduct();
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

/** The tax rate of the product, which links each gross price to its net price. */
const taxRate = computed(() =>
  product.value ? (taxRates.value[product.value.taxId] ?? 0) : 0,
);

const round = (value: number) => Math.round(value * 100) / 100;

function toNet(gross: number | null) {
  return gross == null ? null : round(gross / (1 + taxRate.value / 100));
}

function toGross(net: number | null) {
  return net == null ? null : round(net * (1 + taxRate.value / 100));
}

const netPrice = computed(() => toNet(product.value?.price.gross ?? 0) ?? 0);

function validate(entity: Product) {
  const required = { detail: t("common.required") };

  errors.value = {
    name: entity.name.trim() ? undefined : required,
    productNumber: entity.productNumber.trim() ? undefined : required,
    taxId: entity.taxId ? undefined : required,
  };

  return !Object.values(errors.value).some(Boolean);
}

async function save({ duplicate = false } = {}) {
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

    if (duplicate) {
      duplicateProduct(saved);
    } else if (isNew.value) {
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

/** Discards the changes, or goes back to the list when there are none, as in the Administration. */
function cancel() {
  if (isDirty.value) discardChanges();
  else router.push({ name: "product-list" });
}
const isDescriptionHintVisible = ref(true);

const tabs = computed(() => [
  {
    name: "general",
    label: t("products.tabs.general"),
    hasError: Object.values(errors.value).some(Boolean),
  },
  ...(
    [
      "specifications",
      "advancedPricing",
      "variants",
      "layout",
      "seo",
      "crossSelling",
      "reviews",
    ] as const
  ).map((name) => ({ name, label: t(`products.tabs.${name}`) })),
]);

/** The product's URL in the storefront, from its name. */
const seoPath = computed(() =>
  (product.value?.name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .concat(`/${product.value?.productNumber ?? ""}`),
);

/** Example properties, so the properties card of the specifications isn't empty. */
const propertyColumns = computed<GridColumn[]>(() => [
  { key: "group", label: t("products.properties.property") },
  { key: "values", label: t("products.properties.values") },
]);

const properties = computed(() => {
  const seed = product.value?.productNumber.length ?? 0;
  const colors = ["Black", "Sand", "Blue", "Green"];
  const materials = ["Cotton", "Linen", "Stoneware", "Walnut"];

  return [
    { id: "color", group: "Color", values: colors[seed % 4] },
    { id: "material", group: "Material", values: materials[(seed + 1) % 4] },
  ];
});
</script>

<template>
  <mt-page width="m" :is-loading="isLoading" :breadcrumb="breadcrumb">
    <template #actions>
      <language-switch />
      <mt-button variant="secondary" size="default" @click="cancel">
        {{ t("common.cancel") }}
      </mt-button>

      <div class="split-button">
        <mt-button
          variant="primary"
          size="default"
          :disabled="!product"
          :is-loading="isSaving"
          @click="save()"
        >
          {{ t("common.save") }}
        </mt-button>

        <mt-dropdown-menu-root>
          <mt-dropdown-menu-trigger as-child>
            <mt-button
              variant="primary"
              size="default"
              square
              :disabled="!product"
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
              <mt-action-menu-item @select="save({ duplicate: true })">
                {{ t("products.saveAndDuplicate") }}
              </mt-action-menu-item>
            </mt-action-menu>
          </mt-dropdown-menu-portal>
        </mt-dropdown-menu-root>
      </div>
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
        <mt-tabs
          v-if="!isNew"
          :items="tabs"
          :default-item="activeTab"
          @new-item-active="activeTab = $event"
        />

        <template v-if="activeTab === 'general'">
          <mt-card :title="t('products.cards.general')">
            <div class="stack">
              <mt-text-field
                v-model="product.name"
                :label="t('products.fields.name')"
                :placeholder="t('products.placeholders.name')"
                :error="errors.name"
                required
              />

              <div class="form-row" style="--form-row-columns: 2fr 1fr">
                <mt-select
                  v-model="product.manufacturerId"
                  :label="t('products.fields.manufacturer')"
                  :placeholder="t('products.placeholders.manufacturer')"
                  :options="options.manufacturer"
                />
                <mt-text-field
                  v-model="product.productNumber"
                  :label="t('products.fields.productNumber')"
                  :help-text="t('products.fields.productNumberHelp')"
                  :error="errors.productNumber"
                  required
                />
              </div>

              <mt-banner
                v-if="isDescriptionHintVisible"
                variant="info"
                closable
                @close="isDescriptionHintVisible = false"
              >
                {{ t("products.descriptionHint") }}
              </mt-banner>

              <mt-text-editor
                v-model="product.description"
                :label="t('products.fields.description')"
                :placeholder="t('products.placeholders.description')"
              />

              <mt-switch
                v-model="product.markAsTopseller"
                :label="t('products.fields.topseller')"
                :help-text="t('products.fields.topsellerHelp')"
              />
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.prices')">
            <div class="stack">
              <div class="form-row" style="--form-row-columns: 1fr 2fr">
                <mt-select
                  v-model="product.taxId"
                  :label="t('products.fields.tax')"
                  :options="options.tax"
                  :error="errors.taxId"
                  :enable-search="false"
                  hide-clearable-button
                  required
                />

                <div class="stack">
                  <div class="product-detail__price">
                    <mt-number-field
                      v-model="product.price.gross"
                      :label="t('products.fields.priceGross')"
                      :min="0"
                      required
                    >
                      <template #suffix><mt-text size="xs">€</mt-text></template>
                    </mt-number-field>
                    <mt-icon
                      class="product-detail__lock"
                      name="regular-lock"
                      size="var(--scale-size-16)"
                      decorative
                    />
                    <mt-number-field
                      :model-value="netPrice"
                      :label="t('products.fields.priceNet')"
                      :min="0"
                      required
                      @update:model-value="
                        product.price.gross = toGross($event ?? 0) ?? 0
                      "
                    >
                      <template #suffix><mt-text size="xs">€</mt-text></template>
                    </mt-number-field>
                  </div>

                  <div class="product-detail__price">
                    <mt-number-field
                      v-model="product.purchasePrice"
                      :label="t('products.fields.purchasePriceGross')"
                      :min="0"
                    >
                      <template #suffix><mt-text size="xs">€</mt-text></template>
                    </mt-number-field>
                    <mt-icon
                      class="product-detail__lock"
                      name="regular-lock"
                      size="var(--scale-size-16)"
                      decorative
                    />
                    <mt-number-field
                      :model-value="toNet(product.purchasePrice)"
                      :label="t('products.fields.purchasePriceNet')"
                      :min="0"
                      @update:model-value="product.purchasePrice = toGross($event)"
                    >
                      <template #suffix><mt-text size="xs">€</mt-text></template>
                    </mt-number-field>
                  </div>

                  <div class="product-detail__price">
                    <mt-number-field
                      v-model="product.listPrice"
                      :label="t('products.fields.listPriceGross')"
                      :help-text="t('products.fields.listPriceHelp')"
                      :min="0"
                    >
                      <template #suffix><mt-text size="xs">€</mt-text></template>
                    </mt-number-field>
                    <mt-icon
                      class="product-detail__lock"
                      name="regular-lock"
                      size="var(--scale-size-16)"
                      decorative
                    />
                    <mt-number-field
                      :model-value="toNet(product.listPrice)"
                      :label="t('products.fields.listPriceNet')"
                      :min="0"
                      @update:model-value="product.listPrice = toGross($event)"
                    >
                      <template #suffix><mt-text size="xs">€</mt-text></template>
                    </mt-number-field>
                  </div>
                </div>
              </div>

              <div class="product-detail__links">
                <mt-link as="button" @click="activeTab = 'advancedPricing'">
                  {{ t("products.tabs.advancedPricing") }}
                  <mt-icon
                    name="regular-long-arrow-right"
                    size="var(--scale-size-12)"
                    decorative
                  />
                </mt-link>
                <mt-link as="button">
                  {{ t("products.currencyPricing") }}
                  <mt-icon
                    name="regular-long-arrow-right"
                    size="var(--scale-size-12)"
                    decorative
                  />
                </mt-link>
              </div>
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.deliverability')">
            <div class="form-row" style="--form-row-columns: 1fr 1fr 1fr">
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
              <mt-switch
                v-model="product.isCloseout"
                class="product-detail__switch"
                :label="t('products.fields.closeout')"
                bordered
              />

              <mt-select
                v-model="product.deliveryTimeId"
                :label="t('products.fields.deliveryTime')"
                :placeholder="t('products.placeholders.deliveryTime')"
                :options="options.deliveryTime"
                :enable-search="false"
              />
              <mt-number-field
                v-model="product.restockTime"
                :label="t('products.fields.restockTime')"
                number-type="int"
                :min="0"
              />
              <mt-switch
                v-model="product.shippingFree"
                class="product-detail__switch"
                :label="t('products.fields.shippingFree')"
                bordered
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
          </mt-card>

          <mt-card :title="t('products.cards.visibility')">
            <div class="stack">
              <h3 class="card-heading">{{ t("products.fields.salesChannels") }}</h3>
              <p class="card-text">{{ t("products.salesChannelsText") }}</p>

              <mt-select
                v-model="product.salesChannelIds"
                :label="t('products.fields.salesChannels')"
                :placeholder="t('products.placeholders.salesChannels')"
                :options="options.salesChannel"
                enable-multi-selection
              />

              <div class="product-detail__visibility">
                <mt-switch
                  v-model="product.active"
                  :label="t('products.fields.active')"
                />
                <mt-link v-if="product.salesChannelIds.length > 0" as="button">
                  {{ t("products.setVisibility") }}
                  <mt-icon
                    name="regular-long-arrow-right"
                    size="var(--scale-size-12)"
                    decorative
                  />
                </mt-link>
              </div>

              <h3 class="card-heading">{{ t("products.categoriesAndTags") }}</h3>
              <p class="card-text">{{ t("products.categoriesText") }}</p>
              <p class="card-text">{{ t("products.tagsText") }}</p>

              <mt-select
                v-model="product.categoryIds"
                :label="t('products.fields.categories')"
                :placeholder="t('products.placeholders.categories')"
                :options="options.category"
                enable-multi-selection
              />
              <mt-select
                v-model="product.tags"
                :label="t('products.fields.tags')"
                :placeholder="t('products.placeholders.tags')"
                :options="options.tag"
                enable-multi-selection
              />
            </div>
          </mt-card>

          <mt-card
            :title="t('products.cards.media')"
            :subtitle="t('products.mediaSubtitle')"
          >
            <div class="product-detail__upload">
              <mt-icon
                name="regular-cloud-upload"
                size="var(--scale-size-24)"
                decorative
              />
              <mt-text size="xs" color="color-text-secondary-default">
                {{ t("products.dropFiles") }}
              </mt-text>
              <div class="cluster">
                <mt-button variant="secondary" size="small">
                  {{ t("products.uploadFile") }}
                </mt-button>
                <mt-button variant="secondary" size="small">
                  {{ t("products.openMedia") }}
                </mt-button>
              </div>
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.labelling')">
            <div class="form-row" style="--form-row-columns: 1fr 1fr 1fr">
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

        <template v-else-if="activeTab === 'specifications'">
          <mt-card :title="t('products.cards.measurements')">
            <div class="stack">
              <p class="card-text">{{ t("products.measurementsText") }}</p>
              <div class="form-row">
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
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.packaging')">
            <div class="stack">
              <p class="card-text">{{ t("products.packagingText") }}</p>
              <div class="form-row" style="--form-row-columns: 1fr 1fr 1fr">
                <mt-number-field
                  v-model="product.purchaseUnit"
                  :label="t('products.fields.purchaseUnit')"
                  :min="0"
                />
                <mt-select
                  v-model="product.scaleUnit"
                  :label="t('products.fields.scaleUnit')"
                  :options="scaleUnitOptions"
                  :enable-search="false"
                  hide-clearable-button
                />
                <mt-number-field
                  v-model="product.referenceUnit"
                  :label="t('products.fields.referenceUnit')"
                  :min="0"
                />
              </div>
              <div class="form-row">
                <mt-text-field
                  v-model="product.packUnit"
                  :label="t('products.fields.packUnit')"
                />
                <mt-text-field :label="t('products.fields.packUnitPlural')" />
              </div>
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.properties')">
            <template #grid>
              <div class="product-detail__toolbar">
                <mt-search
                  size="small"
                  :placeholder="t('products.properties.search')"
                />
                <mt-button variant="secondary" size="small">
                  {{ t("products.properties.configure") }}
                </mt-button>
              </div>
              <app-grid
                plain
                :caption="t('products.cards.properties')"
                :columns="propertyColumns"
                :rows="properties"
              >
                <template #actions>
                  <mt-action-menu-item icon="regular-trash" variant="critical">
                    {{ t("common.delete") }}
                  </mt-action-menu-item>
                </template>
              </app-grid>
            </template>
          </mt-card>

          <mt-card :title="t('products.cards.essentialCharacteristics')">
            <div class="stack">
              <p class="card-text">{{ t("products.essentialText") }}</p>
              <mt-select
                :label="t('products.fields.template')"
                :placeholder="t('products.placeholders.template')"
                :options="[]"
              />
            </div>
          </mt-card>
        </template>

        <mt-card
          v-else-if="activeTab === 'advancedPricing'"
          :title="t('products.tabs.advancedPricing')"
        >
          <div class="stack">
            <p class="card-text">{{ t("products.advancedPricingText") }}</p>
            <mt-select
              :label="t('products.fields.rule')"
              :placeholder="t('products.placeholders.rule')"
              :options="[]"
            />
          </div>
        </mt-card>

        <mt-card v-else-if="activeTab === 'layout'" :title="t('products.cards.layout')">
          <div class="product-detail__layout">
            <div class="product-detail__layout-preview">
              <span v-for="block in 3" :key="block" />
            </div>
            <div class="stack">
              <div>
                <mt-text size="s" weight="semibold">
                  {{ t("products.defaultLayout") }}
                </mt-text>
                <mt-text size="xs" color="color-text-secondary-default">
                  {{ t("products.layoutType") }}
                </mt-text>
              </div>
              <div class="cluster">
                <mt-button variant="secondary" size="small">
                  {{ t("products.changeLayout") }}
                </mt-button>
                <mt-button variant="secondary" size="small">
                  {{ t("products.editInDesigner") }}
                </mt-button>
              </div>
            </div>
          </div>
        </mt-card>

        <template v-else-if="activeTab === 'seo'">
          <mt-card :title="t('products.cards.seo')">
            <div class="stack">
              <mt-text-field
                :label="t('products.fields.metaTitle')"
                :placeholder="product.name"
              />
              <mt-textarea :label="t('products.fields.metaDescription')" />
              <mt-text-field :label="t('products.fields.keywords')" />
            </div>
          </mt-card>

          <mt-card :title="t('products.cards.seoUrls')">
            <div class="stack">
              <mt-select
                :model-value="options.salesChannel[0]?.value"
                :label="t('products.fields.salesChannel')"
                :options="options.salesChannel"
                :enable-search="false"
                hide-clearable-button
              />
              <mt-text-field
                :model-value="seoPath"
                :label="t('products.fields.seoPath')"
              />
            </div>
          </mt-card>
        </template>

        <mt-card v-else :title="t(`products.tabs.${activeTab}`)">
          <mt-empty-state
            :icon="
              activeTab === 'variants'
                ? 'regular-variants'
                : activeTab === 'crossSelling'
                  ? 'regular-crossselling'
                  : 'regular-star'
            "
            :headline="t(`products.empty.${activeTab}.headline`)"
            :description="t(`products.empty.${activeTab}.description`)"
          >
            <template v-if="activeTab !== 'reviews'" #button>
              <mt-button variant="secondary" size="default">
                {{ t(`products.empty.${activeTab}.button`) }}
              </mt-button>
            </template>
          </mt-empty-state>
        </mt-card>
      </template>
    </div>
  </mt-page>
</template>

<style scoped>
.product-detail__price {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: end;
  gap: var(--scale-size-12);
}

.product-detail__lock {
  margin-block-end: var(--scale-size-12);
  color: var(--color-icon-secondary-default);
}

.product-detail__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--scale-size-24);
}

.product-detail__links .mt-icon,
.product-detail__visibility .mt-icon {
  margin-inline-start: var(--scale-size-4);
}

.product-detail__switch {
  align-self: end;
}

.product-detail__visibility {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-16);
}

.product-detail__upload {
  display: grid;
  justify-items: center;
  gap: var(--scale-size-12);
  padding: var(--scale-size-32) var(--scale-size-16);
  color: var(--color-icon-secondary-default);
  border: 1px dashed var(--color-border-primary-default);
  border-radius: var(--border-radius-m);
}

.product-detail__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16) var(--scale-size-24);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.product-detail__toolbar > .mt-search {
  flex: 0 1 20rem;
}

.product-detail__layout {
  display: grid;
  grid-template-columns: 12rem 1fr;
  align-items: center;
  gap: var(--scale-size-24);
}

.product-detail__layout-preview {
  display: grid;
  gap: var(--scale-size-8);
  padding: var(--scale-size-12);
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

.product-detail__layout-preview span {
  height: var(--scale-size-24);
  background-color: var(--color-elevation-surface-default);
  border-radius: var(--border-radius-xs);
}

.product-detail__layout-preview span:first-child {
  height: var(--scale-size-48);
}
</style>
