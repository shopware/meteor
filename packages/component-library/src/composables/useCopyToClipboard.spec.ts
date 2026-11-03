import { useCopyToClipboard } from "./useCopyToClipboard";

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("copies the value and returns to idle after the reset delay", async () => {
    // ARRANGE
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const { status, copy } = useCopyToClipboard({ resetDelayInMs: 1000 });

    // ACT
    const result = await copy("SW-10001");

    // ASSERT
    expect(result).toBe(true);
    expect(writeText).toHaveBeenCalledWith("SW-10001");
    expect(status.value).toBe("copied");

    vi.advanceTimersByTime(1000);
    expect(status.value).toBe("idle");
  });

  it("fails when the Clipboard API rejects the write", async () => {
    // ARRANGE
    const permissionError = new DOMException("Write permission denied.", "NotAllowedError");
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(permissionError) },
    });
    const { status, error, copy } = useCopyToClipboard();

    // ACT
    const result = await copy("SW-10001");

    // ASSERT
    expect(result).toBe(false);
    expect(status.value).toBe("failed");
    expect(error.value).toBe(permissionError);
  });

  it("fails when the Clipboard API is not available", async () => {
    // ARRANGE
    vi.stubGlobal("navigator", {});
    const { status, copy } = useCopyToClipboard();

    // ACT
    const result = await copy("SW-10001");

    // ASSERT
    expect(result).toBe(false);
    expect(status.value).toBe("failed");
  });
});
