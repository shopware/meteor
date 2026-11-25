import type { Meta, StoryObj } from "@storybook/vue3";
import MtStepper, { type StepperStep } from "./mt-stepper.vue";

export type MtStepperMeta = Meta<typeof MtStepper>;

const steps: StepperStep[] = [
  { label: "Account" },
  { label: "Shipping" },
  { label: "Payment" },
  { label: "Review" },
];

const longLabelSteps: StepperStep[] = [
  { label: "Account" },
  { label: "Shipping address and delivery options" },
  { label: "Payment" },
  { label: "Review and confirm the order" },
];

const renderInContainer = (width: number) => (args: Record<string, unknown>) => ({
  components: { MtStepper },
  setup: () => ({ args }),
  template: `
    <div style="width: ${width}px; max-width: 100%;">
      <mt-stepper v-bind="args" />
    </div>`,
});

const meta: MtStepperMeta = {
  title: "Components/Stepper",
  component: MtStepper,
  args: {
    steps,
    currentStep: 1,
    orientation: "vertical",
  },
  argTypes: {
    steps: {
      control: { type: "object" },
    },
    currentStep: {
      control: { type: "number" },
    },
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal"],
    },
    ariaLabel: {
      control: { type: "text" },
    },
  },
  render: (args) => ({
    components: { MtStepper },
    setup: () => ({ args }),
    template: `<mt-stepper v-bind="args" />`,
  }),
};

export default meta;
export type MtStepperStory = StoryObj<MtStepperMeta>;

export const Default: MtStepperStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-stepper :steps="steps" :current-step="1" />`,
      },
    },
  },
};

export const Horizontal: MtStepperStory = {
  args: {
    orientation: "horizontal",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-stepper :steps="steps" :current-step="1" orientation="horizontal" />`,
      },
    },
  },
};

export const CompletedCurrentStep: MtStepperStory = {
  name: "Completed current step",
  args: {
    steps: [
      { label: "Account" },
      { label: "Shipping", completed: true },
      { label: "Payment", completed: true },
      { label: "Review" },
    ],
  },
};

export const LongLabels: MtStepperStory = {
  name: "Long labels",
  args: {
    steps: longLabelSteps,
    currentStep: 2,
  },
  render: renderInContainer(240),
};

export const HorizontalLongLabels: MtStepperStory = {
  name: "Horizontal with long labels",
  args: {
    steps: longLabelSteps,
    currentStep: 2,
    orientation: "horizontal",
  },
  render: renderInContainer(720),
};
