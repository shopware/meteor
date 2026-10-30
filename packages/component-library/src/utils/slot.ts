import { Comment, Fragment, Text, isVNode, type VNode, type VNodeChild } from "vue";

/** A slot function as exposed by `useSlots()` or typed via `defineSlots()`. */
type SlotLike = (...args: any[]) => unknown;

export function hasSlotContent(slot: SlotLike | undefined | null, props: any = {}) {
  return hasRenderedContent(slot?.(props) as VNodeChild);
}

/** Whether rendered slot content shows anything. */
export function hasRenderedContent(node: VNodeChild) {
  return !isEmpty(node);
}

/**
 * The first component at the top of rendered slot content whose definition carries the marker,
 * such as `__MT_PANEL__`. It looks through fragments (`v-for`, `<template>`), but not into elements
 * or other components.
 */
export function findSlotComponent(node: VNodeChild, marker: string): VNode | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findSlotComponent(child, marker);
      if (found) return found;
    }

    return undefined;
  }

  if (!isVNode(node)) return undefined;
  if (node.type === Fragment) return findSlotComponent(node.children as VNodeChild, marker);

  return typeof node.type === "object" && marker in node.type ? node : undefined;
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
