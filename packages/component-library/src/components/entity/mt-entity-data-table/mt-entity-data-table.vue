<template>
  <mt-data-table
    v-bind="$attrs"
    v-model:applied-filters="appliedFilters"
    :title="title"
    :subtitle="subtitle"
    :layout="layout"
    :columns="columns"
    :column-changes="columnChanges"
    :data-source="dataSource"
    :current-page="currentPage"
    :pagination-limit="paginationLimit"
    :pagination-total-items="paginationTotalItems"
    :is-loading="isLoading"
    :enable-row-numbering="enableRowNumbering"
    :show-outlines="showOutlines"
    :show-stripes="showStripes"
    :enable-outline-framing="enableOutlineFraming"
    :allow-bulk-delete="allowBulkDelete"
    :allow-bulk-edit="allowBulkEdit"
    :allow-row-selection="allowRowSelection"
    :bulk-edit-more-actions="bulkEditMoreActions"
    :disable-delete="disableDelete"
    :disable-edit="disableEdit"
    :disable-search="disableSearch"
    :disable-settings-table="disableSettingsTable"
    :caption="caption"
    :sort-by="sortBy"
    :sort-direction="sortDirection"
    :pagination-options="paginationOptions"
    :enable-reload="true"
    :search-value="searchValue"
    :selected-rows="selectedRows"
    :filters="generatedFilters"
    :number-of-results="numberOfResults"
    @pagination-current-page-change="handlePaginationCurrentPageChange"
    @pagination-limit-change="handlePaginationLimitChange"
    @change-enable-row-numbering="handleChangeEnableRowNumbering"
    @change-show-outlines="handleChangeShowOutlines"
    @change-show-stripes="handleChangeShowStripes"
    @change-outline-framing="handleChangeOutlineFraming"
    @sort-change="handleSortChange"
    @search-value-change="handleSearchValueChange"
    @selection-change="handleSelectionChange"
    @multiple-selection-change="handleMultipleSelectionChange"
    @reload="fetchData"
    @open-details="handleOpenDetails"
    @bulk-delete="handleBulkDelete"
    @bulk-edit="handleBulkEdit"
    @item-delete="handleItemDelete"
  >
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name v-bind="scope ?? {}" />
    </template>
  </mt-data-table>

  <mt-modal-root :is-open="isDeleteModalOpen" @change="(isOpen) => (isDeleteModalOpen = isOpen)">
    <mt-modal :title="t('entity.delete.title')" width="s">
      <template #default>
        <p>{{ t("entity.delete.description") }}</p>
        <mt-loader v-if="isDeletingEntity" />
      </template>

      <template #footer>
        <div class="mt-entity-data-table__delete-modal-footer">
          <mt-button variant="secondary" @click="() => (isDeleteModalOpen = false)">{{
            t("entity.delete.cancel")
          }}</mt-button>
          <mt-button variant="critical" @click="handleItemDeleteConfirm">{{
            t("entity.delete.delete")
          }}</mt-button>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>

<script setup lang="ts">
/**
 * This component is a wrapper for the mt-entity-data-table component.
 *
 * It is used to add automatic data handling for the mt-entity-data-table component using
 * the repository methods from the meteor-admin-sdk.
 *
 * The developer can provide a entity name and the component will automatically fetch the
 * data from the repository and pass it to the mt-entity-data-table component. Pagination,
 * limiting, sorting and filtering is handled automatically.
 *
 * The fallback uses the meteor-admin-sdk's find method to fetch the data. But the developer
 * can also provide a custom repository to use their own data fetching logic.
 */
import type Repository from "@shopware-ag/meteor-admin-sdk/es/data/repository";
import Criteria from "@shopware-ag/meteor-admin-sdk/es/data/Criteria";
import { useRepository } from "@shopware-ag/meteor-admin-sdk/es/data/composables/useRepository";
import { getRepository } from "@shopware-ag/meteor-admin-sdk/es/data/composables/getRepository";
import MtDataTable, {
  type ColumnChanges,
  type ColumnDefinition,
} from "../../table-and-list/mt-data-table/mt-data-table.vue";
import { onMounted, ref, watch, type Ref } from "vue";
import { computedAsync } from "@vueuse/core";
import type { MtPopoverItemType } from "@/components/overlay/mt-popover-item/mt-popover-item.vue";
import type { Filter } from "@/components/table-and-list/mt-data-table/mt-data-table.interfaces";
import type { AvailableFilter } from "./mt-entity-data-table.interfaces";
import { useI18n } from "vue-i18n";
import MtModalRoot from "@/components/overlay/mt-modal/sub-components/mt-modal-root.vue";
import MtModal from "@/components/overlay/mt-modal/mt-modal.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtLoader from "@/components/feedback-indicator/mt-loader/mt-loader.vue";

