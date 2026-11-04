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
    expect(container.firstElementChild).toHaveAttribute("data-overflowing");
  });

  it("ignores overflow in a direction that does not scroll", async () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { orientation: "vertical" },
      slots: { default: "Scrollable content" },
    });
    await flushPromises();
    const viewport = getViewport(container);

    // ACT
    mockOverflow(viewport, { scrollWidth: 300 });
    await flushPromises();

    // ASSERT
    expect(viewport).not.toHaveAttribute("tabindex");
  });

  it("fades the edges of the scrolling direction by default", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { orientation: "horizontal" },
    });
    const root = container.firstElementChild as HTMLElement;

    // ASSERT
    expect(root).toHaveClass("mt-scroll-area--fade");
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size-start")).toBe(
      "var(--mt-scroll-area-fade-size-default)",
    );
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size-end")).toBe(
      "var(--mt-scroll-area-fade-size-default)",
    );
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size-top")).toBe("");
  });

  it("fades a single edge", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { fade: "bottom" },
    });
    const root = container.firstElementChild as HTMLElement;

    // ASSERT
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size-bottom")).not.toBe("");
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size-top")).toBe("");
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

  it("sets the fade size from a token step, also per edge", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { fadeSize: { top: 16 } },
    });
    const root = container.firstElementChild as HTMLElement;

    // ASSERT
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size-top")).toBe(
      "var(--scale-size-16)",
    );
    expect(root.style.getPropertyValue("--mt-scroll-area-fade-size-bottom")).toBe(
      "var(--mt-scroll-area-fade-size-default)",
    );
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
