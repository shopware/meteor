import { fireEvent, render, screen } from "@testing-library/vue";
import MtExtensionIcon from "./mt-extension-icon.vue";

describe("mt-extension-icon", () => {
  afterEach(() => {
    vi.restoreAllMocks();
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

  it("shows a decorative placeholder when neither src nor alt is given", () => {
    // ARRANGE
    const { container } = render(MtExtensionIcon);

    // ACT & ASSERT
    expect(screen.getByTestId("mt-extension-icon-placeholder")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("exposes the alt text on the placeholder", () => {
    // ARRANGE
    render(MtExtensionIcon, {
      props: { alt: "Example extension" },
    });

    // ACT & ASSERT
    expect(screen.getByRole("img", { name: "Example extension" })).toHaveClass("mt-extension-icon");
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
});
