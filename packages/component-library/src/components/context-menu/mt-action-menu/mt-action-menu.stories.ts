import type { Meta, StoryObj } from "@storybook/vue3";
import { DropdownMenuRoot,  DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'reka-ui'
import MtButton from "../../form/mt-button/mt-button.vue";
import MtActionMenu from "./mt-action-menu.vue";
import MtActionMenuItem from "./mt-action-menu-item.vue";
import MtActionMenuDivider from "./mt-action-menu-divider.vue";

export default {
    component: DropdownMenuRoot,
    title: "Components/Context Menu/mt-action-menu",
    subcomponents: {
        DropdownMenuPortal,
        DropdownMenuContent,
        DropdownMenuItem,
        MtActionMenuItem,
        MtActionMenu,
        MtActionMenuDivider
    },
    render: (args) => ({
        components: {
            DropdownMenuRoot,
            DropdownMenuPortal,
            MtActionMenuItem,
            MtActionMenu,
            DropdownMenuItem,
            DropdownMenuTrigger,
            MtButton,
            MtActionMenuDivider
        },
        setup() {
            return { args }
        },
        template: `
<dropdown-menu-root open>
    <dropdown-menu-trigger asChild>
        <mt-button>Open menu</mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-item icon="file-text">
            Documentation
          </mt-action-menu-item>

          <mt-action-menu-item disabled icon="duplicate" :shortcut="{ pc: 'Ctrl + D', mac: '⌘ + D' }">
            Duplicate
          </mt-action-menu-item>

          <mt-action-menu-item icon="arrows">
            Move
          </mt-action-menu-item>

          <mt-action-menu-divider />

          <mt-action-menu-item icon="trash" variant="critical">
            Delete
          </mt-action-menu-item>
        </mt-action-menu>
    </dropdown-menu-portal>
</dropdown-menu-root>
`
    }),
} satisfies Meta;

export const Default: StoryObj = {}