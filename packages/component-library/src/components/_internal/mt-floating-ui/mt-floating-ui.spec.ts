import { mount } from "@vue/test-utils";
import MtFloatingUi from "./mt-floating-ui.vue";
import flushPromises from "flush-promises";

// mock resizeOvserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
};

function createWrapper() {
  return mount(MtFloatingUi, {
    attachTo: document.getElementById("appWrapper")!,
    slots: {
      trigger: `<div id="triggerSlotContent">Slot content for "trigger" slot</div>`,
      default: `<div id="defaultSlotContent">Slot content for "default" slot</div>`,
    },
    props: {
      isOpened: false,
    },
  });
}

describe("mt-floating-ui", () => {
  let wrapper: undefined | ReturnType<typeof createWrapper>;

  // create app wrapper
  let appWrapper = document.createElement("div");
  appWrapper.setAttribute("id", "appWrapper");
  document.body.appendChild(appWrapper);

  beforeEach(async () => {
    if (wrapper) {
      wrapper.unmount();
    }
    await flushPromises();

    document.body.innerHTML = '<div id="app"></div>';
    appWrapper = document.createElement("div");
    appWrapper.setAttribute("id", "appWrapper");
    document.body.appendChild(appWrapper);
  });

  it("should render the component", () => {
    wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the trigger slot", async () => {
    wrapper = createWrapper();

    const triggerSlot = wrapper.find("#triggerSlotContent");
    expect(triggerSlot.exists()).toBeTruthy();
    expect(triggerSlot.text()).toBe('Slot content for "trigger" slot');
  });

  it("should not render the content when floating UI is closed", () => {
    wrapper = createWrapper();

    const contentSlotContent = wrapper.find("#defaultSlotContent");

    expect(contentSlotContent.exists()).toBeFalsy();
  });

  it("should render the content when floating UI gets opened", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true,
    });

    const contentSlotContent = document.querySelector("#defaultSlotContent");
    expect(contentSlotContent).toBeTruthy();
    expect(contentSlotContent?.textContent).toBe('Slot content for "default" slot');
  });

  it("should not render the arrow when prop is not set", () => {
    wrapper = createWrapper();

    const arrow = wrapper.find(".mt-floating-ui__arrow");

    expect(arrow.exists()).toBeFalsy();
  });

  it("should render the arrow when prop is set", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      showArrow: true,
      isOpened: true,
    });

    const arrow = document.querySelector(".mt-floating-ui__arrow");

    expect(arrow).toBeTruthy();
  });

  it("should mount the floating ui to the document body", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true,
    });

    await flushPromises();

    const floatingUi = document.querySelector(".mt-floating-ui");
    const floatingUiContent = document.querySelector(".mt-floating-ui__content");

    expect(document.querySelector("#appWrapper")!.contains(floatingUi)).toBeTruthy(); // won't get teleported, so it's still in the app wrapper
    expect(document.querySelector("#appWrapper")!.contains(floatingUiContent)).toBeFalsy(); // will get teleported to the body, so it's outside the app wrapper
    expect(floatingUiContent!.parentElement!.tagName).toBe("BODY");
  });

  it("should unmount the floating ui to the document body", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true,
    });

    wrapper.unmount();

    await flushPromises();

    const floatingUi = document.querySelector(".mt-floating-ui");
    const floatingUiContent = document.querySelector(".mt-floating-ui__content");

    expect(floatingUi).toBeNull();
    expect(floatingUiContent).toBeNull();
  });

  it("should match reference width when matchReferenceWidth prop is true", async () => {
    wrapper = createWrapper();

    // Set a specific width for the trigger element to test against
    const triggerElement = wrapper.find(".mt-floating-ui__trigger").element as HTMLElement;
    triggerElement.style.width = "200px";
    // Mock getBoundingClientRect to return the expected width
    triggerElement.getBoundingClientRect = vi.fn(() => ({
      width: 200,
      height: 50,
      top: 0,
      left: 0,
      bottom: 50,
      right: 200,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }));

    await wrapper.setProps({
      isOpened: true,
      matchReferenceWidth: true,
    });

    await flushPromises();

    // Give some time for floating-ui to compute
    await new Promise((resolve) => setTimeout(resolve, 50));

    const floatingUiContent = document.querySelector(".mt-floating-ui__content") as HTMLElement;

    expect(floatingUiContent).toBeTruthy();
    expect(floatingUiContent.style.width).toBe("200px");
  });

  it("should not set width when matchReferenceWidth prop is false or not set", async () => {
    wrapper = createWrapper();

    // Set a specific width for the trigger element
    const triggerElement = wrapper.find(".mt-floating-ui__trigger").element as HTMLElement;
    triggerElement.style.width = "200px";

    await wrapper.setProps({
      isOpened: true,
      matchReferenceWidth: false,
    });

    await flushPromises();

    const floatingUiContent = document.querySelector(".mt-floating-ui__content") as HTMLElement;

    expect(floatingUiContent).toBeTruthy();
    expect(floatingUiContent.style.width).toBe("");
  });
});
