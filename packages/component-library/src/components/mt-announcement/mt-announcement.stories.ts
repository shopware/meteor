import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtAnnouncement from "./mt-announcement.vue";

export type MtAnnouncementMeta = SlottedMeta<typeof MtAnnouncement, "default">;

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
    template: `<mt-announcement :variant="args.variant" :appearance="args.appearance" :icon="args.icon" :closable="args.closable">{{ args.default }}</mt-announcement>`,
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
