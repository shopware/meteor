import type { Meta, StoryObj } from "@storybook/vue3";
import MtBreadcrumb from "./mt-breadcrumb.vue";
import MtBreadcrumbItem from "./mt-breadcrumb-item.vue";
import MtBreadcrumbLink from "./mt-breadcrumb-link.vue";
import MtBreadcrumbSeparator from "./mt-breadcrumb-separator.vue";

export type MtBreadcrumbMeta = Meta<typeof MtBreadcrumb>;

const sharedComponents = {
  MtBreadcrumb,
  MtBreadcrumbItem,
  MtBreadcrumbLink,
  MtBreadcrumbSeparator,
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
<mt-breadcrumb v-bind="args">
  <mt-breadcrumb-link as="a" to="#">Home</mt-breadcrumb-link>
  <mt-breadcrumb-separator />
  <mt-breadcrumb-link as="a" to="#">Products</mt-breadcrumb-link>
  <mt-breadcrumb-separator />
  <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
</mt-breadcrumb>
`;

const sizesTemplate = `
<div style="display: flex; flex-direction: column; gap: 16px;">
  <mt-breadcrumb size="xs">
    <mt-breadcrumb-link as="a" to="#">Home</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link as="a" to="#">Products</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
  </mt-breadcrumb>

  <mt-breadcrumb size="s">
    <mt-breadcrumb-link as="a" to="#">Home</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link as="a" to="#">Products</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
  </mt-breadcrumb>
</div>
`;

const longLabelTemplate = `
<div style="width: 480px; max-width: 100%; resize: horizontal; overflow: hidden; border: 1px dashed var(--color-border-primary-default); padding: 8px;">
  <mt-breadcrumb v-bind="args">
    <mt-breadcrumb-link as="a" to="#">Home</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link as="a" to="#">Clothing and accessories for every season of the year</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-item current>Shoes</mt-breadcrumb-item>
  </mt-breadcrumb>
</div>
`;

const collapsedTemplate = `
<div style="width: 360px; max-width: 100%; resize: horizontal; overflow: hidden; border: 1px dashed var(--color-border-primary-default); padding: 8px;">
  <mt-breadcrumb v-bind="args">
    <mt-breadcrumb-link as="a" to="#">Home</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link as="a" to="#">Catalog</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link as="a" to="#">Clothing and accessories for every season</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link as="a" to="#">Shoes</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-link as="a" to="#">Sneakers</mt-breadcrumb-link>
    <mt-breadcrumb-separator />
    <mt-breadcrumb-item current>Running shoes</mt-breadcrumb-item>
  </mt-breadcrumb>
</div>
`;

const meta: MtBreadcrumbMeta = {
  title: "Components/Breadcrumb",
  component: MtBreadcrumb,
  args: {
    size: "xs",
    overflow: "collapse",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "s"],
      description: "The text size of all crumbs.",
    },
    overflow: {
      control: { type: "select" },
      options: ["collapse", "wrap"],
      description:
        "`collapse` hides middle crumbs behind an ellipsis when space runs out, `wrap` lets crumbs flow onto further lines.",
    },
    ariaLabel: {
      control: { type: "text" },
      description: "The accessible name of the navigation landmark.",
    },
  },
};

export default meta;
export type MtBreadcrumbStory = StoryObj<MtBreadcrumbMeta>;

export const Default: MtBreadcrumbStory = {
  ...createStory(defaultTemplate),
};

export const Sizes: MtBreadcrumbStory = {
  ...createStory(sizesTemplate),
};

export const LongLabel: MtBreadcrumbStory = {
  ...createStory(longLabelTemplate),
  name: "Long label",
};

export const Collapsed: MtBreadcrumbStory = {
  ...createStory(collapsedTemplate),
};

export const Wrap: MtBreadcrumbStory = {
  ...createStory(collapsedTemplate),
  args: {
    overflow: "wrap",
  },
};
