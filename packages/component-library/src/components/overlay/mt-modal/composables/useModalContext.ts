import { inject, type InjectionKey, type Ref } from "vue";

interface StateDefinition {
  isOpen: Ref<boolean>;
  setIsOpen: (value: boolean) => void;
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
