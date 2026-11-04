import type { Meta, StoryObj } from "@storybook/vue3";
import MtScrollArea from "./mt-scroll-area.vue";
import MtBadge from "../mt-badge/mt-badge.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtScrollAreaMeta = Meta<typeof MtScrollArea>;

const items = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);
const tags = [
  "Clothing",
  "Shoes",
  "Accessories",
  "Sale",
  "New arrivals",
  "Outdoor",
  "Sports",
  "Kids",
  "Home",
  "Garden",
  "Electronics",
  "Books",
];

const meta: MtScrollAreaMeta = {
  title: "Components/Scroll Area",
  component: MtScrollArea,
  args: {
    orientation: "vertical",
    scrollbar: false,
    fade: true,
  },
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal", "both"],
    },
    scrollbar: {
      control: { type: "boolean" },
    },
    fade: {
      control: { type: "select" },
      options: [true, false, "top", "bottom", "start", "end"],
    },
    fadeSize: {
      control: { type: "select" },
      options: [undefined, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64],
    },
  },
  render: (args) => ({
    components: { MtScrollArea, MtText },
    setup() {
      return { args, items };
    },
    template: `
      <mt-scroll-area v-bind="args" style="height: 240px; width: 280px; border: 1px solid var(--color-border-primary-default); border-radius: var(--border-radius-m);">
        <div style="padding: 8px 16px;">
          <mt-text v-for="item in items" :key="item" style="padding-block: 6px;">{{ item }}</mt-text>
        </div>
      </mt-scroll-area>`,
  }),
};

export default meta;
export type MtScrollAreaStory = StoryObj<MtScrollAreaMeta>;

export const Default: MtScrollAreaStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-scroll-area style="height: 240px">
  <!-- long content -->
</mt-scroll-area>`,
      },
    },
  },
};

export const Horizontal: MtScrollAreaStory = {
  args: {
    orientation: "horizontal",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-scroll-area orientation="horizontal">
  <div style="display: flex; gap: 8px">
    <mt-badge>Clothing</mt-badge>
    <mt-badge>Shoes</mt-badge>
    <!-- more tags -->
  </div>
</mt-scroll-area>`,
      },
    },
  },
  render: (args) => ({
    components: { MtScrollArea, MtBadge },
    setup() {
      return { args, tags };
    },
    template: `
      <mt-scroll-area v-bind="args" style="width: 320px;">
        <div style="display: flex; gap: 8px; padding-block: 4px 12px;">
          <mt-badge v-for="tag in tags" :key="tag" style="white-space: nowrap;">{{ tag }}</mt-badge>
        </div>
      </mt-scroll-area>`,
  }),
};

export const Both: MtScrollAreaStory = {
  name: "Both directions",
  args: {
    orientation: "both",
  },
  render: (args) => ({
    components: { MtScrollArea, MtText },
    setup() {
      return { args, items };
    },
    template: `
      <mt-scroll-area v-bind="args" style="height: 240px; width: 280px; border: 1px solid var(--color-border-primary-default); border-radius: var(--border-radius-m);">
        <div style="padding: 8px 16px; width: 600px;">
          <mt-text v-for="item in items" :key="item" style="padding-block: 6px;">{{ item }}, with a long description that does not fit into the width of the area</mt-text>
        </div>
      </mt-scroll-area>`,
  }),
};

export const SingleEdge: MtScrollAreaStory = {
  name: "Single edge",
  args: {
    fade: "bottom",
  },
};

export const WithScrollbar: MtScrollAreaStory = {
  name: "With scrollbar",
  args: {
    scrollbar: true,
  },
};

export const WithoutOverflow: MtScrollAreaStory = {
  name: "Without overflow",
  render: (args) => ({
    components: { MtScrollArea, MtText },
    setup() {
      return { args, items: items.slice(0, 3) };
    },
    template: `
      <mt-scroll-area v-bind="args" style="max-height: 240px; width: 280px; border: 1px solid var(--color-border-primary-default); border-radius: var(--border-radius-m);">
        <div style="padding: 8px 16px;">
          <mt-text v-for="item in items" :key="item" style="padding-block: 6px;">{{ item }}</mt-text>
        </div>
      </mt-scroll-area>`,
  }),
};
