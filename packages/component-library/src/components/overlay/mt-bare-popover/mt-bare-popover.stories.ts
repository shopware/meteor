import type { SlottedMeta } from "@/_internal/story-helper";
import MtBarePopover from "./mt-bare-popover.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtBarePopoverItem from "./sub-components/mt-bare-popover-item.vue";
import { userEvent, within } from "@storybook/test";

export type MtBarePopoverMeta = SlottedMeta<typeof MtBarePopover, "default" | "trigger">;

export default {
  title: "Components/Overlay/mt-bare-popover",
  render: (args) => ({
    setup: () => args,
    components: { MtBarePopover, MtButton, MtBarePopoverItem },
    template: `
<mt-bare-popover>
    <template #trigger="params">
        <mt-button variant="secondary" v-bind="params">Open popover</mt-button>
    </template>

    <template #default>
        <mt-bare-popover-item>
            Item 1
        </mt-bare-popover-item>
    </template>
</mt-bare-popover>
`,
  }),
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Open popover" }));
  },
} satisfies MtBarePopoverMeta;

export const Default = {};
