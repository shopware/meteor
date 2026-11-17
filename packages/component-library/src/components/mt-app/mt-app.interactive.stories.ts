import { expect, userEvent, waitFor, within } from "@storybook/test";

import meta, { WithAnnouncement, type MtAppMeta, type MtAppStory } from "./mt-app.stories";

export default {
  ...meta,
  title: "Components/App/Interaction tests",
  tags: ["!autodocs"],
} as MtAppMeta;

export const VisualTestAnnouncement: MtAppStory = {
  ...WithAnnouncement,
  name: "Render the announcement above the header",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(/Planned maintenance/)).toBeVisible();
  },
};

export const VisualTestCloseAnnouncement: MtAppStory = {
  ...WithAnnouncement,
  name: "Slide the closed announcement out and move the focus to the content",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Close announcement" }));

    expect(canvas.getByRole("main")).toHaveFocus();
    await waitFor(() => expect(canvas.queryByText(/Planned maintenance/)).not.toBeInTheDocument());
  },
};
