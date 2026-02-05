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
  parameters: {
    docs: {
      description: {
        component: `The \`mt-radio-group\` component allows users to select a single option from a list of mutually exclusive choices. Radio groups are ideal when users need to make exactly one selection from multiple options.

## ✅ Do's

- Use for mutually exclusive options where only one selection is allowed
- Provide clear, concise labels for each option
- Use a descriptive group label that explains what the user is selecting
- Include help text or hint when the selection needs additional context
- Use the \`error\` prop to display validation errors when needed
- Ensure each radio item has a unique \`id\` and \`value\`
- Use \`MtRadioGroupList\` to wrap multiple \`MtRadioGroupItem\` components for proper spacing
- Use \`MtRadioGroupCustomItem\` when you need custom-styled radio options (e.g., pricing plans, feature cards)
- Keep the number of options manageable (typically 2-7 options work best)

## ❌ Don'ts

- Don't use for multiple selections (use checkboxes instead)
- Don't use a single radio button (radio groups require at least two options)
- Don't omit labels - always provide clear labels for accessibility and usability
- Don't use radio groups for yes/no questions with only two options if a toggle or checkbox would be more appropriate
- Don't create radio groups with too many options (consider a select dropdown for 8+ options)
- Don't nest radio groups or use them within other interactive elements
- Don't use the same \`value\` for multiple items within the same group
- Don't forget to handle the \`v-model\` binding to track the selected value`,
      },
    },
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
