import meta, { type MtAvatarMeta, type MtAvatarStory } from "./mt-avatar.stories";

export default {
  ...meta,
  title: "Interaction Tests/Icons & Media/mt-avatar",
} satisfies MtAvatarMeta;

export const VisualTestRenderAvatar: MtAvatarStory = {
  name: "Render avatar",
  args: {
    firstName: "John",
    lastName: "Doe",
  },
};

export const VisualTestAvatarSquare: MtAvatarStory = {
  name: "Render avatar in square variant",
  args: {
    firstName: "John",
    lastName: "Doe",
    variant: "square",
  },
};

export const VisualTestAvatarPlaceholder: MtAvatarStory = {
  name: "Render avatar with placeholder",
  args: {
    placeholder: true,
  },
};

export const VisualTestAvatarImage: MtAvatarStory = {
  name: "Render avatar with image",
  args: {
    imageUrl: "/avatar.png",
  },
};

export const VisualTestColorOrange: MtAvatarStory = {
  name: "Render avatar with orange color",
  args: {
    firstName: "John",
    lastName: "Doe",
  },
};

export const VisualTestColorPink: MtAvatarStory = {
  name: "Render avatar with pink color",
  args: {
    firstName: "A",
  },
};

export const VisualTestColorYellow: MtAvatarStory = {
  name: "Render avatar with yellow color",
  args: {
    firstName: "Jo",
  },
};

export const VisualTestColorPurple: MtAvatarStory = {
  name: "Render avatar with purple color",
  args: {
    firstName: "Joe",
  },
};

export const VisualTestColorRed: MtAvatarStory = {
  name: "Render avatar with red color",
  args: {
    firstName: "Jane",
  },
};

export const VisualTestColorBlue: MtAvatarStory = {
  name: "Render avatar with blue color",
  args: {
    firstName: "James",
  },
};

export const VisualTestColorEmerald: MtAvatarStory = {
  name: "Render avatar with emerald color",
  args: {
    firstName: "Amanda",
  },
};
