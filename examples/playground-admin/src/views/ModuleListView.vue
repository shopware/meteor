<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtActionMenuItem,
  MtButton,
  MtEmptyState,
  MtPage,
} from "@shopware-ag/meteor-component-library";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppPagination from "../components/AppPagination.vue";
import LanguageSwitch from "../components/LanguageSwitch.vue";
import ModuleCell from "../components/ModuleCell.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useGlobalSearch } from "../composables/useGlobalSearch";
import { useRequest } from "../composables/useRequest";
import { modules, type ModuleKey, type ModuleConfig } from "../modules";

/**
 * The list of a module the playground only shows, such as the reviews or the promotions: its
 * columns and mock rows come from `src/modules.ts`.
 */

const { t } = useI18n();
const route = useRoute();
const { request } = useRequest();

const key = computed(() => route.meta.module as ModuleKey);
const config = computed<ModuleConfig>(() => modules[key.value]);

const rows = shallowRef<Record<string, unknown>[]>([]);
const isLoading = ref(true);
const { term } = useGlobalSearch();
const page = ref(1);
const limit = ref(25);
const sortBy = ref<string>();
const sortDirection = ref<"ASC" | "DESC">("ASC");
const selection = ref<string[]>([]);

watch(
  key,
  async () => {
    isLoading.value = true;
    page.value = 1;
    sortBy.value = undefined;
    selection.value = [];
    rows.value = await request(() => config.value.rows());
    isLoading.value = false;
  },
  { immediate: true },
);

const title = computed(() => t(`nav.${key.value}`));

const breadcrumb = useBreadcrumb(() =>
  isLoading.value
    ? title.value
    : t("common.titleWithCount", { title: title.value, n: filtered.value.length }),
);

const columns = computed<GridColumn[]>(() =>
  config.value.columns.map((column) => ({
    key: column.key,
    label: t(`modules.${key.value}.columns.${column.key}`),
    align: column.align,
    sortable: true,
  })),
);

const filtered = computed(() => {
  const search = term.value.trim().toLowerCase();
  const matching = search
    ? rows.value.filter((row) =>
        Object.values(row).some((value) =>
          String(value ?? "").toLowerCase().includes(search),
        ),
      )
    : rows.value;

  if (!sortBy.value) return matching;

  const property = sortBy.value;
  const direction = sortDirection.value === "ASC" ? 1 : -1;

  return [...matching].sort(
    (a, b) =>
      String(a[property] ?? "").localeCompare(String(b[property] ?? ""), undefined, {
        numeric: true,
      }) * direction,
  );
});

const visibleRows = computed(
  () =>
    filtered.value.slice(
      (page.value - 1) * limit.value,
      page.value * limit.value,
    ) as { id: string }[],
);

watch([term, limit], () => (page.value = 1));

function onSort(property: string, direction: "ASC" | "DESC") {
  sortBy.value = property;
  sortDirection.value = direction;
}

function cell(row: unknown, property: string) {
  return (row as Record<string, unknown>)[property];
}
</script>

<template>
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
      <language-switch v-if="key !== 'reviews'" />
      <mt-button v-if="config.add" variant="primary" size="default">
        {{ t(`modules.${key}.add`) }}
      </mt-button>
    </template>

    <div class="listing">
      <app-grid
        v-model:selection="selection"
        :caption="title"
        :columns="columns"
        :rows="visibleRows"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        selectable
        @sort="onSort"
      >
        <template
          v-for="column in config.columns"
          :key="column.key"
          #[`cell-${column.key}`]="{ row }"
        >
          <module-cell :column="column" :value="cell(row, column.key)" />
        </template>

        <template #actions>
          <mt-action-menu-item icon="regular-pencil-s">
            {{ t("common.edit") }}
          </mt-action-menu-item>
          <mt-action-menu-item icon="regular-trash" variant="critical">
            {{ t("common.delete") }}
          </mt-action-menu-item>
        </template>

        <template #bulk>
          <mt-button variant="tertiary" size="small" @click="selection = []">
            {{ t("grid.deselectAll") }}
          </mt-button>
          <mt-button variant="critical" size="small">
            {{ t("common.delete") }}
          </mt-button>
        </template>

        <template #empty>
          <mt-empty-state
            icon="regular-search"
            :headline="t('common.nothingFound')"
            :description="t('common.nothingFoundDescription')"
          />
        </template>
      </app-grid>

      <app-pagination
        v-model:page="page"
        v-model:limit="limit"
        :total="filtered.length"
      />
    </div>
  </mt-page>
</template>
