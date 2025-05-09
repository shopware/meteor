import type { StoryObj, Meta } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { defineComponent } from "vue";
import { get } from "../../../utils/object"; // Assuming path is correct

import MtEntityDataTable from "./mt-entity-data-table.vue";
import type { ColumnDefinition, CriteriaStaticHelpers } from "./mt-entity-data-table.vue";
import MtDataTableFixtures from "../../table-and-list/mt-data-table/mt-data-table.fixtures.json";
// Import other components if used in story template, e.g., MtButton for toolbar slots

// Explicit types for mocks to satisfy export requirements
// These should match the expected signatures from the SDK
type EqualsFilter = ReturnType<CriteriaStaticHelpers['equals']>;
type SortFilter = ReturnType<CriteriaStaticHelpers['sort']>;
type MultiFilter = ReturnType<CriteriaStaticHelpers['multi']>;
// Adjust this based on the actual EntityCollection structure or use `any` if too complex for story mock
type MockEntityCollection = Array<any> & { total: number | null, criteria: any, context: any, aggregations: any | null, getIds: () => string[] };

// Mock for window.sw
// Use basic function types compatible with fn()
const mockSwCriteriaStaticEquals: (...args: Parameters<CriteriaStaticHelpers['equals']>) => EqualsFilter = fn((field: string, value: any) => ({ type: 'equals', field, value, _mocked: true } as EqualsFilter));
const mockSwCriteriaStaticSort: (...args: Parameters<CriteriaStaticHelpers['sort']>) => SortFilter = fn((field: string, order = 'ASC', naturalSorting = false) => ({ field, order, naturalSorting, _mocked: true } as SortFilter));
const mockSwCriteriaStaticMulti: (...args: Parameters<CriteriaStaticHelpers['multi']>) => MultiFilter = fn((operator: 'and' | 'AND' | 'or' | 'OR', queries = []) => ({ type: 'multi', operator, queries, _mocked: true } as MultiFilter));

// Define the type for the repository search function
type RepositorySearchFn = (criteria: any) => Promise<MockEntityCollection | null>;
const mockRepositorySearch: RepositorySearchFn & ReturnType<typeof fn> = fn(async (criteria: any) => {
  // Simulate API call
  console.log(`Mock SDK: Searching entity with criteria:`, JSON.parse(JSON.stringify(criteria)));
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400)); // Simulate delay

  let items = JSON.parse(JSON.stringify(MtDataTableFixtures)); // Deep clone

  // Basic term search (name or manufacturer name)
  if (criteria.term) {
    items = items.filter((item: any) =>
      item.name?.toLowerCase().includes(criteria.term.toLowerCase()) ||
      item.manufacturer?.name?.toLowerCase().includes(criteria.term.toLowerCase())
    );
  }

  // Basic sorting
  if (criteria.sortings && criteria.sortings.length > 0) {
    const sorter = criteria.sortings[0];
    items.sort((a: any, b: any) => {
      const valA = get(a, sorter.field);
      const valB = get(b, sorter.field);
      let comparison = 0;
      if (valA < valB) comparison = -1;
      if (valA > valB) comparison = 1;
      return sorter.order === 'ASC' ? comparison : comparison * -1;
    });
  }
  
  // Basic filtering (expects filters to be [{type: 'equals', field: 'fieldName', value: 'fieldValue'}])
  // This is a simplified mock. Real SDK criteria filters are more complex.
  if (criteria.filters && criteria.filters.length > 0) {
    criteria.filters.forEach((filter: any) => {
      if (filter.type === 'equals') {
        items = items.filter((item: any) => get(item, filter.field) === filter.value);
      } else if (filter.type === 'multi' && filter.operator?.toUpperCase() === 'OR') {
        items = items.filter((item: any) => 
          filter.queries.some((query: any) => get(item, query.field) === query.value)
        );
      }
      // Add more filter types if needed
    });
  }


  const total = items.length;
  const paginatedItems = items.slice(
    (criteria.page - 1) * criteria.limit,
    criteria.page * criteria.limit
  );

  // Mimic EntityCollection structure
  const entityCollection = [...paginatedItems] as any;
  entityCollection.total = total;
  entityCollection.criteria = criteria;
  entityCollection.entity = criteria.entityName; // Assuming entityName is on criteria for mock
  entityCollection.context = {
    languageId: 'mockLanguageId',
    liveVersionId: 'mockLiveVersionId',
  };
  entityCollection.aggregations = null;
  entityCollection.getIds = () => paginatedItems.map((i: any) => i.id);

  return Promise.resolve(entityCollection);
});

