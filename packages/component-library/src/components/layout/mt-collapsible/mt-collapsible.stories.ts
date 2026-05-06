import type { Meta, StoryObj } from "@storybook/vue3";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtCollapsible from "./mt-collapsible.vue";
import MtCollapsibleTrigger from "./mt-collapsible-trigger.vue";
import MtCollapsibleContent from "./mt-collapsible-content.vue";

export type MtCollapsibleMeta = Meta<typeof MtCollapsible>;

const sharedComponents = {
  MtCollapsible,
  MtCollapsibleTrigger,
  MtCollapsibleContent,
  MtButton,
};

const createRender = (template: string) => (args: Record<string, unknown>) => ({
  components: sharedComponents,
  setup: () => ({ args }),
  template,
});

const createStory = (template: string) => ({
  render: createRender(template),
  parameters: {
    docs: {
      source: {
        code: template.trim(),
      },
    },
  },
});

const defaultTemplate = `
<mt-collapsible v-bind="args">
  <mt-collapsible-trigger as-child>
    <mt-button variant="primary">Toggle content</mt-button>
  </mt-collapsible-trigger>

  <mt-collapsible-content>
    <p style="margin-top: 8px; font-size: var(--font-size-xs);">
      This content is revealed and hidden by the trigger above.
    </p>
  </mt-collapsible-content>
</mt-collapsible>
`;

const disabledTemplate = `
<mt-collapsible v-bind="args">
  <mt-collapsible-trigger as-child>
    <mt-button variant="primary" :disabled="args.disabled">Toggle content</mt-button>
  </mt-collapsible-trigger>

  <mt-collapsible-content>
    <p style="margin-top: 8px; font-size: var(--font-size-xs);">
      This content cannot be toggled because the collapsible is disabled.
    </p>
  </mt-collapsible-content>
</mt-collapsible>
`;

const meta: MtCollapsibleMeta = {
  title: "Components/mt-collapsible",
  component: MtCollapsible,
  argTypes: {
    open: {
      control: { type: "boolean" },
      description: "Controlled open state. Use with `v-model:open` or `update:open`.",
    },
    defaultOpen: {
      control: { type: "boolean" },
      description: "The open state when initially rendered.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Prevents the user from interacting with the collapsible.",
    },
    keepMounted: {
      control: { type: "boolean" },
      description:
        "Whether the closed content stays mounted in the DOM. Required `true` for the built-in slide animation to play; set `false` to unmount the closed subtree.",
    },
  },
};

export default meta;
export type MtCollapsibleStory = StoryObj<MtCollapsibleMeta>;

export const Default: MtCollapsibleStory = {
  ...createStory(defaultTemplate),
};

export const Disabled: MtCollapsibleStory = {
  ...createStory(disabledTemplate),
  args: {
    disabled: true,
  },
};

export const UnmountOnHide: MtCollapsibleStory = {
  ...createStory(defaultTemplate),
  args: {
    keepMounted: false,
  },
};
