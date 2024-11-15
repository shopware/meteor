import type { SlottedMeta } from "@/_internal/story-helper";
import MtBarePopover from "./mt-bare-popover.vue";
import MtButton from "../../form/mt-button/mt-button.vue";

export type MtBarePopoverMeta = SlottedMeta<typeof MtBarePopover, "default" | "trigger">;

export default {
  title: "Components/Overlay/mt-bare-popover",
  render: (args) => ({
    setup: () => args,
    components: { MtBarePopover, MtButton },
    template: `
<mt-bare-popover>
    <template #trigger="params">
        <mt-button variant="secondary" v-bind="params">Open popover</mt-button>
    </template>

    <template #default>
        <div>Content</div>
    </template>
</mt-bare-popover>
`,
  }),
} satisfies MtBarePopoverMeta;

export const Default = {};
