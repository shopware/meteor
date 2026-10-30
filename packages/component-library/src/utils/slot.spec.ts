import { render } from "@testing-library/vue";
import { defineComponent, type VNode, type VNodeChild } from "vue";
import { findSlotComponent, hasSlotContent } from "./slot";

function hasDefaultSlotContent(template: string, items: { id: number; visible: boolean }[] = []) {
  let result: boolean | undefined;

  const Probe = defineComponent({
    setup(_, { slots }) {
      return () => {
        result = hasSlotContent(slots.default);
        return null;
      };
    },
  });

  render({
    components: { Probe },
    data: () => ({ items }),
    template: `<Probe>${template}</Probe>`,
  });

  return result;
}

const list = `
  <template v-for="item in items" :key="item.id">
    <span v-if="item.visible">Item {{ item.id }}</span>
  </template>
`;

describe("hasSlotContent", () => {
  it("treats an element hidden by v-if as empty", () => {
    // ACT
    const result = hasDefaultSlotContent(`<span v-if="false">Error</span>`);

    // ASSERT
    expect(result).toBe(false);
  });

  it("treats a v-for whose items are all hidden by v-if as empty", () => {
    // ACT
    const result = hasDefaultSlotContent(list, [
      { id: 1, visible: false },
      { id: 2, visible: false },
    ]);

    // ASSERT
    expect(result).toBe(false);
  });

  it("treats a v-for with one shown item as content", () => {
    // ACT
    const result = hasDefaultSlotContent(list, [
      { id: 1, visible: false },
      { id: 2, visible: true },
    ]);

    // ASSERT
    expect(result).toBe(true);
  });
});

describe("findSlotComponent", () => {
  const Marked = defineComponent({
    __MARKED__: true,
    props: { label: { type: String, default: undefined } },
    template: "<div />",
  });
  const Wrapper = defineComponent({
    components: { Marked },
    template: "<Marked label='Inside' />",
  });

  function findInSlot(template: string, data: Record<string, unknown> = {}) {
    let found: VNode | undefined;

    const Probe = defineComponent({
      setup(_, { slots }) {
        return () => {
          found = findSlotComponent(slots.default?.() as VNodeChild, "__MARKED__");
          return null;
        };
      },
    });

    render({
      components: { Probe, Marked, Wrapper },
      data: () => data,
      template: `<Probe>${template}</Probe>`,
    });

    return found;
  }

  it("finds the marked component at the top of the slot with its props as written", () => {
    // ACT
    const found = findInSlot(`<Marked label="Assistant" />`);

    // ASSERT
    expect(found?.props).toEqual({ label: "Assistant" });
  });

  it("looks through v-if and fragments", () => {
    // ACT
    const found = findInSlot(
      `<span v-if="false" /><template v-for="item in items" :key="item"><Marked :label="item" /></template>`,
      { items: ["First", "Second"] },
    );

    // ASSERT
    expect(found?.props?.label).toBe("First");
  });

  it("doesn't look into other components", () => {
    // ACT
    const found = findInSlot(`<Wrapper />`);

    // ASSERT
    expect(found).toBeUndefined();
  });
});
