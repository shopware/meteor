import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import type { ComputePositionConfig, ComputePositionReturn, Middleware } from "@floating-ui/dom";

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

function createWrapper(props: Record<string, unknown> = {}) {
  const appWrapper = document.createElement("div");
  appWrapper.setAttribute("id", "appWrapper");
  document.body.appendChild(appWrapper);

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

async function openAndGetConfig(props: Record<string, unknown> = {}) {
  const wrapper = createWrapper(props);
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

describe("mt-floating-ui positioning config", () => {
  beforeEach(() => {
    computePositionMock.mockClear();
    document.body.innerHTML = "";
  });

  it("includes the hide middleware so the content vanishes with its reference", async () => {
    const { wrapper, config } = await openAndGetConfig();

    expect(middlewareNames(config)).toContain("hide");

    wrapper.unmount();
  });

  it("still applies consumer placement overrides", async () => {
    const { wrapper, config } = await openAndGetConfig({
      floatingUiOptions: { placement: "top-end" },
    });

    expect(config.placement).toBe("top-end");

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
});
