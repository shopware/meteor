import { within, userEvent, expect, waitFor } from "@storybook/test";

import MtButton from "../../form/mt-button/mt-button.vue";
import MtCollapsible from "./mt-collapsible.vue";
import MtCollapsibleTrigger from "./mt-collapsible-trigger.vue";
import MtCollapsibleContent from "./mt-collapsible-content.vue";

import meta, {
  type MtCollapsibleMeta,
  type MtCollapsibleStory,
} from "./mt-collapsible.stories";

export default {
  ...meta,
  title: "Components/mt-collapsible/Interaction tests",
  tags: ["!autodocs"],
} as MtCollapsibleMeta;

const sharedComponents = {
  MtCollapsible,
  MtCollapsibleTrigger,
  MtCollapsibleContent,
  MtButton,
};

export const VisualTestStartsClosed: MtCollapsibleStory = {
  name: "Should start closed and open on trigger click",
  render: () => ({
    components: sharedComponents,
    template: `
      <mt-collapsible>
        <mt-collapsible-trigger as-child>
          <mt-button>Toggle</mt-button>
        </mt-collapsible-trigger>

        <mt-collapsible-content>
          <p>Hidden content</p>
        </mt-collapsible-content>
      </mt-collapsible>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByText("Hidden content")).toBeNull();

    await userEvent.click(canvas.getByRole("button", { name: "Toggle" }));

    await waitFor(() => {
      expect(canvas.getByText("Hidden content")).toBeDefined();
    });
  },
};

export const VisualTestDefaultOpen: MtCollapsibleStory = {
  name: "Should start open with default-open",
  render: () => ({
    components: sharedComponents,
    template: `
      <mt-collapsible default-open>
        <mt-collapsible-trigger as-child>
          <mt-button>Toggle</mt-button>
        </mt-collapsible-trigger>

        <mt-collapsible-content>
          <p>Visible content</p>
        </mt-collapsible-content>
      </mt-collapsible>
    `,
  }),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Visible content")).toBeDefined();
    expect(canvas.getByRole("button", { name: "Toggle" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  },
};

export const VisualTestDisabled: MtCollapsibleStory = {
  name: "Should not toggle when disabled",
  render: () => ({
    components: sharedComponents,
    template: `
      <mt-collapsible disabled>
        <mt-collapsible-trigger as-child>
          <mt-button>Toggle</mt-button>
        </mt-collapsible-trigger>

        <mt-collapsible-content>
          <p>Hidden content</p>
        </mt-collapsible-content>
      </mt-collapsible>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Toggle" }));

    expect(canvas.queryByText("Hidden content")).toBeNull();
  },
};
