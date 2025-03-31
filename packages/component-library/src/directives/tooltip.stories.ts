import MtIcon from "../components/icons-media/mt-icon/mt-icon.vue";
import TooltipDirective from "./tooltip.directive";
import type { SlottedMeta } from "@/_internal/story-helper";
import { defineComponent } from "vue";

const meta: SlottedMeta<
  typeof MtIcon,
  | "message"
  | "width"
  | "showDelay"
  | "hideDelay"
  | "disabled"
  | "appearance"
  | "showOnDisabledElements"
> = {
  title: "Directives/Tooltip",
  component: MtIcon,
  render: (args) =>
    defineComponent({
      components: { MtIcon },
      directives: {
        tooltip: TooltipDirective,
      },
      template: `<div>
      <mt-icon
        name="regular-question-circle"
          v-tooltip="{
          ...args
        }">
      </mt-icon>
    </div>`,
      setup: () => {
        return {
          args,
        };
      },
    }),
  args: {
    message: "Help text",
    width: 200,
    showDelay: 100,
    hideDelay: 100,
    disabled: false,
    showOnDisabledElements: false,
  },
  argTypes: {
    appearance: {
      control: {
        type: "radio",
        options: ["dark", "light"],
      },
    },
    /**
     * Disable name, color and decorative because they
     * are automatically generated and don't belong to
     * the directive
     */
    name: {
      table: {
        disable: true,
      },
    },
    color: {
      table: {
        disable: true,
      },
    },
    decorative: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

export const Default = {
  name: "Tooltip",
};
