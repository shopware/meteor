import SwDataTable from "./sw-data-table.vue";
import SwButton from "../../form/sw-button/sw-button.vue";
import SwBanner from "../../feedback-indicator/sw-banner/sw-banner.vue";
import SwDataTableFixtures from "./sw-data-table.fixtures.json";
import { get } from "lodash-es";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { defineComponent } from "vue";

export type SwDataTableMeta = SlottedMeta<
  typeof SwDataTable,
  | "_storybook_internal_show_experimental_warning_"
  | "reload"
  | "pagination-limit-change"
  | "paginationLimitChange"
  | "pagination-current-page-change"
  | "paginationCurrentPageChange"
  | "search-value-change"
  | "searchValueChange"
  | "sort-change"
  | "sortChange"
  | "open-details"
  | "openDetails"
  | "selection-change"
  | "selectionChange"
  | "multiple-selection-change"
  | "multipleSelectionChange"
  | "bulk-edit"
  | "bulkEdit"
  | "bulk-delete"
  | "bulkDelete"
  | "change-show-outlines"
  | "changeShowOutlines"
  | "change-show-stripes"
  | "changeShowStripes"
  | "change-outline-framing"
  | "changeOutlineFraming"
  | "change-enable-row-numbering"
  | "changeEnableRowNumbering"
  | "_remove_primary_toolbar_button_"