const props = defineProps<{
  // Props needed for the data handling
  entity: keyof EntitySchema.Entities;

  // Optional props for the data handling
  repository?: typeof Repository;

  // Optional props for the modal
  forceRealModal?: boolean;

  // Original props for the mt-data-table component
  columns: ColumnDefinition[];
  columnChanges?: Record<string, ColumnChanges>;
  title?: string;
  subtitle?: string;
  layout?: "default" | "full";
  allowBulkDelete?: boolean;
  allowBulkEdit?: boolean;
  allowRowSelection?: boolean;
  bulkEditMoreActions?: {
    id: string;
    label: string;
    onClick: () => void;
    icon?: "default" | "critical" | "active" | string;
    type?: MtPopoverItemType;
    metaCopy?: string;
    contextualDetail?: string;
  }[];
  disableDelete?: boolean;
  disableEdit?: boolean;
  disableSearch?: boolean;
  disableSettingsTable?: boolean;
  additionalContextButtons?: {
    type?: "default" | "active" | "critical";
    label: string;
    key: string;
  }[];
  caption?: string;
  paginationOptions?: number[];
  availableFilters?: AvailableFilter[];
}>();

const emit = defineEmits<{
  (
    e: "open-details",
    row: {
      id: string;
    },
  ): void;
  (e: "bulk-delete", rowIds: string[]): void;
  (e: "bulk-edit", rowIds: string[]): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      booleanFilter: {
        true: "Active",
        false: "Inactive",
      },
      entity: {
        delete: {
          title: "Delete item",
          description: "Are you sure you want to delete the selected items?",
          cancel: "Cancel",
          delete: "Delete",
        },
      },
    },
    de: {
      booleanFilter: {
        true: "Aktiv",
        false: "Inaktiv",
      },
      entity: {
        delete: {
          title: "Element löschen",
          description: "Soll dieses Element wirklich gelöscht werden?",
          cancel: "Abbrechen",
          delete: "Löschen",
        },
      },
    },
  },
});

// Required props for the mt-data-table component
const dataSource: Ref<any[]> = ref([]);
const currentPage = ref(1);
const paginationLimit = ref(25);
const paginationTotalItems = ref(0);
const sortBy = ref("");
const sortDirection: Ref<"ASC" | "DESC"> = ref("ASC");
const searchValue = ref("");
const isLoading = ref(true);
const enableRowNumbering = ref(false);
const showOutlines = ref(true);
const showStripes = ref(true);
const enableOutlineFraming = ref(false);
const selectedRows = ref<string[]>([]);
const appliedFilters = ref<Filter[]>([]);
const numberOfResults = ref(0);

const isDeleteModalOpen = ref(false);
const itemToDelete = ref<string | null>(null);
const isDeletingEntity = ref(false);

// @ts-expect-error - The repository is not typed exactly the same
const repository = useRepository(props.entity, props.repository);

const generatedFilters: Ref<Filter[]> = computedAsync(async () => {
  // Fetch the available options for each filter
  const filterPromises = props.availableFilters?.map<Promise<Filter>>(async (filter) => {
    // If filter is a boolean filter, return a boolean filter
    if (filter.filterType === "boolean") {
      return {
        id: filter.id,
        label: filter.label,
        type: {
          id: "options",
          options: [
            {
              id: "true",
              label: t("booleanFilter.true"),
            },
            {
              id: "false",
              label: t("booleanFilter.false"),
            },
          ],
        },
      } as Filter;
    }

    // Get the repository for the filter id
    const repository = await getRepository(
      filter.id as keyof EntitySchema.Entities,
      props.repository as undefined,
    );

    // Fetch the available options for the filter
    const optionCriteria = new Criteria(1, 500);
    // Include the id and name of the entity result
    optionCriteria.addIncludes({
      [filter.id]: ["id", "name"],
    });
    const options = await repository.search(optionCriteria);

    return {
      id: filter.id,
      label: filter.label,
      type: {
        id: "options",
        options: options?.map((option) => ({
          id: option.id,
          // @ts-expect-error - name will be used for label
          label: option?.name ?? "",
        })),
      },
    } as Filter;
  });

  // @ts-expect-error - The filter type is not known
  const filters: Filter[] = await Promise.all(filterPromises);

  return filters;
}, []);

// Add the filters to the criteria
function addDataTableFilters(criteria: Criteria, filters: Filter[]): Criteria {
  filters.forEach((filter) => {
    filter.type.options.forEach((option) => {
      criteria.addFilter(Criteria.equals(filter.id, option.id));
    });
  });

  return criteria;
}

