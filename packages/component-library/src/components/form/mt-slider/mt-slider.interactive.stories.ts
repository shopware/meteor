import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtSliderMeta, type MtSliderStory } from "./mt-slider.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-slider",
} as MtSliderMeta;

export const TestInputValue: MtSliderStory = {
  name: "Slider - Value input",
  play: async ({ canvasElement, args }) => {

  },
};
