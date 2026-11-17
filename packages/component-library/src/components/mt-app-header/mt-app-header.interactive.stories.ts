import { within, expect, userEvent, waitFor } from "@storybook/test";

import meta, { Mobile, type MtAppHeaderMeta, type MtAppHeaderStory } from "./mt-app-header.stories";

export default {
  ...meta,
  title: "Components/App Header/Interaction tests",
  tags: ["!autodocs"],
} as MtAppHeaderMeta;

export const VisualTestDefault: MtAppHeaderStory = {
  name: "Render header with start, navigation, actions and end",
  args: {
    breakpoint: 0,
  },
};

export const VisualTestMobile: MtAppHeaderStory = {
  ...Mobile,
  name: "Render mobile header with the drawer button and the actions",
};

export const VisualTestMobileOpen: MtAppHeaderStory = {
  ...Mobile,
  name: "Open the drawer with start, navigation and end",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(await canvas.findByRole("button", { name: "Toggle Navigation" }));

    const drawer = await body.findByRole("dialog", { name: "Navigation" });
    await waitFor(() => expect(drawer).toBeVisible());
    expect(within(drawer).getByRole("navigation", { name: "Main" })).toBeVisible();
    expect(within(drawer).getByText("Demo shop")).toBeVisible();
  },
};
