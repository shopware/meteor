import { defineComponent } from "vue";
import MtEntityDataTable from "./mt-entity-data-table.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import repositoryMock from "./_mocks/repositoryMock";
import type Repository from "@shopware-ag/meteor-admin-sdk/es/data/Repository";
import type { ColumnDefinition } from "@/components/table-and-list/mt-data-table/mt-data-table.vue";
import { get } from "@/utils/object";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtEntityDataTableMeta = SlottedMeta<
  typeof MtEntityDataTable,
  "onBulkEdit" | "onBulkDelete" | "onOpenDetails"
>;

export const Default: StoryObj<MtEntityDataTableMeta> = {
  render: (args) =>
    defineComponent({
      components: { MtEntityDataTable },
      setup() {
        return { args };
      },
      template: '<MtEntityDataTable v-bind="args" />',
    }),
};

const meta: MtEntityDataTableMeta = {
  title: "Components/Entity/mt-entity-data-table",
  component: MtEntityDataTable,
  argTypes: {
    onBulkEdit: {
      action: "bulk-edit",
    },
    onBulkDelete: {
      action: "bulk-delete",
    },
    onOpenDetails: {
      action: "open-details",
    },
  },
  args: {
    // @ts-expect-error - This is a mock
    entity: "product",
    repository: repositoryMock as unknown as typeof Repository,
    title: "Products",
    subtitle: "Example with products",
    layout: "default",
    forceRealModal: true,
    allowBulkDelete: true,
    allowBulkEdit: true,
    allowRowSelection: true,
    availableFilters: [
      {
        filterType: "multi-select",
        id: "manufacturer.id",
        label: "Manufacturer",
      },
      {
        filterType: "boolean",
        id: "active",
        label: "Active",
      },
    ],
    columns: [
      {
        label: "Name",
        property: "name",
        renderer: "text",
        position: 100,
        cellWrap: "normal",
        sortable: true,
        clickable: true,
      },
      {
        label: "Manufacturer",
        property: "manufacturer.name",
        renderer: "text",
        position: 200,
        cellWrap: "normal",
        sortable: true,
      },
      {
        label: "Active",
        property: "active",
        renderer: "badge",
        position: 300,
        rendererOptions: {
          renderItemBadge: (data: any, columnDefinition: ColumnDefinition) => {
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
    ],
  },
};

export default meta;