const mockRepositoryInstance = {
  search: mockRepositorySearch,
  get: fn().mockResolvedValue(MtDataTableFixtures[0]), // Mock other methods as needed
  save: fn().mockResolvedValue(undefined),
  delete: fn().mockResolvedValue(undefined),
  create: fn().mockResolvedValue(MtDataTableFixtures[0]),
};

const mockSwRepository = fn((entityName: string) => {
  console.log(`Mock SDK: Repository requested for ${entityName}`);
  (mockRepositoryInstance as any)._entityName = entityName; // Store for verification
  return mockRepositoryInstance;
});

const MockCriteriaClass = class {
  public page: number;
  public limit: number;
  public term: string | null = null;
  public filters: any[] = [];
  public ids: string[] = [];
  public queries: any[] = [];
  public associations: any[] = [];
  public postFilter: any[] = [];
  public sortings: any[] = [];
  public aggregations: any[] = [];
  public grouping: string[] = [];
  public fields: string[] = [];
  public groupFields: any[] = [];
  public totalCountMode: number | null = 1;
  public includes: any | null = null;
  public _mocked: boolean = true;

  constructor(page = 1, limit = 25, ..._args: any[]) {
    this.page = page;
    this.limit = limit;
    // console.log('MockCriteriaClass instance created with page:', page, 'limit:', limit);
  }
  setPage(p: number) { this.page = p; return this; }
  setLimit(l: number) { this.limit = l; return this; }
  setTerm(t: string) { this.term = t; return this;}
  addFilter(f: any) { this.filters.push(f); return this; }
  addSorting(s: any) { this.sortings.push(s); return this; }
  addAssociation(a: string) { this.associations.push({ association: a, criteria: new MockCriteriaClass() }); return this;}
  setTotalCountMode(m: number) { this.totalCountMode = m; return this;}
  getAssociation(_path: string) { return new MockCriteriaClass(); } // Simplified mock

  static equals = mockSwCriteriaStaticEquals;
  static sort = mockSwCriteriaStaticSort;
  static multi = mockSwCriteriaStaticMulti;
};

if (!(window as any).sw) {
  (window as any).sw = {
    data: {
      repository: mockSwRepository,
      Classes: {
        Criteria: MockCriteriaClass,
      },
    },
    // Add other sw sub-objects if mt-entity-data-table uses them
  };
}

// Export mocks needed by interactive stories
export { mockRepositorySearch, mockSwCriteriaStaticEquals, mockSwCriteriaStaticSort, mockSwCriteriaStaticMulti };

export type MtEntityDataTableMeta = Meta<typeof MtEntityDataTable>;

