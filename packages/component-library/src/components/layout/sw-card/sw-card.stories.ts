import SwCard from "./sw-card.vue";
import SwButton from "../../form/sw-button/sw-button.vue";
import SwContextMenuItem from "../../context-menu/sw-context-menu-item/sw-context-menu-item.vue";
import SwTabs from "../../navigation/sw-tabs/sw-tabs.vue";
import SwAvatar from "../../icons-media/sw-avatar/sw-avatar.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import type { StoryObj } from "@storybook/vue3";

type SwCardSlots =
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
  | "after-card";

export type SwCardMeta = SlottedMeta<typeof SwCard, SwCardSlots>;
export type SwCardStory = StoryObj<SwCardMeta>;

const meta: SwCardMeta = {
  title: "Components/Layout/sw-card",
  component: SwCard,
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
      control: { type: null },
    },
    grid: {
      control: { type: null },
    },
    tabs: {
      control: { type: null },
    },
    avatar: {
      control: { type: null },
    },
    "before-card": {
      control: { type: null },
    },
    "after-card": {
      control: { type: null },
    },
  },
};

export default meta;

export const MinimalStory: StoryObj<SwCardMeta> = {
  name: "Minimal",
  render: (args) => ({
    components: { SwCard, SwContextMenuItem, SwTabs, SwAvatar, SwButton },
    setup() {
      return { args };
    },
    template: `
    <sw-card v-bind="args">
      <div v-html="args.default"></div>
    </sw-card>`,
  }),
  args: {
    default: `
    <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
    <br>
    <p>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>
    <br>
    `,
    title: "Title",
    subtitle: "Subtitle",
    toolbar: null,
    footer: null,
    headerRight: null,
    hero: false,
    isLoading: false,
    large: false,
    avatar: null,
  },
  ...meta,
};

export const ExtendedStory: StoryObj<SwCardMeta> = {
  name: "Extended",
  render: (args) => ({
    components: { SwCard, SwContextMenuItem, SwTabs, SwAvatar, SwButton },
    setup() {
      return { args };
    },
    template: `
    <sw-card v-bind="args">
        <h4 style="color: var(--color-text-primary-default);">
          Active Tab: {{ activeTab }}
        </h4>

        <div v-html="args.default"></div>

        <template #toolbar>
          <template v-if="args.toolbar">
            <sw-button variant="primary">Primary button</sw-button>
            <sw-button variant="secondary">Secondary button</sw-button>
          </template>
        </template>

        <template #tabs>
          <sw-tabs
          v-if="args.tabs"
          :default-item="activeTab"
          @new-item-active="setContent"
          :items="tabItems"
          ></sw-tabs>
        </template>

        <template #footer>
          <div v-if="args.footer" v-html="args.footer"></div>
        </template>

        <template #avatar>
          <sw-avatar v-if="args.avatar" firstName="Max" lastName="Mustermann" variant="square" />
        </template>

        <template #headerRight>
          <div v-if="args.headerRight" v-html="args.headerRight"></div>
        </template>

        <template #context-actions>
          <template v-if="args['context-actions']">
            <sw-context-menu-item label="Menu Item A"></sw-context-menu-item>
            <sw-context-menu-item label="Menu Item B"></sw-context-menu-item>
            <sw-context-menu-item label="Menu Item C"></sw-context-menu-item>
          </template>
        </template>
    </sw-card>`,
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
    <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
    <br>
    <p>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>
    <br>
    `,
    toolbar: `<p>Toolbar</p>`,
    footer: "<p><strong>Footer</strong></p>",
    title: "Title",
    subtitle: "Subtitle",
    headerRight: "Header right",
    hero: false,
    isLoading: false,
    large: false,
    avatar: "AVTR",
    tabs: true,
    "context-actions": true,
  },
  ...meta,
};
