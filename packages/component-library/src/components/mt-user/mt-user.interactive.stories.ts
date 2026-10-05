import MtUser from "./mt-user.vue";
import meta, { type MtUserMeta, type MtUserStory } from "./mt-user.stories";

export default {
  ...meta,
  title: "Components/User/Interaction tests",
  tags: ["!autodocs"],
} satisfies MtUserMeta;

export const VisualTestTruncation: MtUserStory = {
  name: "Render a user and truncate long text",
  render: () => ({
    components: { MtUser },
    template: `
      <div style="display: grid; gap: 24px; max-width: 15rem;">
        <mt-user name="Mila Hoffmann" subtitle="Administrator" />
        <mt-user
          name="Maximiliane Alexandra Schmidt-Wolfenstein"
          subtitle="maximiliane.schmidt-wolfenstein@example.com"
        />
      </div>
    `,
  }),
};

export const VisualTestAvatarOnly: MtUserStory = {
  name: "Render only the avatar",
  args: {
    avatarOnly: true,
  },
};
