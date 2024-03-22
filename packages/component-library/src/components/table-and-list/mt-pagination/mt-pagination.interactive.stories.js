import { expect } from "@storybook/jest";
import MtPagination from "./mt-pagination.vue";
import defaultPaginationStory, { Default } from "./mt-pagination.stories";
import flushPromises from "flush-promises";

export default {
  ...defaultPaginationStory,
  title: "Interaction Tests/Table and list/mt-pagination",
  component: MtPagination,
};

export const TestOnePage = {
  render: Default.render,
  name: "Render with one page",

  args: {
    ...Default.args,
    limit: 100,
  },

  play: async () => {
    const infoText = document.querySelector(".mt-pagination__info-text");

    expect(infoText).not.toBeNull();
    expect(infoText.innerText).toEqual("1-100 of 100");
  },
};

export const TestManyPages = {
  render: Default.render,
  name: "Render with 100 page",

  args: {
    ...Default.args,
    limit: 1,
  },

  play: async () => {
    const infoText = document.querySelector(".mt-pagination__info-text");

    expect(infoText).not.toBeNull();
    expect(infoText.innerText).toEqual("1-1 of 100");
  },
};

export const TestPageChange = {
  render: Default.render,
  name: "Test page change",
};

(TestPageChange.args = Default.args),
  (TestPageChange.play = async () => {
    document.querySelector(".mt-segmented-control__action-id-pagination-next").click();

    await flushPromises();

    const infoText = document.querySelector(".mt-pagination__info-text");

    expect(infoText).not.toBeNull();
    expect(infoText.innerText).toEqual("26-50 of 100");
  });
