import { within, expect } from "@storybook/test";

import meta, {
  CompletedCurrentStep,
  Default,
  Horizontal,
  HorizontalLongLabels,
  LongLabels,
  type MtStepperMeta,
  type MtStepperStory,
} from "./mt-stepper.stories";

export default {
  ...meta,
  title: "Components/Stepper/Interaction tests",
  tags: ["!autodocs"],
} as MtStepperMeta;

export const VisualTestVertical: MtStepperStory = {
  ...Default,
  name: "Render a vertical stepper",
};

export const VisualTestHorizontal: MtStepperStory = {
  ...Horizontal,
  name: "Render a horizontal stepper",
};

export const VisualTestCompletedCurrentStep: MtStepperStory = {
  ...CompletedCurrentStep,
  name: "Render a completed current step",
};

export const VisualTestAllCompleted: MtStepperStory = {
  name: "Complete every step",
  args: {
    currentStep: 4,
  },
};

export const VisualTestLongLabels: MtStepperStory = {
  ...LongLabels,
  name: "Wrap long labels",
};

export const VisualTestHorizontalLongLabels: MtStepperStory = {
  ...HorizontalLongLabels,
  name: "Wrap long labels of a horizontal stepper",
};

export const TestListHasAccessibleName: MtStepperStory = {
  ...Default,
  name: "Exposes a labelled list of steps",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("list", { name: "Progress" })).toBeVisible();
    expect(canvas.getAllByRole("listitem")).toHaveLength(4);
  },
};

export const TestCurrentStepHasAriaCurrent: MtStepperStory = {
  ...Default,
  name: "Marks the current step",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [completed, current, upcoming] = canvas.getAllByRole("listitem");

    expect(completed).toHaveTextContent("Completed: Account");
    expect(completed).not.toHaveAttribute("aria-current");
    expect(current).toHaveAttribute("aria-current", "step");
    expect(upcoming).not.toHaveAttribute("aria-current");
  },
};
