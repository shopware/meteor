import type { Meta, StoryObj } from "@storybook/vue3";
import MtPage from "./mt-page.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtPageMeta = Meta<typeof MtPage>;

const meta: MtPageMeta = {
  title: "Components/Page",
  component: MtPage,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
    layout: "fullscreen",
  },
  args: {
    width: "full",
    breadcrumb: [{ label: "Products", to: "#", icon: "products" }, { label: "Running shoes" }],
  },
  argTypes: {
    width: {
      control: { type: "select" },
      options: ["s", "m", "l", "full"],
    },
  },
  render: (args) => ({
    components: { MtPage, MtButton, MtText },
    setup: () => ({ args }),
    template: `
      <div style="height: 480px;">
        <mt-page
          :width="args.width"
          :inset="args.inset"
          :is-loading="args.isLoading"
          :breadcrumb="args.breadcrumb"
          :breakpoint="args.breakpoint"
          :closable="args.closable"
        >
          <template #actions>
            <mt-button variant="primary" size="default">Save</mt-button>
          </template>


          <mt-text size="xs">The content of the page.</mt-text>
        </mt-page>
      </div>`,
  }),
};

export default meta;
export type MtPageStory = StoryObj<MtPageMeta>;

export const Default: MtPageStory = {};
