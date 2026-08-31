// Separate from mt-floating-ui.spec.ts because vi.mock is file-wide: these
// tests mock @floating-ui/dom, while the tests over there need the real one.
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import type {
  ComputePositionConfig,
  ComputePositionReturn,
  FlipOptions,
  Middleware,
  SizeOptions,
} from "@floating-ui/dom";

const flipSpy = vi.hoisted(() => vi.fn());
const sizeSpy = vi.hoisted(() => vi.fn());

const computePositionMock = vi.hoisted(() =>
  vi.fn(
    (
      _reference: unknown,
      _floating: unknown,
      _config?: Partial<ComputePositionConfig>,
    ): Promise<Partial<ComputePositionReturn>> =>
      Promise.resolve({
        x: 0,
        y: 0,
        placement: "bottom-start",
        strategy: "fixed",
        middlewareData: {},
      }),
  ),
);

vi.mock("@floating-ui/dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@floating-ui/dom")>();

  return {
    ...actual,
    // Records the options while still building the real middleware.
    flip: (options?: FlipOptions) => {
      flipSpy(options);

      return actual.flip(options);
    },
    size: (options?: SizeOptions) => {
      sizeSpy(options);

      return actual.size(options);
    },
    computePosition: computePositionMock,
    autoUpdate: (
      _reference: unknown,
      _floating: unknown,
      update: () => void,
      _options: unknown,
    ) => {
      update();
      return () => {};
    },
  };
});

import MtFloatingUi from "./mt-floating-ui.vue";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom measures every element as 0×0, and a zero-area reference counts as
// hidden — so give the trigger a size wherever the reference must be measurable.
function giveTriggerASize(wrapper: ReturnType<typeof createWrapper>) {
  const trigger = wrapper.find(".mt-floating-ui__trigger").element as HTMLElement;

  trigger.getBoundingClientRect = vi.fn(() => ({
    width: 200,
    height: 40,
    top: 100,
    left: 50,
    bottom: 140,
    right: 250,
    x: 50,
    y: 100,
    toJSON: vi.fn(),
  }));
}

// The boundary is built from the panes' own rects, which jsdom leaves at 0×0.
function givePaneVerticalBounds(pane: HTMLElement, top: number, bottom: number) {
  pane.getBoundingClientRect = vi.fn(() => ({
    width: 200,
    height: bottom - top,
    top,
    left: 50,
    bottom,
    right: 250,
    x: 50,
    y: top,
    toJSON: vi.fn(),
  }));
}

// Nests the mount point in one ancestor per `overflow-y` value, outermost first.
function nestMountPointIn(...overflows: string[]) {
  const ancestors: HTMLElement[] = [];

  const mountPoint = overflows.reduce((parent, overflowY) => {
    const ancestor = document.createElement("div");
    ancestor.style.overflowY = overflowY;
    parent.appendChild(ancestor);
    ancestors.push(ancestor);

    return ancestor;
  }, document.body as HTMLElement);

  return { mountPoint, ancestors };
}

function createWrapper(
  props: Record<string, unknown> = {},
  mountPoint: HTMLElement = document.body,
) {
  const appWrapper = document.createElement("div");
  appWrapper.setAttribute("id", "appWrapper");
  mountPoint.appendChild(appWrapper);

  return mount(MtFloatingUi, {
    attachTo: appWrapper,
    slots: {
      trigger: `<div id="triggerSlotContent">Trigger</div>`,
      default: `<div id="defaultSlotContent">Content</div>`,
    },
    props: {
      isOpened: false,
      ...props,
    },
  });
}

async function openAndGetConfig(
  props: Record<string, unknown> = {},
  measurable = true,
  mountPoint: HTMLElement = document.body,
) {
  const wrapper = createWrapper(props, mountPoint);

  if (measurable) {
    giveTriggerASize(wrapper);
  }

  await wrapper.setProps({ isOpened: true });
  await flushPromises();

  expect(computePositionMock).toHaveBeenCalled();
  const config = computePositionMock.mock.calls.at(-1)![2] as ComputePositionConfig;
  expect(config).toBeDefined();

  return { wrapper, config };
}

function middlewareNames(config: ComputePositionConfig): string[] {
  return (config.middleware ?? []).filter(Boolean).map((m) => (m as Middleware).name);
}

function lastFlipOptions(): FlipOptions {
  expect(flipSpy).toHaveBeenCalled();

  return flipSpy.mock.calls.at(-1)![0] as FlipOptions;
}

function lastSizeOptions(): SizeOptions {
  expect(sizeSpy).toHaveBeenCalled();

  return sizeSpy.mock.calls.at(-1)![0] as SizeOptions;
}

type SizeApplyState = Parameters<NonNullable<SizeOptions["apply"]>>[0];

// `computePosition` is mocked, so `size()` never runs `apply` itself — call the
// recorded one with the fields the component reads and hand back the element it
// styled. jsdom lays nothing out, so the content height is stubbed.
function applySizeWith(availableHeight: number, contentHeight = 0): HTMLElement {
  const floating = document.createElement("div");
  Object.defineProperty(floating, "scrollHeight", { get: () => contentHeight });

  lastSizeOptions().apply!({
    availableHeight,
    availableWidth: 200,
    rects: {
      reference: { width: 200, height: 40, x: 50, y: 100 },
      floating: { width: 200, height: 400, x: 50, y: 146 },
    },
    elements: { reference: document.createElement("div"), floating },
  } as unknown as SizeApplyState);

  return floating;
}

