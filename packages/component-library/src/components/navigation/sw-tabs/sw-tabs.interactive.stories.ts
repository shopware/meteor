import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { waitUntilRendered } from "../../../_internal/test-helper";

import meta, { type SwTabsMeta, type SwTabsStory } from "./sw-tabs.stories";

const tabItems = [
  {
    label: "Item 1",
    name: "item1",
  },
  {
    label: "Item 2 very long",
    name: "item2",
  },
  {
    label: "Item 3",
    name: "item3",
  },
  {
    label: "Item 4 also very long",
    name: "item4",
  },
  {
    label: "Item 5",
    name: "item5",
  },
  {
    label: "Item 6",
    name: "item6",
  },
  {
    label: "Item 7",
    name: "item7",
  },
  {
    label: "Item 8 very long",
    name: "item8",
  },
  {
    label: "Item 9",
    name: "item9",
  },
  {
    label: "Item 10",
    name: "item10",
  },
  {
    label: "Item 11",
    name: "item11",
  },
  {
    label: "Item 12",
    name: "item12",
  },
  {
    label: "Item 13",
    name: "item13",
  },
  {
    label: "Item 14",
    name: "item14",
  },
  {
    label: "Item 15",
    name: "item15",
  },
  {
    label: "Item 16",
    name: "item16",
  },
  {
    label: "Item 17",
    name: "item17",
  },
];

export default {
  ...meta,
  title: "Interaction Tests/Navigation/sw-tabs",
} as SwTabsMeta;

export const VisualTestRenderTabs: SwTabsStory = {
  name: "Render tabs",
  args: {
    small: false,
    defaultItem: "item2",
    items: tabItems.slice(0, 2),
  },
};

export const VisualTestRenderTabsVertical: SwTabsStory = {
  name: "Render tabs vertical",
  args: {
    vertical: true,
    small: true,
    defaultItem: "item2",
    items: tabItems.slice(0, 2),
  },
};

export const VisualTestRenderTabsFullWidth: SwTabsStory = {
  name: "Render tabs in small",
  args: {
    small: true,
    defaultItem: "item2",
    items: tabItems.slice(0, 2),
  },
};

export const VisualTestRenderManyTabItems: SwTabsStory = {
  name: "Render many tab items",
  args: {
    small: true,
    defaultItem: "item2",
    items: tabItems,
  },
};

export const VisualTestRenderTabsWithError: SwTabsStory = {
  name: "Render tabs with error",
  args: {
    small: true,
    defaultItem: "item5",
    items: [
      ...tabItems.slice(0, 4),
      {
        label: "Item with error",
        name: "item5",
        hasError: true,
      },
    ],
  },
};

export const VisualTestRenderContextTabWithError: SwTabsStory = {
  name: "Render context tab with error",
  args: {
    small: true,
    defaultItem: "itemWithError",
    items: [
      ...tabItems,
      {
        label: "Item with error",
        name: "itemWithError",
        hasError: true,
      },
    ],
  },
};

export const VisualTestRenderContextTabWithActiveItem: SwTabsStory = {
  name: "Render context tab with active item inside",
  args: {
    defaultItem: "item1",
    small: true,
    items: [
      {
        label: "Context tab test",
        name: "contextTabTest",
      },
      ...tabItems.slice(0, 10),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until tab bar is loaded and context button gets rendered

    await waitUntilRendered(() => document.body.textContent?.includes("Context tab test"));
    await waitUntilRendered(() => document.querySelector(".sw-context-button__button"));

    const button = canvas.getByRole("button");

    await userEvent.click(button);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("sw-popover__content")[0] as HTMLElement,
    );

    const menuItem = popover.getAllByRole("tab");

    const lastItem = menuItem[menuItem.length - 1];
    await expect(lastItem).toHaveTextContent("Item 10");

    await userEvent.click(lastItem);

    await waitUntilRendered(
      () => document.getElementsByClassName("sw-popover__content").length === 0,
    );

    expect(document.getElementsByClassName("sw-popover__content").length).toEqual(0);
  },
};

export const VisualTestRenderTabsWithPositiveBadge: SwTabsStory = {
  name: "Render tabs with positive badge",
  args: {
    small: true,
    defaultItem: "badgeItem",
    items: [
      ...tabItems.slice(0, 3),
      {
        label: "Item with positive badge",
        name: "badgeItem",
        badge: "positive",
      },
      ...tabItems.slice(5),
    ],
  },
};

export const VisualTestRenderTabsWithInfoBadge: SwTabsStory = {
  name: "Render tabs with info badge",
  args: {
    small: true,
    defaultItem: "badgeItem",
    items: [
      ...tabItems.slice(0, 3),
      {
        label: "Item with info badge",
        name: "badgeItem",
        badge: "info",
      },
      ...tabItems.slice(5),
    ],
  },
};

export const VisualTestRenderTabsWithContextMenuBadge: SwTabsStory = {
  name: "Render tabs with badge in context menu",
  args: {
    small: true,
    defaultItem: "item5",
    items: [
      {
        label: "Context tab test",
        name: "contextTabTest",
      },
      ...tabItems.slice(0, 8),
      {
        label: "Item with critical badge",
        name: "badgeItem",
        badge: "critical",
      },
      ...tabItems.slice(9),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until tab bar is loaded and context button gets rendered

    await waitUntilRendered(() => document.body.textContent?.includes("Context tab test"));
    await waitUntilRendered(() => document.querySelector("button"));

    const button = canvas.getByRole("button");

    await userEvent.click(button);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("sw-popover__content")[0] as HTMLElement,
    );

    const menuItem = popover.getAllByRole("tab");

    await expect(menuItem[menuItem.length - 9]).toHaveTextContent("Item with critical badge");
  },
};
