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

const createRender = (template: string) => ({
  components: sharedComponents,
  template,
});

const createStory = (template: string) => ({
  render: () => createRender(template),
  parameters: {
    docs: {
      source: {
        code: template.trim(),
      },
    },
  },
});

const defaultTemplate = `
<mt-collapsible>
  <mt-collapsible-trigger as-child>
    <mt-button>Toggle content</mt-button>
  </mt-collapsible-trigger>

  <mt-collapsible-content>
    <p style="margin-top: 8px;">
      This content is revealed and hidden by the trigger above.
    </p>
  </mt-collapsible-content>
</mt-collapsible>
`;

const defaultOpenTemplate = `
<mt-collapsible default-open>
  <mt-collapsible-trigger as-child>
    <mt-button>Toggle content</mt-button>
  </mt-collapsible-trigger>

  <mt-collapsible-content>
    <p style="margin-top: 8px;">
      This collapsible starts in the open state.
    </p>
  </mt-collapsible-content>
</mt-collapsible>
`;

const disabledTemplate = `
<mt-collapsible disabled>
  <mt-collapsible-trigger as-child>
    <mt-button disabled>Toggle content</mt-button>
  </mt-collapsible-trigger>

  <mt-collapsible-content>
    <p style="margin-top: 8px;">
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
    unmountOnHide: {
      control: { type: "boolean" },
      description: "When `true`, the content is unmounted while closed.",
    },
  },
};

export default meta;
export type MtCollapsibleStory = StoryObj<MtCollapsibleMeta>;

export const Default: MtCollapsibleStory = {
  ...createStory(defaultTemplate),
};

export const DefaultOpen: MtCollapsibleStory = {
  name: "Default open",
  ...createStory(defaultOpenTemplate),
};

export const Disabled: MtCollapsibleStory = {
  ...createStory(disabledTemplate),
};
