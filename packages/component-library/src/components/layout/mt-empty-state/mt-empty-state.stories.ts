import type { Meta, StoryFn } from "@storybook/vue3";
import MtEmptyState from "./mt-empty-state.vue";

export default {
  title: "Components/Layout/mt-empty-state",
  component: MtEmptyState,
  argTypes: {
    headline: {
      control: "text",
      description: "The headline of the empty state",
    },
    description: {
      control: "text",
      description: "The description of the empty state",
    },
    icon: {
      control: "text",
      description: "The icon to display in the empty state",
    },
    linkHref: {
      control: "text",
      description: "The URL to link to",
    },
    linkText: {
      control: "text",
      description: "The text of the link",
    },
    linkType: {
      control: { type: "select", options: ["external", "internal"] },
      description: "The type of the link, determines if it opens in a new tab or not",
    },
    buttonText: {
      control: "text",
      description: "The text of the action button",
    },
  },
} as Meta;

const DefaultTemplate: StoryFn = (args) => ({
  components: { MtEmptyState },
  setup() {
    return { args };
  },
  template: `
  <div style="height: 100vh; display: flex; justify-content: center; align-items: center;">
    <mt-empty-state v-bind="args" />
  </div>
  `,
});

export const Default: StoryFn = DefaultTemplate.bind({});
Default.args = {
  icon: "solid-chart-line-arrow",
  headline: "Default Headline",
  description: "Default Description",
};

const ExtendedTemplate: StoryFn = (args) => ({
  components: { MtEmptyState },
  setup() {
    return { args };
  },
  template: `
  <div style="height: 100vh; display: flex; justify-content: center; align-items: center;">
    <mt-empty-state v-bind="args" @button-click="args.onButtonClick" />
  </div>
  `,
});

export const Extended: StoryFn = ExtendedTemplate.bind({});
Extended.args = {
  headline: "Extended Headline",
  description: "Extended Description",
  icon: "solid-chart-line-arrow",
  linkHref: "https://storybook.js.org",
  linkText: "Learn more",
  buttonText: "Button text",
  onButtonClick: () => {
    alert("Button clicked");
  },
};
