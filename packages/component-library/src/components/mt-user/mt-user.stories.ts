import type { Meta, StoryObj } from "@storybook/vue3";
import MtUser from "./mt-user.vue";

export type MtUserMeta = Meta<typeof MtUser>;

const meta: MtUserMeta = {
  title: "Components/User",
  component: MtUser,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  args: {
    name: "Mila Hoffmann",
    subtitle: "mila.hoffmann@example.com",
    avatarOnly: false,
  },
  render: (args) => ({
    components: { MtUser },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 15rem;">
        <mt-user
          :name="args.name"
          :subtitle="args.subtitle"
          :image-url="args.imageUrl"
          :avatar-only="args.avatarOnly"
        />
      </div>`,
  }),
};

export default meta;
export type MtUserStory = StoryObj<MtUserMeta>;

export const Default: MtUserStory = {};
