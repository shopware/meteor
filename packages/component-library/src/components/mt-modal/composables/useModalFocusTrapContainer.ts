import { inject, onBeforeUnmount, watch, type InjectionKey, type Ref } from "vue";

interface FocusTrapContainers {
  add: (element: HTMLElement) => void;
  remove: (element: HTMLElement) => void;
}

export const ModalFocusTrapContainers = Symbol(
  "ModalFocusTrapContainers",
) as InjectionKey<FocusTrapContainers>;

/**
 * Adds an element that is teleported out of the enclosing `mt-modal` (e.g. popover content
 * rendered into `<body>`) to the modal's focus trap for as long as the element exists.
 * Without it, the trap pulls focus back into the modal and the element's inputs can't be used.
 * Does nothing outside of an `mt-modal`.
 */
export function useModalFocusTrapContainer(element: Ref<HTMLElement | null>) {
  const containers = inject(ModalFocusTrapContainers, null);
  if (!containers) return;

  watch(
    element,
    (current, previous) => {
      if (previous) containers.remove(previous);
      if (current) containers.add(current);
    },
    { immediate: true, flush: "post" },
  );

  onBeforeUnmount(() => {
    if (element.value) containers.remove(element.value);
  });
}
