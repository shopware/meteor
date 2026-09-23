import { Comment, Fragment, Text, createCommentVNode, createTextVNode, createVNode, h } from "vue";
import { hasSlotContent } from "./slot";

describe("hasSlotContent", () => {
  it("treats a missing slot as empty", () => {
    // ACT
    const result = hasSlotContent(undefined);

    // ASSERT
    expect(result).toBe(false);
  });

  it("treats a slot that renders only a comment as empty", () => {
    // ACT
    const result = hasSlotContent(() => [createCommentVNode("v-if")]);

    // ASSERT
    expect(result).toBe(false);
  });

  it("treats a slot that renders an element as content", () => {
    // ACT
    const result = hasSlotContent(() => [h("nav")]);

    // ASSERT
    expect(result).toBe(true);
  });

  it("treats a slot that renders text as content", () => {
    // ACT
    const result = hasSlotContent(() => [createTextVNode("Hello")]);

    // ASSERT
    expect(result).toBe(true);
  });

  it("treats a list that renders only comments as empty", () => {
    // ARRANGE
    const list = createVNode(Fragment, null, [
      createCommentVNode("v-if"),
      createCommentVNode("v-if"),
    ]);

    // ACT
    const result = hasSlotContent(() => [list]);

    // ASSERT
    expect(result).toBe(false);
  });

  it("treats a list that renders at least one element as content", () => {
    // ARRANGE
    const list = createVNode(Fragment, null, [createCommentVNode("v-if"), h("li")]);

    // ACT
    const result = hasSlotContent(() => [list]);

    // ASSERT
    expect(result).toBe(true);
  });

  it("treats nested empty lists as empty", () => {
    // ARRANGE
    const inner = createVNode(Fragment, null, [createCommentVNode("v-if")]);
    const outer = createVNode(Fragment, null, [inner, createVNode(Text, null, "")]);

    // ACT
    const result = hasSlotContent(() => [outer]);

    // ASSERT
    expect(result).toBe(false);
  });

  it("passes the slot props to the slot function", () => {
    // ARRANGE
    const slot = vi.fn(() => [createVNode(Comment)]);

    // ACT
    hasSlotContent(slot, { isMobile: true });

    // ASSERT
    expect(slot).toHaveBeenCalledWith({ isMobile: true });
  });
});
