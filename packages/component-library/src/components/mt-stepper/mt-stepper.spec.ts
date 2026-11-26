import { render, screen, within } from "@testing-library/vue";
import MtStepper, { type StepperStep } from "./mt-stepper.vue";

const steps: StepperStep[] = [
  { label: "Account" },
  { label: "Shipping" },
  { label: "Payment" },
  { label: "Review" },
];

function renderStepper(props: Record<string, unknown> = {}) {
  return render(MtStepper, {
    props: { steps, ...props },
  });
}

function getSteps() {
  return screen.getAllByRole("listitem");
}

function getCurrentSteps() {
  return getSteps().filter((step) => step.hasAttribute("aria-current"));
}

function getCompletedLabels() {
  return getSteps()
    .filter((step) => within(step).queryByTestId("mt-icon__regular-checkmark-xs"))
    .map((step) => step.textContent?.trim());
}

describe("mt-stepper", () => {
  it("renders a list named Progress by default", () => {
    // ARRANGE
    renderStepper();

    // ASSERT
    expect(screen.getByRole("list", { name: "Progress" })).toBeInTheDocument();
  });

  it("uses the given aria label for the list", () => {
    // ARRANGE
    renderStepper({ ariaLabel: "Checkout progress" });

    // ASSERT
    expect(screen.getByRole("list", { name: "Checkout progress" })).toBeInTheDocument();
  });

  it("renders one list item per step in the given order", () => {
    // ARRANGE
    renderStepper();

    // ASSERT
    expect(getSteps().map((step) => step.textContent?.trim())).toEqual([
      "Account",
      "Shipping",
      "Payment",
      "Review",
    ]);
  });

  it("renders nothing without steps", () => {
    // ARRANGE
    renderStepper({ steps: [] });

    // ASSERT
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("marks the first step as the current step by default", () => {
    // ARRANGE
    renderStepper();

    // ASSERT
    expect(getCurrentSteps()).toHaveLength(1);
    expect(getSteps()[0]).toHaveAttribute("aria-current", "step");
    expect(getCompletedLabels()).toEqual([]);
  });

  it("marks only the step at the given index as the current step", () => {
    // ARRANGE
    renderStepper({ currentStep: 2 });

    // ASSERT
    expect(getCurrentSteps()).toHaveLength(1);
    expect(getSteps()[2]).toHaveAttribute("aria-current", "step");
  });

  it("shows the steps before the current step as completed", () => {
    // ARRANGE
    renderStepper({ currentStep: 2 });

    // ASSERT
    expect(getCompletedLabels()).toEqual(["Completed: Account", "Completed: Shipping"]);
  });

  it("shows a circle in the marker of every step that is not completed", () => {
    // ARRANGE
    renderStepper({ currentStep: 2 });

    // ASSERT
    const [, , current, upcoming] = getSteps();
    expect(within(current).getByTestId("mt-icon__regular-circle-xs")).toBeInTheDocument();
    expect(within(upcoming).getByTestId("mt-icon__regular-circle-xs")).toBeInTheDocument();
  });

  it("hides the marker icons from assistive technology", () => {
    // ARRANGE
    renderStepper({ currentStep: 1 });

    // ASSERT
    expect(screen.getByTestId("mt-icon__regular-checkmark-xs")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    screen.getAllByTestId("mt-icon__regular-circle-xs").forEach((icon) => {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("shows the current step as completed when it is marked as completed", () => {
    // ARRANGE
    renderStepper({
      steps: [{ label: "Account" }, { label: "Shipping", completed: true }, { label: "Payment" }],
      currentStep: 1,
    });

    // ASSERT
    const current = getSteps()[1];
    expect(current).toHaveAttribute("aria-current", "step");
    expect(current).toHaveTextContent("Completed: Shipping");
    expect(current).toHaveClass("mt-stepper__step--current", "mt-stepper__step--completed");
  });

  it("shows a step after the current step as completed when it is marked as completed", () => {
    // ARRANGE
    renderStepper({
      steps: [{ label: "Account" }, { label: "Shipping" }, { label: "Payment", completed: true }],
      currentStep: 1,
    });

    // ASSERT
    expect(getCompletedLabels()).toEqual(["Completed: Account", "Completed: Payment"]);
  });

  it("does not show a step before the current step as completed when it is marked as not completed", () => {
    // ARRANGE
    renderStepper({
      steps: [{ label: "Account", completed: false }, { label: "Shipping" }, { label: "Payment" }],
      currentStep: 2,
    });

    // ASSERT
    expect(getCompletedLabels()).toEqual(["Completed: Shipping"]);
  });

  it("completes every step and marks none as current when the index is past the last step", () => {
    // ARRANGE
    renderStepper({ currentStep: 4 });

    // ASSERT
    expect(getCurrentSteps()).toHaveLength(0);
    expect(getCompletedLabels()).toEqual([
      "Completed: Account",
      "Completed: Shipping",
      "Completed: Payment",
      "Completed: Review",
    ]);
  });

  it("leaves every step upcoming when the index is negative", () => {
    // ARRANGE
    renderStepper({ currentStep: -1 });

    // ASSERT
    expect(getCurrentSteps()).toHaveLength(0);
    expect(getCompletedLabels()).toEqual([]);
  });

  it("moves the current step when the index changes", async () => {
    // ARRANGE
    const { rerender } = renderStepper({ currentStep: 0 });

    // ACT
    await rerender({ currentStep: 1 });

    // ASSERT
    expect(getSteps()[1]).toHaveAttribute("aria-current", "step");
    expect(getCompletedLabels()).toEqual(["Completed: Account"]);
  });

  it("lays the steps out vertically by default", () => {
    // ARRANGE
    renderStepper();

    // ASSERT
    expect(screen.getByRole("list")).toHaveClass("mt-stepper--vertical");
  });

  it("lays the steps out horizontally when the orientation is horizontal", () => {
    // ARRANGE
    renderStepper({ orientation: "horizontal" });

    // ASSERT
    expect(screen.getByRole("list")).toHaveClass("mt-stepper--horizontal");
  });
});
