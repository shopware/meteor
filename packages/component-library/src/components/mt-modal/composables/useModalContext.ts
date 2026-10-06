import { inject, onUnmounted, watch, type InjectionKey, type Ref } from "vue";

interface StateDefinition {
  isOpen: Ref<boolean>;
  setIsOpen: (value: boolean) => void;
  closable: Ref<boolean>;
  backdrop: Readonly<Ref<HTMLElement | null>>;
}

export const DialogContext = Symbol("DialogContext") as InjectionKey<StateDefinition>;

export function useModalContext(component: string) {
  const context = inject(DialogContext, null);

  if (context === null) {
    const error = new Error(`<${component} /> is missing a parent <mt-modal-root /> component.`);
    if (Error.captureStackTrace) Error.captureStackTrace(error, useModalContext);

    throw error;
  }

  return context;
}

let openModals = 0;

/** Counts the open `mt-modal`s and warns when one opens on top of another. */
export function useStackedModalWarning(isOpen: Readonly<Ref<boolean>>) {
  watch(
    isOpen,
    (value, previous) => {
      if (value) {
        openModals += 1;

        if (openModals > 1) {
          console.warn(
            "[MtModal] It is not recommended to stack multiple modals on top of each other.",
          );
        }
      } else if (previous) {
        openModals -= 1;
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (isOpen.value) openModals -= 1;
  });
}
