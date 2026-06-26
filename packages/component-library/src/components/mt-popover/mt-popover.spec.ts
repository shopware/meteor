import { mount } from "@vue/test-utils";
import MtPopover from "./mt-popover.vue";
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

async function createWrapper(
  {
    slots,
    disableInitialOpen,
  }: {
    disableInitialOpen?: boolean;
    slots?: any;
  } = {
    slots: {},
    disableInitialOpen: false,
  },
) {
  const wrapper = mount(MtPopover, {
    slots: {
      "popover-items__base": `
          <div class="base-view">
            <span>Base view content</span>
            <span id="goToExampleView" @click="params.changeView('example')">Go to example view</span>
            <span id="goToExampleWithAnotherChildView" @click="params.changeView('example_with_another_child')">Go to example with another child view</span>
          </div>
      `,
      "popover-items__example": `
          <div class="example-view">
            <span>Example view content</span>
            <span id="goToBaseView" @click="params.changeView('base')">Go to base view</span>
          </div>
      `,
      "popover-items__example_with_another_child": `
          <div class="example_with_another_child-view">
            <span>Example with another child view content</span>
            <span id="goToThirdLevelView" @click="params.changeView('example_third_level')">Go to third level view</span>
          </div>
      `,
      "popover-items__example_third_level": `
          <div class="example_third_level-view">
            <span>Example with third level view content</span>
            <span id="toToExampleWithAnotherChild" @click="params.changeView('example_with_another_child')">Go to example with another child view</span>
          </div>
      `,
      trigger: `
        <span
          class="trigger-slot"
          @click="params.toggleFloatingUi"
        >
          Trigger slot content
        </span>`,
      ...slots,
    },
    props: {
      title: "My default popover title",
      childViews: [
        { name: "example", title: "Example view title" },
        {
          name: "example_with_another_child",
          title: "Example view with another child title",
          childViews: [{ name: "example_third_level", title: "Example third level view title" }],
        },
      ],
    },
    attachTo: document.getElementById("appWrapper")!,
    mocks: {},
  });

  if (!disableInitialOpen) {
    // open the floating UI
    await wrapper.find(".trigger-slot").trigger("click");
  }

  return wrapper;
}

describe("mt-popover-item", () => {
  let wrapper: undefined | Awaited<ReturnType<typeof createWrapper>>;

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

  it("should render the component", async () => {
    wrapper = await createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the trigger slot content", async () => {
    wrapper = await createWrapper();

    expect(wrapper.find(".trigger-slot").exists()).toBeTruthy();
    expect(wrapper.find(".trigger-slot").text()).toBe("Trigger slot content");
  });

  it("should not render the trigger slot content when float is disabled", async () => {
    wrapper = await createWrapper({
      disableInitialOpen: true,
    });

    await wrapper.setProps({
      disableFloat: true,
    });

    expect(wrapper.find(".trigger-slot").exists()).toBeFalsy();
  });

  it("should render the popover directly when disable float", async () => {
    wrapper = await createWrapper({
      slots: {},
      disableInitialOpen: true,
    });

    await wrapper.setProps({
      disableFloat: true,
    });

    expect(document.querySelectorAll(".mt-popover__content")).toHaveLength(1);
    expect(wrapper.find(".mt-popover__content").text()).toContain("Base view content");
  });

  it("should open the floating UI with trigger click", async () => {
    wrapper = await createWrapper({
      slots: {},
      disableInitialOpen: true,
    });

    expect(wrapper.find(".mt-popover__content").exists()).toBeFalsy();

    await wrapper.find(".trigger-slot").trigger("click");

    expect(document.querySelectorAll(".mt-popover__content")).toHaveLength(1);
  });

  it("should close the floating UI with trigger click", async () => {
    wrapper = await createWrapper();

    await flushPromises();

    expect(document.querySelectorAll(".mt-popover__content")).toHaveLength(1);

    await wrapper.find(".trigger-slot").trigger("click");

    expect(document.querySelectorAll(".mt-popover__content")).toHaveLength(0);
  });

  it("should close the floating UI emit close event", async () => {
    wrapper = await createWrapper();

    expect(document.querySelectorAll(".mt-popover__content")).toHaveLength(1);

    const MtFloatingUi = wrapper.findComponent({ name: "MtFloatingUi" });

    MtFloatingUi.vm.onClickOutside(new MouseEvent("click"));
    await wrapper.vm.$nextTick();

    expect(document.querySelectorAll(".mt-popover__content")).toHaveLength(0);
  });

  it("should render the title", async () => {
    wrapper = await createWrapper();

    expect(document.querySelectorAll("h3")).toHaveLength(1);
    expect(document.querySelector("h3")?.textContent).toBe("My default popover title");
  });

  it("should use changeView to switch to example view", async () => {
    wrapper = await createWrapper();

    // check content rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Base view content",
    );

    // go to example view
    document.querySelector("#goToExampleView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check content rendering on example view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Example view content",
    );
  });

  it("should use changeView to switch back to base view", async () => {
    wrapper = await createWrapper();
    // check content rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Base view content",
    );

    // go to example view
    document.querySelector("#goToExampleView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check content rendering on example view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Example view content",
    );

    // go to example view
    document.querySelector("#goToBaseView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check content rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Base view content",
    );
  });

  it("should not render back button base view", async () => {
    wrapper = await createWrapper();

    expect(wrapper.find(".mt-popover__back-button").exists()).toBeFalsy();
  });

  it("should render back button on example view", async () => {
    wrapper = await createWrapper();

    // go to example view
    document.querySelector("#goToExampleView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    expect(document.querySelectorAll(".mt-popover__back-button")).toHaveLength(1);
  });

  it("should use back button to switch back to base view", async () => {
    wrapper = await createWrapper();
    // check content rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Base view content",
    );

    // go to example view
    document.querySelector("#goToExampleView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check content rendering on example view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Example view content",
    );

    // go to example view
    document.querySelector(".mt-popover__back-button")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check content rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Base view content",
    );
  });

  it("should render the title and content of base view", async () => {
    wrapper = await createWrapper();

    // check title rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "My default popover title",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "Example view title",
    );

    // check content rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Base view content",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "Example view content",
    );
  });

  it("should render the title and content of example view", async () => {
    wrapper = await createWrapper();

    // go to example view
    document.querySelector("#goToExampleView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check title rendering on example view
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "My default popover title",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Example view title",
    );

    // check content rendering on example view
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "Base view content",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Example view content",
    );
  });

  it("should render the title and content of third level view", async () => {
    wrapper = await createWrapper();

    // go to example with another child view
    document
      .querySelector("#goToExampleWithAnotherChildView")
      ?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // go to third level view
    document.querySelector("#goToThirdLevelView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check title rendering on third level view
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "My default popover title",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "Example view title",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Example third level view title",
    );

    // check content rendering on third level view
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "Base view content",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).not.toContain(
      "Example view content",
    );
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Example with third level view content",
    );
  });

  it("should go back from third level view to base view with back button", async () => {
    wrapper = await createWrapper();

    // go to example with another child view
    document
      .querySelector("#goToExampleWithAnotherChildView")
      ?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // go to third level view
    document.querySelector("#goToThirdLevelView")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // go back to base view with clicking back button twice
    document.querySelector(".mt-popover__back-button")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();
    document.querySelector(".mt-popover__back-button")?.dispatchEvent(new MouseEvent("click"));
    await flushPromises();

    // check title rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "My default popover title",
    );

    // check content rendering on base view
    expect(document.querySelector(".mt-popover__content")?.textContent).toContain(
      "Base view content",
    );
  });
});
