<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtButton,
  MtCard,
  MtEmptyState,
  MtIcon,
  MtPage,
  MtPanel,
  MtSelect,
  MtSkeletonBar,
  MtSwitch,
  MtTabs,
  MtText,
  MtTextEditor,
  MtTextField,
  MtTextarea,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import type { Category } from "../../shared/types";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppPagination from "../components/AppPagination.vue";
import CategoryTree from "../components/CategoryTree.vue";
import MediaThumbnail from "../components/MediaThumbnail.vue";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useListing } from "../composables/useListing";
import { useRepository } from "../composables/useRepository";

const { t } = useI18n();
const route = useRoute();
const { addSnackbar } = useSnackbar();
const categoryRepository = useRepository("category");
const salesChannelRepository = useRepository("salesChannel");

/** The root of the tree, like the "Home" category of a new shop. */
const ROOT_ID = "home";

const categories = shallowRef<Category[]>([]);
const salesChannelOptions = shallowRef<{ value: string; label: string }[]>([]);
const isLoading = ref(true);

Promise.all([
  categoryRepository.search({ page: 1, limit: 500, sortBy: "name" }),
  salesChannelRepository.search({ page: 1, limit: 100, sortBy: "name" }),
]).then(([categoryResult, salesChannelResult]) => {
  categories.value = [
    { id: ROOT_ID, name: t("categories.home"), parentId: null },
    ...categoryResult.data.map((category) => ({
      ...category,
      parentId: category.parentId ?? ROOT_ID,
    })),
  ];
  salesChannelOptions.value = salesChannelResult.data.map((channel) => ({
    value: channel.id,
    label: channel.name,
  }));
  isLoading.value = false;
});

/** The selected category, or `null` without a selection. */
const categoryId = computed(
  () => (route.params.id as string | undefined) || null,
);

function findCategory(id: string | null) {
  return categories.value.find((category) => category.id === id) ?? null;
}

const category = computed(() => findCategory(categoryId.value));

const expanded = ref(new Set<string>([ROOT_ID]));

function toggle(id: string) {
  const next = new Set(expanded.value);

  if (next.has(id)) next.delete(id);
  else next.add(id);

  expanded.value = next;
}

// Opens the categories above the selected one, so it shows in the tree.
watch([category, categories], () => {
  const next = new Set(expanded.value);

  for (
    let parent = findCategory(category.value?.parentId ?? null);
    parent;
    parent = findCategory(parent.parentId)
  ) {
    next.add(parent.id);
  }

  expanded.value = next;
});

const breadcrumb = useBreadcrumb(() =>
  category.value ? category.value.name : t("categories.title"),
);

/** The editable fields of the selected category. The playground keeps them on the page only. */
const draft = ref({
  name: "",
  active: true,
  tags: [] as string[],
  type: "page",
  entryPoint: null as string | null,
  salesChannels: [] as string[],
  hideInNavigation: false,
  description: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
});

const isDirty = ref(false);

function resetDraft() {
  const isRoot = category.value?.id === ROOT_ID;

  draft.value = {
    name: category.value?.name ?? "",
    active: true,
    tags: [],
    type: isRoot ? "folder" : "page",
    entryPoint: isRoot ? "main-navigation" : null,
    salesChannels: isRoot
      ? salesChannelOptions.value.map((option) => option.value)
      : [],
    hideInNavigation: false,
    description: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  };
  isDirty.value = false;
}

watch(category, resetDraft, { immediate: true });
watch(draft, () => (isDirty.value = true), { deep: true, flush: "sync" });

function save() {
  isDirty.value = false;
  addSnackbar({ message: t("categories.saved"), variant: "success" });
}

const activeTab = ref("general");
watch(categoryId, () => (activeTab.value = "general"));

const tabs = computed(() =>
  (["general", "products", "layout", "seo"] as const).map((name) => ({
    name,
    label: t(`categories.tabs.${name}`),
  })),
);

