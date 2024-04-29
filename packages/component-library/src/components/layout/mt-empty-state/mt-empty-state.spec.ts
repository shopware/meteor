import { mount } from "@vue/test-utils";
import MtEmptyState from "./mt-empty-state.vue";

async function createWrapper(customOptions = {}, props = {}) {
  return mount(MtEmptyState, {
    props: {
      headline: "Foo",
      description: "Bar",
      ...props,
    },
    global: {
      stubs: {
        "mt-icon": true,
      },
    },
    ...customOptions,
  });
}

describe("mt-empty-state", () => {
  let wrapper: undefined | Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("should be a Vue.JS component", async () => {
    wrapper = await createWrapper();
    expect(wrapper.vm).toBeTruthy();
  });

  it("should render a headline", async () => {
    wrapper = await createWrapper();
    expect(wrapper.text()).toContain("Foo");
  });

  it("should render a description", async () => {
    wrapper = await createWrapper();
    expect(wrapper.text()).toContain("Bar");
  });

  it("should render an icon", async () => {
    wrapper = await createWrapper(undefined, {
      icon: "solid-chart-line-arrow",
    });
    const icon = wrapper.find("mt-icon-stub");
    expect(icon.exists()).toBeTruthy();
    expect(icon.attributes("name")).toBe("solid-chart-line-arrow");
  });

  it("should render a link", async () => {
    wrapper = await createWrapper(undefined, {
      linkHref: "https://storybook.js.org",
      linkText: "Learn more",
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("https://storybook.js.org");
    expect(link.text()).toBe("Learn more");
  });

  it("should render an action button", async () => {
    wrapper = await createWrapper(undefined, {
      buttonText: "Button text",
    });
    expect(wrapper.text()).toContain("Button text");
  });

  it("should emit a button-click event when the button is clicked", async () => {
    wrapper = await createWrapper(undefined, {
      buttonText: "Button text",
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("button-click")).toBeTruthy();
  });
});
