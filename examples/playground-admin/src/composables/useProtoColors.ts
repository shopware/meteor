import { ref, watchEffect } from "vue";

const STORAGE_KEY = "playground-admin-proto-colors";

const isNew = ref(localStorage.getItem(STORAGE_KEY) !== "old");

watchEffect(() => {
  document.documentElement.toggleAttribute("data-proto-colors", isNew.value);
  localStorage.setItem(STORAGE_KEY, isNew.value ? "new" : "old");
});

/** Whether the prototype of the new color palettes applies, kept in the browser. */
export function useProtoColors() {
  return isNew;
}
