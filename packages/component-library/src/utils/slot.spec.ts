import { render } from "@testing-library/vue";
import { defineComponent } from "vue";
import { hasSlotContent } from "./slot";

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
