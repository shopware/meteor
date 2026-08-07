import type { Meta, StoryFn } from "@storybook/vue3";
import MtGrantPermissionServiceBanner from "./mt-grant-permission-service-banner.vue";

export default {
  title: "Components/Grant Permission Service Banner",
  component: MtGrantPermissionServiceBanner,
  argTypes: {
    layout: {
      control: { type: "select" },
      options: ["vertical", "compact", "wide"],
      description: "The arrangement of icon, text and actions",
    },
  },
} as Meta;

const DefaultTemplate: StoryFn = (args) => ({
  components: { MtGrantPermissionServiceBanner },
  setup() {
    return { args };
  },
  template: `<mt-grant-permission-service-banner v-bind="args" @grant="args.grant" />`,
});

const defaultArgs = {
  grantLabel: "Grant permission and activate",
  moreInfoLabel: "More info",
  moreInfoUrl: "https://www.shopware.com",
};

export const Compact: StoryFn = DefaultTemplate.bind({});
Compact.args = { ...defaultArgs };

export const Wide: StoryFn = DefaultTemplate.bind({});
Wide.args = { ...defaultArgs, layout: "wide" };

export const Vertical: StoryFn = DefaultTemplate.bind({});
Vertical.args = {
  ...defaultArgs,
  layout: "vertical",
  grantLabel: "Grant permission",
};
Vertical.decorators = [() => ({ template: '<div style="max-width: 288px"><story /></div>' })];
