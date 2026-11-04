import { render } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import MtGrid from "./mt-grid.vue";

describe("mt-grid", () => {
  it("renders two responsive columns with a 32px gap by default", async () => {
    const { container } = render(MtGrid, {
      slots: { default: "<span>A</span><span>B</span>" },
    });

    const grid = container.firstElementChild;
    expect(grid).toHaveClass("mt-grid", "mt-grid--align-end");
    expect(grid).toHaveStyle({
      "--mt-grid-template-columns":
        "repeat(auto-fit, minmax(max(calc(100% / 2 - var(--mt-grid-column-gap)), var(--scale-size-192)), 1fr))",
      "--mt-grid-row-gap": "var(--scale-size-32)",
      "--mt-grid-column-gap": "var(--scale-size-32)",
    });
  });

  it("creates the given number of equal columns", async () => {
    const { container } = render(MtGrid, {
      props: { columns: 3, minColumnWidth: "scale-size-128" },
    });

    expect(container.firstElementChild).toHaveStyle({
      "--mt-grid-template-columns":
        "repeat(auto-fit, minmax(max(calc(100% / 3 - var(--mt-grid-column-gap)), var(--scale-size-128)), 1fr))",
    });
  });

  it("uses a string template directly", async () => {
    const { container } = render(MtGrid, {
      props: { columns: "1fr auto" },
    });

    expect(container.firstElementChild).toHaveStyle({
      "--mt-grid-template-columns": "1fr auto",
    });
  });

  it("applies the gap token to rows and columns", async () => {
    const { container } = render(MtGrid, {
      props: { gap: "scale-size-16" },
    });

    expect(container.firstElementChild).toHaveStyle({
      "--mt-grid-row-gap": "var(--scale-size-16)",
      "--mt-grid-column-gap": "var(--scale-size-16)",
    });
  });

  it("lets row and column gap override the shared gap", async () => {
    const { container } = render(MtGrid, {
      props: { gap: "scale-size-16", rowGap: "scale-size-8", columnGap: "scale-size-24" },
    });

    expect(container.firstElementChild).toHaveStyle({
      "--mt-grid-row-gap": "var(--scale-size-8)",
      "--mt-grid-column-gap": "var(--scale-size-24)",
    });
  });

  it("applies the alignment class", async () => {
    const { container } = render(MtGrid, {
      props: { align: "center" },
    });

    expect(container.firstElementChild).toHaveClass("mt-grid--align-center");
    expect(container.firstElementChild).not.toHaveClass("mt-grid--align-end");
  });

  it("renders slot content", async () => {
    const { getByText } = render(MtGrid, {
      slots: { default: "<span>Item</span>" },
    });

    expect(getByText("Item")).toBeInTheDocument();
  });
});