>;
export default {
  title: "Components/Table and list/sw-data-table",
  component: SwDataTable,
  argTypes: {
    // TODO: can be removed when component is not experimental anymore
    _storybook_internal_show_experimental_warning_: {
      table: {
        disable: true,
      },
    },
    // TODO: replace events with new storybook actions
    // events
    reload: {
      action: "reload",
      table: {
        category: "Events",
      },
    },
    "pagination-limit-change": {
      table: {
        disable: true,
      },
    },
    paginationLimitChange: {
      action: "pagination-limit-change",
      table: {
        category: "Events",
      },
    },
    "pagination-current-page-change": {
      table: {
        disable: true,
      },
    },
    paginationCurrentPageChange: {
      action: "pagination-current-page-change",
      table: {
        category: "Events",
      },
    },
    "search-value-change": {
      table: {
        disable: true,
      },
    },
    searchValueChange: {
      action: "search-value-change",
      table: {
        category: "Events",
      },
    },
    "sort-change": {
      table: {
        disable: true,
      },
    },
    sortChange: {
      action: "sort-change",
      table: {
        category: "Events",
      },
    },
    "open-details": {
      table: {
        disable: true,
      },
    },
    openDetails: {
      action: "open-details",
      table: {
        category: "Events",
      },
    },
    "selection-change": {
      table: {
        disable: true,
      },
    },
    selectionChange: {
      action: "selection-change",
      table: {
        category: "Events",
      },
    },
    "multiple-selection-change": {
      table: {
        disable: true,
      },
    },
    multipleSelectionChange: {
      action: "multiple-selection-change",
      table: {
        category: "Events",
      },
    },
    "bulk-edit": {
      table: {
        disable: true,
      },
    },
    bulkEdit: {
      action: "bulk-edit",
      table: {
        category: "Events",
      },
    },
    "bulk-delete": {
      table: {
        disable: true,
      },
    },
    bulkDelete: {
      action: "bulk-delete",
      table: {
        category: "Events",
      },
    },
    changeShowOutlines: {
      action: "change-show-outlines",
      table: {
        category: "Events",
      },
    },
    changeShowStripes: {
      action: "change-show-stripes",
      table: {
        category: "Events",
      },
    },
    changeOutlineFraming: {
      action: "change-outline-framing",
      table: {
        category: "Events",
      },
    },
    changeEnableRowNumbering: {
      action: "change-enable-row-numbering",
      table: {
        category: "Events",
      },
    },
  },
  args: {
    dataSource: SwDataTableFixtures,
    columns: [
      {
        label: "Name",
        property: "name",
        renderer: "text",
        position: 0,
        cellWrap: "normal",
        sortable: true,
        clickable: true,
      },
      {
        label: "Manufacturer",
        property: "manufacturer.name",
        renderer: "text",
        position: 100,
        cellWrap: "normal",
        sortable: true,
      },
      {
        label: "Active",
        property: "active",
        renderer: "badge",
        cellWrap: "normal",
        position: 200,
        rendererOptions: {
          renderItemBadge: (data, columnDefinition) => {
            const value = get(data, columnDefinition.property);

            return value
              ? {
                  variant: "positive",
                  label: "Active",
                }
              : {
                  variant: "critical",
                  label: "Inactive",
                };
          },
        },
      },
      {
        label: "Price",
        property: "price",
        renderer: "price",
        rendererOptions: {
          currencyId: "b7d2554b0ce847cd82f3ac9bd1c0dfca",
          currencyISOCode: "EUR",
          source: "gross",
        },
        position: 300,
        cellWrap: "nowrap",
        width: 150,
      },
      {
        label: "Stock",
        property: "stock",
        renderer: "number",
        position: 400,
        visible: false,
        sortable: true,
      },
      {
        label: "Available",
        property: "available",
        renderer: "number",
        position: 500,
        sortable: true,
      },
    ],
    title: "Data table",
    subtitle: "Meta information is helpful for giving the user quick insides",
    enableReload: true,
    currentPage: 1,
    paginationLimit: 25,
    paginationOptions: [5, 10, 25, 50],
    searchValue: "",
    disableSearch: false,
    sortBy: "name",
    sortDirection: "ASC",
    isLoading: false,
    layout: "default",
    allowRowSelection: true,
    selectedRows: [],
    allowBulkEdit: true,
    allowBulkDelete: true,
    showOutlines: true,
    showStripes: true,
    enableOutlineFraming: true,
    enableRowNumbering: false,
    bulkEditMoreActions: [
      {
        id: "send-to-warehouse",
        label: "Send to warehouse",
        onClick: () => {
          alert("Send selected rows to warehouse");
        },
        icon: "regular-warehouse",
      },
      {
        id: "download-as-csv",
        label: "Download as CSV",
        onClick: () => {
          alert("Download selected rows as CSV");
        },
        icon: "regular-download",
      },
      {
        id: "delete-in-erp",
        label: "Delete in ERP",
        onClick: () => {
          alert("Delete selected rows in ERP");
        },
        type: "critical",
        metaCopy:
          "This action will delete the selected rows in the ERP system. This action cannot be undone.",
        contextualDetail: "MagicERP",
      },
    ],
    disableEdit: false,
    disableDelete: false,
    // TODO: can be removed when component is not experimental anymore
    _storybook_internal_show_experimental_warning_: false,
    _remove_primary_toolbar_button_: false,
  },
  render: (args) =>
    defineComponent({
      components: { SwDataTable, SwButton, SwBanner },
      data(): {
        paginationLimitValue: number;
        currentPageValue: number;
        searchValueValue: string;
        sortByValue: string;
        sortDirectionValue: string;
        isLoadingValue: boolean;
        selectedRowsValue: string[];
        showOutlinesValue: boolean;
        showStripesValue: boolean;
        enableOutlineFramingValue: boolean;
        enableRowNumberingValue: boolean;
      } {
        return {
          paginationLimitValue: 0,
          currentPageValue: 0,
          searchValueValue: "",
          sortByValue: "",
          sortDirectionValue: "",
          isLoadingValue: true,
          selectedRowsValue: [],
          showOutlinesValue: true,
          showStripesValue: true,
          enableOutlineFramingValue: true,
          enableRowNumberingValue: true,
        };
      },
      computed: {
        dataSourceValue(): {
          [key: string]: unknown;
          id: string;
        }[] {
          /**
           * Mock server data handling
           */
          const returnValue = args.dataSource
            .sort((aData, bData) => {
              const a = aData[this.sortByValue];
              const b = bData[this.sortByValue];
              let result = 0;

              // @ts-expect-error
              if (a < b) {
                result = -1;
                // @ts-expect-error
              } else if (a > b) {
                result = 1;
              }

              if (this.sortDirectionValue === "DESC") {
                result *= -1;
              }

              return result;
            })
            .slice(
              (this.currentPageValue - 1) * this.paginationLimitValue,
              this.currentPageValue * this.paginationLimitValue,
            );

          return returnValue;
        },
        paginationTotalItemsValue(): number {
          return args.dataSource.length;
        },
      },
      watch: {
        "args.paginationLimit": {
          handler(v) {
            if (this.paginationLimitValue === v) {
              return;
            }

            this.paginationLimitValue = v;
          },
          immediate: true,
        },
        "args.currentPage": {
          handler(v) {
            if (this.currentPageValue === v) {
              return;
            }

            this.currentPageValue = v;
          },
          immediate: true,
        },
        "args.sortBy": {
          handler(v) {
            if (this.sortByValue === v) {
              return;
            }

            this.sortByValue = v;
          },
          immediate: true,
        },
        "args.sortDirection": {
          handler(v) {
            if (this.sortDirectionValue === v) {
              return;
            }

            this.sortDirectionValue = v;
          },
          immediate: true,
        },
        "args.searchValue": {
          handler(v) {
            if (this.searchValueValue === v) {
              return;
            }

            this.searchValueValue = v;
          },
          immediate: true,
        },
        "args.isLoading": {
          handler(v) {
            if (this.isLoadingValue === v) {
              return;
            }

            this.isLoadingValue = v;
          },
          immediate: false,
        },
        "args.selectedRows": {
          handler(v) {
            if (this.selectedRowsValue === v) {
              return;
            }

            this.selectedRowsValue = v;
          },
          immediate: true,
        },
        "args.showOutlines": {
          handler(v) {
            if (this.showOutlinesValue === v) {
              return;
            }

            this.showOutlinesValue = v;
          },
          immediate: true,
        },
        "args.showStripes": {
          handler(v) {
            if (this.showStripesValue === v) {
              return;
            }

            this.showStripesValue = v;
          },
          immediate: true,
        },
        "args.enableOutlineFraming": {
          handler(v) {
            if (this.enableOutlineFramingValue === v) {
              return;
            }

            this.enableOutlineFramingValue = v;
          },
          immediate: true,
        },
        "args.enableRowNumbering": {
          handler(v) {
            if (this.enableRowNumberingValue === v) {
              return;
            }

            this.enableRowNumberingValue = v;
          },
          immediate: true,
        },
      },
      created() {
        if (!args.isLoading) {
          this.simulateLoading();
        }
      },
      methods: {
        simulateLoading() {
          // random loading time between 300 and 600ms
          const loadingTime = Math.floor(Math.random() * 300) + 300;
          this.isLoadingValue = true;

          window.setTimeout(() => {
            this.isLoadingValue = false;
          }, loadingTime);
        },
        paginationLimitChangeHandler(event: number) {
          args.paginationLimitChange(event);
          this.paginationLimitValue = event;

          this.simulateLoading();
        },
        paginationCurrentPageChangeHandler(event: number) {
          args.paginationCurrentPageChange(event);
          this.currentPageValue = event;

          this.simulateLoading();
        },
        searchValueChangeHandler(event: string) {
          args.searchValueChange(event);
          this.searchValueValue = event;

          this.simulateLoading();
        },
        sortChangeValueHandler(property: string, direction: string) {
          args.sortChange(property, direction);

          this.sortByValue = property;
          this.sortDirectionValue = direction;

          this.simulateLoading();
        },

        reloadHandler(event: number) {
          args.reload(event);

          this.simulateLoading();
        },

        selectionChangeHandler(event: { id: string; value: boolean }) {
          args.selectionChange(event);

          const id = event.id;
          const value = event.value;

          if (value) {
            this.selectedRowsValue.push(id);
          } else {
            this.selectedRowsValue.splice(this.selectedRowsValue.indexOf(id), 1);
          }
        },

        multipleSelectionChangeHandler(event: { selections: string[]; value: boolean }) {
          args.multipleSelectionChange(event);

          const selections = event.selections;
          const value = event.value;

          if (value) {
            selections.forEach((selection) => {
              if (this.selectedRowsValue.indexOf(selection) === -1) {
                this.selectedRowsValue.push(selection);
              }
            });
          } else {
            this.selectedRowsValue = this.selectedRowsValue.filter((row) => {
              return selections.indexOf(row) === -1;
            });
          }
        },

        changeShowOutlinesHandler(event: boolean) {
          args.changeShowOutlines(event);

          this.showOutlinesValue = event;
        },

        changeShowStripesHandler(event: boolean) {
          args.changeShowStripes(event);

          this.showStripesValue = event;
        },

        changeOutlineFramingHandler(event: boolean) {
          args.changeOutlineFraming(event);

          this.enableOutlineFramingValue = event;
        },

        changeEnableRowNumberingHandler(event: boolean) {
          args.changeEnableRowNumbering(event);

          this.enableRowNumberingValue = event;
        },
      },
      template: `
      <div
          style="
      margin: 0 auto;
      height: 100vh;
      width: 100vw;
      margin: -1rem;
      padding: 1rem;
      overflow: auto;
    "
      >
        <div
            v-if="args._storybook_internal_show_experimental_warning_"
            style="width: 960px; max-width: 100%; margin: 0 auto;"
        >
          <sw-banner
              title="Experimental component"
              variant="attention"
          >
            This component is currently in an experimental state and may undergo frequent
            changes. Please use it with discretion and be prepared for potential updates
            that could impact its functionality, appearance, or behavior. We welcome
            feedback, which can be submitted in the GitHub Discussions of the
            Meteor Component Library.
          </sw-banner>
        </div>

        <sw-data-table
            v-bind="args"
            :dataSource="dataSourceValue"
            :paginationTotalItems="paginationTotalItemsValue"
            @reload="reloadHandler"
            :paginationLimit="paginationLimitValue"
            @pagination-limit-change="paginationLimitChangeHandler"
            :currentPage="currentPageValue"
            @pagination-current-page-change="paginationCurrentPageChangeHandler"
            :searchValue="searchValueValue"
            @search-value-change="searchValueChangeHandler"
            :sortBy="sortByValue"
            :sortDirection="sortDirectionValue"
            @sort-change="sortChangeValueHandler"
            :isLoading="isLoadingValue"
            :selectedRows="selectedRowsValue"
            @selection-change="selectionChangeHandler"
            @multiple-selection-change="multipleSelectionChangeHandler"
            @open-details="openDetails"
            @bulk-edit="bulkEdit"
            @bulk-delete="bulkDelete"
            @change-show-outlines="changeShowOutlinesHandler"
            :showOutlines="showOutlinesValue"
            @change-show-stripes="changeShowStripesHandler"
            :showStripes="showStripesValue"
            @change-outline-framing="changeOutlineFramingHandler"
            :enableOutlineFraming="enableOutlineFramingValue"
            @change-enable-row-numbering="changeEnableRowNumberingHandler"
            :enableRowNumbering="enableRowNumberingValue"
        >
          {{ args.default}}

          <template #toolbar>
            <sw-button
                v-if="!args._remove_primary_toolbar_button_"
                variant="primary"
                @click="reloadHandler"
            >
              Primary
            </sw-button>
          </template>
        </sw-data-table>
      </div>
    `,
      setup: () => {
        return {
          args,
        };
      },
    }),
} as SwDataTableMeta;

export type SwDataTableStory = StoryObj<SwDataTableMeta>;

export const Default: SwDataTableStory = {
  args: {
    _storybook_internal_show_experimental_warning_: true,
  },
};

export const Full = {
  args: {
    layout: "full",
    _storybook_internal_show_experimental_warning_: true,
  },
};
