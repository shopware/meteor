import { expect, userEvent, within } from "@storybook/test";
import meta from "./mt-helptext.stories";
import type { StoryObj } from "@storybook/vue3";
import { waitUntil } from "@/_internal/test-helper";

type MtHelpTextMeta = typeof meta;
type MtHelpTextStory = StoryObj<MtHelpTextMeta>;

function getVisibleTooltip(body: ReturnType<typeof within>) {
  return body.queryAllByRole("tooltip").find((tooltip) => {
    let element: HTMLElement | null = tooltip;

    while (element) {
      const style = window.getComputedStyle(element);

      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
        return false;
      }

      element = element.parentElement;
    }

    return tooltip.getClientRects().length > 0;
  });
}

async function waitForVisibleTooltip(body: ReturnType<typeof within>) {
  await waitUntil(() => getVisibleTooltip(body));

  return getVisibleTooltip(body) as HTMLElement;
}

export default {
  ...meta,
  title: "Components/mt-help-text/Interaction tests",
  tags: ["!autodocs"],
} as MtHelpTextMeta;

export const VisualTestTooltipOnFocus: MtHelpTextStory = {
  name: "Show tooltip on focus",
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.tab();

    await waitUntil(() => canvas.queryByRole("button"));
    await expect(canvas.getByRole("button")).toHaveFocus();
    await expect(await waitForVisibleTooltip(body)).toBeVisible();
  },
};

export const VisualTestTooltipOnHover: MtHelpTextStory = {
  name: "Show tooltip on hover",
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByRole("button");

    await userEvent.hover(button);

    await expect(await waitForVisibleTooltip(body)).toBeVisible();
  },
};