describe("mt-floating-ui positioning config", () => {
  beforeEach(() => {
    computePositionMock.mockClear();
    flipSpy.mockClear();
    sizeSpy.mockClear();
    document.body.innerHTML = "";
  });

  it("includes the hide middleware so the content vanishes with its reference", async () => {
    const { wrapper, config } = await openAndGetConfig();

    expect(middlewareNames(config)).toContain("hide");

    wrapper.unmount();
  });

  it("keeps the default middleware when the consumer supplies its own", async () => {
    const consumerMiddleware: Middleware = {
      name: "consumerMiddleware",
      fn: () => ({}),
    };

    const { wrapper, config } = await openAndGetConfig({
      floatingUiOptions: { middleware: [consumerMiddleware] },
    });

    const names = middlewareNames(config);
    expect(names).toContain("consumerMiddleware");
    expect(names).toEqual(expect.arrayContaining(["offset", "flip", "size", "hide"]));

    wrapper.unmount();
  });

  it("still applies consumer placement overrides", async () => {
    const { wrapper, config } = await openAndGetConfig({
      floatingUiOptions: { placement: "top-end" },
    });

    expect(config.placement).toBe("top-end");

    wrapper.unmount();
  });

  it("shrinks the content before it flips it", async () => {
    const { wrapper, config } = await openAndGetConfig();

    const names = middlewareNames(config);
    expect(names.indexOf("size")).toBeGreaterThan(-1);
    expect(names.indexOf("size")).toBeLessThan(names.indexOf("flip"));

    wrapper.unmount();
  });

  it("bounds sizing and flipping by the vertical space of the scrollable ancestors", async () => {
    const { mountPoint, ancestors } = nestMountPointIn("auto");
    givePaneVerticalBounds(ancestors[0], 100, 400);

    const { wrapper } = await openAndGetConfig({}, true, mountPoint);

    expect(lastSizeOptions().boundary).toMatchObject({ y: 100, height: 300 });
    expect(lastFlipOptions().boundary).toMatchObject({ y: 100, height: 300 });

    wrapper.unmount();
  });

  it("leaves the width of the boundary to the viewport", async () => {
    const { mountPoint, ancestors } = nestMountPointIn("auto");
    givePaneVerticalBounds(ancestors[0], 100, 400);

    const { wrapper } = await openAndGetConfig({}, true, mountPoint);

    // Narrowing the boundary onto the pane would make the content change
    // alignment at the pane's edge instead of at the edge of the screen.
    expect(lastSizeOptions().boundary).toMatchObject({ x: 0, width: window.innerWidth });
    expect(lastFlipOptions().boundary).toMatchObject({ x: 0, width: window.innerWidth });

    wrapper.unmount();
  });

  it("keeps overflow: hidden ancestors out of the boundary", async () => {
    const { mountPoint, ancestors } = nestMountPointIn("auto", "hidden");
    const [scrollPane, clippingBox] = ancestors;
    givePaneVerticalBounds(scrollPane, 100, 400);
    givePaneVerticalBounds(clippingBox, 150, 350);

    const { wrapper } = await openAndGetConfig({}, true, mountPoint);

    // Counting the clipping box would have tightened this to 150…350.
    expect(lastSizeOptions().boundary).toMatchObject({ y: 100, height: 300 });
    expect(lastFlipOptions().boundary).toMatchObject({ y: 100, height: 300 });

    wrapper.unmount();
  });

  it("falls back to the clipping ancestors without a scrollable ancestor", async () => {
    const { wrapper } = await openAndGetConfig();

    expect(lastSizeOptions().boundary).toBe("clippingAncestors");
    expect(lastFlipOptions().boundary).toBe("clippingAncestors");

    wrapper.unmount();
  });

  it("caps the content at the space left in the boundary", async () => {
    const { wrapper } = await openAndGetConfig();

    expect(applySizeWith(420).style.maxHeight).toBe("420px");

    wrapper.unmount();
  });

  it("never shrinks the content below the minimum height", async () => {
    const { wrapper } = await openAndGetConfig();

    // Overshooting the boundary on purpose: the leftover overflow is what makes
    // `flip()` move the content when a side is genuinely too small for it.
    expect(applySizeWith(12).style.maxHeight).toBe("150px");

    wrapper.unmount();
  });

  it("caps nothing when the content will not shrink into the space", async () => {
    const { wrapper } = await openAndGetConfig();

    expect(applySizeWith(200, 400).style.maxHeight).toBe("");

    wrapper.unmount();
  });

  it("hides the content when the reference is fully clipped", async () => {
    computePositionMock.mockResolvedValue({
      x: 10,
      y: 20,
      placement: "bottom-start",
      strategy: "fixed",
      middlewareData: { hide: { referenceHidden: true } },
    });

    const { wrapper } = await openAndGetConfig();

    const content = document.querySelector(".mt-floating-ui__content") as HTMLElement;
    expect(content.style.visibility).toBe("hidden");

    wrapper.unmount();
  });

  it("shows the content again when the reference is visible", async () => {
    computePositionMock.mockResolvedValue({
      x: 10,
      y: 20,
      placement: "bottom-start",
      strategy: "fixed",
      middlewareData: { hide: { referenceHidden: false } },
    });

    const { wrapper } = await openAndGetConfig();

    const content = document.querySelector(".mt-floating-ui__content") as HTMLElement;
    expect(content.style.visibility).toBe("visible");

    wrapper.unmount();
  });

  it("keeps the content visible for a reference without a measurable size", async () => {
    computePositionMock.mockResolvedValue({
      x: 10,
      y: 20,
      placement: "bottom-start",
      strategy: "fixed",
      middlewareData: { hide: { referenceHidden: true } },
    });

    const { wrapper } = await openAndGetConfig({}, false);

    const content = document.querySelector(".mt-floating-ui__content") as HTMLElement;
    expect(content.style.visibility).toBe("visible");

    wrapper.unmount();
  });
});
