import MtCard from "./mt-card.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtContextMenuItem from "../../context-menu/mt-context-menu-item/mt-context-menu-item.vue";
import MtTabs from "../../navigation/mt-tabs/mt-tabs.vue";
import MtAvatar from "../../icons-media/mt-avatar/mt-avatar.vue";
import { fn } from "@storybook/test";
import { action } from "@storybook/addon-actions";
import type { SlottedMeta } from "@/_internal/story-helper";
import type { StoryObj } from "@storybook/vue3";
import MtText from "@/components/content/mt-text/mt-text.vue";

type MtCardSlots =
  | "default"
  | "toolbar"
  | "footer"
  | "headerRight"
  | "avatar"
  | "title"
  | "subtitle"
  | "context-actions"
  | "grid"
  | "tabs"
  | "before-card"
  | "after-card"
  | "updateInheritance";

export type MtCardMeta = SlottedMeta<typeof MtCard, MtCardSlots>;
export type MtCardStory = StoryObj<MtCardMeta>;

const meta: MtCardMeta = {
  title: "Components/Layout/mt-card",
  component: MtCard,
  argTypes: {
    title: {
      control: { type: "text" },
      table: {
        category: "props",
      },
    },
    subtitle: {
      control: { type: "text" },
      table: {
        category: "props",
      },
    },
    "context-actions": {
      control: { type: undefined },
    },
    grid: {
      control: { type: undefined },
    },
    tabs: {
      control: { type: undefined },
    },
    avatar: {
      control: { type: undefined },
    },
    inheritance: {
      control: { type: "boolean" },
      table: {
        category: "props",
      },
    },
    updateInheritance: {
      action: "updateInheritance",
      table: {
        category: "Events",
      },
    },
    "before-card": {
      control: { type: undefined },
    },
    "after-card": {
      control: { type: undefined },
    },
  },
};

export default meta;

export const MinimalStory: StoryObj<MtCardMeta> = {
  name: "Minimal",
  render: (args) => ({
    components: { MtCard, MtContextMenuItem, MtTabs, MtAvatar, MtButton, MtText },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args" @update:inheritance="args.updateInheritance">
      <div v-html="args.default"></div>
    </mt-card>`,
  }),
  args: {
    default: `
    <mt-text>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</mt-text>
    <br>
    <mt-text>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</mt-text>
    <br>
    `,
    title: "Title",
    subtitle: "Subtitle",
    toolbar: null,
    footer: null,
    headerRight: null,
    isLoading: false,
    large: false,
    avatar: null,
    updateInheritance: fn(action("update:inhertitance")),
  },
  ...meta,
};

export const ExtendedStory: StoryObj<MtCardMeta> = {
  name: "Extended",
  render: (args) => ({
    components: { MtCard, MtContextMenuItem, MtTabs, MtAvatar, MtButton, MtText },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args" @update:inheritance="args.updateInheritance">
        <mt-text as="h4" size="l" style="color: var(--color-text-primary-default);">
          Active Tab: {{ activeTab }}
        </mt-text>

        <div v-html="args.default"></div>

        <template #toolbar>
          <template v-if="args.toolbar">
            <mt-button variant="primary">Primary button</mt-button>
            <mt-button variant="secondary">Secondary button</mt-button>
          </template>
        </template>

        <template #tabs>
          <mt-tabs
          v-if="args.tabs"
          :default-item="activeTab"
          @new-item-active="setContent"
          :items="tabItems"
          ></mt-tabs>
        </template>

        <template #footer>
          <div v-if="args.footer" v-html="args.footer"></div>
        </template>

        <template #avatar>
          <mt-avatar v-if="args.avatar" firstName="Max" lastName="Mustermann" variant="square" />
        </template>

        <template #headerRight>
          <div v-if="args.headerRight" v-html="args.headerRight"></div>
        </template>

        <template #context-actions>
          <template v-if="args['context-actions']">
            <mt-context-menu-item label="Menu Item A"></mt-context-menu-item>
            <mt-context-menu-item label="Menu Item B"></mt-context-menu-item>
            <mt-context-menu-item label="Menu Item C"></mt-context-menu-item>
          </template>
        </template>
    </mt-card>`,
    data() {
      return {
        activeTab: "tabA",
        tabItems: [
          { label: "Tab A", name: "tabA" },
          { label: "Tab B", name: "tabB" },
          { label: "Tab C", name: "tabC" },
        ],
      };
    },
    methods: {
      setContent(name: string) {
        this.activeTab = name;
      },
    },
  }),
  args: {
    default: `
    <mt-text>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</mt-text>
    <br>
    <mt-text>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</mt-text>
    <br>
    `,
    toolbar: `<mt-text>Toolbar</mt-text>`,
    footer: "<mt-text><strong>Footer</strong></mt-text>",
    title: "Title",
    subtitle: "Subtitle",
    headerRight: "Header right",
    isLoading: false,
    large: false,
    avatar: "AVTR",
    tabs: true,
    "context-actions": true,
  },
  ...meta,
};
