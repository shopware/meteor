import { ref } from "vue";

const STORAGE_KEY = "playground-admin-closed-announcement";

/**
 * Whether the user closed the announcement with this id, kept in the browser. A new id shows the
 * announcement again.
 */
export function useClosedAnnouncement(id: string) {
  const isClosed = ref(localStorage.getItem(STORAGE_KEY) === id);

  function close() {
    localStorage.setItem(STORAGE_KEY, id);
    isClosed.value = true;
  }

  return { isClosed, close };
}
