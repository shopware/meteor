import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import MtAttachment from "./mt-attachment.vue";

export type MtAttachmentMeta = Meta<typeof MtAttachment>;

const meta: MtAttachmentMeta = {
  title: "Components/Attachment",
  component: MtAttachment,
  args: {
    label: "Product: Lamp",
    icon: "regular-products",
    removable: true,
    onRemove: fn(),
  },
  render: (args) => ({
    components: { MtAttachment },
    setup: () => ({ args }),
    template: `<mt-attachment v-bind="args" />`,
  }),
};

export default meta;
export type MtAttachmentStory = StoryObj<MtAttachmentMeta>;

export const Default: MtAttachmentStory = {};
