import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";

import meta, { type MtTabsMeta, type MtTabsStory } from "./mt-tabs.stories";

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
  title: "Interaction Tests/Navigation/mt-tabs",
} as MtTabsMeta;

export const VisualTestRenderTabs: MtTabsStory = {
  name: "Render tabs",
  args: {
    small: false,
    defaultItem: "item2",
    items: tabItems.slice(0, 2),
  },
};

export const VisualTestRenderTabsVertical: MtTabsStory = {
  name: "Render tabs vertical",
  args: {
    vertical: true,
    small: true,
    defaultItem: "item2",
    items: tabItems.slice(0, 2),
  },
};

export const VisualTestRenderTabsFullWidth: MtTabsStory = {
  name: "Render tabs in small",
  args: {
    small: true,
    defaultItem: "item2",
    items: tabItems.slice(0, 2),
  },
};

export const VisualTestRenderManyTabItems: MtTabsStory = {
  name: "Render many tab items",
  args: {
    small: true,
    defaultItem: "item2",
    items: tabItems,
  },
};

export const VisualTestRenderTabsWithError: MtTabsStory = {
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

export const VisualTestRenderContextTabWithError: MtTabsStory = {
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

export const VisualTestRenderContextTabWithActiveItem: MtTabsStory = {
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

    await waitUntil(() => canvas.getByRole("tab", { name: "Context tab test" }));
    await waitUntil(() => canvas.getByRole("tab", { name: "More tabs" }));

    await userEvent.click(canvas.getByRole("tab", { name: "More tabs" }));

    const popover = within(document.querySelector('[role="dialog"]') as HTMLElement);

    await userEvent.click(popover.getByRole("tab", { name: "Item 10" }));

    expect(document.querySelector('[role="dialog"]')).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("tab", { name: "More tabs" }));

    const popoverWithSelectedTab = within(document.querySelector('[role="dialog"]') as HTMLElement);
    expect(popoverWithSelectedTab.getByRole("tab", { name: "Item 10" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

export const VisualTestRenderTabsWithPositiveBadge: MtTabsStory = {
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

export const VisualTestRenderTabsWithInfoBadge: MtTabsStory = {
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

export const VisualTestRenderTabsWithContextMenuBadge: MtTabsStory = {
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
    await waitUntil(() => canvas.getByRole("tab", { name: "Context tab test" }));

    await userEvent.click(canvas.getByRole("tab", { name: "More tabs" }));

    const popover = within(document.querySelector("[role='dialog']") as HTMLElement);

    await expect(
      popover.getByRole("tab", { name: "Item with critical badge" }),
    ).toBeInTheDocument();
  },
};

export const VisualTestRenderTabsWithDisabledItem: MtTabsStory = {
  name: "Render tabs with disabled item",
  args: {
    defaultItem: "item1",
    items: [
      ...tabItems.slice(0, 4),
      {
        label: "Disabled item",
        name: "item5",
        disabled: true,
      },
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    const disabledTabItem = canvas.getByRole("tab", { name: /disabled/i });

    expect(disabledTabItem).toBeDisabled();

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(canvas.getByRole("tab", { name: /item 1/i })).toHaveFocus();

    await userEvent.click(disabledTabItem);

    expect(canvas.getByRole("tab", { name: /item 1/i })).toHaveAttribute("aria-selected", "true");
  },
};

export const CannotTabToMoreItemsTabWhenNoneOfItsChildrenIsActive: MtTabsStory = {
  args: {
    small: true,
    defaultItem: "item1",
    items: [
      ...tabItems.slice(0, 4),
      {
        label: "Item with icon",
        name: "item5",
      },
      ...tabItems.slice(5),
    ],
  },
  async play() {
    await userEvent.tab();
    await userEvent.tab();

    await expect(document.body).toHaveFocus();
  },
};

export const TabsToMoreItemsTabWhenOneOfItsChildrenIsActive: MtTabsStory = {
  args: {
    small: true,
    defaultItem: "item11",
    items: [
      ...tabItems.slice(0, 4),
      {
        label: "Item with icon",
        name: "item5",
      },
      ...tabItems.slice(5),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await userEvent.tab();

    await expect(canvas.getByRole("tab", { name: "More tabs" })).toHaveFocus();
  },
};

export const FocusesTheMoreTabsWhenPressingLeftArrowKeyOnFirstTab: MtTabsStory = {
  args: {
    small: true,
    defaultItem: "item1",
    items: tabItems,
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await userEvent.tab();

    await userEvent.keyboard("{arrowleft}");

    await expect(canvas.getByRole("tab", { name: "More tabs" })).toHaveFocus();
  },
};

export const MovesFocusAwayFromTheMoreTabsButtonWhenPressingTheArrowKeys: MtTabsStory = {
  args: {
    small: true,
    defaultItem: "item1",
    items: tabItems,
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await userEvent.tab();

    await userEvent.keyboard("{arrowleft}");
    await userEvent.keyboard("{arrowright}");

    await expect(canvas.getByRole("tab", { name: "Item 1" })).toHaveFocus();

    await userEvent.keyboard("{arrowleft}");
    await userEvent.keyboard("{arrowleft}");

    await expect(canvas.getByRole("tab", { name: "Item 7" })).toHaveFocus();
  },
};
