import type { Meta, StoryObj } from "@storybook/vue3";
import MtBreadcrumb, { type BreadcrumbItem } from "./mt-breadcrumb.vue";

export type MtBreadcrumbMeta = Meta<typeof MtBreadcrumb>;

const sharedComponents = {
  MtBreadcrumb,
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

const defaultItems: BreadcrumbItem[] = [
  { label: "Home", to: "#" },
  { label: "Products", to: "#" },
  { label: "Shoes" },
];

const longLabelItems: BreadcrumbItem[] = [
  { label: "Home", to: "#" },
  { label: "Clothing and accessories for every season of the year", to: "#" },
  { label: "Shoes" },
];

const collapsedItems: BreadcrumbItem[] = [
  { label: "Home", to: "#" },
  { label: "Catalog", to: "#" },
  { label: "Clothing and accessories for every season", to: "#" },
  { label: "Shoes", to: "#" },
  { label: "Sneakers", to: "#" },
  { label: "Running shoes" },
];

const defaultTemplate = `
<mt-breadcrumb v-bind="args" link-as="a" />
`;

const sizesTemplate = `
<div style="display: flex; flex-direction: column; gap: 16px;">
  <mt-breadcrumb :items="args.items" size="xs" link-as="a" />
  <mt-breadcrumb :items="args.items" size="s" link-as="a" />
</div>
`;

const resizableTemplate = (width: number) => `
<div style="width: ${width}px; max-width: 100%; resize: horizontal; overflow: hidden; border: 1px dashed var(--color-border-primary-default); padding: 8px;">
  <mt-breadcrumb v-bind="args" link-as="a" />
</div>
`;

const meta: MtBreadcrumbMeta = {
  title: "Components/Breadcrumb",
  component: MtBreadcrumb,
  args: {
    items: defaultItems,
    size: "xs",
    overflow: "collapse",
  },
  argTypes: {
    items: {
      control: { type: "object" },
      description: "The crumbs from the root to the current page.",
    },
    size: {
      control: { type: "select" },
      options: ["xs", "s"],
      description: "The text size of all crumbs.",
    },
    overflow: {
      control: { type: "select" },
      options: ["collapse", "wrap"],
      description:
        "`collapse` shrinks labels and then hides middle crumbs behind an ellipsis when space runs out, `wrap` lets crumbs flow onto further lines.",
    },
    ariaLabel: {
      control: { type: "text" },
      description: "The accessible name of the navigation landmark.",
    },
    linkAs: {
      control: { type: "text" },
      description: "The element or component that renders a link crumb.",
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
  ...createStory(resizableTemplate(480)),
  name: "Long label",
  args: {
    items: longLabelItems,
  },
};

export const Collapsed: MtBreadcrumbStory = {
  ...createStory(resizableTemplate(360)),
  args: {
    items: collapsedItems,
  },
};

export const Wrap: MtBreadcrumbStory = {
  ...createStory(resizableTemplate(360)),
  args: {
    items: collapsedItems,
    overflow: "wrap",
  },
};
