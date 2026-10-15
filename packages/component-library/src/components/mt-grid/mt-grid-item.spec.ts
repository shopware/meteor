import { render } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtGridItem from "./mt-grid-item.vue";

describe("mt-grid-item", () => {
  it("spans one column by default", async () => {
    const { container } = render(MtGridItem, {
      slots: { default: "Item" },
    });

    const item = container.firstElementChild;
    expect(item).toHaveClass("mt-grid-item");
    expect(item).not.toHaveClass("mt-grid-item--full");
    expect(item).toHaveStyle({ "--mt-grid-item-span": "1" });
  });

  it("spans the given number of columns", async () => {
    const { container } = render(MtGridItem, {
      props: { span: 2 },
    });

    expect(container.firstElementChild).toHaveStyle({ "--mt-grid-item-span": "2" });
  });

  it("stretches across the whole row with span full", async () => {
    const { container } = render(MtGridItem, {
      props: { span: "full" },
    });

    const item = container.firstElementChild;
    expect(item).toHaveClass("mt-grid-item--full");
    expect(item?.getAttribute("style")).toBeFalsy();
  });

  it("renders slot content", async () => {
    const { getByText } = render(MtGridItem, {
      slots: { default: "<span>Item</span>" },
    });

    expect(getByText("Item")).toBeInTheDocument();
  });
});
