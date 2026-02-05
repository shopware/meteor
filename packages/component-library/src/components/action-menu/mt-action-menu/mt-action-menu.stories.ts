import type { Meta, StoryObj } from "@storybook/vue3";
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

export type MtActionMenuMeta = Meta<typeof MtActionMenu>;

const meta: MtActionMenuMeta = {
  title: "Components/Form/mt-action-menu",
  component: MtActionMenu,
  render: (args) => ({
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
    setup() {
      return { args };
    },
    template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger as-child>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu v-bind="args">
          <mt-action-menu-group>
            <mt-action-menu-item icon="file-text">
              Documentation
            </mt-action-menu-item>

            <mt-action-menu-item disabled icon="duplicate" :shortcut="{ modifiers: ['mod'], key: 'd' }">
              Duplicate
            </mt-action-menu-item>

            <dropdown-menu-sub>
              <mt-action-menu-item is-sub-trigger icon="arrows">
                  Move
              </mt-action-menu-item>

              <dropdown-menu-portal>
                  <mt-action-menu is-sub-menu>
                      <mt-action-menu-group>
                        <mt-action-menu-item icon="up-circle">
                            Up
                        </mt-action-menu-item>

                        <mt-action-menu-item icon="down-circle">
                            Down
                        </mt-action-menu-item>
                      </mt-action-menu-group>

                      <mt-action-menu-group>
                        <mt-action-menu-item icon="left-circle">
                            Left
                        </mt-action-menu-item>

                        <mt-action-menu-item icon="right-circle">
                            Right
                        </mt-action-menu-item>
                      </mt-action-menu-group>
                  </mt-action-menu>
              </dropdown-menu-portal>
            </dropdown-menu-sub>
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item icon="trash" variant="critical">
              Delete
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`,
  }),
  argTypes: {
    isSubMenu: {
      control: { type: "boolean" },
      description: "Determines if this menu is rendered as a submenu",
    },
  },
};

export default meta;
export type MtActionMenuStory = StoryObj<MtActionMenuMeta>;

export const Default: MtActionMenuStory = {
  name: "mt-action-menu",
};
