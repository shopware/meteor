import { computed, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { useConfirm } from "./useConfirm";

/**
 * Tracks the unsaved changes of an edited entity: whether it differs from its last saved state, a
 * way to discard them, and a confirmation before navigating to another route with them.
 */
export function useUnsavedChanges<Entity>(draft: Ref<Entity | null>) {
  const { t } = useI18n();
  const { confirm } = useConfirm();
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

  function confirmLeave() {
    return (
      !isDirty.value ||
      confirm({
        title: t("common.discardTitle"),
        text: t("common.discardText"),
        cancelLabel: t("common.keepEditing"),
        confirmLabel: t("common.discardChanges"),
        variant: "critical",
      })
    );
  }

  // Also when the route only changes its params, such as from one product to the next.
  onBeforeRouteLeave(confirmLeave);
  onBeforeRouteUpdate(confirmLeave);

  return { isDirty, markSaved, discard };
}
