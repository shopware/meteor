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
      await wrapper.unmount();
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

    const contentSlotContent = wrapper.find("#defaultSlotContent");
    expect(contentSlotContent.exists()).toBeTruthy();
    expect(contentSlotContent.text()).toBe('Slot content for "default" slot');
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

    const arrow = wrapper.find(".mt-floating-ui__arrow");

    expect(arrow.exists()).toBeTruthy();
  });

  it("should mount the floating ui to the document body", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true,
    });

    await flushPromises();

    const floatingUi = document.querySelector(".mt-floating-ui");
    const floatingUiContent = document.querySelector(".mt-floating-ui__content");

    expect(document.querySelector("#appWrapper")!.contains(floatingUi)).toBeTruthy();
    expect(document.querySelector("#appWrapper")!.contains(floatingUiContent)).toBeFalsy();
    expect(floatingUiContent!.parentElement!.tagName).toBe("BODY");
  });

  it("should unmount the floating ui to the document body", async () => {
    await wrapper?.unmount();
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true,
    });

    await wrapper.unmount();

    await flushPromises();

    const floatingUi = document.querySelector(".mt-floating-ui");
    const floatingUiContent = document.querySelector(".mt-floating-ui__content");

    expect(floatingUi).toBeNull();
    expect(floatingUiContent).toBeNull();
  });
});
