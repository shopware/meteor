import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, { type SwUrlFieldMeta, type SwUrlFieldStory } from "./sw-url-field.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-url-field",
} as SwUrlFieldMeta;

export const Default = {
  name: "sw-url-field",
};

export const VisualTestInputValue: SwUrlFieldStory = {
  name: "Should keep input value",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "shopware.com");
    await userEvent.click(canvas.getByText("hidden"));
    await userEvent.click(canvas.getByText("hidden"));

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("shopware.com");

    expect(args.updateModelValue).toHaveBeenLastCalledWith("https://shopware.com");
  },
};

export const VisualTestHttpSwitch: SwUrlFieldStory = {
  name: "Should change the ssl switch to http",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "shopware.com");
    await userEvent.click(canvas.getByText("hidden"));

    expect(canvas.getByText("https://").innerText).toContain("https://");

    expect(args.updateModelValue).toHaveBeenLastCalledWith("https://shopware.com");

    await userEvent.click(canvas.getByRole("button"));

    expect(canvas.getByText("http://").innerText).toContain("http://");
    await userEvent.click(canvas.getByText("hidden"));

    expect(args.updateModelValue).toHaveBeenLastCalledWith("http://shopware.com");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("shopware.com");
  },
};

export const TestNotOmitUrlHash: SwUrlFieldStory = {
  name: "Should not omit the url hash",
  args: {
    omitUrlHash: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "shopware.com/#content");

    await userEvent.click(canvas.getByText("hidden"));

    expect(args.updateModelValue).toHaveBeenLastCalledWith("https://shopware.com/#content");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("shopware.com/#content");
  },
};

export const TestOmitUrlHash: SwUrlFieldStory = {
  name: "Should omit the url hash",
  args: {
    omitUrlHash: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "shopware.com/#content");

    await userEvent.click(canvas.getByText("hidden"));

    expect(args.updateModelValue).toHaveBeenLastCalledWith("https://shopware.com");

    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("shopware.com");
  },
};

export const TestNotOmitUrlSearch: SwUrlFieldStory = {
  name: "Should not omit the url search",
  args: {
    omitUrlSearch: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "shopware.com/?someValue=5");

    await userEvent.click(canvas.getByText("hidden"));

    expect(args.updateModelValue).toHaveBeenLastCalledWith("https://shopware.com/?someValue=5");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe(
      "shopware.com/?someValue=5",
    );
  },
};

export const TestOmitUrlSearch: SwUrlFieldStory = {
  name: "Should omit the url search",
  args: {
    omitUrlSearch: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "shopware.com/?someValue=5");

    await userEvent.click(canvas.getByText("hidden"));

    expect(args.updateModelValue).toHaveBeenLastCalledWith("https://shopware.com");
    expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("shopware.com");
  },
};
