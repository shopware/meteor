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
