import { ref } from "vue";
import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import MtRadioGroupRoot from "./mt-radio-group-root.vue";
import MtRadioGroupList from "./mt-radio-group-list.vue";
import MtRadioGroupItem from "./mt-radio-group-item.vue";
import MtRadioGroupCardItem from "./mt-radio-group-card-item.vue";
import MtRadioGroupCustomItem from "./mt-radio-group-custom-item.vue";
import MtRadioGroupIndicator from "./mt-radio-group-indicator.vue";
import ExampleRadioOption from "./_internal/example-radio-option.vue";
import type { StoryObj, Meta } from "@storybook/vue3";
import { fn } from "@storybook/test";
import meta, { WithCardItems } from "./mt-radio-group.stories";
import {
  expectHintIconAlignedWithFirstLine,
  multiLinePropHint,
} from "@/components/_internal/mt-field-hint/mt-field-hint.story-helper";

export default {
  ...meta,
  title: "Components/Radio Group/Interaction tests",
  tags: ["!autodocs"],
} as Meta;

type Story = StoryObj<typeof meta>;

export const VisualTestCardItems: Story = {
  ...WithCardItems,
  name: "Visual Test: Card items",
};

export const VisualTestHoveredCardItem: Story = {
  ...WithCardItems,
  name: "Visual Test: Hovered card item",
};

export const VisualTestPressedCardItem: Story = {
  ...WithCardItems,
  name: "Visual Test: Pressed card item",
};

export const VisualTestDarkCardItems: Story = {
  ...VisualTestCardItems,
  name: "Visual Test: Card items in dark mode",
  globals: { theme: "dark" },
};

export const VisualTestDisabledCardItems: Story = {
  ...WithCardItems,
  name: "Visual Test: Disabled card items",
  args: {
    ...WithCardItems.args,
    disabled: true,
    change: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("radio", { name: "Express delivery" })).toBeDisabled();
    expect(canvas.getByRole("radio", { name: "Express delivery" })).not.toBeChecked();
    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toBeDisabled();
    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toBeChecked();
    expect(args.change).not.toHaveBeenCalled();
  },
};

export const VisualTestCardItemsWithError: Story = {
  ...WithCardItems,
  name: "Visual Test: Card items with a group error",
  args: {
    ...WithCardItems.args,
    error: { detail: "This delivery method is not available for your address." },
  },
};

export const VisualTestFocusedSelectedCardItem: Story = {
  ...WithCardItems,
  name: "Visual Test: Focused selected card item",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();

    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toHaveFocus();
    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toBeChecked();
  },
};

export const VisualTestFocusedUnselectedCardItem: Story = {
  ...WithCardItems,
  name: "Visual Test: Focused unselected card item",
  args: {
    ...WithCardItems.args,
    modelValue: null,
    change: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();

    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toHaveFocus();
    expect(canvas.getByRole("radio", { name: "Standard delivery" })).not.toBeChecked();
    expect(args.change).not.toHaveBeenCalled();
  },
};

export const TestSelectsCardItems: Story = {
  ...WithCardItems,
  name: "Selects card items with their labels",
  args: {
    ...WithCardItems.args,
    change: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const standard = canvas.getByRole("radio", { name: "Standard delivery" });
    const express = canvas.getByRole("radio", { name: "Express delivery" });

    await userEvent.click(canvas.getByText("Express delivery"));

    expect(express).toBeChecked();
    expect(standard).not.toBeChecked();
    expect(express).toHaveAccessibleDescription(
      "Delivery on the next business day for orders placed before 14:00.",
    );
    expect(args.change).toHaveBeenCalledWith("express");
    expect(args.change).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByText("Express delivery"));

    expect(args.change).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByText("Standard delivery"));

    expect(standard).toBeChecked();
    expect(express).not.toBeChecked();
    expect(args.change).toHaveBeenLastCalledWith("standard");
    expect(args.change).toHaveBeenCalledTimes(2);
  },
};

