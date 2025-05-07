<template>
  <mt-data-table
    :title="title"
    :subtitle="subtitle"
    :layout="layout"
    :columns="columns"
    :column-changes="columnChanges"
    :data-source="dataSource"
    :is-loading="isLoading"
    :current-page="currentPage"
    :pagination-limit="paginationLimit"
    :pagination-total-items="paginationTotalItems"
    :pagination-options="paginationOptions"
    :sort-by="sortBy"
    :sort-direction="sortDirection"
    :search-value="searchValue"
    :disable-search="disableSearch"
    :allow-row-selection="allowRowSelection"
    :selected-rows="selectedRows"
    :allow-bulk-edit="allowBulkEdit"
    :allow-bulk-delete="allowBulkDelete"
    :bulk-edit-more-actions="bulkEditMoreActions"
    :enable-row-numbering="enableRowNumbering"
    :show-stripes="showStripes"
    :show-outlines="showOutlines"
    :enable-outline-framing="enableOutlineFraming"
    :disable-delete="disableDelete"
    :disable-edit="disableEdit"
    :disable-settings-table="disableSettingsTable"
    :caption="caption"
    :filters="filters"
    :applied-filters="currentAppliedFilters"
    :number-of-results="paginationTotalItems"
    :enable-reload="enableReload"
    @reload="onReload"
    @pagination-limit-change="onPaginationLimitChange"
    @pagination-current-page-change="onPaginationCurrentPageChange"
    @search-value-change="onSearchValueChange"
    @sort-change="onSortChange"
    @update:appliedFilters="onUpdateAppliedFilters"
    @open-details="(item) => $emit('open-details', item)"
    @selection-change="(selection) => $emit('selection-change', selection)"
    @multiple-selection-change="(selection) => $emit('multiple-selection-change', selection)"
    @bulk-edit="() => $emit('bulk-edit')"
    @bulk-delete="() => $emit('bulk-delete')"
    @change-show-outlines="(value) => $emit('change-show-outlines', value)"
    @change-show-stripes="(value) => $emit('change-show-stripes', value)"
    @change-outline-framing="(value) => $emit('change-outline-framing', value)"
    @change-enable-row-numbering="(value) => $emit('change-enable-row-numbering', value)"
    @item-delete="(item) => $emit('item-delete', item)"
  >
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </mt-data-table>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, type PropType } from "vue";
import type * as MeteorAdminSDK from "@shopware-ag/meteor-admin-sdk"; // Use a clear alias

import MtDataTable from "../../table-and-list/mt-data-table/mt-data-table.vue";
import type {
  ColumnDefinition,
  ColumnChanges,
} from "../../table-and-list/mt-data-table/mt-data-table.vue";
import type { Filter } from "../../table-and-list/mt-data-table/mt-data-table.interfaces"; // Adjusted path

// Forward type declarations from mt-data-table for convenience
export type { ColumnDefinition, ColumnChanges, Filter };

declare global {
  // eslint-disable-next-line no-var
  var sw: typeof MeteorAdminSDK;
  // The EntitySchema namespace is used for global type augmentation,
  // aligning with the Admin SDK's documented approach for entity type definitions (see installation.md).
  // While the linter prefers ES modules, namespaces are a standard way to declare global shapes.
  namespace EntitySchema {
    // This should be populated with actual entity definitions for full type safety
    // For now, allow any string to avoid blocking, but ideally, this would be specific.
    interface Entities {
      [key: string]: any;
    }
  }
}

// Infer types from the runtime SDK structure
// This assumes `sw` is globally available and typed by `@shopware-ag/meteor-admin-sdk`

// Remove manually defined SingleFilter, as it conflicts.
// We will rely on TypeScript to infer the correct filter object types from SDK methods.

type Criteria = InstanceType<typeof sw.data.Classes.Criteria>;
// Specific type for objects returned by Criteria.equals
type EqualsFilterType = ReturnType<typeof sw.data.Classes.Criteria.equals>;
// Specific type for objects returned by Criteria.multi
type MultiFilterType = ReturnType<typeof sw.data.Classes.Criteria.multi>;
// A union type for what addFilter might accept, based on what Criteria.equals and Criteria.multi return
type AdmissibleFilterType = EqualsFilterType | MultiFilterType;

