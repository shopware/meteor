import { render } from "@testing-library/vue";
import flushPromises from "flush-promises";
import { h, ref } from "vue";
import MtScrollArea from "./mt-scroll-area.vue";

let resizeCallbacks: ResizeObserverCallback[] = [];

function mockOverflow(element: HTMLElement, { scrollHeight = 100, scrollWidth = 100 } = {}) {
  Object.defineProperty(element, "clientHeight", { configurable: true, value: 100 });
  Object.defineProperty(element, "clientWidth", { configurable: true, value: 100 });
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(element, "scrollWidth", { configurable: true, value: scrollWidth });

  resizeCallbacks.forEach((callback) => callback([], {} as ResizeObserver));
}

function getViewport(container: Element) {
  return container.querySelector<HTMLElement>(".mt-scroll-area__viewport")!;
}

describe("mt-scroll-area", () => {
  beforeEach(() => {
    resizeCallbacks = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallbacks.push(callback);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the content in the viewport", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      slots: { default: "Scrollable content" },
    });

    // ASSERT
    expect(getViewport(container)).toHaveTextContent("Scrollable content");
  });

  it("marks the area as overflowing only while the content overflows", async () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      slots: { default: "Scrollable content" },
    });
    await flushPromises();
    const viewport = getViewport(container);

    // ACT
    mockOverflow(viewport);
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).not.toHaveAttribute("data-overflowing");

    // ACT
    mockOverflow(viewport, { scrollHeight: 300 });
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).toHaveAttribute("data-overflowing");
  });

  it("makes the viewport focusable only while the content overflows", async () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      slots: { default: "Scrollable content" },
    });
    await flushPromises();
    const viewport = getViewport(container);

    // ACT
    mockOverflow(viewport);
    await flushPromises();

    // ASSERT
    expect(viewport).not.toHaveAttribute("tabindex");

    // ACT
    mockOverflow(viewport, { scrollHeight: 300 });
    await flushPromises();

    // ASSERT
    expect(viewport).toHaveAttribute("tabindex", "0");
  });

  it("only checks the overflow in the scrolling direction", async () => {
    // ARRANGE
    const { container, rerender } = render(MtScrollArea, {
      props: { orientation: "vertical" },
      slots: { default: "Scrollable content" },
    });
    await flushPromises();
    const viewport = getViewport(container);

    // ACT
    mockOverflow(viewport, { scrollWidth: 300 });
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).not.toHaveAttribute("data-overflowing");

    // ACT
    await rerender({ orientation: "horizontal" });
    mockOverflow(viewport, { scrollWidth: 300 });
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).toHaveAttribute("data-overflowing");
  });

  it("ignores a rounding difference of one pixel", async () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      slots: { default: "Scrollable content" },
    });
    await flushPromises();

    // ACT
    mockOverflow(getViewport(container), { scrollHeight: 101 });
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).not.toHaveAttribute("data-overflowing");
  });

  it("fades both edges by default", () => {
    // ARRANGE
    const { container } = render(MtScrollArea);

    // ASSERT
    expect(container.firstElementChild).toHaveClass(
      "mt-scroll-area--fade",
      "mt-scroll-area--fade-start",
      "mt-scroll-area--fade-end",
    );
  });

  it("fades a single edge", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { fade: "end" },
    });

    // ASSERT
    expect(container.firstElementChild).toHaveClass("mt-scroll-area--fade-end");
    expect(container.firstElementChild).not.toHaveClass("mt-scroll-area--fade-start");
  });

  it("does not fade when the fade is turned off", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { fade: false },
    });

    // ASSERT
    expect(container.firstElementChild).not.toHaveClass("mt-scroll-area--fade");
  });

  it("hides the scrollbar unless it is turned on", async () => {
    // ARRANGE
    const { container, rerender } = render(MtScrollArea);

    // ASSERT
    expect(container.firstElementChild).not.toHaveClass("mt-scroll-area--scrollbar");

    // ACT
    await rerender({ scrollbar: true });

    // ASSERT
    expect(container.firstElementChild).toHaveClass("mt-scroll-area--scrollbar");
  });

  it("sets the fade size from a token step", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { fadeSize: 16 },
    });
    const root = container.firstElementChild as HTMLElement;

    // ASSERT
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size")).toBe("var(--scale-size-16)");
  });

  it("exposes the viewport element", async () => {
    // ARRANGE
    const scrollArea = ref<InstanceType<typeof MtScrollArea>>();
    const { container } = render({
      render: () => h(MtScrollArea, { ref: scrollArea }, () => "Scrollable content"),
    });
    await flushPromises();

    // ASSERT
    expect(scrollArea.value?.viewport).toBe(getViewport(container));
  });
});
