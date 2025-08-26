import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import { usePriorityPlusNavigation } from "./usePriorityPlusNavigation";
import { within, expect, waitFor } from "@storybook/test";

const meta: Meta = {
  title: "Composables / Internal / usePriorityPlusNavigation",
  render: (args) => ({
    setup() {
      const containerElement = ref<HTMLElement>();
      const overflowButton = ref<HTMLElement>();

      const { priorityItems, overflowItems, showNavigation } = usePriorityPlusNavigation(
        args.items,
        {
          container: containerElement,
          overflowButton: overflowButton,
        },
      );

      return {
        containerElement,
        overflowButton,
        priorityItems,
        overflowItems,
        showNavigation,
      };
    },
    template: `
<div ref="containerElement" :style="{ display: 'flex', position: 'relative', visibility: showNavigation ? 'visible' : 'hidden' }">
    <div v-for="item in priorityItems"
        :key="item.id"
        style="text-wrap: nowrap;" data-priority-plus
        aria-hidden="false"
    >
        {{ item.label }}
    </div>

    <button ref="overflowButton" style="min-width: 50px">More</button>

    <div style="position: absolute; top: 100%; left: 0;">
      <div v-for="item in overflowItems" :key="item.id" style="text-wrap: nowrap; color: red;" aria-hidden="true">{{ item.label }}</div>
    </div>
</div>
`,
  }),
  decorators: [
    () => ({
      template: "<div style='width: 400px; overflow-x: clip;'><story/></div>",
    }),
  ],
};

export default meta;

export const VisualTestShowsAllItem: StoryObj = {
  name: "Shows all items",
  args: {
    items: [
      { id: "1", label: "Item 1" },
      { id: "2", label: "Item 2" },
      { id: "3", label: "Item 3" },
      { id: "4", label: "Item 4" },
      { id: "5", label: "Item 5" },
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    // We need to wait until the component updated itself
    await waitFor(() => expect(canvas.getByText("Item 1")).toHaveAttribute("aria-hidden", "false"));

    await expect(canvas.getByText("Item 1")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 2")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 3")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 4")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 5")).toHaveAttribute("aria-hidden", "false");

    expect(canvas.queryByRole("button", { name: "More" })).not.toBeInTheDocument();
  },
};

export const VisualTestHidesTheLastThreeItems: StoryObj = {
  name: "Hides the last three items",
  args: {
    items: [
      { id: "1", label: "Item 1" },
      { id: "2", label: "Item 2" },
      { id: "3", label: "Item 3" },
      { id: "4", label: "Item 4" },
      { id: "5", label: "Item 5" },
      { id: "6", label: "Item 6" },
      { id: "7", label: "Item 7" },
      { id: "8", label: "Item 8" },
      { id: "9", label: "Item 9" },
      { id: "10", label: "Item 10" },
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    // We need to wait until the component updated itself
    await waitFor(() => expect(canvas.getByText("Item 1")).toHaveAttribute("aria-hidden", "false"));
    await waitFor(() => expect(canvas.getByText("Item 10")).toHaveAttribute("aria-hidden", "true"));

    await expect(canvas.getByText("Item 1")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 2")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 3")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 4")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 5")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 6")).toHaveAttribute("aria-hidden", "false");
    await expect(canvas.getByText("Item 7")).toHaveAttribute("aria-hidden", "false");

    await expect(canvas.getByText("Item 8")).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.getByText("Item 9")).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.getByText("Item 10")).toHaveAttribute("aria-hidden", "true");

    await expect(canvas.getByRole("button", { name: "More" })).toBeVisible();
  },
};
