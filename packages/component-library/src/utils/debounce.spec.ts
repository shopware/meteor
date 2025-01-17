import { debounce } from "./debounce";

describe("utils/debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("calls the function after the delay", () => {
    // ARRANGE
    const handler = vi.fn();

    const subject = debounce(handler, 100);

    // ACT
    subject();

    vi.advanceTimersByTime(100);

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not call the function before the delay", () => {
    // ARRANGE
    const handler = vi.fn();

    const subject = debounce(handler, 100);

    // ACT
    subject();
    vi.advanceTimersByTime(50);

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("resets the timer when called multiple times", () => {
    // ARRANGE
    const handler = vi.fn();

    const subject = debounce(handler, 100);

    // ACT
    subject();
    vi.advanceTimersByTime(50);

    subject();
    vi.advanceTimersByTime(50);

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("only calls the function after the reseted delay", () => {
    // ARRANGE
    const handler = vi.fn();

    const subject = debounce(handler, 100);

    // ACT
    subject();
    vi.advanceTimersByTime(50);

    subject();
    vi.advanceTimersByTime(100);

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });
});
