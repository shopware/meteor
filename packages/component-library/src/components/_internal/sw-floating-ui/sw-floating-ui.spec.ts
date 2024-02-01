import { mount, Wrapper } from "@vue/test-utils";
import SwFloatingUi from "./sw-floating-ui.vue";

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
  return mount(SwFloatingUi, {
    attachTo: document.getElementById("app")!,
    slots: {
      trigger: `<div id="triggerSlotContent">Slot content for "trigger" slot</div>`,
      default: `<div id="defaultSlotContent">Slot content for "default" slot</div>`,
    },
    propsData: {
      isOpened: false
    },
    mocks: {}
  });
}

describe("sw-floating-ui", () => {
  let wrapper: Wrapper<SwFloatingUi>;

  // create app wrapper
  const appWrapper = document.createElement("div");
  appWrapper.setAttribute("id", "appWrapper");
  document.body.appendChild(appWrapper);

  beforeEach(() => {
    appWrapper.innerHTML = '<div id="app"></div>';
  });

  afterEach(async () => {
    if (wrapper) {
      await wrapper.destroy();
    }
  })

  it("should render the component", () => {
    wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the trigger slot", async () => {
    wrapper = createWrapper();

    const triggerSlot = wrapper.find("#triggerSlotContent");
    expect(triggerSlot.exists()).toBe(true);
    expect(triggerSlot.text()).toBe("Slot content for \"trigger\" slot");
  })

  it("should not render the content when floating UI is closed", () => {
    wrapper = createWrapper();

    const contentSlotContent = wrapper.find("#defaultSlotContent");

    expect(contentSlotContent.exists()).toBe(false);
  });

  it("should render the content when floating UI gets opened", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true
    })

    const contentSlotContent = wrapper.find("#defaultSlotContent");
    expect(contentSlotContent.exists()).toBe(true);
    expect(contentSlotContent.text()).toBe("Slot content for \"default\" slot");
  });

  it("should not render the arrow when prop is not set", () => {
    wrapper = createWrapper();

    const arrow = wrapper.find(".sw-floating-ui__arrow");

    expect(arrow.exists()).toBe(false);
  });

  it.only("should render the arrow when prop is set", async () => {
    wrapper = createWrapper();
    
    await wrapper.setProps({
      showArrow: true,
      isOpened: true,
    });

    const arrow = wrapper.find(".sw-floating-ui__arrow");

    expect(arrow.exists()).toBe(true);
  });

  it("should mount the floating ui to the document body", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true
    });

    const floatingUi = document.querySelector(".sw-floating-ui");
    const floatingUiContent = document.querySelector(".sw-floating-ui__content");

    expect(document.querySelector('#appWrapper')!.contains(floatingUi)).toBeTruthy();
    expect(document.querySelector('#appWrapper')!.contains(floatingUiContent)).toBeFalsy();
    expect(floatingUiContent!.parentElement!.tagName).toBe("BODY");
  })

  it("should unmount the floating ui to the document body", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      isOpened: true
    });

    await wrapper.destroy();
   
    const floatingUi = document.querySelector(".sw-floating-ui");
    const floatingUiContent = document.querySelector(".sw-floating-ui__content");

    expect(floatingUi).toBeNull();
    expect(floatingUiContent).toBeNull();
  })
});