// Fetch the data from the repository
const fetchData = async () => {
  isLoading.value = true;

  try {
    const criteria = new Criteria();
    criteria.setLimit(paginationLimit.value);
    criteria.setPage(currentPage.value);

    if (sortBy.value) {
      criteria.addSorting({
        field: sortBy.value,
        // TODO: Add support for checking natural sorting
        naturalSorting: false,
        order: sortDirection.value,
      });
    }

    if (searchValue.value) {
      criteria.setTerm(searchValue.value);
    }

    if (appliedFilters.value.length > 0) {
      addDataTableFilters(criteria, appliedFilters.value);
    }

    const data = await repository.value.search(criteria);

    if (data) {
      dataSource.value = data;
      paginationTotalItems.value = data.total ?? 0;
      numberOfResults.value = data.total ?? 0;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch the data when something changes
watch([currentPage, paginationLimit, sortBy, sortDirection, searchValue, appliedFilters], () => {
  fetchData();
});

// Fetch the data on mounted
onMounted(() => {
  fetchData();
});

// Handle the pagination current page change
const handlePaginationCurrentPageChange = (page: number) => {
  currentPage.value = page;
};

// Handle the pagination limit change
const handlePaginationLimitChange = (limit: number) => {
  paginationLimit.value = limit;
};

// Handle the change enable row numbering
const handleChangeEnableRowNumbering = (newEnableRowNumbering: boolean) => {
  enableRowNumbering.value = newEnableRowNumbering;
};

// Handle the change show outlines
const handleChangeShowOutlines = (newShowOutlines: boolean) => {
  showOutlines.value = newShowOutlines;
};

// Handle the change show stripes
const handleChangeShowStripes = (newShowStripes: boolean) => {
  showStripes.value = newShowStripes;
};

// Handle the change enable outline framing
const handleChangeOutlineFraming = (newEnableOutlineFraming: boolean) => {
  enableOutlineFraming.value = newEnableOutlineFraming;
};

// Handle the sort change
const handleSortChange = (newSortBy: string, newSortDirection: "ASC" | "DESC") => {
  sortBy.value = newSortBy;
  sortDirection.value = newSortDirection;
};

// Handle the search value change
const handleSearchValueChange = (newSearchValue: string) => {
  searchValue.value = newSearchValue;
};

// Handle the selection change
const handleSelectionChange = (row: { id: string; value: boolean }) => {
  if (row.value && !selectedRows.value.includes(row.id)) {
    selectedRows.value.push(row.id);
  } else {
    selectedRows.value = selectedRows.value.filter((id) => id !== row.id);
  }
};

// Handle the multiple selection change
const handleMultipleSelectionChange = ({
  selections,
  value,
}: {
  selections: string[];
  value: boolean;
}) => {
  if (value) {
    // Add the new selections to the selected rows and remove duplicates
    selectedRows.value = Array.from(new Set([...selectedRows.value, ...selections]));
  } else {
    selectedRows.value = selectedRows.value.filter((id) => !selections.includes(id));
  }
};

// Handle the open details
const handleOpenDetails = (row: { id: string }) => {
  emit("open-details", row);
};

// Handle the bulk delete
const handleBulkDelete = () => {
  emit("bulk-delete", selectedRows.value);
};

// Handle the bulk edit
const handleBulkEdit = () => {
  emit("bulk-edit", selectedRows.value);
};

// Handle the item delete
const handleItemDelete = async ({ id }: { id: string }) => {
  itemToDelete.value = id;
  const isInIframe = window.self !== window.top;

  if (isInIframe && !props.forceRealModal) {
    const { ui } = await import("@shopware-ag/meteor-admin-sdk");

    // If we are inside a iFrame, we need to trigger the
    // sdk modal to open
    ui.modal.open({
      title: t("entity.delete.title"),
      textContent: t("entity.delete.description"),
      buttons: [
        {
          label: t("entity.delete.cancel"),
          variant: "ghost",
          size: "small",
          method: () => {
            ui.modal.close({});
          },
        },
        {
          label: t("entity.delete.delete"),
          variant: "danger",
          size: "small",
          method: () => {
            handleItemDeleteConfirm();
            ui.modal.close({});
          },
        },
      ],
    });
  } else {
    isDeleteModalOpen.value = true;
  }
};

// Handle the item delete confirm
const handleItemDeleteConfirm = async () => {
  try {
    isDeletingEntity.value = true;

    if (itemToDelete.value) {
      await repository.value.delete(itemToDelete.value);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isDeleteModalOpen.value = false;
    isDeletingEntity.value = false;

    await fetchData();
  }
};
</script>

<style lang="scss">
.mt-entity-data-table__delete-modal-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
