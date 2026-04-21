import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import MtBanner from "./mt-banner.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtBannerMeta = SlottedMeta<typeof MtBanner, "default" | "close">;

const meta: MtBannerMeta = {
  title: "Components/mt-banner",
  component: MtBanner,
  args: {
    title: "This is a banner",
    default: "I am in the default slot of the banner",
    variant: "neutral",
    close: fn(action("close")),
  },
  render: (args) => ({
    components: { MtBanner },
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-banner
        v-bind="args"
        @close="args.close"
      >
        <span v-html="args.default"></span>
      </mt-banner>`,
  }),
};

export default meta;
export type MtBannerStory = StoryObj<MtBannerMeta>;

export const Default: MtBannerStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-banner title="This is a banner" variant="neutral">
  I am in the default slot of the banner
</mt-banner>`,
      },
    },
  },
};

export const AllVariants: MtBannerStory = {
  name: "Variants",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-banner variant="neutral" title="Neutral banner">
  Use for general information that should stay visible in the page flow.
</mt-banner>

<mt-banner variant="info" title="Info banner">
  Use for informative updates or guidance that helps users continue their task.
</mt-banner>

<mt-banner variant="attention" title="Attention banner">
  Use when users should review something carefully before continuing.
</mt-banner>

<mt-banner variant="critical" title="Critical banner">
  Use for errors or states that require user attention.
</mt-banner>

<mt-banner variant="positive" title="Positive banner">
  Use for success states that should remain visible in context.
</mt-banner>

<mt-banner variant="inherited" title="Inherited banner">
  Use when content or configuration is inherited from another source.
</mt-banner>`,
      },
    },
  },
  render: () => ({
    components: { MtBanner },
    template: `
        <mt-banner variant="neutral" title="Neutral banner" >
          Use for general information that should stay visible in the page flow.
        </mt-banner>

        <mt-banner variant="info" title="Info banner" >
          Use for informative updates or guidance that helps users continue their task.
        </mt-banner>

        <mt-banner variant="attention" title="Attention banner" >
          Use when users should review something carefully before continuing.
        </mt-banner>

        <mt-banner variant="critical" title="Critical banner" >
          Use for errors or states that require user attention.
        </mt-banner>

        <mt-banner variant="positive" title="Positive banner" >
          Use for success states that should remain visible in context.
        </mt-banner>

        <mt-banner variant="inherited" title="Inherited banner" >
          Use when content or configuration is inherited from another source.
      </mt-banner>`,
  }),
};

export const Closable: MtBannerStory = {
  args: {
    title: "Closable banner",
    default: "Use this when dismissing the message is a safe choice for the user.",
    variant: "neutral",
    closable: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-banner title="Closable banner" variant="neutral" :closable="true">
  Use this when dismissing the message is a safe choice for the user.
</mt-banner>`,
      },
    },
  },
};
