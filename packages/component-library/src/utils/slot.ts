import { Comment, Text, type VNode, type VNodeArrayChildren, Fragment } from "vue";

/** A slot function as exposed by `useSlots()` or typed via `defineSlots()`. */
type SlotLike = (...args: any[]) => unknown;

export function hasSlotContent(slot: SlotLike | undefined | null, props: any = {}) {
  return !isSlotEmpty(slot, props);
}

function isSlotEmpty(slot: SlotLike | undefined | null, props: any = {}) {
  return isVNodeEmpty(slot?.(props) as VNode | VNode[] | undefined);
}

function isVNodeEmpty(vnode: VNode | VNode[] | undefined | null): boolean {
  return (
    !vnode ||
    asArray(vnode).every(
      (vnode) =>
        vnode.type === Comment ||
        (vnode.type === Text && !vnode.children?.length) ||
        (vnode.type === Fragment && isFragmentEmpty(vnode)),
    )
  );
}

/**
 * A fragment (for example rendered by `v-for`) is empty when it has no children or
 * when every child is empty itself, such as the comments left behind by `v-if`.
 */
function isFragmentEmpty(vnode: VNode): boolean {
  const children = vnode.children as VNodeArrayChildren | null;
  if (!children?.length) return true;

  return children.every((child) => {
    if (child == null || child === "") return true;
    if (typeof child !== "object") return false;

    return isVNodeEmpty(child as VNode | VNode[]);
  });
}

function asArray<T>(arg: T | T[] | null) {
  return Array.isArray(arg) ? arg : arg !== null ? [arg] : [];
}
