import { render, screen, waitFor } from "@testing-library/vue";
import MtFileIcon from "./mt-file-icon.vue";

function getRoot(container: Element) {
  return container.querySelector(".mt-file-icon")!;
}

function getIconName(container: Element) {
  return container.querySelector(".mt-file-icon__icon .mt-icon")?.getAttribute("data-testid");
}

function getFormat(container: Element) {
  return container.querySelector(".mt-file-icon__format");
}

describe("mt-file-icon", () => {
  it("shows the empty page without any props", () => {
    // ARRANGE
    const { container } = render(MtFileIcon);

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--empty");
    expect(getIconName(container)).toBeUndefined();
    expect(getFormat(container)).not.toBeInTheDocument();
  });

  it("shows the category icon and format label of a file name", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { fileName: "invoice.pdf" } });

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--format");
    expect(getIconName(container)).toBe("mt-icon__regular-bars");
    expect(getFormat(container)).toHaveTextContent("PDF");
    expect(getFormat(container)).toHaveClass("mt-file-icon__format--pdf");
  });

  it("falls back to the category icon when there is no format", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { mimeType: "audio/x-unknown" } });

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--icon");
    expect(getIconName(container)).toBe("mt-icon__regular-volume-up");
    expect(getFormat(container)).not.toBeInTheDocument();
  });

  it("falls back to the empty page when the format has no category", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { fileName: "data.xyz" } });

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--empty");
    expect(getFormat(container)).not.toBeInTheDocument();
  });

  it("falls back to the empty page when the category is unknown", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, {
      // @ts-expect-error -- a value from outside of the type, such as one from an API
      props: { category: "other" },
    });

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--empty");
    expect(getIconName(container)).toBeUndefined();
  });

  it("shows a custom icon and format", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { icon: "solid-square", format: "txt" } });

    // ASSERT
    expect(getIconName(container)).toBe("mt-icon__regular-square");
    expect(getFormat(container)).toHaveTextContent("TXT");
  });

  it("shows the zipper for archives with and without a format label", async () => {
    // ARRANGE
    const { container, rerender } = render(MtFileIcon, { props: { fileName: "photos.zip" } });

    // ASSERT
    expect(getIconName(container)).toBe("mt-icon__regular-zipper");
    expect(container.querySelector(".mt-file-icon__icon")).toHaveClass("mt-file-icon__icon--top");

    // ACT
    await rerender({ fileName: "photos.zip", showFormat: false });

    // ASSERT
    expect(getIconName(container)).toBe("mt-icon__regular-zipper");
    expect(container.querySelector(".mt-file-icon__icon")).toHaveClass("mt-file-icon__icon--top");
  });

  it("hides the format label when showFormat is false", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, {
      props: { fileName: "sheet.xlsx", showFormat: false },
    });

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--icon");
    expect(getIconName(container)).toBe("mt-icon__regular-table");
    expect(getFormat(container)).not.toBeInTheDocument();
  });

  it("leaves hiding the format label of a small icon to its container query", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { fileName: "sheet.xlsx", size: 32 } });

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--format");
    expect(getFormat(container)).toHaveTextContent("XLSX");
  });

  it("shows the broken preview over everything else", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { fileName: "invoice.pdf", broken: true } });

    // ASSERT
    expect(getRoot(container)).toHaveClass("mt-file-icon--broken");
    expect(getIconName(container)).toBe("mt-icon__regular-times");
    expect(getFormat(container)).not.toBeInTheDocument();
  });

  it("sets the height from the token scale and the width at three quarters of it", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { size: 96 } });

    // ASSERT
    const root = getRoot(container) as HTMLElement;
    expect(root.style.getPropertyValue("--mt-file-icon-width")).toBe(
      "calc(var(--scale-size-96) * 3 / 4)",
    );
  });

  it("leaves the size to its parent when fluid", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { fileName: "sheet.xlsx", size: "fluid" } });

    // ASSERT
    const root = getRoot(container) as HTMLElement;
    expect(root.style.getPropertyValue("--mt-file-icon-width")).toBe("");
    expect(getFormat(container)).toHaveTextContent("XLSX");
  });

  it("sizes the icon from its viewBox on the icon grid", async () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { category: "document" } });

    // ACT
    const icon = container.querySelector(".mt-file-icon__icon .mt-icon") as HTMLElement;
    icon.innerHTML = '<svg viewBox="0 0 20 16"></svg>';

    // ASSERT
    await waitFor(() => {
      expect(icon.style.width).toBe("calc(var(--mt-file-icon-icon-unit) * 20)");
    });
    expect(icon.style.height).toBe("calc(var(--mt-file-icon-icon-unit) * 16)");
  });

  it("centers a custom icon of an archive", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { fileName: "photos.rar", icon: "image" } });

    // ASSERT
    expect(container.querySelector(".mt-file-icon__icon")).not.toHaveClass(
      "mt-file-icon__icon--top",
    );
  });

  it("is hidden from assistive technology without a label", () => {
    // ARRANGE
    const { container } = render(MtFileIcon, { props: { fileName: "invoice.pdf" } });

    // ASSERT
    expect(getRoot(container)).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("exposes the label as the accessible name", () => {
    // ARRANGE
    render(MtFileIcon, { props: { fileName: "invoice.pdf", label: "PDF file" } });

    // ASSERT
    expect(screen.getByRole("img", { name: "PDF file" })).not.toHaveAttribute("aria-hidden");
  });

  it("gives every instance its own clip paths", () => {
    // ARRANGE
    const { container } = render({
      components: { MtFileIcon },
      template: `<div><mt-file-icon /><mt-file-icon /></div>`,
    });

    // ASSERT
    const ids = [...container.querySelectorAll("clipPath")].map((clipPath) => clipPath.id);
    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
  });
});
