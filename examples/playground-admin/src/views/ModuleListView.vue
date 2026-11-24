<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtButton,
  MtEmptyState,
  MtPage,
  MtSearch,
} from "@shopware-ag/meteor-component-library";
import AppGrid, { type GridColumn } from "../components/AppGrid.vue";
import AppPagination from "../components/AppPagination.vue";
import AppHeaderActions from "../components/AppHeaderActions.vue";
import { useBreadcrumb } from "../composables/useBreadcrumb";
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
const term = ref("");
const page = ref(1);
const limit = ref(25);

watch(
  key,
  async () => {
    isLoading.value = true;
    term.value = "";
    page.value = 1;
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
  })),
);

/** The rows matching the search, which the grid shows as skeleton rows. */
const filtered = computed(() => {
  const search = term.value.trim().toLowerCase();

  return search
    ? rows.value.filter((row) =>
        Object.values(row).some((value) =>
          String(value ?? "").toLowerCase().includes(search),
        ),
      )
    : rows.value;
});

const visibleRows = computed(() =>
  filtered.value.slice((page.value - 1) * limit.value, page.value * limit.value),
);

watch([term, limit], () => (page.value = 1));
</script>

<template>
  <mt-page inset :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button v-if="config.add" variant="primary" size="default">
        {{ t(`modules.${key}.add`) }}
      </mt-button>
      <app-header-actions />
    </template>

    <div class="listing">
      <div class="listing__toolbar">
        <mt-search v-model="term" size="small" :placeholder="t('common.searchIn', { title })" />
      </div>

      <app-grid
        :caption="title"
        :columns="columns"
        :rows="visibleRows"
        :is-loading="isLoading"
        selectable
        actions
      >
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
