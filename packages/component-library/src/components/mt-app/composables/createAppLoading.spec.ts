import { effectScope, nextTick } from "vue";
import { createAppLoading } from "./createAppLoading";

function setup() {
  return effectScope().run(() => createAppLoading())!;
}

describe("createAppLoading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows loading only when it lasts longer than 200ms", async () => {
    // ARRANGE
    const { isLoading, startLoading } = setup();

    // ACT
    startLoading();
    await nextTick();
    vi.advanceTimersByTime(199);

    // ASSERT
    expect(isLoading.value).toBe(false);

    // ACT
    vi.advanceTimersByTime(1);

    // ASSERT
    expect(isLoading.value).toBe(true);
  });

  it("keeps loading shown for at least 500ms, so it doesn't flash", async () => {
    // ARRANGE
    const { isLoading, startLoading } = setup();
    const done = startLoading();
    await nextTick();
    vi.advanceTimersByTime(250);

    // ACT
    done();
    await nextTick();
    vi.advanceTimersByTime(449);

    // ASSERT
    expect(isLoading.value).toBe(true);

    // ACT
    vi.advanceTimersByTime(1);

    // ASSERT
    expect(isLoading.value).toBe(false);
  });

  it("never shows loading that ends within 200ms", async () => {
    // ARRANGE
    const { isLoading, startLoading } = setup();

    // ACT
    const done = startLoading();
    await nextTick();
    vi.advanceTimersByTime(100);
    done();
    await nextTick();
    vi.advanceTimersByTime(500);

    // ASSERT
    expect(isLoading.value).toBe(false);
  });

  it("keeps loading until every report is done", async () => {
    // ARRANGE
    const { isLoading, startLoading } = setup();
    const first = startLoading();
    const second = startLoading();
    await nextTick();
    vi.advanceTimersByTime(200);

    // ACT
    first();
    first();
    await nextTick();

    // ASSERT
    expect(isLoading.value).toBe(true);

    // ACT
    second();
    await nextTick();
    vi.advanceTimersByTime(500);

    // ASSERT
    expect(isLoading.value).toBe(false);
  });
});
