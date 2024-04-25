import type { Meta, StoryFn } from "@storybook/vue3";
import { within, expect } from "@storybook/test";
import MtEmptyState from "./mt-empty-state.vue";
import meta, { Default, Extended } from "./mt-empty-state.stories";

export default {
  ...meta,
  title: "Interaction Tests/Layout/mt-empty-state",
  component: MtEmptyState,
} as Meta;

export const VisualTestDefaultPage: StoryFn = Default.bind({});
VisualTestDefaultPage.storyName = "Render a default empty state";
VisualTestDefaultPage.args = {
  ...Default.args,
};
VisualTestDefaultPage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(canvas.getByText(Default.args?.headline)).toBeVisible();
  expect(canvas.getByText(Default.args?.description)).toBeVisible();
};

export const VisualTestExtendedPage: StoryFn = Extended.bind({});
VisualTestExtendedPage.storyName = "Render an extended empty state";
VisualTestExtendedPage.args = {
  ...Extended.args,
};
VisualTestExtendedPage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(canvas.getByTestId("mt-icon__solid-chart-line-arrow")).toBeVisible();
  expect(canvas.getByText(Extended.args?.headline)).toBeVisible();
  expect(canvas.getByText(Extended.args?.description)).toBeVisible();

  const link = canvas.getByRole("link", { name: Extended.args?.linkText });
  expect(link).toHaveAttribute("href", Extended.args?.linkHref);

  expect(canvas.getByText(Extended.args?.linkText)).toBeVisible();
  expect(canvas.getByText(Extended.args?.buttonText)).toBeVisible();
};
