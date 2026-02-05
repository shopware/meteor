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
import MtAvatar from "../../icons-media/mt-avatar/mt-avatar.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

import meta, { type MtActionMenuMeta, type MtActionMenuStory } from "./mt-action-menu.stories";
import MtText from "@/components/content/mt-text/mt-text.vue";

export default {
  ...meta,
  title: "Interaction Tests/Components/Form/mt-action-menu",
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

          <mt-action-menu-item icon="cog">
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
            <mt-action-menu-item icon="cog">
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
            <mt-action-menu-item icon="cog">
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

            <mt-action-menu-item icon="duplicate" :shortcut="{ modifiers: ['mod'], key: 'd' }">
              Default with shortcut
            </mt-action-menu-item>

            <!-- Disabled states -->
            <mt-action-menu-item disabled icon="lock">
              Disabled with icon
            </mt-action-menu-item>

            <mt-action-menu-item disabled>
              Disabled without icon
            </mt-action-menu-item>

            <mt-action-menu-item disabled icon="copy" :shortcut="{ modifiers: ['mod'], key: 'c' }">
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

            <mt-action-menu-item icon="trash" variant="critical" :shortcut="{ key: 'backspace' }">
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

// 11. External link items
export const VisualTestExternalLinks: MtActionMenuStory = {
  name: "Items with external links",
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
            <mt-action-menu-item icon="file-text" link="https://docs.example.com">
              Documentation
            </mt-action-menu-item>

            <mt-action-menu-item icon="help" link="https://support.example.com">
              Help Center
            </mt-action-menu-item>

            <mt-action-menu-item link="https://example.com">
              External link without icon
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item icon="cog">
              Settings (no link)
            </mt-action-menu-item>

            <mt-action-menu-item icon="user">
              Profile (no link)
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
};

// 12. User profile trigger with matchTriggerWidth
export const VisualTestUserProfileTrigger: MtActionMenuStory = {
  name: "User profile trigger with matchTriggerWidth",
  render: () => ({
    components: {
      DropdownMenuRoot,
      DropdownMenuPortal,
      MtActionMenuItem,
      MtActionMenu,
      DropdownMenuTrigger,
      MtActionMenuGroup,
      MtAvatar,
      MtIcon,
      MtText,
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <button style="display: flex; align-items: center;" class="user-profile-trigger">
          <mt-avatar 
            first-name="John" 
            last-name="Doe" 
            size="s"
          />

          <div style="padding-left: var(--scale-size-14);" />

          <div style="text-align: left;">
            <mt-text>John Doe</mt-text>

            <mt-text size="xs" color="color-text-secondary-default" style="margin-top: -4px;">john.doe@example.com</mt-text>
          </div>

          <div style="padding-left: var(--scale-size-32);" />

          <mt-icon 
            name="chevron-down-s" 
            size="12" 
            color="var(--color-icon-primary-default)"
          />
        </button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu match-trigger-width>
          <mt-action-menu-group>
            <mt-action-menu-item icon="user">
              Profile
            </mt-action-menu-item>

            <mt-action-menu-item icon="cog">
              Settings
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item icon="sign-out" variant="critical">
              Sign out
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
