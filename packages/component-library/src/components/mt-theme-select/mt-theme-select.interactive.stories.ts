import { within, userEvent, expect } from "@storybook/test";

import meta, { type MtThemeSelectMeta, type MtThemeSelectStory } from "./mt-theme-select.stories";

export default {
  ...meta,
  title: "Components/Theme Select/Interaction tests",
  tags: ["!autodocs"],
} as MtThemeSelectMeta;

export const TestSelectTheme: MtThemeSelectStory = {
  name: "Should select a color theme",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));

    const popover = within(
      document.querySelector(".mt-popover-deprecated__wrapper") as HTMLElement,
    );
    await userEvent.click(popover.getByTestId("mt-select-option--dark"));

    expect(args["onUpdate:modelValue"]).toHaveBeenCalledWith("dark");
    expect(canvas.getByRole("textbox")).toHaveValue("Dark");
  },
};

export const TestDisabledSelect: MtThemeSelectStory = {
  name: "Should not open the result list when disabled",
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("textbox"));

    expect(document.querySelector(".mt-select-result-list__content")).toBeNull();
  },
};