export const TestSelectsCardItemsWithKeyboard: Story = {
  ...WithCardItems,
  name: "Selects card items with arrow keys and space",
  args: {
    ...WithCardItems.args,
    modelValue: null,
    change: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await userEvent.keyboard(" ");

    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toBeChecked();
    expect(args.change).toHaveBeenCalledWith("standard");
    expect(args.change).toHaveBeenCalledTimes(1);

    await userEvent.keyboard("{ArrowDown}");

    expect(canvas.getByRole("radio", { name: "Express delivery" })).toHaveFocus();
    expect(canvas.getByRole("radio", { name: "Express delivery" })).toBeChecked();
    expect(canvas.getByRole("radio", { name: "Standard delivery" })).not.toBeChecked();
    expect(args.change).toHaveBeenLastCalledWith("express");

    await userEvent.keyboard("{ArrowUp}");

    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toHaveFocus();
    expect(canvas.getByRole("radio", { name: "Standard delivery" })).toBeChecked();
    expect(args.change).toHaveBeenLastCalledWith("standard");
  },
};

export const VisualTestMixedCardItems: Story = {
  name: "Visual Test: Standard and card items in the same group",
  args: {
    label: "Choose a delivery method",
    change: fn(),
  },
  render: (args: typeof meta.args) => ({
    components: { MtRadioGroupRoot, MtRadioGroupList, MtRadioGroupItem, MtRadioGroupCardItem },
    setup() {
      const modelValue = ref("default");

      return { args, modelValue };
    },
    template: `
      <div style="max-width: 480px">
        <MtRadioGroupRoot v-model="modelValue" :label="args.label" @update:modelValue="args.change">
          <MtRadioGroupList>
            <MtRadioGroupItem id="store-default" value="default" label="Use the store default" />
            <MtRadioGroupCardItem
              id="express-delivery"
              value="express"
              label="Express delivery"
              description="Delivery on the next business day for orders placed before 14:00."
            />
          </MtRadioGroupList>
        </MtRadioGroupRoot>
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const standard = canvas.getByRole("radio", { name: "Use the store default" });
    const card = canvas.getByRole("radio", { name: "Express delivery" });

    await userEvent.click(canvas.getByText("Express delivery"));

    expect(card).toBeChecked();
    expect(standard).not.toBeChecked();
    expect(args.change).toHaveBeenCalledWith("express");
    expect(args.change).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByText("Use the store default"));

    expect(standard).toBeChecked();
    expect(card).not.toBeChecked();
    expect(args.change).toHaveBeenLastCalledWith("default");
  },
};

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

export const VisualTestHintProp: Story = {
  name: "Should display hint via prop",
  args: {
    label: "Select an option",
    hint: "Hint via prop",
  },
  render: (args: typeof meta.args) => ({
    components: { MtRadioGroupRoot, MtRadioGroupList, MtRadioGroupItem },
    setup: () => ({ args }),
    template: `
      <MtRadioGroupRoot :label="args.label" :hint="args.hint">
        <MtRadioGroupList>
          <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
          <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
        </MtRadioGroupList>
      </MtRadioGroupRoot>`,
  }),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Hint via prop")).toBeDefined();
  },
};

export const VisualTestMultiLinePropHint: Story = {
  name: "Should display multi line prop hint",
  args: {
    label: "Select an option",
    hint: multiLinePropHint,
  },
  render: (args: typeof meta.args) => ({
    components: { MtRadioGroupRoot, MtRadioGroupList, MtRadioGroupItem },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 320px">
        <MtRadioGroupRoot :label="args.label" :hint="args.hint">
          <MtRadioGroupList>
            <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
            <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
          </MtRadioGroupList>
        </MtRadioGroupRoot>
      </div>`,
  }),
  play: ({ canvasElement }) => {
    expectHintIconAlignedWithFirstLine(canvasElement);
  },
};

export const VisualTestHintSlot: Story = {
  name: "Should display hint via slot",
  args: {
    label: "Select an option",
  },
  render: (args: typeof meta.args) => ({
    components: { MtRadioGroupRoot, MtRadioGroupList, MtRadioGroupItem },
    setup: () => ({ args }),
    template: `
      <MtRadioGroupRoot :label="args.label">
        <template #hint>Hint via slot</template>
        <MtRadioGroupList>
          <MtRadioGroupItem id="option-1" value="value1" label="Option 1" />
          <MtRadioGroupItem id="option-2" value="value2" label="Option 2" />
        </MtRadioGroupList>
      </MtRadioGroupRoot>`,
  }),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Hint via slot")).toBeDefined();
  },
};
