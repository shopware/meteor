import { defineComponent } from 'vue';
import MtEntityDataTableWrapper from './mt-entity-data-table-wrapper.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import repositoryMock from './_mocks/repositoryMock';
import type Repository from '@shopware-ag/meteor-admin-sdk/es/data/Repository';
import type { ColumnDefinition } from '@/components/table-and-list/mt-data-table/mt-data-table.vue';
import { get } from '@/utils/object';

type MtEntityDataTableWrapperMeta = Meta<typeof MtEntityDataTableWrapper>;

export const Default: StoryObj<MtEntityDataTableWrapperMeta> = {
  render: (args) => defineComponent({
    components: { MtEntityDataTableWrapper },
    setup() { return { args }; },
    template: '<MtEntityDataTableWrapper v-bind="args" />',
  }),
};

const meta: Meta<typeof MtEntityDataTableWrapper> = {
  title: "Components/Entity/mt-entity-data-table-wrapper",
  component: MtEntityDataTableWrapper,
  args: {
    entity: "product",
    repository: repositoryMock as unknown as typeof Repository,
    title: "Products",
    subtitle: "Example with products",
    layout: "default",
    columns: [
      {
        label: "Name",
        property: "name",
        renderer: "text",
        position: 100,
        cellWrap: "normal",
        sortable: true
      },
      {
        label: "Manufacturer",
        property: "manufacturer.name",
        renderer: "text",
        position: 200,
        cellWrap: "normal",
        sortable: true
      },
      {
        label: "Active",
        property: "active",
        renderer: "badge",
        position: 300,
        rendererOptions: {
          renderItemBadge: (data: any, columnDefinition: ColumnDefinition) => {
            const value = get(data, columnDefinition.property);

            return value ? {
              variant: "positive",
              label: "Active"
            } : {
              variant: "critical",
              label: "Inactive"
            };
          },
        },
      },
    ],
  },
};

export default meta;