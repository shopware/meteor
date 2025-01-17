import { throttle } from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the function immediately", () => {
    // ARRANGE
    const handler = vi.fn();

    vi.setSystemTime(new Date("December 1, 2025 00:00:00"));

    const subject = throttle(handler, 2_000);

    // ACT
    subject();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not call the function again within the time frame", () => {
    // ARRANGE
    const handler = vi.fn();

    vi.setSystemTime(new Date("December 1, 2025 00:00:00"));

    const subject = throttle(handler, 2_000);

    // ACT
    subject();
    vi.setSystemTime(new Date("December 1, 2025 00:00:01"));
    subject();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("calls the function again after the time frame", () => {
    // ARRANGE
    const handler = vi.fn();

    vi.setSystemTime(new Date("December 1, 2025 00:00:00"));

    const subject = throttle(handler, 2_000);

    // ACT
    subject();
    vi.setSystemTime(new Date("December 1, 2025 00:00:02"));
    subject();

    // ASSERT
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