type Repository<TEntityName extends keyof EntitySchema.Entities>
  = ReturnType<typeof sw.data.repository<TEntityName>>;
type EntityCollection<TEntityName extends keyof EntitySchema.Entities>
  = Awaited<ReturnType<Repository<TEntityName>["search"]>>;

// Type for the expected structure of criteria static helpers
export interface CriteriaStaticHelpers {
  equals: typeof sw.data.Classes.Criteria.equals;
  sort: typeof sw.data.Classes.Criteria.sort;
  multi: typeof sw.data.Classes.Criteria.multi;
  // Add other static methods if used/needed, e.g., range, contains, etc.
}

export default defineComponent({
  name: "MtEntityDataTable",

  components: {
    MtDataTable,
  },

  props: {
    entity: {
      type: String,
      required: true,
    },
    columns: {
      type: Array as PropType<ColumnDefinition[]>,
      required: true,
    },
    columnChanges: {
      type: Object as PropType<Record<string, ColumnChanges>>,
      required: false,
      default: () => ({}),
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
    subtitle: {
      type: String,
      required: false,
      default: "",
    },
    layout: {
      type: String as PropType<"default" | "full">,
      required: false,
      default: "default",
    },
    enableReload: {
      type: Boolean,
      required: false,
      default: true, // Default to true for entity table as data can change
    },
    defaultSortBy: {
      type: String,
      required: false,
      default: undefined,
    },
    defaultSortDirection: {
      type: String as PropType<"ASC" | "DESC">,
      required: false,
      default: "ASC",
    },
    initialCriteria: {
      type: Object as PropType<Partial<Criteria>>,
      required: false,
      default: () => ({}),
    },
    associations: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
    /**
     * Optionally provide an external repository instance.
     * Expected to conform to the Shopware Admin SDK Repository interface.
     */
    providedRepository: {
      type: Object as PropType<Repository<keyof EntitySchema.Entities> | null>,
      required: false,
      default: null,
    },
    /**
     * Optionally provide an external Criteria class constructor.
     * Instances are expected to conform to the Shopware Admin SDK Criteria interface.
     */
    providedCriteriaClass: {
      type: Function, // Vue's standard way to denote a function/constructor prop
      required: false,
      default: null,
      // We will handle more specific TypeScript typing in the setup function
    },
    /**
     * Optionally provide an external object for Criteria static helper methods
     * (e.g., equals, sort, multi). Expected to match Shopware Admin SDK Criteria static methods' signatures.
     */
    providedCriteriaStaticHelpers: {
      type: Object as PropType<CriteriaStaticHelpers | null>,
      required: false,
      default: null,
    },
    // Props directly passed to mt-data-table (and their defaults from mt-data-table)
    paginationOptions: {
      type: Array as PropType<number[]>,
      required: false,
      default: () => [5, 10, 25, 50],
    },
    disableSearch: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowRowSelection: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectedRows: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
    allowBulkEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowBulkDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
    bulkEditMoreActions: {
      type: Array as PropType<any[]>, // Consider defining a more specific type
      required: false,
      default: () => [],
    },
    enableRowNumbering: {
      type: Boolean,
      required: false,
      default: false,
    },
    showStripes: {
      type: Boolean,
      required: false,
      default: true,
    },
    showOutlines: {
      type: Boolean,
      required: false,
      default: true,
    },
    enableOutlineFraming: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableSettingsTable: {
      type: Boolean,
      required: false,
      default: false,
    },
    caption: {
      type: String,
      required: false,
      default: "Data table",
    },
    filters: {
      type: Array as PropType<Filter[]>,
      required: false,
      default: () => [],
    },
    initialAppliedFilters: {
      type: Array as PropType<Filter[]>,
      required: false,
      default: () => [],
    },
  },

  emits: [
    "open-details",
    "selection-change",
    "multiple-selection-change",
    "bulk-edit",
    "bulk-delete",
    "change-show-outlines",
    "change-show-stripes",
    "change-outline-framing",
    "change-enable-row-numbering",
    "item-delete",
    "data-loaded",
    "load-error",
  ],

  setup(props, { emit }) {
    const dataSource = ref<any[]>([]);
    const isLoading = ref(false);
    const currentPage = ref(1);
    const paginationLimit = ref(props.paginationOptions[0] || 25);
    const paginationTotalItems = ref(0);
    const sortBy = ref<string | undefined>(props.defaultSortBy);
    const sortDirection = ref<"ASC" | "DESC">(props.defaultSortDirection);
    const searchValue = ref("");
    const currentAppliedFilters = ref<Filter[]>(props.initialAppliedFilters);

    const CriteriaClassToUse = computed(() => {
      const cls = props.providedCriteriaClass || sw.data.Classes.Criteria;
      // Assert that the chosen class is a constructor for Criteria instances.
      // This cast is safe if props.providedCriteriaClass is used correctly by the parent.
      return cls as (new (...args: any[]) => Criteria);
    });

    const CriteriaStaticsToUse = computed<CriteriaStaticHelpers>(() => {
      if (props.providedCriteriaStaticHelpers) {
        return props.providedCriteriaStaticHelpers;
      }
      // Ensure sw.data.Classes.Criteria and its methods are available
      if (typeof sw !== 'undefined' && sw.data && sw.data.Classes && sw.data.Classes.Criteria) {
        return sw.data.Classes.Criteria; // It has static methods like .equals, .sort
      }
      // Fallback to a dummy object if SDK is not fully loaded to prevent runtime errors on access
      // This case should ideally be handled by ensuring SDK is loaded before component mounts
      console.warn("SDK Criteria static helpers not available, falling back to dummy implementation.");
      return {
        equals: (() => ({ type: 'equals' } as EqualsFilterType)), // Provide minimal valid structure
        sort: (() => ({ field: '', order: 'ASC', naturalSorting: false })), 
        multi: (() => ({ type: 'multi' } as MultiFilterType)),
      };
    });

    const buildCriteriaInstance = (): Criteria => {
      const criteriaInst = new CriteriaClassToUse.value(
        currentPage.value,
        paginationLimit.value,
      );

      // Apply initial criteria from props
      if (props.initialCriteria) {
        for (const key in props.initialCriteria) {
          if (Object.prototype.hasOwnProperty.call(props.initialCriteria, key)) {
            const value = (props.initialCriteria as any)[key];
            const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;

            if (typeof (criteriaInst as any)[setterName] === 'function') {
              (criteriaInst as any)[setterName](value);
            } else if (typeof (criteriaInst as any)[key] === 'function') {
              if (Array.isArray(value) && key !== 'addFilter' && key !== 'addSorting') {
                value.forEach(item => (criteriaInst as any)[key](item));
              } else {
                (criteriaInst as any)[key](value);
              }
            } else if (Object.prototype.hasOwnProperty.call(criteriaInst, key)){
              (criteriaInst as any)[key] = value;
            }
          }
        }
      }

      // Apply search term
      if (searchValue.value) {
        criteriaInst.setTerm(searchValue.value);
      }

      // Apply sorting
      if (sortBy.value && sortDirection.value) {
        criteriaInst.addSorting(
          CriteriaStaticsToUse.value.sort(sortBy.value, sortDirection.value)
        );
      }

      // Apply associations
      props.associations.forEach((association: string) => {
        criteriaInst.addAssociation(association);
      });

      // Apply filters from mt-data-table
      currentAppliedFilters.value.forEach((filterGroup: Filter) => {
        if (filterGroup.type && filterGroup.type.options && filterGroup.type.options.length > 0) {
          const individualEqualsFilters: EqualsFilterType[] = filterGroup.type.options.map((option: { id: string; label: string }) => {
            return CriteriaStaticsToUse.value.equals(filterGroup.id, option.id);
          });

          if (individualEqualsFilters.length > 1) {
            const multiFilter: MultiFilterType = CriteriaStaticsToUse.value.multi('OR', individualEqualsFilters);
            criteriaInst.addFilter(multiFilter);
          } else if (individualEqualsFilters.length === 1) {
            criteriaInst.addFilter(individualEqualsFilters[0]);
          }
        }
      });

      // Set total count mode for accurate pagination
      criteriaInst.setTotalCountMode(1);

      return criteriaInst;
    };

    const activeRepository = computed<Repository<keyof EntitySchema.Entities> | null>(() => {
      if (props.providedRepository) {
        return props.providedRepository;
      }
      if (typeof sw === "undefined" || !sw.data || !sw.data.repository || !sw.data.Classes?.Criteria) {
        console.warn(
          "Shopware Admin SDK (sw.data.repository or sw.data.Classes.Criteria) not available. Ensure it is loaded.",
        );
        return null;
      }
      try {
        // Cast props.entity to keyof EntitySchema.Entities for the repository type
        return sw.data.repository(props.entity as keyof EntitySchema.Entities);
      } catch (error) {
        console.error(`Failed to get repository for entity "${props.entity}":`, error);
        return null;
      }
    });

    const fetchData = async () => {
      if (!activeRepository.value) {
        dataSource.value = [];
        paginationTotalItems.value = 0;
        isLoading.value = false;
        emit("load-error", new Error("Repository instance not available"));
        return;
      }

      isLoading.value = true;
      try {
        const criteriaInstance = buildCriteriaInstance(); // Use the extracted helper function

        const result = await activeRepository.value.search(criteriaInstance) as EntityCollection<keyof EntitySchema.Entities> | null; // Explicitly include | null

        if (result) {
          dataSource.value = [...result]; // EntityCollection extends Array, spread to ensure new array ref
          paginationTotalItems.value = result.total || 0;
          emit("data-loaded", {
              items: dataSource.value,
              total: paginationTotalItems.value,
          });
        } else {
          // Handle null result case
          dataSource.value = [];
          paginationTotalItems.value = 0;
          emit("data-loaded", { items: [], total: 0 }); // Or emit a specific error/empty event
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dataSource.value = [];
        paginationTotalItems.value = 0;
        emit("load-error", error);
      } finally {
        isLoading.value = false;
      }
    };

    const onReload = () => {
      fetchData();
    };

    const onPaginationLimitChange = (limit: number) => {
      paginationLimit.value = limit;
      currentPage.value = 1; // Reset to first page
      fetchData();
    };

    const onPaginationCurrentPageChange = (page: number) => {
      currentPage.value = page;
      fetchData();
    };

    const onSearchValueChange = (term: string) => {
      searchValue.value = term;
      currentPage.value = 1; // Reset to first page
      fetchData();
    };

    const onSortChange = (newSortBy: string, newSortDirection: "ASC" | "DESC") => {
      sortBy.value = newSortBy;
      sortDirection.value = newSortDirection;
      currentPage.value = 1; // Reset to first page
      fetchData();
    };

    const onUpdateAppliedFilters = (updatedFilters: Filter[]) => {
      currentAppliedFilters.value = updatedFilters;
      currentPage.value = 1; // Reset to first page
      fetchData();
    };

    onMounted(() => {
      fetchData();
    });

    watch(() => props.entity, fetchData);
    watch(() => props.initialCriteria, fetchData, { deep: true });
    watch(() => props.associations, fetchData, { deep: true });
    watch(() => props.initialAppliedFilters, (newFilters) => {
        currentAppliedFilters.value = newFilters;
        fetchData();
    }, { deep: true });


    return {
      dataSource,
      isLoading,
      currentPage,
      paginationLimit,
      paginationTotalItems,
      sortBy,
      sortDirection,
      searchValue,
      currentAppliedFilters,
      onReload,
      onPaginationLimitChange,
      onPaginationCurrentPageChange,
      onSearchValueChange,
      onSortChange,
      onUpdateAppliedFilters,
    };
  },
});
</script>

<style lang="scss" scoped>
/* Add any component-specific styles here if needed */
</style>
