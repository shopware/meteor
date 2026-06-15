---
title: Data Table
description: A flexible table for displaying large datasets with pagination, sorting, filtering, and row selection.
---

::warning
**Experimental.** The API may still change in a future release.
::

## Import

```ts
import { MtDataTable } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Data Table** to present large, structured datasets in rows and columns.
- Define each column through a configuration object that sets its label, data property, renderer, and position.
- Drive the table entirely through props and react to its events; it holds no internal data state.
- Use pagination, sorting, filtering, and search to help users work through large result sets.
- Use row selection and bulk actions when users need to act on several rows at once.
- Use the `caption` prop to give screen readers a descriptive summary of the table.

## Examples

### Basic

::component-example{name="data-table-basic-example" fullWidth}
::

### Full width

The `full` layout lets the table span the available width instead of sitting in a centered card.

::component-example{name="data-table-full-width-example" fullWidth}
::

### Empty state

When the data source is empty, the table shows a built-in empty state.

::component-example{name="data-table-empty-state-example" fullWidth}
::

### Sticky header

The column header stays in view while the rows scroll.

::component-example{name="data-table-sticky-header-example" fullWidth}
::

## Basic usage

A minimal table needs a `dataSource`, a `columns` definition, and handlers for the pagination events:

```html
<template>
  <mt-data-table
    :data-source="dataSource"
    :columns="columns"
    :pagination-limit="10"
    :pagination-current-page="1"
    :pagination-total-items="100"
    :is-loading="isLoading"
    @pagination-limit-change="handleLimitChange"
    @pagination-current-page-change="handlePageChange"
  />
</template>

<script setup>
  import { ref } from "vue";

  const dataSource = ref([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    // ... more data
  ]);

  const columns = [
    { label: "Name", property: "name", sortable: true, position: 100 },
    { label: "Email", property: "email", sortable: true, position: 200 },
  ];

  const isLoading = ref(false);

  const handleLimitChange = (limit) => {
    // Handle page size change
  };

  const handlePageChange = (page) => {
    // Handle page change
  };
</script>
```

## Column configuration

Each column is described by a configuration object that controls how the cell is rendered and how it behaves:

```typescript
interface ColumnDefinition {
  label: string; // Column header label
  property: string; // Property path in the data source object
  renderer?: string; // How to render the cell ('text' | 'number' | 'price')
  position: number; // Column order (use increments of 100)
  sortable?: boolean; // Enable or disable sorting (default: true)
  width?: number; // Fixed column width
  allowResize?: boolean; // Allow column resizing
  visible?: boolean; // Show or hide the column
}
```

## Managing data

Because **Data Table** holds no internal state, the parent owns all data and UI state and reacts to the table's events. A complete integration wires every interaction back to a single data-fetching function:

```html
<template>
  <mt-data-table
    :data-source="dataSource"
    :columns="columns"
    :pagination-limit="limit"
    :pagination-current-page="currentPage"
    :pagination-total-items="totalItems"
    :is-loading="isLoading"
    :applied-filters="appliedFilters"
    @pagination-limit-change="handleLimitChange"
    @pagination-current-page-change="handlePageChange"
    @sort-change="handleSortChange"
    @search-value-change="handleSearchChange"
    @update:appliedFilters="handleFilterChange"
  />
</template>

<script setup>
  import { ref, onMounted } from "vue";

  // State management
  const dataSource = ref([]);
  const limit = ref(10);
  const currentPage = ref(1);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const appliedFilters = ref([]);
  const sortBy = ref({ property: "", direction: "" });
  const searchTerm = ref("");

  // Data fetching
  const fetchData = async () => {
    isLoading.value = true;
    try {
      const response = await api.fetchData({
        page: currentPage.value,
        limit: limit.value,
        sort: sortBy.value,
        filters: appliedFilters.value,
        search: searchTerm.value,
      });

      dataSource.value = response.data;
      totalItems.value = response.total;
    } finally {
      isLoading.value = false;
    }
  };

  // Event handlers
  const handleLimitChange = (newLimit) => {
    limit.value = newLimit;
    currentPage.value = 1; // Reset to first page
    fetchData();
  };

  const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    fetchData();
  };

  const handleSortChange = ({ property, direction }) => {
    sortBy.value = { property, direction };
    fetchData();
  };

  const handleSearchChange = (term) => {
    searchTerm.value = term;
    currentPage.value = 1; // Reset to first page
    fetchData();
  };

  const handleFilterChange = (newFilters) => {
    appliedFilters.value = newFilters;
    currentPage.value = 1; // Reset to first page
    fetchData();
  };

  // Initial data load
  onMounted(() => {
    fetchData();
  });
</script>
```

## Filtering

Filters are declared through a `filters` array and applied through `appliedFilters`. Each filter follows this structure:

```typescript
interface Filter {
  id: string;
  label: string;
  type: {
    id: string;
    options: Array<{
      id: string;
      label: string;
    }>;
  };
}
```

```html
<template>
  <mt-data-table
    :data-source="dataSource"
    :columns="columns"
    :filters="filters"
    :applied-filters="appliedFilters"
    @update:appliedFilters="updateFilters"
  />
