import { expect } from "@storybook/test";
import { within, userEvent } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";
import meta, {
  Default,
  type MtFloatingUiMeta,
  type MtFloatingUiStory,
} from "./mt-floating-ui.stories";

export default {
  ...meta,
  title: "Components/Floating UI/Interaction tests",
  tags: ["!autodocs"],
} as MtFloatingUiMeta;

export const VisualTestRenderFloatingUi: MtFloatingUiStory = {
  ...Default,
  name: "Render floating ui",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Toggle floating UI" }));

    await waitUntil(() => document.querySelector(".mt-floating-ui__content"));

    const floatingUi = within(document.querySelector(".mt-floating-ui__content") as HTMLElement);

    expect(floatingUi.getByText("Adjust size")).toBeInTheDocument();
    expect(floatingUi.getByRole("button", { name: "Apply" })).toBeInTheDocument();
  },
};
