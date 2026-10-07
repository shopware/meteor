import { render } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtStack from "./mt-stack.vue";

describe("mt-stack", () => {
  it("stacks vertically with a 32px gap by default", async () => {
    const { container } = render(MtStack, {
      slots: { default: "<span>A</span><span>B</span>" },
    });

    const stack = container.firstElementChild;
    expect(stack).toHaveClass(
      "mt-stack",
      "mt-stack--vertical",
      "mt-stack--align-stretch",
      "mt-stack--justify-start",
    );
    expect(stack).toHaveStyle({ "--mt-stack-gap": "var(--scale-size-32)" });
  });

  it("stacks horizontally", async () => {
    const { container } = render(MtStack, {
      props: { direction: "horizontal" },
    });

    expect(container.firstElementChild).toHaveClass("mt-stack--horizontal");
    expect(container.firstElementChild).not.toHaveClass("mt-stack--vertical");
  });

  it("applies the gap token", async () => {
    const { container } = render(MtStack, {
      props: { gap: "scale-size-8" },
    });

    expect(container.firstElementChild).toHaveStyle({ "--mt-stack-gap": "var(--scale-size-8)" });
  });

  it("applies the alignment class", async () => {
    const { container } = render(MtStack, {
      props: { align: "center" },
    });

    expect(container.firstElementChild).toHaveClass("mt-stack--align-center");
  });

  it("applies the justify class", async () => {
    const { container } = render(MtStack, {
      props: { justify: "end" },
    });

    expect(container.firstElementChild).toHaveClass("mt-stack--justify-end");
    expect(container.firstElementChild).not.toHaveClass("mt-stack--justify-start");
  });

  it("renders slot content", async () => {
    const { getByText } = render(MtStack, {
      slots: { default: "<span>Item</span>" },
    });

    expect(getByText("Item")).toBeInTheDocument();
  });
});