const typeOptions = computed(() =>
  (["page", "folder", "link"] as const).map((value) => ({
    value,
    label: t(`categories.types.${value}`),
  })),
);

const entryPointOptions = computed(() =>
  (["main-navigation", "footer-navigation", "service-navigation"] as const).map(
    (value) => ({ value, label: t(`categories.entryPoints.${value}`) }),
  ),
);

/** The selected category and every category below it, whose products the products tab lists. */
const categoryIds = computed(() => {
  const ids: string[] = [];
  const collect = (id: string) => {
    ids.push(id);
    categories.value
      .filter((entry) => entry.parentId === id)
      .forEach((entry) => collect(entry.id));
  };

  if (categoryId.value) collect(categoryId.value);

  return ids;
});

const {
  items: products,
  total,
  isLoading: isLoadingProducts,
  page,
  limit,
} = useListing("product", {
  sortBy: "name",
  limit: 10,
  filters: () => ({ categoryIds: categoryIds.value }),
});

const productColumns = computed<GridColumn[]>(() => [
  { key: "name", label: t("products.columns.name") },
  {
    key: "productNumber",
    label: t("products.columns.productNumber")
  },
  {
    key: "price.gross",
    label: t("products.columns.price"),
    align: "end"
  },
]);

</script>

<template>
  <mt-page width="m" :is-loading="isLoading" :breadcrumb="breadcrumb">
    <template #actions>
      <template v-if="category">
        <mt-button
          variant="secondary"
          size="default"
          :disabled="!isDirty"
          @click="resetDraft"
        >
          {{ t("common.cancel") }}
        </mt-button>
        <mt-button
          variant="primary"
          size="default"
          :disabled="!isDirty"
          @click="save"
        >
          {{ t("common.save") }}
        </mt-button>
      </template>
      <app-header-actions />
    </template>

    <template #start>
      <mt-panel
        :label="t('categories.title')"
        icon="regular-folder"
        closable
        resizable
        :min-width="260"
      >
        <nav class="category-panel" :aria-label="t('categories.title')">
          <div class="category-panel__header">
            <mt-text size="xs" weight="semibold">
              {{ t("categories.title") }}
            </mt-text>
            <mt-icon
              name="regular-chevron-down-xxs"
              size="var(--scale-size-8)"
              decorative
            />
          </div>

          <div v-if="isLoading" class="stack category-panel__loading">
            <mt-skeleton-bar v-for="row in 8" :key="row" />
          </div>
          <category-tree
            v-else
            :categories="categories"
            :parent-id="null"
            :selected-id="categoryId"
            :expanded="expanded"
            @toggle="toggle"
          />

          <div class="category-panel__header">
            <mt-text size="xs" weight="semibold">
              {{ t("categories.landingPages") }}
            </mt-text>
            <mt-icon
              name="regular-chevron-right-xxs"
              size="var(--scale-size-8)"
              decorative
            />
          </div>
        </nav>
      </mt-panel>
    </template>

    <mt-card v-if="isLoading">
      <div class="stack">
        <mt-skeleton-bar v-for="row in 4" :key="row" />
      </div>
    </mt-card>

    <mt-card v-else-if="!category">
      <mt-empty-state
        icon="regular-folder"
        :headline="
          categoryId
            ? t('categories.notFound.headline')
            : t('categories.noSelection.headline')
        "
        :description="
          categoryId
            ? t('categories.notFound.description')
            : t('categories.noSelection.description')
        "
      />
    </mt-card>

    <div v-else class="stack">
      <mt-tabs
        :items="tabs"
        :default-item="activeTab"
        @new-item-active="activeTab = $event"
      />

      <template v-if="activeTab === 'general'">
        <mt-card :title="t('categories.cards.general')">
          <div class="stack">
            <div class="form-row" style="--form-row-columns: 2fr 1fr">
              <mt-text-field
                v-model="draft.name"
                :label="t('categories.fields.name')"
                required
              />
              <mt-switch
                v-model="draft.active"
                class="category-detail__switch"
                :label="t('categories.fields.active')"
                bordered
              />
            </div>
            <mt-select
              v-model="draft.tags"
              :label="t('categories.fields.tags')"
              :placeholder="t('categories.placeholders.tags')"
              :options="[
                { value: 'Seasonal', label: 'Seasonal' },
                { value: 'Sale', label: 'Sale' },
                { value: 'New', label: 'New' },
              ]"
              enable-multi-selection
            />
            <mt-select
              v-model="draft.type"
              :label="t('categories.fields.type')"
              :help-text="t('categories.fields.typeHelp')"
              :options="typeOptions"
              :enable-search="false"
            />
          </div>
        </mt-card>

        <mt-card
          v-if="draft.type !== 'link'"
          :title="t('categories.cards.navigation')"
        >
          <div class="stack">
            <mt-select
              v-model="draft.entryPoint"
              :label="t('categories.fields.entryPoint')"
              :placeholder="t('categories.placeholders.entryPoint')"
              :options="entryPointOptions"
              :enable-search="false"
            />
            <mt-select
              v-model="draft.salesChannels"
              :label="t('categories.fields.salesChannels')"
              :placeholder="t('categories.placeholders.salesChannels')"
              :options="salesChannelOptions"
              enable-multi-selection
            />
          </div>
        </mt-card>

        <mt-card
          v-if="draft.type !== 'link'"
          :title="t('categories.cards.menu')"
        >
          <div class="stack">
            <mt-switch
              v-model="draft.hideInNavigation"
              :label="t('categories.fields.hideInNavigation')"
            />
            <div class="category-detail__image">
              <media-thumbnail size="var(--scale-size-64)" />
              <div class="stack">
                <mt-text size="xs" weight="semibold">
                  {{ t("categories.fields.image") }}
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
            </div>
            <mt-text-editor
              v-model="draft.description"
              :label="t('categories.fields.description')"
              :placeholder="t('categories.placeholders.description')"
            />
          </div>
        </mt-card>
      </template>

      <mt-card
        v-else-if="activeTab === 'products'"
        :title="t('categories.cards.products')"
      >
        <template #grid>
          <app-grid
            plain
            :caption="t('categories.cards.products')"
            :columns="productColumns"
            :rows="products"
            :is-loading="isLoadingProducts"
            :skeleton-rows="5"
          >
            <template #empty>
              <mt-empty-state
                icon="regular-products"
                :headline="t('categories.noProducts.headline')"
                :description="t('categories.noProducts.description')"
              />
            </template>
          </app-grid>
          <app-pagination
            v-if="total > 0"
            v-model:page="page"
            v-model:limit="limit"
            :total="total"
          />
        </template>
      </mt-card>

      <mt-card
        v-else-if="activeTab === 'layout'"
        :title="t('products.cards.layout')"
      >
        <div class="stack">
          <div>
            <mt-text size="s" weight="semibold">
              {{ t("categories.defaultLayout") }}
            </mt-text>
            <mt-text size="xs" color="color-text-secondary-default">
              {{ t("categories.layoutType") }}
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
      </mt-card>

      <mt-card v-else :title="t('products.cards.seo')">
        <div class="stack">
          <mt-text-field
            v-model="draft.metaTitle"
            :label="t('products.fields.metaTitle')"
            :placeholder="category.name"
          />
          <mt-textarea
            v-model="draft.metaDescription"
            :label="t('products.fields.metaDescription')"
          />
          <mt-text-field
            v-model="draft.keywords"
            :label="t('products.fields.keywords')"
          />
        </div>
      </mt-card>
    </div>
  </mt-page>
</template>

<style scoped>
.category-panel {
  padding: var(--scale-size-8);
}

.category-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--scale-size-12) var(--scale-size-8);
  color: var(--color-icon-secondary-default);
}

.category-panel__loading {
  padding: var(--scale-size-8);
}

.category-detail__switch {
  align-self: end;
}

.category-detail__image {
  display: flex;
  align-items: center;
  gap: var(--scale-size-16);
}
</style>
