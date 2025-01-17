import useScrollPossibilitiesClasses from "./useScrollPossibilitiesClasses";
import { mount } from "@vue/test-utils";
import { ref, onMounted } from "vue";

// mock throttle
vi.mock("@/utils/throttle", () => ({
  throttle: vi.fn((fn) => fn),
}));

// mock resizeObserver callbackFn for manual calling
let resizeObserverCallbackFn: () => void = () => {};

const createWrapper = async ({
  clientWidth = 0,
  clientHeight = 0,
  scrollWidth = 0,
  scrollHeight = 0,
  scrollTop = 0,
  scrollLeft = 0,
  offsetWidth = 0,
  offsetHeight = 0,
} = {}) => {
  // @ts-expect-error
  // mock resizeOvserver
  global.ResizeObserver = class ResizeObserver {
    constructor(callbackFn: () => void) {
      resizeObserverCallbackFn = callbackFn;
    }

    observe() {
      // do nothing
      return vi.fn();
    }
    unobserve() {
      // do nothing
      return vi.fn();
    }
    disconnect() {
      // do nothing
      return vi.fn();
    }
  };

  const mockComponent = {
    template: `
      <div id="parentElement" ref="parentElement">
        <div id="exampleElement" ref="exampleElement">My example Element</div>
      </div>
    `,
    setup() {
      const exampleElement = ref();
      const parentElement = ref();

      onMounted(() => {
        vi.spyOn(exampleElement.value, "clientWidth", "get").mockImplementation(() => clientWidth);
        vi.spyOn(exampleElement.value, "clientHeight", "get").mockImplementation(
          () => clientHeight,
        );
        vi.spyOn(exampleElement.value, "scrollWidth", "get").mockImplementation(() => scrollWidth);
        vi.spyOn(exampleElement.value, "scrollHeight", "get").mockImplementation(
          () => scrollHeight,
        );
        vi.spyOn(exampleElement.value, "scrollTop", "get").mockImplementation(() => scrollTop);
        vi.spyOn(exampleElement.value, "scrollLeft", "get").mockImplementation(() => scrollLeft);
        vi.spyOn(exampleElement.value, "offsetWidth", "get").mockImplementation(() => offsetWidth);
        vi.spyOn(exampleElement.value, "offsetHeight", "get").mockImplementation(
          () => offsetHeight,
        );

        vi.spyOn(exampleElement.value, "addEventListener").mockImplementation(() => {});
        vi.spyOn(window, "addEventListener").mockImplementation(() => {});
      });

      useScrollPossibilitiesClasses(exampleElement);

      return { exampleElement, parentElement };
    },
  };

  const wrapper = mount(mockComponent);

  await wrapper.vm.$nextTick();

  return wrapper;
};

