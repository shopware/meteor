import { expect, userEvent, within } from "@storybook/test";

import meta, {
  CustomLogo,
  LongTitle,
  NotCollapsible,
  WithoutSubtitle,
  type MtSidebarHeaderMeta,
  type MtSidebarHeaderStory,
} from "./mt-sidebar-header.stories";

export default {
  ...meta,
  title: "Components/Sidebar/Header/Interaction tests",
  tags: ["!autodocs"],
} as MtSidebarHeaderMeta;

export const VisualTestDefault: MtSidebarHeaderStory = {
  name: "Render header with title and subtitle",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Demo shop")).toBeVisible();
    expect(canvas.getByText("Shopware")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Minimize menu" })).toBeVisible();
  },
};

export const VisualTestWithoutSubtitle: MtSidebarHeaderStory = {
  ...WithoutSubtitle,
  name: "Render header without subtitle",
};

export const VisualTestLongTitle: MtSidebarHeaderStory = {
  ...LongTitle,
  name: "Cut off a long title with an ellipsis",
  play: async ({ canvasElement }) => {
    const title = canvasElement.querySelector<HTMLElement>(".mt-sidebar-header__title");
    if (!title) throw new Error("Title not found");

    expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
  },
};

export const VisualTestNotCollapsible: MtSidebarHeaderStory = {
  ...NotCollapsible,
  name: "Render header without collapse button",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByRole("button")).toBeNull();
  },
};

export const VisualTestCustomLogo: MtSidebarHeaderStory = {
  ...CustomLogo,
  name: "Render header with a custom logo",
};

export const TestEmitsCollapse: MtSidebarHeaderStory = {
  name: "Emits collapse when the collapse button is clicked",
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Minimize menu" }));

    expect(args.onCollapse).toHaveBeenCalledOnce();
  },
};