export default {
  title: "Components/Entity/mt-entity-data-table",
  component: MtEntityDataTable,
  excludeStories: [
      "mockRepositorySearch",
      "mockSwCriteriaStaticEquals",
      "mockSwCriteriaStaticSort",
      "mockSwCriteriaStaticMulti",
  ],
  argTypes: {
    // Props of mt-entity-data-table
    entity: { control: "text", description: "Name of the entity to display." },
    columns: { control: "object", description: "Column definitions." },
    // Add other specific props for mt-entity-data-table if any beyond mt-data-table's
    providedRepository: { control: false, description: "Externally provided repository instance." },
    providedCriteriaClass: { control: false, description: "Externally provided Criteria class." },
    providedCriteriaStaticHelpers: { control: false, description: "Externally provided Criteria static helpers." },

    // Props passed to mt-data-table (taken from mt-data-table.stories.ts for consistency)
    title: { control: "text" },
    subtitle: { control: "text" },
    layout: { control: "select", options: ["default", "full"] },
    enableReload: { control: "boolean" },
    // Pagination
    currentPage: { control: "number" }, // This will be managed internally by entity-data-table
    paginationLimit: { control: "number" }, // This will be managed internally by entity-data-table
    paginationOptions: { control: "object" },
    // Sorting & Search
    defaultSortBy: { control: "text" },
    defaultSortDirection: { control: "select", options: ["ASC", "DESC"] },
    disableSearch: { control: "boolean" },
    // Row Selection & Bulk Actions
    allowRowSelection: { control: "boolean" },
    selectedRows: { control: "object" }, // If controlled from outside
    allowBulkEdit: { control: "boolean" },
    allowBulkDelete: { control: "boolean" },
    bulkEditMoreActions: { control: "object" },
    // Appearance
    showOutlines: { control: "boolean" },
    showStripes: { control: "boolean" },
    enableOutlineFraming: { control: "boolean" },
    enableRowNumbering: { control: "boolean" },
    // Disabling features
    disableDelete: { control: "boolean" },
    disableEdit: { control: "boolean" },
    disableSettingsTable: { control: "boolean" },
    // Accessibility & Filters
    caption: { control: "text" },
    filters: { control: "object" },
    initialAppliedFilters: { control: "object" },
    initialCriteria: { control: "object" },
    associations: { control: "object" },


    // Events (actions)
    // These are events from mt-data-table that mt-entity-data-table re-emits
    openDetails: { action: "open-details" },
    itemDelete: { action: "item-delete" },
    selectionChange: { action: "selection-change" },
    multipleSelectionChange: { action: "multiple-selection-change" },
    bulkEdit: { action: "bulk-edit" },
    bulkDelete: { action: "bulk-delete" },
    // Events specific to mt-entity-data-table
    dataLoaded: { action: "data-loaded" },
    loadError: { action: "load-error" },
  },
  args: {
    entity: "product", // Default entity
    columns: [
      { label: "Name", property: "name", renderer: "text", position: 0, cellWrap: "normal", sortable: true },
      { label: "Manufacturer", property: "manufacturer.name", renderer: "text", position: 100, cellWrap: "normal", sortable: true },
      { label: "Active", property: "active", renderer: "badge", position: 200,
        rendererOptions: {
          renderItemBadge: (data: any, columnDefinition: ColumnDefinition) => {
            const value = get(data, columnDefinition.property);
            return value ? { variant: "positive", label: "Active" } : { variant: "critical", label: "Inactive" };
          },
        },
      },
      { label: "Price", property: "price[0].gross", renderer: "price", position: 300,
        rendererOptions: { currencyISOCode: "EUR", source:"gross" }
      },
      { label: "Stock", property: "stock", renderer: "number", position: 400, sortable: true },
    ] as ColumnDefinition[],
    title: "Entity Data Table",
    subtitle: "Displaying data from a repository",
    layout: "default",
    enableReload: true,
    // currentPage & paginationLimit are managed internally by default, but can be influenced by initial props if needed
    // For storybook control, we might need to reflect them or let the component manage them.
    // For now, let internal state handle it based on interactions.
    paginationOptions: [5, 10, 25, 50],
    defaultSortBy: "name",
    defaultSortDirection: "ASC",
    disableSearch: false,
    allowRowSelection: true,
    selectedRows: [],
    allowBulkEdit: true,
    allowBulkDelete: true,
    bulkEditMoreActions: [],
    showOutlines: true,
    showStripes: true,
    enableOutlineFraming: false,
    enableRowNumbering: false,
    disableDelete: false,
    disableEdit: false,
    disableSettingsTable: false,
    caption: "Product Data",
    filters: [], // Example: [{ id: 'active', label: 'Status', type: { id: 'options', options: [{id: true, label: 'Active'}, {id: false, label: 'Inactive'}] } }]
    initialAppliedFilters: [],
    initialCriteria: {},
    associations: [],

    // Mock event handlers
    openDetails: fn(),
    itemDelete: fn(),
    selectionChange: fn(),
    multipleSelectionChange: fn(),
    bulkEdit: fn(),
    bulkDelete: fn(),
    dataLoaded: fn(),
    loadError: fn(),
  },
} as MtEntityDataTableMeta;

