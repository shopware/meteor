import type { Meta, StoryObj } from "@storybook/vue3";
import {
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "reka-ui";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtActionMenuGroup from "../mt-action-menu-group/mt-action-menu-group.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";
import MtActionMenu from "./mt-action-menu.vue";

export type MtActionMenuMeta = Meta<typeof MtActionMenu>;

const sharedComponents = {
  MtDropdownMenuPortal: DropdownMenuPortal,
  MtDropdownMenuRoot: DropdownMenuRoot,
  MtDropdownMenuSub: DropdownMenuSub,
  MtDropdownMenuTrigger: DropdownMenuTrigger,
  MtButton,
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
};

const createRender = (template: string) => ({
  components: sharedComponents,
  template,
});

const createStory = (template: string) => ({
  render: () => createRender(template),
  parameters: {
    docs: {
      source: {
        code: template.trim(),
      },
    },
  },
});

const defaultTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button>Open menu</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu>
      <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
      <mt-action-menu-item icon="solid-duplicate">Duplicate</mt-action-menu-item>
      <mt-action-menu-item icon="copy">Copy</mt-action-menu-item>
      <mt-action-menu-item icon="download">Download</mt-action-menu-item>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const withoutIconsTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button>Open menu</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu>
      <mt-action-menu-item>Documentation</mt-action-menu-item>
      <mt-action-menu-item>Duplicate</mt-action-menu-item>
      <mt-action-menu-item>Copy</mt-action-menu-item>
      <mt-action-menu-item>Download</mt-action-menu-item>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const groupedItemsTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button>Open menu</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu>
      <mt-action-menu-group>
        <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
        <mt-action-menu-item icon="solid-duplicate">Duplicate</mt-action-menu-item>
      </mt-action-menu-group>

      <mt-action-menu-group>
        <mt-action-menu-item icon="cog">Settings</mt-action-menu-item>
        <mt-action-menu-item icon="user">Profile</mt-action-menu-item>
      </mt-action-menu-group>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const keyboardShortcutsTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button>Open menu</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu>
      <mt-action-menu-item
        icon="solid-duplicate"
        :shortcut="{ modifiers: ['mod'], key: 'd' }"
      >
        Duplicate
      </mt-action-menu-item>
      <mt-action-menu-item
        icon="copy"
        :shortcut="{ modifiers: ['mod'], key: 'c' }"
      >
        Copy
      </mt-action-menu-item>
      <mt-action-menu-item
        icon="download"
        :shortcut="{ modifiers: ['shift'], key: 'd' }"
      >
        Download
      </mt-action-menu-item>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const statesTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button>Open menu</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu>
      <mt-action-menu-group>
        <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
        <mt-action-menu-item disabled icon="copy">Copy</mt-action-menu-item>
        <mt-action-menu-item disabled>Rename</mt-action-menu-item>
      </mt-action-menu-group>

      <mt-action-menu-group>
        <mt-action-menu-item icon="trash" variant="critical">
          Delete
        </mt-action-menu-item>
        <mt-action-menu-item disabled variant="critical">
          Remove
        </mt-action-menu-item>
      </mt-action-menu-group>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const nestedSubmenuTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button>Open menu</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu>
      <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>

      <mt-dropdown-menu-sub>
        <mt-action-menu-item is-sub-trigger icon="arrows">
          Move
        </mt-action-menu-item>

        <mt-dropdown-menu-portal>
          <mt-action-menu is-sub-menu>
            <mt-action-menu-item icon="up-circle">Up</mt-action-menu-item>
            <mt-action-menu-item icon="down-circle">Down</mt-action-menu-item>
            <mt-action-menu-item icon="left-circle">Left</mt-action-menu-item>
            <mt-action-menu-item icon="right-circle">Right</mt-action-menu-item>
          </mt-action-menu>
        </mt-dropdown-menu-portal>
      </mt-dropdown-menu-sub>

      <mt-action-menu-item icon="cog">Settings</mt-action-menu-item>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const externalLinksTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button>Open menu</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu>
      <mt-action-menu-item icon="file-text" link="https://docs.example.com">
        Documentation
      </mt-action-menu-item>
      <mt-action-menu-item icon="question-circle" link="https://support.example.com">
        Help Center
      </mt-action-menu-item>
      <mt-action-menu-item link="https://example.com">
        External link without icon
      </mt-action-menu-item>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const matchTriggerWidthTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <mt-button style="width: 260px;">Project actions</mt-button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu match-trigger-width>
      <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
      <mt-action-menu-item icon="solid-duplicate">Duplicate</mt-action-menu-item>
      <mt-action-menu-item icon="trash" variant="critical">Delete</mt-action-menu-item>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>
`;

const meta: MtActionMenuMeta = {
  title: "Components/mt-action-menu",
  component: MtActionMenu,
  argTypes: {
    isSubMenu: {
      control: { type: "boolean" },
      description: "Determines if this menu is rendered as a submenu.",
    },
    matchTriggerWidth: {
      control: { type: "boolean" },
      description: "Matches the menu width to the trigger width.",
    },
  },
};

export default meta;
export type MtActionMenuStory = StoryObj<MtActionMenuMeta>;

export const Default: MtActionMenuStory = {
  ...createStory(defaultTemplate),
};

export const WithoutIcons: MtActionMenuStory = {
  name: "Without icons",
  ...createStory(withoutIconsTemplate),
};

export const GroupedItems: MtActionMenuStory = {
  name: "Grouped items",
  ...createStory(groupedItemsTemplate),
};

export const KeyboardShortcuts: MtActionMenuStory = {
  name: "Keyboard shortcuts",
  ...createStory(keyboardShortcutsTemplate),
};

export const States: MtActionMenuStory = {
  ...createStory(statesTemplate),
};

export const NestedSubmenu: MtActionMenuStory = {
  name: "Nested submenu",
  ...createStory(nestedSubmenuTemplate),
};

export const ExternalLinks: MtActionMenuStory = {
  name: "External links",
  ...createStory(externalLinksTemplate),
};

export const MatchTriggerWidth: MtActionMenuStory = {
  name: "Match trigger width",
  ...createStory(matchTriggerWidthTemplate),
};
