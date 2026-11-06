import { computed, ref, type Ref } from "vue";
import { useUnsavedChanges } from "@shopware-ag/meteor-component-library";

/**
 * Tracks the unsaved changes of an edited entity: whether it differs from its last saved state and
 * a way to discard them. The shell asks before a navigation or a reload loses them.
 */
export function useDraft<Entity>(draft: Ref<Entity | null>) {
  const saved = ref("");

  const isDirty = computed(
    () => draft.value !== null && JSON.stringify(draft.value) !== saved.value,
  );

  /** Makes the current state the saved state, after loading or saving. */
  function markSaved() {
    saved.value = JSON.stringify(draft.value);
  }

  function discard() {
    draft.value = JSON.parse(saved.value || "null");
  }

  useUnsavedChanges(isDirty);

  return { isDirty, markSaved, discard };
}
