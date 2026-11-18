import { ref, watchEffect } from "vue";

const STORAGE_KEY = "playground-admin-proto-colors";

export type ProtoColors = "old" | "new" | "contrast";

export const PROTO_COLORS: ProtoColors[] = ["old", "new", "contrast"];

const stored = localStorage.getItem(STORAGE_KEY);
const palette = ref<ProtoColors>(
  PROTO_COLORS.includes(stored as ProtoColors)
    ? (stored as ProtoColors)
    : "new",
);

watchEffect(() => {
  const root = document.documentElement;
  if (palette.value === "old") root.removeAttribute("data-proto-colors");
  else root.setAttribute("data-proto-colors", palette.value);
  localStorage.setItem(STORAGE_KEY, palette.value);
});

/**
 * Which colors apply: the current ones, the prototype of the new palettes, or its contrast mode,
 * which adjusts the tokens for WCAG 2.1 AA. Kept in the browser.
 */
export function useProtoColors() {
  return palette;
}
