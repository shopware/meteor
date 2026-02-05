import { ref } from "vue";
import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import MtRadioGroupRoot from "./mt-radio-group-root.vue";
import MtRadioGroupList from "./mt-radio-group-list.vue";
import MtRadioGroupItem from "./mt-radio-group-item.vue";
import MtRadioGroupCustomItem from "./mt-radio-group-custom-item.vue";
import MtRadioGroupIndicator from "./mt-radio-group-indicator.vue";
import ExampleRadioOption from "./_internal/example-radio-option.vue";
import type { StoryObj, Meta } from "@storybook/vue3";
import { fn } from "@storybook/test";
import meta from "./mt-radio-group.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-radio-group",
} as Meta;

type Story = StoryObj<typeof meta>;

export const VisualTestDefault: Story = {
  name: "Should render the default radio group",
  args: {
    label: "Select an option",
    change: fn(),
  },
  render: (args: typeof meta.args) => ({
    components: { MtRadioGroupRoot, MtRadioGroupList, MtRadioGroupItem },
    setup() {
      const modelValue = ref("value2");

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option2 = canvas.getByLabelText("Option 2") as HTMLInputElement;
    expect(option2.checked).toBe(true);
  },
};

export const VisualTestDisabled: Story = {
  name: "Should render the disabled radio group",
  args: {
    label: "Select an option",
    disabled: true,
    change: fn(),
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option1 = canvas.getByLabelText("Option 1") as HTMLInputElement;
    expect(option1.disabled).toBe(true);
  },
};

export const VisualTestError: Story = {
  name: "Should render the radio group with error message",
  args: {
    label: "Select an option",
    error: {
      detail: "Please select an option",
    },
    change: fn(),
  },
  render: (args: typeof meta.args) => ({
    components: { MtRadioGroupRoot, MtRadioGroupList, MtRadioGroupItem },
    setup() {
      const modelValue = ref("");

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
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Please select an option")).toBeDefined();
  },
};

export const VisualTestHelpText: Story = {
  name: "Should render the radio group with help text",
  args: {
    label: "Select an option",
    helpText: "This is a helpful description of what to select",
    change: fn(),
  },
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
  play: async () => {
    const helpText = document.body.querySelector(".mt-help-text") as HTMLElement;
    expect(helpText).toBeInTheDocument();
    await userEvent.hover(helpText);
    expect(document.body.querySelector(".tooltip") as HTMLElement).toHaveTextContent(
      "This is a helpful description of what to select",
    );
  },
};

export const VisualTestHint: Story = {
  name: "Should render the radio group with hint text",
  args: {
    label: "Select an option",
    hint: "Additional information about this field",
    change: fn(),
  },
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
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Additional information about this field")).toBeDefined();
  },
};

export const VisualTestCustomItems: Story = {
  name: "Should render the radio group with custom items",
  args: {
    label: "Select a plan",
    change: fn(),
  },
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
