import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtAnnouncement from "./mt-announcement.vue";
import MtLink from "../mt-link/mt-link.vue";

export type MtAnnouncementMeta = SlottedMeta<typeof MtAnnouncement, "default" | "close">;

const VARIANTS = [
  {
    variant: "neutral",
    icon: "solid-calendar",
    text: "Our support team is away on December 24 and 25.",
  },
  {
    variant: "info",
    icon: "solid-megaphone",
    text: "Join our live product update on Thursday, November 20, at 3:00 PM CET.",
  },
  {
    variant: "attention",
    icon: "solid-tools",
    text: "Planned maintenance on Sunday, November 16, from 2:00 to 4:00 AM CET.",
  },
  {
    variant: "critical",
    icon: "solid-exclamation-circle",
    text: "Orders can't be saved right now. We are working on a fix.",
  },
  {
    variant: "positive",
    icon: "solid-check-circle",
    text: "Everything works again. Thanks for your patience.",
  },
];

const meta: MtAnnouncementMeta = {
  title: "Components/Announcement",
  component: MtAnnouncement,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  args: {
    variant: "attention",
    appearance: "subtle",
    icon: "solid-tools",
    closable: false,
    default:
      "Planned maintenance on Sunday, November 16, from 2:00 to 4:00 AM CET. You can't save changes during this time.",
    close: fn(action("close")),
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "info", "attention", "critical", "positive"],
    },
    appearance: {
      control: { type: "select" },
      options: ["subtle", "strong"],
    },
    icon: {
      control: { type: "text" },
    },
    closable: {
      control: { type: "boolean" },
    },
  },
  render: (args) => ({
    components: { MtAnnouncement },
    setup: () => ({ args }),
    template: `
      <mt-announcement
        :variant="args.variant"
        :appearance="args.appearance"
        :icon="args.icon"
        :closable="args.closable"
        @close="args.close"
      >
        {{ args.default }}
      </mt-announcement>`,
  }),
};

export default meta;
export type MtAnnouncementStory = StoryObj<MtAnnouncementMeta>;

export const Default: MtAnnouncementStory = {};

export const Strong: MtAnnouncementStory = {
  args: {
    appearance: "strong",
  },
};

const variantsRender =
  (appearance: "subtle" | "strong"): MtAnnouncementStory["render"] =>
  () => ({
    components: { MtAnnouncement },
    setup: () => ({ variants: VARIANTS, appearance }),
    template: `
      <div style="display: grid; gap: var(--scale-size-8);">
        <mt-announcement
          v-for="item in variants"
          :key="item.variant"
          :variant="item.variant"
          :appearance="appearance"
          :icon="item.icon"
        >
          {{ item.text }}
        </mt-announcement>
      </div>`,
  });

export const Variants: MtAnnouncementStory = {
  render: variantsRender("subtle"),
};

export const StrongVariants: MtAnnouncementStory = {
  render: variantsRender("strong"),
};

export const Closable: MtAnnouncementStory = {
  args: {
    closable: true,
  },
};

export const WithLink: MtAnnouncementStory = {
  args: {
    variant: "info",
    icon: "solid-megaphone",
    closable: true,
  },
  render: (args) => ({
    components: { MtAnnouncement, MtLink },
    setup: () => ({ args }),
    template: `
      <mt-announcement
        :variant="args.variant"
        :appearance="args.appearance"
        :icon="args.icon"
        :closable="args.closable"
        @close="args.close"
      >
        The new reporting arrives on December 1.
        <mt-link as="a" to="#">See what's new in reporting</mt-link>
      </mt-announcement>`,
  }),
};

export const LongText: MtAnnouncementStory = {
  args: {
    closable: true,
    default:
      "Planned maintenance on Sunday, November 16, from 2:00 to 4:00 AM CET. You can't save changes during this time, and orders that customers place in the storefront are only processed once the maintenance is over. Please plan your work around it and let your team know.",
  },
  render: (args) => ({
    components: { MtAnnouncement },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 720px;">
        <mt-announcement
          :variant="args.variant"
          :appearance="args.appearance"
          :icon="args.icon"
          :closable="args.closable"
          @close="args.close"
        >
          {{ args.default }}
        </mt-announcement>
      </div>`,
  }),
};

export const WithoutIcon: MtAnnouncementStory = {
  args: {
    icon: undefined,
  },
};
