import type { Meta, StoryFn } from "@storybook/vue3";
import MtGrantPermissionServiceBanner from "./mt-grant-permission-service-banner.vue";

export default {
  title: "Components/Grant Permission Service Banner",
  component: MtGrantPermissionServiceBanner,
  argTypes: {
    title: {
      control: "text",
      description: "The headline of the banner",
    },
    description: {
      control: "text",
      description: "The supporting text below the headline",
    },
    layout: {
      control: { type: "select" },
      options: ["vertical", "compact", "wide"],
      description: "The arrangement of icon, text and actions",
    },
    icon: {
      control: "text",
      description: "The icon which is shown next to the text",
    },
    hideIcon: {
      control: "boolean",
      description: "Whether the icon is hidden",
    },
    grantLabel: {
      control: "text",
      description: "The label of the button which starts the consent request",
    },
    moreInfoLabel: {
      control: "text",
      description: "The label of the secondary button",
    },
    moreInfoUrl: {
      control: "text",
      description: "The target of the secondary button. The button is hidden without it",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the consent request is running",
    },
    grant: {
      action: "grant",
      description: "Emitted when the user grants the permission",
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
  title: "Grant permission to activate this service.",
  description: "Only the data needed to function will be accessed.",
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

export const WithoutMoreInfo: StoryFn = DefaultTemplate.bind({});
WithoutMoreInfo.args = { ...defaultArgs, moreInfoUrl: undefined };

export const Loading: StoryFn = DefaultTemplate.bind({});
Loading.args = { ...defaultArgs, isLoading: true };

const CustomIconTemplate: StoryFn = (args) => ({
  components: { MtGrantPermissionServiceBanner },
  setup() {
    return { args };
  },
  template: `
    <mt-grant-permission-service-banner v-bind="args" @grant="args.grant">
      <template #icon>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 27S4 20.5 4 12.5A6.5 6.5 0 0 1 16 9a6.5 6.5 0 0 1 12 3.5C28 20.5 16 27 16 27Z"
            stroke="#37D046"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </template>
    </mt-grant-permission-service-banner>
  `,
});

export const CustomIcon: StoryFn = CustomIconTemplate.bind({});
CustomIcon.args = { ...defaultArgs };
