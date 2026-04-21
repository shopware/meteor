import type { SlottedMeta } from "@/_internal/story-helper";
import MtAvatar from "./mt-avatar.vue";
import type { StoryObj } from "@storybook/vue3";

export type MtAvatarMeta = SlottedMeta<typeof MtAvatar, "default">;

const meta: MtAvatarMeta = {
  title: "Components/mt-avatar",
  component: MtAvatar,
  render: (args) => ({
    components: { MtAvatar },
    template: '<mt-avatar v-bind="args"></mt-avatar>',
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    firstName: "John",
    lastName: "Doe",
    size: "m",
    variant: "circle",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["2xs", "xs", "s", "m", "l"],
    },
    variant: {
      control: "select",
      options: ["circle", "square"],
    },
  },
};

export default meta;
export type MtAvatarStory = StoryObj<MtAvatarMeta>;

export const Default: MtAvatarStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar first-name="John" last-name="Doe" size="m" variant="circle" />`,
      },
    },
  },
};

export const AllSizes: MtAvatarStory = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar first-name="John" last-name="Doe" size="2xs" />
<mt-avatar first-name="John" last-name="Doe" size="xs" />
<mt-avatar first-name="John" last-name="Doe" size="s" />
<mt-avatar first-name="John" last-name="Doe" size="m" />
<mt-avatar first-name="John" last-name="Doe" size="l" />`,
      },
    },
  },
  render: () => ({
    components: { MtAvatar },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <mt-avatar first-name="John" last-name="Doe" size="2xs" />
        <mt-avatar first-name="John" last-name="Doe" size="xs" />
        <mt-avatar first-name="John" last-name="Doe" size="s" />
        <mt-avatar first-name="John" last-name="Doe" size="m" />
        <mt-avatar first-name="John" last-name="Doe" size="l" />
      </div>`,
  }),
};

export const WithImage: MtAvatarStory = {
  name: "With image",
  args: {
    imageUrl: "/avatar.jpg",
    firstName: undefined,
    lastName: undefined,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar image-url="/avatar.jpg" size="m" />`,
      },
    },
  },
};

export const Square: MtAvatarStory = {
  args: {
    firstName: "John",
    lastName: "Doe",
    variant: "square",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar first-name="John" last-name="Doe" variant="square" size="m" />`,
      },
    },
  },
};

export const AllBackgroundColors: MtAvatarStory = {
  name: "All background colors",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar first-name="Jane" />
<mt-avatar first-name="James" />
<mt-avatar first-name="Amanda" />
<mt-avatar first-name="Abigail" />
<mt-avatar first-name="A" />
<mt-avatar first-name="Jo" />
<mt-avatar first-name="Joe" />`,
      },
    },
  },
  render: () => ({
    components: { MtAvatar },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <mt-avatar first-name="Jane" />
        <mt-avatar first-name="James" />
        <mt-avatar first-name="Amanda" />
        <mt-avatar first-name="Abigail" />
        <mt-avatar first-name="A" />
        <mt-avatar first-name="Jo" />
        <mt-avatar first-name="Joe" />
      </div>`,
  }),
};
