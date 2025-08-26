import { expect, userEvent } from "@storybook/test";

import { Default } from "./mt-pagination.stories";
import flushPromises from "flush-promises";
import type MtPagination from "./mt-pagination.vue";
import { defineStory } from "@/_internal/story-helper";

export default {
  title: "Interaction Tests/Table and list/mt-pagination",
};

export const VisualTestRenderWithOnePage = defineStory<typeof MtPagination>(
  {
    name: "Render with one page",
    args: {
      limit: 100,
      totalItems: 100,
    },
    async play({ screen }) {
      const infoText = screen.getByText("1-100 of 100");

      expect(infoText).not.toBeNull();
      expect(infoText.innerText).toEqual("1-100 of 100");
    },
  },
  { from: Default },
);

export const TestManyPages = defineStory<typeof MtPagination>(
  {
    name: "Render with 100 page",
    args: {
      limit: 1,
      totalItems: 100,
    },
    play: async ({ screen }) => {
      const infoText = screen.getByText("1-1 of 100");

      expect(infoText).not.toBeNull();
      expect(infoText.innerText).toEqual("1-1 of 100");
    },
  },
  { from: Default },
);

export const TestPageChange = defineStory<typeof MtPagination>(
  {
    name: "Test page change",
    async play({ screen }) {
      const nextPageButton = screen.getByRole("button", { name: "Next page" });
      await userEvent.click(nextPageButton);

      await flushPromises();

      const infoText = screen.getByText("26-50 of 100");

      expect(infoText).not.toBeNull();
      expect(infoText.innerText).toEqual("26-50 of 100");
    },
  },
  { from: Default },
);
