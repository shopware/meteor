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
import MtInset from "../mt-inset/mt-inset.vue";

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
  title: "Components/Card",
  component: MtCard,
  excludeStories: ["ExtendedStory"],
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
    toolbar: {
      control: { type: undefined },
      table: {
        disable: true,
      },
    },
    footer: {
      control: { type: undefined },
      table: {
        disable: true,
      },
    },
    "context-actions": {
      control: { type: undefined },
      table: {
        disable: true,
      },
    },
    grid: {
      control: { type: undefined },
      table: {
        disable: true,
      },
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
      table: {
        disable: true,
      },
    },
    "after-card": {
      control: { type: undefined },
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

export const Default: StoryObj<MtCardMeta> = {
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
};

export const HeaderContent: StoryObj<MtCardMeta> = {
  name: "Header content",
  render: (args) => ({
    components: { MtCard, MtAvatar, MtButton },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args">
      <template #avatar>
        <mt-avatar firstName="Max" lastName="Mustermann" variant="square" />
      </template>

      <template #headerRight>
        <mt-button variant="secondary">Edit</mt-button>
      </template>

      <p>Use header content to add context and a related secondary action.</p>
    </mt-card>`,
  }),
  args: {
    title: "Customer details",
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-card title="Customer details">
  <template #avatar>
    <mt-avatar
      first-name="Max"
      last-name="Mustermann"
      variant="square"
    />
  </template>

  <template #headerRight>
    <mt-button variant="secondary">Edit</mt-button>
  </template>

  <p>Use header content to add context and a related secondary action.</p>
</mt-card>`,
      },
    },
  },
};

export const Tabs: StoryObj<MtCardMeta> = {
  render: (args) => ({
    components: { MtCard, MtTabs },
    setup() {
      const tabItems = [
        { label: "Overview", name: "overview" },
        { label: "History", name: "history" },
      ];

      return { args, tabItems };
    },
    template: `
    <mt-card v-bind="args">
      <template #tabs>
        <mt-tabs default-item="overview" :items="tabItems" />
      </template>

      <p>Use tabs to switch between closely related views that still belong to the same section.</p>
    </mt-card>`,
  }),
  args: {
    title: "Customer details",
    subtitle: "Account overview",
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-card title="Customer details" subtitle="Account overview">
  <template #tabs>
    <mt-tabs
      default-item="overview"
      :items="[
        { label: 'Overview', name: 'overview' },
        { label: 'History', name: 'history' },
      ]"
    />
  </template>

  <p>Use tabs to switch between closely related views that still belong to the same section.</p>
</mt-card>`,
      },
    },
  },
};

export const Loading: StoryObj<MtCardMeta> = {
  render: (args) => ({
    components: { MtCard },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args">
      <p>Loading overlays the content area while the card keeps its layout.</p>
    </mt-card>`,
  }),
  args: {
    title: "Analytics",
    subtitle: "Latest report",
    isLoading: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-card title="Analytics" subtitle="Latest report" is-loading>
  <p>Loading overlays the content area while the card keeps its layout.</p>
</mt-card>`,
      },
    },
  },
};

export const Inheritance: StoryObj<MtCardMeta> = {
  render: (args) => ({
    components: { MtCard },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args" @update:inheritance="args.updateInheritance">
      <p>
        Use the inheritance toggle when a card represents values that can be linked
        or overridden.
      </p>
    </mt-card>`,
  }),
  args: {
    title: "Product settings",
    subtitle: "Inherited from parent configuration",
    inheritance: true,
    updateInheritance: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-card
  title="Product settings"
  subtitle="Inherited from parent configuration"
  :inheritance="true"
>
  <p>
    Use the inheritance toggle when a card represents values that can be linked
    or overridden.
  </p>
</mt-card>`,
      },
    },
  },
};

export const InsetContent: StoryObj<MtCardMeta> = {
  name: "Inset content",
  render: (args) => ({
    components: { MtCard, MtInset, MtText },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args">
      <mt-inset>
        <mt-text as="h3" size="m" weight="bold">Headline</mt-text>

        <mt-text>
          Use inset content when the inner block should visually extend to the
          card edges while still respecting the card's own spacing tokens.
        </mt-text>
      </mt-inset>
    </mt-card>`,
  }),
  args: {
    title: "Customer details",
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-card title="Customer details">
  <mt-inset>
    <mt-text as="h3" size="m" weight="bold">Headline</mt-text>

    <mt-text>
      Use inset content when the inner block should visually extend to the
      card edges while still respecting the card's own spacing tokens.
    </mt-text>
  </mt-inset>
</mt-card>`,
      },
    },
  },
};

export const InsetFooter: StoryObj<MtCardMeta> = {
  name: "Inset footer",
  render: (args) => ({
    components: { MtCard, MtInset, MtText },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args">
      <p>Use inset footer content when the footer should stretch edge to edge.</p>

      <template #footer>
        <mt-inset
          style="
            background: var(--color-elevation-surface-sunken);
            padding: var(--mt-card-footer-padding);
          "
        >
          <mt-text as="h3" size="m" weight="bold">Footer content</mt-text>

          <mt-text>
            The inset keeps the footer aligned with the card's own spacing while
            allowing a full-width surface treatment inside the footer area.
          </mt-text>
        </mt-inset>
      </template>
    </mt-card>`,
  }),
  args: {
    title: "Customer details",
    footer: "<p>Custom footer</p>",
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-card title="Customer details">
  <p>Use inset footer content when the footer should stretch edge to edge.</p>

  <template #footer>
    <mt-inset
      style="
        background: var(--color-elevation-surface-sunken);
        padding: var(--mt-card-footer-padding);
      "
    >
      <mt-text as="h3" size="m" weight="bold">Footer content</mt-text>

      <mt-text>
        The inset keeps the footer aligned with the card's own spacing while
        allowing a full-width surface treatment inside the footer area.
      </mt-text>
    </mt-inset>
  </template>
</mt-card>`,
      },
    },
  },
};
