import { ref } from "vue";
import MtRadioGroupRoot from "./mt-radio-group-root.vue";
import MtRadioGroupList from "./mt-radio-group-list.vue";
import MtRadioGroupItem from "./mt-radio-group-item.vue";
import MtRadioGroupCustomItem from "./mt-radio-group-custom-item.vue";
import MtRadioGroupIndicator from "./mt-radio-group-indicator.vue";
import ExampleRadioOption from "./_internal/example-radio-option.vue";
import type { StoryObj, Meta } from "@storybook/vue3";
import { fn } from "@storybook/test";

const meta: Meta = {
  title: "Components/Form/mt-radio-group",
  args: {
    disabled: false,
    label: "Radio Field",
    helpText: "",
    name: undefined,
    error: undefined,
    hint: "",
    change: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "mt-radio-group",
  render: (args: typeof meta.args) => ({
    components: { MtRadioGroupRoot, MtRadioGroupList, MtRadioGroupItem },
    setup() {
      const modelValue = ref("value1");

      const handleUpdate = (value: string) => {
        modelValue.value = value;
        args!.change(value);
      };

      return {
        args,
        modelValue,
        handleUpdate,
      };
    },
    template: `
      <MtRadioGroupRoot
        v-model="modelValue"
        :disabled="args.disabled"
        :label="args.label"
        :help-text="args.helpText"
        :name="args.name"
        :error="args.error"
        @update:modelValue="handleUpdate"
      >
        <template #default>
          <MtRadioGroupList>
            <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
            <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
            <MtRadioGroupItem id="option-3" value="value3" label="Option 3" />
          </MtRadioGroupList>
        </template>
        <template v-if="args.hint" #hint>{{ args.hint }}</template>
      </MtRadioGroupRoot>
    `,
  }),
};

export const WithCustomItem: Story = {
  name: "mt-radio-group (custom item)",
  render: (args: typeof meta.args) => ({
    components: {
      MtRadioGroupRoot,
      MtRadioGroupCustomItem,
      MtRadioGroupIndicator,
      ExampleRadioOption,
    },
    setup() {
      const modelValue = ref("pro");

      const handleUpdate = (value: string) => {
        modelValue.value = value;
        args!.change(value);
      };

      return {
        args,
        modelValue,
        handleUpdate,
      };
    },
    template: `
      <MtRadioGroupRoot
        v-model="modelValue"
        :disabled="args.disabled"
        :label="args.label"
        :help-text="args.helpText"
        :name="args.name"
        :error="args.error"
        @update:modelValue="handleUpdate"
      >
        <template #default="{ disabled: isElementDisabled, identification }">
          <div style="display: flex; flex-direction: row; gap: var(--scale-size-24);">
            <MtRadioGroupCustomItem
              value="pro"
            >
              <ExampleRadioOption
                :checked="modelValue === 'pro'"
                :disabled="isElementDisabled"
                title="Pro"
                feature1="100 image generations"
                feature2="Unlimited workflows"
                feature3="Advanced analytics"
                price="$10"
              >
                <template #indicator>
                  <MtRadioGroupIndicator
                    id="indicator-1"
                    :name="identification"
                    value="pro"
                    :checked="modelValue === 'pro'"
                    :disabled="isElementDisabled"
                  />
                </template>
              </ExampleRadioOption>
            </MtRadioGroupCustomItem>
            <MtRadioGroupCustomItem
              value="plus"
            >
              <ExampleRadioOption
                :checked="modelValue === 'plus'"
                :disabled="isElementDisabled"
                title="Plus"
                feature1="300 image generations"
                feature2="Unlimited workflows"
                feature3="Advanced analytics"
                price="$15"
              >
                <template #indicator>
                  <MtRadioGroupIndicator
                    id="indicator-2"
                    :name="identification"
                    value="plus"
                    :checked="modelValue === 'plus'"
                    :disabled="isElementDisabled"
                  />
                </template>
              </ExampleRadioOption>
            </MtRadioGroupCustomItem>
          </div>
        </template>
        <template v-if="args.hint" #hint>{{ args.hint }}</template>
      </MtRadioGroupRoot>
    `,
  }),
};
