import { tabbable } from "tabbable";

/** The elements inside the root that the Tab key reaches, in tab order. */
export function getTabbables(root: HTMLElement) {
  return tabbable(root, { displayCheck: "full-native" });
}
