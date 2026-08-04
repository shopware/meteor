import { render, screen } from "@testing-library/vue";
import MtStatusDot from "./mt-status-dot.vue";

describe("mt-status-dot", () => {
  it("renders the neutral variant in the m size by default", () => {
    // ARRANGE
    const { container } = render(MtStatusDot);

    // ACT & ASSERT
    const dot = container.firstElementChild;
    expect(dot).toHaveClass("mt-status-dot--variant-neutral");
    expect(dot).toHaveClass("mt-status-dot--size-m");
  });

  it("applies the given variant and size", () => {
    // ARRANGE
    const { container } = render(MtStatusDot, {
      props: { variant: "critical", size: "l" },
    });

    // ACT & ASSERT
    const dot = container.firstElementChild;
    expect(dot).toHaveClass("mt-status-dot--variant-critical");
    expect(dot).toHaveClass("mt-status-dot--size-l");
  });

  it("is not pulsating by default", () => {
    // ARRANGE
    const { container } = render(MtStatusDot);

    // ACT & ASSERT
    expect(container.firstElementChild).not.toHaveClass("mt-status-dot--pulse");
  });

  it("pulsates when the pulse prop is set", () => {
    // ARRANGE
    const { container } = render(MtStatusDot, {
      props: { variant: "positive", pulse: true },
    });

    // ACT & ASSERT
    expect(container.firstElementChild).toHaveClass("mt-status-dot--pulse");
  });

  it("is hidden from assistive technology when no label is given", () => {
    // ARRANGE
    const { container } = render(MtStatusDot, {
      props: { variant: "positive" },
    });

    // ACT & ASSERT
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes its label to assistive technology", () => {
    // ARRANGE
    render(MtStatusDot, {
      props: { variant: "positive", label: "Online" },
    });

    // ACT & ASSERT
    expect(screen.getByRole("img", { name: "Online" })).toBeInTheDocument();
  });
});
