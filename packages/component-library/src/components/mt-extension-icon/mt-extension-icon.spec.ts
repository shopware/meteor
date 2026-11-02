import { fireEvent, render, screen } from "@testing-library/vue";
import { nextTick } from "vue";
import MtExtensionIcon from "./mt-extension-icon.vue";

function getSize(container: Element) {
  return (container.firstElementChild as HTMLElement).style.getPropertyValue(
    "--mt-extension-icon-size",
  );
}

describe("mt-extension-icon", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders in the 40 size by default", () => {
    // ARRANGE
    const { container } = render(MtExtensionIcon);

    // ACT & ASSERT
    expect(getSize(container)).toBe("var(--scale-size-40)");
  });

  it("applies the given size", () => {
    // ARRANGE
    const { container } = render(MtExtensionIcon, {
      props: { size: 96 },
    });

    // ACT & ASSERT
    expect(getSize(container)).toBe("var(--scale-size-96)");
  });

  it("shows the image when a src is given", () => {
    // ARRANGE
    render(MtExtensionIcon, {
      props: { src: "/icon.png", alt: "Example extension" },
    });

    // ACT & ASSERT
    expect(screen.getByRole("img", { name: "Example extension" })).toHaveAttribute(
      "src",
      "/icon.png",
    );
    expect(screen.queryByTestId("mt-extension-icon-placeholder")).not.toBeInTheDocument();
  });

  it("shows the placeholder when no src is given", () => {
    // ARRANGE
    const { container } = render(MtExtensionIcon);

    // ACT & ASSERT
    expect(screen.getByTestId("mt-extension-icon-placeholder")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("mt-extension-icon--placeholder");
  });

  it("does not use the placeholder modifier when an image is shown", () => {
    // ARRANGE
    const { container } = render(MtExtensionIcon, {
      props: { src: "/icon.png" },
    });

    // ACT & ASSERT
    expect(container.firstElementChild).not.toHaveClass("mt-extension-icon--placeholder");
  });

  it("keeps the image when it already loaded before mounting", async () => {
    // ARRANGE
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(64);

    // ACT
    const { container } = render(MtExtensionIcon, {
      props: { src: "/icon.png" },
    });
    await nextTick();

    // ASSERT
    expect(container.querySelector("img")).toHaveAttribute("src", "/icon.png");
    expect(screen.queryByTestId("mt-extension-icon-placeholder")).not.toBeInTheDocument();
  });

  it("shows the placeholder when the image already failed to load before mounting", async () => {
    // ARRANGE
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(0);

    // ACT
    const { container } = render(MtExtensionIcon, {
      props: { src: "/broken.png" },
    });

    // ASSERT
    expect(await screen.findByTestId("mt-extension-icon-placeholder")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("shows the placeholder when the image fails to load", async () => {
    // ARRANGE
    const { container } = render(MtExtensionIcon, {
      props: { src: "/broken.png" },
    });

    // ACT
    await fireEvent.error(container.querySelector("img")!);

    // ASSERT
    expect(screen.getByTestId("mt-extension-icon-placeholder")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("tries to load the image again when the src changes after an error", async () => {
    // ARRANGE
    const { container, rerender } = render(MtExtensionIcon, {
      props: { src: "/broken.png" },
    });
    await fireEvent.error(container.querySelector("img")!);

    // ACT
    await rerender({ src: "/icon.png" });

    // ASSERT
    expect(container.querySelector("img")).toHaveAttribute("src", "/icon.png");
    expect(screen.queryByTestId("mt-extension-icon-placeholder")).not.toBeInTheDocument();
  });

  it("treats the image as decorative when no alt is given", () => {
    // ARRANGE
    const { container } = render(MtExtensionIcon, {
      props: { src: "/icon.png" },
    });

    // ACT & ASSERT
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(container.firstElementChild).not.toHaveAttribute("role");
  });

  it("exposes the alt text on the placeholder", () => {
    // ARRANGE
    render(MtExtensionIcon, {
      props: { alt: "Example extension" },
    });

    // ACT & ASSERT
    expect(screen.getByRole("img", { name: "Example extension" })).toHaveClass("mt-extension-icon");
  });

  it("hides the placeholder from assistive technology when no alt is given", () => {
    // ARRANGE
    render(MtExtensionIcon);

    // ACT & ASSERT
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByTestId("mt-extension-icon-placeholder")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
