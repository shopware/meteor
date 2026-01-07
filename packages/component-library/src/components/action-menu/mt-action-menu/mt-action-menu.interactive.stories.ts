import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import {
  DropdownMenuRoot,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuSub,
} from "reka-ui";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtActionMenu from "./mt-action-menu.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";
import MtActionMenuGroup from "../mt-action-menu-group/mt-action-menu-group.vue";

import meta, { type MtActionMenuMeta, type MtActionMenuStory } from "./mt-action-menu.stories";

export default {
  ...meta,
  title: "Interaction Tests/Action Menu/mt-action-menu",
} as MtActionMenuMeta;

// 1. Closed
export const VisualTestClosed: MtActionMenuStory = {
  name: "Closed menu",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
    },
    template: `
<dropdown-menu-root>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-item icon="file-text">
            Documentation
          </mt-action-menu-item>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 2. Nested items, all items visible
export const VisualTestNestedItemsVisible: MtActionMenuStory = {
  name: "Nested items with submenu visible",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
      MtActionMenuGroup,
      DropdownMenuSub,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-item icon="file-text">
            Documentation
          </mt-action-menu-item>

          <dropdown-menu-sub open>
            <mt-action-menu-item is-sub-trigger icon="arrows">
                Move
            </mt-action-menu-item>

            <dropdown-menu-portal>
                <mt-action-menu is-sub-menu>
                    <mt-action-menu-item icon="up-circle">
                        Up
                    </mt-action-menu-item>

                    <mt-action-menu-item icon="down-circle">
                        Down
                    </mt-action-menu-item>

                    <mt-action-menu-item icon="left-circle">
                        Left
                    </mt-action-menu-item>

                    <mt-action-menu-item icon="right-circle">
                        Right
                    </mt-action-menu-item>
                </mt-action-menu>
            </dropdown-menu-portal>
          </dropdown-menu-sub>

          <mt-action-menu-item icon="settings">
            Settings
          </mt-action-menu-item>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 3. Single group all items have icons
export const VisualTestSingleGroupWithIcons: MtActionMenuStory = {
  name: "Single group with icons",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-item icon="file-text">
            Documentation
          </mt-action-menu-item>

          <mt-action-menu-item icon="duplicate">
            Duplicate
          </mt-action-menu-item>

          <mt-action-menu-item icon="copy">
            Copy
          </mt-action-menu-item>

          <mt-action-menu-item icon="download">
            Download
          </mt-action-menu-item>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 4. Single group all items have NO icons
export const VisualTestSingleGroupNoIcons: MtActionMenuStory = {
  name: "Single group without icons",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-item>
            Documentation
          </mt-action-menu-item>

          <mt-action-menu-item>
            Duplicate
          </mt-action-menu-item>

          <mt-action-menu-item>
            Copy
          </mt-action-menu-item>

          <mt-action-menu-item>
            Download
          </mt-action-menu-item>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 5. Two groups, all items have icons
export const VisualTestTwoGroupsWithIcons: MtActionMenuStory = {
  name: "Two groups with icons",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
      MtActionMenuGroup,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-group>
            <mt-action-menu-item icon="file-text">
              Documentation
            </mt-action-menu-item>

            <mt-action-menu-item icon="duplicate">
              Duplicate
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item icon="settings">
              Settings
            </mt-action-menu-item>

            <mt-action-menu-item icon="user">
              Profile
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 6. Two groups, no items have icons
export const VisualTestTwoGroupsNoIcons: MtActionMenuStory = {
  name: "Two groups without icons",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
      MtActionMenuGroup,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-group>
            <mt-action-menu-item>
              Documentation
            </mt-action-menu-item>

            <mt-action-menu-item>
              Duplicate
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item>
              Settings
            </mt-action-menu-item>

            <mt-action-menu-item>
              Profile
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 7. Two groups, first group has two icons second group has items with icons and items without icons
export const VisualTestTwoGroupsMixedIcons: MtActionMenuStory = {
  name: "Two groups with mixed icons",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
      MtActionMenuGroup,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-group>
            <mt-action-menu-item icon="file-text">
              Documentation
            </mt-action-menu-item>

            <mt-action-menu-item icon="duplicate">
              Duplicate
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item icon="settings">
              Settings
            </mt-action-menu-item>

            <mt-action-menu-item>
              Help Center
            </mt-action-menu-item>

            <mt-action-menu-item icon="user">
              Profile
            </mt-action-menu-item>

            <mt-action-menu-item>
              About
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 8. All possible states, disabled and variants
export const VisualTestAllStates: MtActionMenuStory = {
  name: "All states (disabled and variants)",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
      MtActionMenuGroup,
      DropdownMenuSub,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-group>
            <!-- Default variant -->
            <mt-action-menu-item icon="file-text">
              Default item with icon
            </mt-action-menu-item>

            <mt-action-menu-item>
              Default item without icon
            </mt-action-menu-item>

            <mt-action-menu-item icon="duplicate" :shortcut="{ pc: 'Ctrl + D', mac: '⌘ + D' }">
              Default with shortcut
            </mt-action-menu-item>

            <!-- Disabled states -->
            <mt-action-menu-item disabled icon="lock">
              Disabled with icon
            </mt-action-menu-item>

            <mt-action-menu-item disabled>
              Disabled without icon
            </mt-action-menu-item>

            <mt-action-menu-item disabled icon="copy" :shortcut="{ pc: 'Ctrl + C', mac: '⌘ + C' }">
              Disabled with shortcut
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <!-- Critical variant -->
            <mt-action-menu-item icon="warning" variant="critical">
              Critical item with icon
            </mt-action-menu-item>

            <mt-action-menu-item variant="critical">
              Critical item without icon
            </mt-action-menu-item>

            <mt-action-menu-item icon="trash" variant="critical" :shortcut="{ pc: 'Del', mac: '⌫' }">
              Critical with shortcut
            </mt-action-menu-item>

            <!-- Critical disabled -->
            <mt-action-menu-item disabled icon="trash" variant="critical">
              Critical disabled with icon
            </mt-action-menu-item>

            <mt-action-menu-item disabled variant="critical">
              Critical disabled without icon
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <!-- Sub trigger -->
            <dropdown-menu-sub>
              <mt-action-menu-item is-sub-trigger icon="arrows">
                  Sub menu trigger
              </mt-action-menu-item>

              <dropdown-menu-portal>
                  <mt-action-menu is-sub-menu>
                      <mt-action-menu-item>
                          Nested item
                      </mt-action-menu-item>
                  </mt-action-menu>
              </dropdown-menu-portal>
            </dropdown-menu-sub>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 9. Two groups: first with icons, second without
export const VisualTestTwoGroupsFirstWithIconsSecondWithout: MtActionMenuStory = {
  name: "Two groups - first with icons, second without",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
      MtActionMenuGroup,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-group>
            <mt-action-menu-item icon="file-text">
              Documentation
            </mt-action-menu-item>

            <mt-action-menu-item icon="duplicate">
              Duplicate
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item>
              Settings
            </mt-action-menu-item>

            <mt-action-menu-item>
              Profile
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 10. Four levels of nesting
export const VisualTestFourLevelsNested: MtActionMenuStory = {
  name: "Four levels of nested submenus",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
      MtActionMenuGroup,
      DropdownMenuSub,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-group>
            <mt-action-menu-item icon="home">
              Home
            </mt-action-menu-item>

            <!-- Level 1 -> Level 2 -->
            <dropdown-menu-sub open>
              <mt-action-menu-item is-sub-trigger icon="folder">
                  Documents
              </mt-action-menu-item>

              <dropdown-menu-portal>
                  <mt-action-menu is-sub-menu>
                      <mt-action-menu-item icon="file-text">
                          README.md
                      </mt-action-menu-item>

                      <!-- Level 2 -> Level 3 -->
                      <dropdown-menu-sub open>
                        <mt-action-menu-item is-sub-trigger icon="folder">
                            Projects
                        </mt-action-menu-item>

                        <dropdown-menu-portal>
                            <mt-action-menu is-sub-menu>
                                <mt-action-menu-item icon="file-text">
                                    notes.txt
                                </mt-action-menu-item>

                                <!-- Level 3 -> Level 4 -->
                                <dropdown-menu-sub open>
                                  <mt-action-menu-item is-sub-trigger icon="folder">
                                      Frontend
                                  </mt-action-menu-item>

                                  <dropdown-menu-portal>
                                      <mt-action-menu is-sub-menu>
                                          <mt-action-menu-group>
                                            <mt-action-menu-item icon="file-text">
                                                index.html
                                            </mt-action-menu-item>

                                            <mt-action-menu-item icon="file-text">
                                                styles.css
                                            </mt-action-menu-item>
                                          </mt-action-menu-group>

                                          <mt-action-menu-group>
                                            <mt-action-menu-item icon="file-text">
                                                app.js
                                            </mt-action-menu-item>
                                          </mt-action-menu-group>
                                      </mt-action-menu>
                                  </dropdown-menu-portal>
                                </dropdown-menu-sub>

                                <mt-action-menu-item icon="folder">
                                    Backend
                                </mt-action-menu-item>
                            </mt-action-menu>
                        </dropdown-menu-portal>
                      </dropdown-menu-sub>

                      <mt-action-menu-item icon="file-text">
                          config.json
                      </mt-action-menu-item>
                  </mt-action-menu>
              </dropdown-menu-portal>
            </dropdown-menu-sub>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item>
              Settings
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// Interaction test: clicking menu item
export const TestMenuItemClick: MtActionMenuStory = {
  name: "Menu item responds to click",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtButton,
    },
    template: `
<dropdown-menu-root>
    <dropdown-menu-trigger as-child>
        <mt-button data-testid="trigger">Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-item icon="file-text" data-testid="menu-item">
            Documentation
          </mt-action-menu-item>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("trigger");

    await userEvent.click(trigger);

    // Wait for menu to appear
    await new Promise((resolve) => setTimeout(resolve, 100));

    const menuItem = document.querySelector('[data-testid="menu-item"]');
    expect(menuItem).toBeInTheDocument();
  },
};
