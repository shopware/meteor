import { expect, userEvent, within } from "@storybook/test";

import { Default, type MtPaginationStory } from "./mt-pagination.stories";
import flushPromises from "flush-promises";

export default {
  title: "Interaction Tests/Table and list/mt-pagination",
};

export const VisualTestRenderWithOnePage: MtPaginationStory = {
  ...Default,
  name: "Render with one page",

  args: {
    limit: 100,
    totalItems: 100,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const infoText = canvas.getByText("1-100 of 100");

    expect(infoText).not.toBeNull();
    expect(infoText.innerText).toEqual("1-100 of 100");
  },
};

export const TestManyPages: MtPaginationStory = {
  ...Default,
  name: "Render with 100 page",

  args: {
    limit: 1,
    totalItems: 100,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const infoText = canvas.getByText("1-1 of 100");

    expect(infoText).not.toBeNull();
    expect(infoText.innerText).toEqual("1-1 of 100");
  },
};

export const TestPageChange: MtPaginationStory = {
  ...Default,
  name: "Test page change",
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    const nextPageButton = canvas.getByRole("button", { name: "Next page" });
    await userEvent.click(nextPageButton);

    await flushPromises();

    const infoText = canvas.getByText("26-50 of 100");

    expect(infoText).not.toBeNull();
    expect(infoText.innerText).toEqual("26-50 of 100");
  },
};
