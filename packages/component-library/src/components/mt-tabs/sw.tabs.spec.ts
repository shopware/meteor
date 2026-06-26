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

  describe("default-item prop watcher", () => {
    it("should set active item on mount when default-item is provided", async () => {
      wrapper = await createWrapper(undefined, {
        defaultItem: "bar",
      });

      expect(wrapper.vm.activeItemName).toBe("bar");
      expect(wrapper.find('.mt-tabs__item[data-item-name="bar"]').classes()).toContain(
        "mt-tabs__item--active",
      );
    });

    it("should update active item when default-item prop changes", async () => {
      wrapper = await createWrapper(undefined, {
        defaultItem: "foo",
      });

      // Initially should be set to foo
      expect(wrapper.vm.activeItemName).toBe("foo");
      expect(wrapper.find('.mt-tabs__item[data-item-name="foo"]').classes()).toContain(
        "mt-tabs__item--active",
      );

      // Change defaultItem prop
      await wrapper.setProps({ defaultItem: "bar" });
      await wrapper.vm.$nextTick();

      // Should now be set to bar
      expect(wrapper.vm.activeItemName).toBe("bar");
      expect(wrapper.find('.mt-tabs__item[data-item-name="bar"]').classes()).toContain(
        "mt-tabs__item--active",
      );
      expect(wrapper.find('.mt-tabs__item[data-item-name="foo"]').classes()).not.toContain(
        "mt-tabs__item--active",
      );
    });
  });
});
