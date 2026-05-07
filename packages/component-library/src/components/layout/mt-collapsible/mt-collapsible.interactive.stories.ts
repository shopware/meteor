import { within, userEvent, expect, waitFor } from "@storybook/test";

import MtButton from "../../form/mt-button/mt-button.vue";
import MtCollapsible from "./mt-collapsible.vue";
import MtCollapsibleTrigger from "./mt-collapsible-trigger.vue";
import MtCollapsibleContent from "./mt-collapsible-content.vue";

import meta, { type MtCollapsibleMeta, type MtCollapsibleStory } from "./mt-collapsible.stories";

export default {
  ...meta,
  title: "Components/Collapsible/Interaction tests",
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
          <mt-button variant="primary">Toggle content</mt-button>
        </mt-collapsible-trigger>

        <mt-collapsible-content>
          <p style="margin-top: 8px; font-size: var(--font-size-xs);">This content is revealed and hidden by the trigger above.</p>
        </mt-collapsible-content>
      </mt-collapsible>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByRole("button", { name: "Toggle content" });
    const content = canvas.getByText("This content is revealed and hidden by the trigger above.");

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(content).not.toBeVisible();

    await userEvent.click(toggleButton);

    await waitFor(() => {
      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
      expect(content).toBeVisible();
    });
  },
};

export const VisualTestDisabled: MtCollapsibleStory = {
  name: "Should not toggle when disabled",
  render: () => ({
    components: sharedComponents,
    template: `
      <mt-collapsible disabled>
        <mt-collapsible-trigger as-child>
          <mt-button variant="primary" disabled>Toggle content</mt-button>
        </mt-collapsible-trigger>

        <mt-collapsible-content>
          <p style="margin-top: 8px; font-size: var(--font-size-xs);">This content is revealed and hidden by the trigger above.</p>
        </mt-collapsible-content>
      </mt-collapsible>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByRole("button", { name: "Toggle content" });
    const content = canvas.getByText("This content is revealed and hidden by the trigger above.");

    await userEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(content).not.toBeVisible();
  },
};