describe("test the composable useScrollPossibilitiesClasses", () => {
  it("should use the composable in a component", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.vm).toBeDefined();
  });

  describe("should set the correct data attributes to element", () => {
    it("should set the data attributes for scrolling right and bottom", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      const exampleElement = wrapper.find("#exampleElement");
      const attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBe("");
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBeUndefined();
    });

    it("should set the data attributes for scrolling left and bottom", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 500,
      });

      const exampleElement = wrapper.find("#exampleElement");
      const attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBeUndefined();
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBe("");
    });

    it("should set the data attributes for scrolling left and top", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 700,
        scrollLeft: 500,
      });

      const exampleElement = wrapper.find("#exampleElement");
      const attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBe("");
      expect(attr["data-scroll-right"]).toBeUndefined();
      expect(attr["data-scroll-bottom"]).toBeUndefined();
      expect(attr["data-scroll-left"]).toBe("");
    });

    it("should set the data attributes for scrolling top, right, bottom and left", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 500,
        scrollLeft: 400,
      });

      const exampleElement = wrapper.find("#exampleElement");
      const attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBe("");
      expect(attr["data-scroll-right"]).toBe("");
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBe("");
    });
  });

  describe("should set the correct css variable to parent element for scrollbar", () => {
    it("should not set values for scrollbar", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      const parentElement = wrapper.find("#parentElement");
      const style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 0px;");
      expect(style).toContain("--scrollbar-height: 0px;");
    });

    it("should set 10px value for scrollbar height", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 510,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      const parentElement = wrapper.find("#parentElement");
      const style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 0px;");
      expect(style).toContain("--scrollbar-height: 10px;");
    });

    it("should set 10px value for scrollbar width", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 710,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      const parentElement = wrapper.find("#parentElement");
      const style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 10px;");
      expect(style).toContain("--scrollbar-height: 0px;");
    });

    it("should set 10px value for scrollbar height and width", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 710,
        offsetHeight: 510,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      const parentElement = wrapper.find("#parentElement");
      const style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 10px;");
      expect(style).toContain("--scrollbar-height: 10px;");
    });
  });

  describe("should update the values on different events", () => {
    it("should update all attributes and styles on updated", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      // check before
      let exampleElement = wrapper.find("#exampleElement");
      let attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBe("");
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBeUndefined();

      let parentElement = wrapper.find("#parentElement");
      let style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 0px;");
      expect(style).toContain("--scrollbar-height: 0px;");

      // update values
      vi.spyOn(exampleElement.element, "scrollLeft", "get").mockImplementation(() => 500);
      // @ts-expect-error
      vi.spyOn(exampleElement.element, "offsetWidth", "get").mockImplementation(() => 750);

      await wrapper.vm.$forceUpdate();
      await wrapper.vm.$nextTick();

      // check after
      exampleElement = wrapper.find("#exampleElement");
      attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBeUndefined();
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBe("");

      parentElement = wrapper.find("#parentElement");
      style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 50px;");
      expect(style).toContain("--scrollbar-height: 0px;");
    });

    it("should update all attributes and styles on scroll", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      // check before
      let exampleElement = wrapper.find("#exampleElement");
      let attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBe("");
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBeUndefined();

      let parentElement = wrapper.find("#parentElement");
      let style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 0px;");
      expect(style).toContain("--scrollbar-height: 0px;");

      // update values by emulating scroll
      vi.spyOn(exampleElement.element, "scrollLeft", "get").mockImplementation(() => 500);
      // @ts-expect-error
      vi.spyOn(exampleElement.element, "offsetWidth", "get").mockImplementation(() => 750);

      // @ts-expect-error
      const triggerScrollEvent = exampleElement.element.addEventListener.mock.lastCall[1];
      triggerScrollEvent();

      // check after
      exampleElement = wrapper.find("#exampleElement");
      attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBeUndefined();
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBe("");

      parentElement = wrapper.find("#parentElement");
      style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 50px;");
      expect(style).toContain("--scrollbar-height: 0px;");
    });

    it("should update all attributes and styles on window resize", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      // check before
      let exampleElement = wrapper.find("#exampleElement");
      let attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBe("");
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBeUndefined();

      let parentElement = wrapper.find("#parentElement");
      let style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 0px;");
      expect(style).toContain("--scrollbar-height: 0px;");

      // update values by emulating window resize
      vi.spyOn(exampleElement.element, "scrollLeft", "get").mockImplementation(() => 500);
      // @ts-expect-error
      vi.spyOn(exampleElement.element, "offsetWidth", "get").mockImplementation(() => 750);

      // @ts-expect-error
      const triggerWindowResizeEvent = window.addEventListener.mock.lastCall[1];
      triggerWindowResizeEvent();

      // check after
      exampleElement = wrapper.find("#exampleElement");
      attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBeUndefined();
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBe("");

      parentElement = wrapper.find("#parentElement");
      style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 50px;");
      expect(style).toContain("--scrollbar-height: 0px;");
    });

    it("should update all attributes and styles on element resize", async () => {
      const wrapper = await createWrapper({
        clientWidth: 700,
        clientHeight: 500,
        offsetWidth: 700,
        offsetHeight: 500,
        scrollWidth: 1200,
        scrollHeight: 1200,
        scrollTop: 0,
        scrollLeft: 0,
      });

      // check before
      let exampleElement = wrapper.find("#exampleElement");
      let attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBe("");
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBeUndefined();

      let parentElement = wrapper.find("#parentElement");
      let style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 0px;");
      expect(style).toContain("--scrollbar-height: 0px;");

      // update values by emulating resize observer change
      vi.spyOn(exampleElement.element, "scrollLeft", "get").mockImplementation(() => 500);
      // @ts-expect-error
      vi.spyOn(exampleElement.element, "offsetWidth", "get").mockImplementation(() => 750);

      resizeObserverCallbackFn();
      await wrapper.vm.$nextTick();

      // check after
      exampleElement = wrapper.find("#exampleElement");
      attr = exampleElement.attributes();

      expect(attr["data-scroll-top"]).toBeUndefined();
      expect(attr["data-scroll-right"]).toBeUndefined();
      expect(attr["data-scroll-bottom"]).toBe("");
      expect(attr["data-scroll-left"]).toBe("");

      parentElement = wrapper.find("#parentElement");
      style = parentElement.attributes().style;

      expect(style).toContain("--scrollbar-width: 50px;");
      expect(style).toContain("--scrollbar-height: 0px;");
    });
  });
});
