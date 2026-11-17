import { reactive, watch } from "vue";

const STORAGE_KEY = "playground-admin-closed-announcements";

const closed = reactive(
  new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")),
);

watch(closed, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...value]));
});

/** The announcements the user closed, kept in the browser. A new id shows the announcement again. */
export function useClosedAnnouncements() {
  return {
    isClosed: (id: string) => closed.has(id),
    close: (id: string) => closed.add(id),
  };
}

export function resetClosedAnnouncements() {
  closed.clear();
}
