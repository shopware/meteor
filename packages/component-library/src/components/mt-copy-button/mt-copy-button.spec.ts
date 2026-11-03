import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MtCopyButton from "./mt-copy-button.vue";

describe("mt-copy-button", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("copies the value and announces that it was copied", async () => {
    // ARRANGE
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const { emitted } = render(MtCopyButton, {
      props: { value: "SW-10001", label: "Copy order number" },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Copy order number" }));

    // ASSERT
    expect(writeText).toHaveBeenCalledWith("SW-10001");
    expect(emitted().copy).toEqual([["SW-10001"]]);
    expect(screen.getByRole("button", { name: "Copied" })).not.toHaveAttribute("aria-describedby");
    expect(screen.getByText("Copied", { selector: "[aria-live]" })).toBeInTheDocument();
  });

  it("announces a failure when the clipboard cannot be written", async () => {
    // ARRANGE
    const permissionError = new DOMException("Write permission denied.", "NotAllowedError");
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText: vi.fn().mockRejectedValue(permissionError) },
    });
    const { emitted } = render(MtCopyButton, { props: { value: "SW-10001" } });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    // ASSERT
    expect(emitted().error).toEqual([[permissionError]]);
    expect(emitted().copy).toBeUndefined();
    expect(screen.getByText("Copy failed", { selector: "[aria-live]" })).toBeInTheDocument();
  });
});
