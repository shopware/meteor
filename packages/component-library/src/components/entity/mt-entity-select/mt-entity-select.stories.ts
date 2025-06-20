import type { Meta, StoryObj } from "@storybook/vue3";
import MtEntitySelect from "./mt-entity-select.vue";
import { fn } from "@storybook/test";
import { ref } from "vue";

// Fixtures
const manufacturers = Array.from(Array(150).keys()).map((i) => {
  return {
    id: `manufacturer-${i}`,
    name: `Manufacturer ${i} with a long name to test wrapping`,
  };
});

const getMockRepository = (data: { id: string; name: string }[]) => {
  return () => {
    return {
      search: (criteria: any) => {
        // mock search
        const term = criteria.term?.toLowerCase();
        let filtered = data;
        if (term) {
          filtered = data.filter((m) => m.name.toLowerCase().includes(term));
        }

        const start = (criteria.page - 1) * criteria.limit;
        const end = start + criteria.limit;
        const paginated = filtered.slice(start, end);

        // Add total property to the array just like the real repository
        const result = Object.assign([...paginated], {
          total: filtered.length,
          [Symbol.iterator]: function* () {
            for (const item of paginated) {
              yield item;
            }
          },
        });

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(result as any);
          }, 500); // Simulate network delay
        });
      },
      get: (id: string) => {
        const item = data.find((d) => d.id === id);
        return Promise.resolve(item as any);
      },
    };
  };
};

const mockManufacturerRepository = getMockRepository(manufacturers);

export default {
  title: "Components/Entity/mt-entity-select",
  component: MtEntitySelect,
  argTypes: {
    "onUpdate:modelValue": {
      action: "update:modelValue",
    },
  },
  args: {
    entity: "product_manufacturer" as any,
    repository: mockManufacturerRepository as any,
    label: "Manufacturers",
    labelProperty: "name",
    valueProperty: "id",
    "onUpdate:modelValue": fn(),
  },
  render: (args) => ({
    components: { MtEntitySelect },
    template: `
          <div style="width: 600px">
              <mt-entity-select
                v-bind="args"
                v-model="currentModelValue"
              />
              <div id="hidden-box" style="height: 400px; width: 100%"></div>
          </div>
      `,
    setup() {
      const currentModelValue = ref(args.modelValue);

      return { args, currentModelValue };
    },
  }),
} as Meta<typeof MtEntitySelect>;

export type MtEntitySelectStory = StoryObj<typeof MtEntitySelect>;

export const Default: MtEntitySelectStory = {
  name: "Default (single selection)",
  args: {},
};

export const MultiSelection: MtEntitySelectStory = {
  name: "Multi-selection",
  args: {
    enableMultiSelection: true,
  },
};

export const WithInitialValue: MtEntitySelectStory = {
  name: "With initial value",
  args: {
    modelValue: "manufacturer-5",
  },
};

export const WithInitialValueMulti: MtEntitySelectStory = {
  name: "With initial value (multi-selection)",
  args: {
    enableMultiSelection: true,
    modelValue: ["manufacturer-5", "manufacturer-10"],
  },
};

export const Disabled: MtEntitySelectStory = {
  name: "Disabled (single selection)",
  args: {
    disabled: true,
    modelValue: "manufacturer-5",
  },
};
