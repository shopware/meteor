import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { MinimalStory, ExtendedStory, type MtCardMeta, type MtCardStory } from "./mt-card.stories";

export default {
  title: "Interaction Tests/Layout/mt-card",
} as MtCardMeta;

export const VisualTestMinimalPage: MtCardStory = {
  ...MinimalStory,
  name: "Render a minimal card",
  args: {
    ...MinimalStory.args,
  },
};

export const VisualTestExtendedPage: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card",
  args: {
    ...ExtendedStory.args,
  },
};

export const VisualTestExtendedPageWithoutToolbar: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card without toolbar",
  args: {
    ...ExtendedStory.args,
    toolbar: null,
  },
};

export const VisualTestExtendedPageWithHero: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card with hero",
  args: {
    ...ExtendedStory.args,
    hero: true,
  },
};

export const VisualTestExtendedPageWithoutHeaderRight: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card without headerRight",
  args: {
    ...ExtendedStory.args,
    headerRight: null,
  },
};

export const VisualTestExtendedPageWithoutTabs: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card without Tabs",
  args: {
    ...ExtendedStory.args,
    tabs: null,
  },
};

export const VisualTestExtendedPageWithoutAvatar: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card without Avatar",
  args: {
    ...ExtendedStory.args,
    avatar: null,
  },
};

export const VisualTestExtendedPageWithoutFooter: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card without Footer",
  args: {
    ...ExtendedStory.args,
    footer: null,
  },
};

export const VisualTestExtendedPageWithoutContextActions: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card without Context Actions",
  args: {
    ...ExtendedStory.args,
    "context-actions": null,
  },
};

export const VisualTestExtendedPageWithOpenedContextActions: MtCardStory = {
  ...ExtendedStory,
  name: "Render a extended card with opened Context Actions",
  args: {
    ...ExtendedStory.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByLabelText("Context menu");

    await userEvent.click(button);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-popover__content")[0] as HTMLElement,
    );

    const menuItem = popover.getAllByRole("menuitem");

    await expect(menuItem[0]).toHaveTextContent("Menu Item A");

    await expect(menuItem[1]).toHaveTextContent("Menu Item B");

    await expect(menuItem[2]).toHaveTextContent("Menu Item C");
  },
};