</template>

<script setup>
  const filters = [
    {
      id: "status",
      label: "Status",
      type: {
        id: "select",
        options: [
          { id: "active", label: "Active" },
          { id: "inactive", label: "Inactive" },
        ],
      },
    },
  ];

  const appliedFilters = ref([]);
  const updateFilters = (newFilters) => {
    appliedFilters.value = newFilters;
  };
</script>
```

## Loading states

Toggle `isLoading` around data fetching so the table shows skeleton placeholders while data is on the way:

```html
<template>
  <mt-data-table
    :data-source="dataSource"
    :columns="columns"
    :is-loading="isLoading"
  />
</template>

<script setup>
  const isLoading = ref(false);

  const fetchData = async () => {
    isLoading.value = true;
    try {
      // Fetch your data
    } finally {
      isLoading.value = false;
    }
  };
</script>
```

## Creating a wrapper component

When several tables share the same data-management logic, wrap the component once to reduce boilerplate, centralize API integration, and keep table implementations consistent:

```html
<!-- DataTableWrapper.vue -->
<template>
  <mt-data-table
    v-bind="$props"
    :data-source="dataSource"
    :pagination-limit="limit"
    :pagination-current-page="currentPage"
    :pagination-total-items="totalItems"
    :is-loading="isLoading"
    :applied-filters="appliedFilters"
    v-on="$listeners"
    @pagination-limit-change="handleLimitChange"
    @pagination-current-page-change="handlePageChange"
    @sort-change="handleSortChange"
    @search-value-change="handleSearchChange"
    @update:appliedFilters="handleFilterChange"
  >
    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
  </mt-data-table>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const props = defineProps({
    fetchDataFn: { type: Function, required: true },
    defaultSort: {
      type: Object,
      default: () => ({ property: "", direction: "" }),
    },
    // ... other forwarded props
  });

  const dataSource = ref([]);
  const limit = ref(10);
  const currentPage = ref(1);
  const totalItems = ref(0);
  const isLoading = ref(false);
  const appliedFilters = ref([]);
  const sortBy = ref(props.defaultSort);
  const searchTerm = ref("");

  const fetchData = async () => {
    isLoading.value = true;
    try {
      const response = await props.fetchDataFn({
        page: currentPage.value,
        limit: limit.value,
        sort: sortBy.value,
        filters: appliedFilters.value,
        search: searchTerm.value,
      });

      dataSource.value = response.data;
      totalItems.value = response.total;
    } finally {
      isLoading.value = false;
    }
  };

  const handleLimitChange = (newLimit) => {
    limit.value = newLimit;
    currentPage.value = 1;
    fetchData();
  };
  const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    fetchData();
  };
  const handleSortChange = ({ property, direction }) => {
    sortBy.value = { property, direction };
    fetchData();
  };
  const handleSearchChange = (term) => {
    searchTerm.value = term;
    currentPage.value = 1;
    fetchData();
  };
  const handleFilterChange = (newFilters) => {
    appliedFilters.value = newFilters;
    currentPage.value = 1;
    fetchData();
  };

  onMounted(() => {
    fetchData();
  });
</script>
```

Consuming the wrapper then takes much less code:

```html
<!-- YourPage.vue -->
<template>
  <data-table-wrapper
    :columns="columns"
    :fetch-data-fn="fetchUsers"
    :default-sort="{ property: 'name', direction: 'asc' }"
  />
</template>

<script setup>
  import { ref } from "vue";
  import DataTableWrapper from "./DataTableWrapper.vue";

  const columns = [
    { label: "Name", property: "name", sortable: true, position: 100 },
    // ... other columns
  ];

  const fetchUsers = async (params) => {
    const response = await api.users.list(params);
    return { data: response.users, total: response.total };
  };
</script>
```

From here you can extend the wrapper with error handling and retry logic, caching, export, bulk actions, or persistent table state.

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Provide a unique `id` field for every row in the data source.
- Use increments of 100 for column positions to leave room for inserting columns later.
- Enable sorting only on columns where it is meaningful.
- Use server-side pagination and keep the current page's data source small for large datasets.
- Show the loading state while data is being fetched.
- Set the `caption` prop to describe the table for screen readers.

#dont

- Do not expect the table to manage its own data, sorting, or pagination state.
- Do not load an entire large dataset into the data source at once.
- Do not offer long or irrelevant filter option lists.

::

## Behavior

- **Data Table** is a dumb component: it renders data and emits events but keeps no internal state.
- All data and UI state, including current page, page size, sort column and direction, applied filters, search term, and selected rows, must be provided through props.
- User interactions such as sorting, filtering, pagination, search, and selection emit events that the parent must handle to update the data.
- Set `isLoading` to true while fetching data so the table shows skeleton placeholders, then set it back to false when the data arrives.
- When data management is repeated across several tables, wrap the component to centralize fetching, state, and event handling.

## Accessibility

- Use the `caption` prop to provide a descriptive summary of the table for screen readers.
- Keep column labels clear so the purpose of each column is understandable on its own.
