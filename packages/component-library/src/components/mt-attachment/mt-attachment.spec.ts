import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import MtAttachment from "./mt-attachment.vue";

describe("mt-attachment", () => {
  it("shows the name of the file with a file icon", () => {
    render(MtAttachment, {
      props: { file: new File(["pdf"], "report.pdf", { type: "application/pdf" }) },
    });

    expect(screen.getByText("report.pdf")).toBeVisible();
    expect(screen.getByTestId("mt-icon__regular-file")).toBeInTheDocument();
  });

  it("shows a label and an icon without a file", () => {
    render(MtAttachment, { props: { label: "Product: Lamp", icon: "regular-products" } });

    expect(screen.getByText("Product: Lamp")).toBeVisible();
    expect(screen.getByTestId("mt-icon__regular-products")).toBeInTheDocument();
  });

  it("previews an image from a URL", () => {
    const { container } = render(MtAttachment, {
      props: { url: "data:image/png;base64,AAAA", mediaType: "image/png", label: "photo.png" },
    });

    expect(container.querySelector("img")).toHaveAttribute("src", "data:image/png;base64,AAAA");
  });

  it("previews an image from a URL with only the top-level media type", () => {
    const { container } = render(MtAttachment, {
      props: { url: "data:image/png;base64,AAAA", mediaType: "image", label: "photo.png" },
    });

    expect(container.querySelector("img")).toHaveAttribute("src", "data:image/png;base64,AAAA");
  });

  it("shows a file icon for other files from a URL", () => {
    const { container } = render(MtAttachment, {
      props: {
        url: "https://example.com/report.pdf",
        mediaType: "application/pdf",
        label: "report.pdf",
      },
    });

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByTestId("mt-icon__regular-file")).toBeInTheDocument();
  });

  it("emits remove from its remove button", async () => {
    const onRemove = vi.fn();
    render(MtAttachment, { props: { label: "Product: Lamp", removable: true, onRemove } });

    await userEvent.click(screen.getByRole("button", { name: "Remove Product: Lamp" }));

    expect(onRemove).toHaveBeenCalledOnce();
  });
});
