import { Comment, Fragment, Text, isVNode, type VNodeChild } from "vue";

/** A slot function as exposed by `useSlots()` or typed via `defineSlots()`. */
type SlotLike = (...args: any[]) => unknown;

export function hasSlotContent(slot: SlotLike | undefined | null, props: any = {}) {
  return !isEmpty(slot?.(props) as VNodeChild);
}

/**
 * Comments (left by `v-if`), empty text and fragments (rendered by `v-for`) whose children
 * are all empty render nothing.
 */
function isEmpty(node: VNodeChild): boolean {
  if (Array.isArray(node)) return node.every(isEmpty);
  if (!isVNode(node)) return node == null || typeof node === "boolean" || node === "";
  if (node.type === Fragment) return isEmpty(node.children as VNodeChild);

  return node.type === Comment || (node.type === Text && !node.children?.length);
}
