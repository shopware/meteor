import type { Meta, StoryObj } from "@storybook/vue3";
import MtUser from "./mt-user.vue";

export type MtUserMeta = Meta<typeof MtUser>;
export type MtUserStory = StoryObj<MtUserMeta>;

const meta: MtUserMeta = {
  title: "Components/User",
  component: MtUser,
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
        <mt-user v-bind="args" />
      </div>
    `,
  }),
};

export default meta;

export const Default: MtUserStory = {};
