import { Comment, Text, type Slot, type VNode, Fragment } from "vue";

function hasSlotContent(slot: Slot | undefined | null, props: any = {}) {
  return !isSlotEmpty(slot, props);
}

function isSlotEmpty(slot: Slot | undefined | null, props: any = {}) {
  return isVNodeEmpty(slot?.(props));
}

function isVNodeEmpty(vnode: VNode | VNode[] | undefined | null) {
  return (
    !vnode ||
    asArray(vnode).every(
      (vnode) =>
        vnode.type === Comment ||
        (vnode.type === Text && !vnode.children?.length) ||
        (vnode.type === Fragment && !vnode.children?.length),
    )
  );
}

function asArray<T>(arg: T | T[] | null) {
  return Array.isArray(arg) ? arg : arg !== null ? [arg] : [];
}

export default function useEmptySlotCheck() {
  return {
    hasSlotContent,
    isSlotEmpty,
  };
}
