import { watch, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";

export interface UseModalLayerOptions {
  /** The element that acts as the modal panel. */
  target: Ref<HTMLElement | null>;
  active: Readonly<Ref<boolean>>;
  onEscape(): void;
  /** The element to focus when the layer deactivates; `null` leaves the focus alone. */
  returnFocusTo(): HTMLElement | null;
}

const TABBABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])',
  "[tabindex]",
].join(",");

function getTabbables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter((element) => {
    const tabindex = element.getAttribute("tabindex");
    if (tabindex !== null && Number(tabindex) < 0) return false;

    return !element.closest("[hidden],[inert]");
  });
}

/**
 * Keeps keyboard navigation inside the panel: tabbing past the last tabbable
 * element wraps to the first one and vice versa. Only reacts to key presses that
 * happen inside the panel, so overlays teleported to the body stay untouched.
 */
function wrapTab(event: KeyboardEvent, root: HTMLElement) {
  const tabbables = getTabbables(root);

  if (tabbables.length === 0) {
    event.preventDefault();
    root.focus();
    return;
  }

  const first = tabbables[0];
  const last = tabbables[tabbables.length - 1];
  const current = document.activeElement;

  if (event.shiftKey && (current === first || current === root)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && current === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Modal behavior for one element without a global focus trap: moves the focus
 * into the panel when it activates, restores it when it deactivates, closes on
 * Escape and wraps Tab inside the panel. Background inertness is the caller's
 * job (the `inert` attribute on the sibling regions).
 *
 * Focus moves run after the DOM has been patched, because focusing an element
 * that is still `inert` or hidden is a no-op.
 */
export function useModalLayer(options: UseModalLayerOptions): void {
  watch(
    options.active,
    (isActive, wasActive) => {
      if (isActive) {
        options.target.value?.focus({ preventScroll: true });
        return;
      }

      if (wasActive) options.returnFocusTo()?.focus({ preventScroll: true });
    },
    { flush: "post" },
  );

  useEventListener(options.target, "keydown", (event: KeyboardEvent) => {
    if (!options.active.value || !options.target.value) return;

    if (event.key === "Escape") {
      if (event.defaultPrevented) return;

      event.preventDefault();
      options.onEscape();
      return;
    }

    if (event.key === "Tab") wrapTab(event, options.target.value);
  });
}
