import { mount } from "@vue/test-utils";
import MtTabs from "./mt-tabs.vue";

async function createWrapper(customOptions = {}, props = {}) {
  return mount(MtTabs, {
    props: {
      items: [
        {
          name: "foo",
          label: "Foo",
        },
        {
          name: "bar",
          label: "Bar",
        },
      ],
      ...props,
    },
    global: {
      stubs: {
        "mt-icon": true,
      },
      mocks: {
        $device: {
          onResize: () => {},
          removeResizeListener: () => {},
        },
      },
    },
    ...customOptions,
  });
}

describe("src/app/component/navigation/mt-tabs", () => {
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

  it("should emit on clicked tab", async () => {
    wrapper = await createWrapper();

    await wrapper.find(".mt-tabs__item[data-item-name=bar]").trigger("click");

    expect(wrapper.emitted("new-item-active")?.[0]).toStrictEqual(["bar"]);
  });

  it("should emit on clicked vertical tab", async () => {
    wrapper = await createWrapper(undefined, {
      vertical: true,
    });

    await wrapper.find(".mt-tabs__item[data-item-name=bar]").trigger("click");

    expect(wrapper.emitted("new-item-active")?.[0]).toStrictEqual(["bar"]);
  });
});
