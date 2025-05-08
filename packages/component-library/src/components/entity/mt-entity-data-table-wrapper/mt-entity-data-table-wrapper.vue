<template>
    <div>
        <mt-data-table
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
            @pagination-current-page-change="handlePaginationCurrentPageChange"
            @pagination-limit-change="handlePaginationLimitChange"
            @change-enable-row-numbering="handleChangeEnableRowNumbering"
            @change-show-outlines="handleChangeShowOutlines"
            @change-show-stripes="handleChangeShowStripes"
            @change-outline-framing="handleChangeOutlineFraming"
        />
    </div>
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
import EntityCollection from '@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection';
import type Repository from '@shopware-ag/meteor-admin-sdk/es/data/Repository';
import Criteria from '@shopware-ag/meteor-admin-sdk/es/data/Criteria';
import MtDataTable, { type ColumnChanges, type ColumnDefinition } from '../../table-and-list/mt-data-table/mt-data-table.vue';
import { computed, onMounted, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue';
import { computedAsync, watchOnce } from '@vueuse/core';
import type { MtPopoverItemType } from '@/components/overlay/mt-popover-item/mt-popover-item.vue';

// Get props from mt-data-table component
const props = defineProps<{
    // Props needed for the data handling
    entity: string;

    // Optional props for the data handling
    repository?: typeof Repository;

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
}>();

// Required props for the mt-data-table component
const dataSource: Ref<[] | EntityCollection<string>> = ref([]);
const currentPage = ref(1);
const paginationLimit = ref(25);
const paginationTotalItems = ref(0);
const isLoading = ref(true);
const enableRowNumbering = ref(false);
const showOutlines = ref(true);
const showStripes = ref(true);
const enableOutlineFraming = ref(false);
const repository = computedAsync(async () => {
    if (!props.repository) {
        // Import the repository from the meteor-admin-sdk dynamically if not provided
        const { data } = await import('@shopware-ag/meteor-admin-sdk');

        // Fallback to the meteor-admin-sdk's repository if no repository is provided
        return data.repository(props.entity);
    }

    return props.repository(props.entity);
}, null);

// Fetch the data from the repository
const fetchData = async () => {
    isLoading.value = true;

    try {
        const criteria = new Criteria();
        criteria.setLimit(paginationLimit.value);
        criteria.setPage(currentPage.value);

        const data = await repository.value?.search(criteria);

    if (data) {
        dataSource.value = data;
            paginationTotalItems.value = data.total ?? 0;
        }
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

// Fetch the data when the repository is ready (needed when the sdk repository is used)
watch(repository, (newValue) => {
    if (!newValue) {
        return;
    }

    fetchData();
}, { immediate: true });

// Fetch the data when something changes
watch([currentPage, paginationLimit], () => {
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

</script>