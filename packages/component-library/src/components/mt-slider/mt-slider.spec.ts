import { defineComponent } from "vue";
import { render, screen, type RenderResult } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import MtSlider from "./mt-slider.vue";

function renderSlider(options: Parameters<typeof render>[1] = {}): RenderResult {
  return render(MtSlider, {
    ...options,
    props: {
      label: "Slider",
      modelValue: 0,
      hasFocus: false,
      ...options.props,
    },
  });
}

describe("mt-slider", () => {
  it("displays a hint passed via the hint prop", () => {
    // ARRANGE
    renderSlider({ props: { hint: "Hint from prop" } });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", () => {
    // ARRANGE
    renderSlider({
      slots: {
        hint: '<span data-testid="custom-hint">Hint from slot</span>',
      },
    });

    // ASSERT
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", () => {
    // ARRANGE
    const { container } = renderSlider();

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("displays a help text when the helpText prop is set", () => {
    // ARRANGE
    const { container } = renderSlider({
      props: { label: "Label", modelValue: 25, helpText: "Some help text" },
    });

    // ASSERT
    expect(container.querySelector(".mt-slider__help-text")).toBeInTheDocument();
  });

  it("marks the label as required when the required prop is set", () => {
    // ARRANGE
    renderSlider({ props: { label: "Label", modelValue: 25, required: true } });

    // ASSERT
    expect(screen.getByText("Label")).toHaveClass("mt-field-label--is-required");
  });

  it("displays a copy button when the copyable prop is set", () => {
    // ARRANGE
    const { container } = renderSlider({
      props: { label: "Label", modelValue: 25, copyable: true },
    });

    // ASSERT
    expect(container.querySelector(".mt-field-copyable")).toBeInTheDocument();
  });

  it("disables the input when the disabled prop is set", () => {
    // ARRANGE
    renderSlider({
      props: { label: "Label", modelValue: 25, disabled: true },
    });

    // ASSERT
    expect(screen.getByTestId("right-slider")).toBeDisabled();
  });

  it("displays an inheritance switch when the isInheritanceField prop is set", () => {
    // ARRANGE
    renderSlider({ props: { label: "Label", modelValue: 25, isInheritanceField: true } });

    // ASSERT
    expect(screen.getByRole("button", { name: "Link inheritance" })).toBeInTheDocument();
  });

  it("marks the field as inherited when the isInherited prop is set", () => {
    // ARRANGE
    const { container } = renderSlider({
      props: { label: "Label", modelValue: 25, isInheritanceField: true, isInherited: true },
    });

    // ASSERT
    expect(container.querySelector(".mt-slider")).toHaveClass("mt-slider--inherited");
    expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeInTheDocument();
  });

  it("disables the inheritance switch when the disableInheritanceToggle prop is set", () => {
    // ARRANGE
    renderSlider({
      props: {
        label: "Label",
        modelValue: 25,
        isInheritanceField: true,
        isInherited: true,
        disableInheritanceToggle: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeDisabled();
  });

  it("renders in the small size when the size prop is set to small", () => {
    // ARRANGE
    const { container } = renderSlider({
      props: { label: "Label", modelValue: 25, size: "small" },
    });

    // ASSERT
    expect(container.querySelector(".mt-slider")).toHaveClass("mt-slider--small");
  });

  it("accepts the validation prop without rendering it as an attribute", () => {
    // ARRANGE
    const { container } = renderSlider({ props: { label: "Label", validation: "required" } });

    // ASSERT
    expect(container.querySelector(".mt-slider")).not.toHaveAttribute("validation");
  });
});

describe("mt-slider conditional hint", () => {
  const Host = defineComponent({
    components: { Field: MtSlider },
    props: {
      showHint: { type: Boolean, default: false },
      hint: { type: String, default: null },
    },
    setup: () => ({ fieldProps: { modelValue: 0, hasFocus: false, label: "Slider" } }),
    template: `
      <Field v-bind="fieldProps" :hint="hint">
        <template v-if="showHint" #hint>
          <span data-testid="custom-hint">Original value</span>
        </template>
      </Field>
    `,
  });

  it("renders a hint slot added after mounting and removes it again", async () => {
    const { container, rerender } = render(Host);

    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("removes a hint slot that was present when mounting", async () => {
    const { container, rerender } = render(Host, { props: { showHint: true } });

    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("falls back to the hint prop when the slot is removed", async () => {
    const { rerender } = render(Host, { props: { hint: "Hint from prop" } });

    expect(screen.getByText("Hint from prop")).toBeVisible();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.queryByText("Hint from prop")).not.toBeInTheDocument();

    await rerender({ showHint: false });
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });
});
