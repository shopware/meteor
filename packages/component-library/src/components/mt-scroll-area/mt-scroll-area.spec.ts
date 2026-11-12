import { fireEvent, render } from "@testing-library/vue";
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

  it("marks only the axes that overflow", async () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      props: { orientation: "both" },
      slots: { default: "Scrollable content" },
    });
    await flushPromises();
    const viewport = getViewport(container);

    // ACT
    mockOverflow(viewport, { scrollWidth: 300 });
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).toHaveAttribute("data-overflowing", "x");

    // ACT
    mockOverflow(viewport, { scrollWidth: 300, scrollHeight: 300 });
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).toHaveAttribute("data-overflowing", "x y");
  });

  it("makes the viewport focusable only while content without focusable elements overflows", async () => {
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

  it("adds no tab stop when the content has focusable elements", async () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      slots: { default: () => h("a", { href: "#" }, "Order #10001") },
    });
    await flushPromises();
    const viewport = getViewport(container);

    // ACT
    mockOverflow(viewport, { scrollHeight: 300 });
    await flushPromises();

    // ASSERT
    expect(viewport).not.toHaveAttribute("tabindex");
  });

  it("keeps a tabindex that is set on the component", async () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      attrs: { tabindex: "-1" },
      slots: { default: "Scrollable content" },
    });
    await flushPromises();
    const viewport = getViewport(container);

    // ACT
    mockOverflow(viewport, { scrollHeight: 300 });
    await flushPromises();

    // ASSERT
    expect(viewport).toHaveAttribute("tabindex", "-1");
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
    expect(container.firstElementChild).not.toHaveAttribute("data-overflowing");
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

  it("checks the overflow again when the orientation changes", async () => {
    // ARRANGE
    const { container, rerender } = render(MtScrollArea, {
      props: { orientation: "both" },
      slots: { default: "Scrollable content" },
    });
    await flushPromises();
    mockOverflow(getViewport(container), { scrollHeight: 300 });
    await flushPromises();

    // ACT
    await rerender({ orientation: "horizontal" });
    await flushPromises();

    // ASSERT
    expect(container.firstElementChild).not.toHaveAttribute("data-overflowing");
  });

  it("applies role, label and tabindex to the viewport and other attributes to the root", () => {
    // ARRANGE
    const { container } = render(MtScrollArea, {
      attrs: {
        role: "region",
        "aria-label": "Order history",
        tabindex: "0",
        class: "custom-class",
        "data-testid": "orders",
      },
    });
    const root = container.firstElementChild as HTMLElement;
    const viewport = getViewport(container);

    // ASSERT
    expect(viewport).toHaveAttribute("role", "region");
    expect(viewport).toHaveAttribute("aria-label", "Order history");
    expect(viewport).toHaveAttribute("tabindex", "0");
    expect(root).toHaveClass("custom-class", "mt-scroll-area");
    expect(root).toHaveAttribute("data-testid", "orders");
    expect(root).not.toHaveAttribute("role");
  });

  it("applies a camel case tabIndex to the viewport", () => {
    // ARRANGE
    const { container } = render({
      render: () => h(MtScrollArea, { tabIndex: 0 }),
    });

    // ASSERT
    expect(getViewport(container)).toHaveAttribute("tabindex", "0");
    expect(container.firstElementChild).not.toHaveAttribute("tabindex");
  });

  it("listens for scroll and focus events on the viewport", async () => {
    // ARRANGE
    const onScroll = vi.fn();
    const onFocus = vi.fn();
    const onClick = vi.fn();
    const { container } = render(MtScrollArea, {
      attrs: { onScroll, onFocus, onClick },
    });
    const viewport = getViewport(container);

    // ACT
    await fireEvent.scroll(viewport);
    await fireEvent.focus(viewport);
    await fireEvent.click(viewport);

    // ASSERT
    expect(onScroll).toHaveBeenCalledOnce();
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
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