export const Default: StoryObj<MtEntityDataTableMeta> = {
  name: "Default Table",
  render: (args) => defineComponent({
    components: { MtEntityDataTable },
    setup() {
      // Reset mocks for each story render if they are stateful in a way that stories interfere
      // mockSwRepository.mockClear();
      // mockRepositorySearch.mockClear();
      // mockSwCriteriaStaticEquals.mockClear();
      // mockSwCriteriaStaticSort.mockClear();
      // mockSwCriteriaStaticMulti.mockClear();
      // (window as any).sw.data.Classes.Criteria.equals.mockClear?.(); // if it's a spy

      return { args };
    },
    template: '<MtEntityDataTable v-bind="args" />',
  }),
  play: async () => {
    // Basic play function to ensure it renders without crashing
    await new Promise(resolve => setTimeout(resolve, 100)); // wait for async operations
    console.log("Default story rendered for mt-entity-data-table.");
  }
};

export const WithProvidedRepository: StoryObj<MtEntityDataTableMeta> = {
  name: "With Provided Repository",
  args: {
    entity: "customProduct",
    providedRepository: { // A custom repository mock
      search: fn(async (criteria: any) => {
        console.log("Custom Repository Search Called with criteria:", criteria);
        // Return a slightly different dataset or structure to verify it's used
        const items = [{ id: 'custom-1', name: 'Custom Item 1', manufacturer: { name: 'Custom Inc.' }, active: true, stock: 10, price: [{gross: 100}] }];
        const entityCollection = [...items] as any;
        entityCollection.total = items.length;
        entityCollection.criteria = criteria;
        return Promise.resolve(entityCollection);
      }),
      // get, save, etc. if needed
    } as any, // Cast as any if the mock doesn't fully implement the Repository type
  },
   render: (args) => defineComponent({
    components: { MtEntityDataTable },
    setup() { return { args }; },
    template: '<MtEntityDataTable v-bind="args" />',
  }),
};

export const WithProvidedCriteria: StoryObj<MtEntityDataTableMeta> = {
  name: "With Provided Criteria Class & Helpers",
  args: {
    entity: "anotherEntity",
    providedCriteriaClass: class CustomCriteria { // A custom Criteria class mock
        public page: number;
        public limit: number;
        public term: string | null = null;
        public filters: any[] = [];
        public sortings: any[] = [];
        public associations: any[] = [];
        public totalCountMode: number | null = 1;
        public _isCustom: boolean = true;

        constructor(page=1, limit=25) { this.page = page; this.limit = limit; console.log("CUSTOM Criteria INSTANCE created"); }
        setPage(p: number) { this.page = p; return this; }
        setLimit(l: number) { this.limit = l; return this; }
        setTerm(t: string) { this.term = t; return this; }
        addFilter(f: any) { this.filters.push(f); console.log("CUSTOM addFilter", f); return this; }
        addSorting(s: any) { this.sortings.push(s); console.log("CUSTOM addSorting", s); return this; }
        addAssociation(a: string) { this.associations.push({association: a}); return this; }
        setTotalCountMode(m: number) { this.totalCountMode = m; return this;}
        getAssociation(_path: string) { return new (this.constructor as any)(); }
    } as any,
    providedCriteriaStaticHelpers: { // Custom static helpers
      equals: fn((field, value) => ({ type: 'customEquals', field, value, custom: true })),
      sort: fn((field, order) => ({ field, order, customSort: true })),
      multi: fn((op, queries) => ({ type: 'customMulti', op, queries, custom: true })),
    } as any,
  },
   render: (args) => defineComponent({
    components: { MtEntityDataTable },
    setup() { return { args }; },
    template: '<MtEntityDataTable v-bind="args" />',
  }),
};

// Add more stories: FullLayout, EmptyState (mock repo to return empty), LoadingState (mock repo with delay), etc. 