import { onMounted, onScopeDispose, watch, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";

export interface UseModalLayerOptions {
  /** The element that acts as the modal panel. It receives the focus while the layer is active. */
  panel: Readonly<Ref<HTMLElement | null>>;
  active: Readonly<Ref<boolean>>;
  /**
   * Called when Escape is pressed inside the panel, or while the focus is lost to the page,
   * and nothing handled it already. Only the topmost active layer is called.
   */
  onEscape(): void;
  /** The elements outside the panel that become inert while the layer is active. */
  inertTargets?: () => Iterable<Element | null | undefined>;
  /**
   * The element that receives the focus when the layer deactivates. Defaults to the
   * element that was focused before the layer opened; `null` leaves the focus alone.
   */
  returnFocusTo?: () => HTMLElement | null;
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

/** The active layers in activation order; only the last one handles Escape. */
const activeLayers: symbol[] = [];

/** How many active layers keep an element inert; elements that were inert before are never tracked. */
const inertReferences = new WeakMap<Element, number>();

function acquireInert(element: Element): boolean {
  const references = inertReferences.get(element);

  if (references === undefined) {
    if (element.hasAttribute("inert")) return false;

    element.setAttribute("inert", "");
  }

  inertReferences.set(element, (references ?? 0) + 1);
  return true;
}

function releaseInert(element: Element) {
  const references = inertReferences.get(element);
  if (references === undefined) return;

  if (references > 1) {
    inertReferences.set(element, references - 1);
    return;
  }

  inertReferences.delete(element);
  element.removeAttribute("inert");
}

function getTabbables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter((element) => {
    const tabindex = element.getAttribute("tabindex");
    if (tabindex !== null && Number(tabindex) < 0) return false;

    return !element.closest("[hidden],[inert]");
  });
}

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
 * The modal behavior shared by `mt-modal` and the drawers of `mt-app`: while active,
 * the panel holds the focus, Tab stays inside it, Escape closes it and the elements
 * outside it are inert. Escape is handled by the topmost layer only, and only when it is
 * pressed inside the panel or while the focus is lost to the page (e.g. after the focused
 * element was removed or blurred), so overlays teleported to the body (menus, date pickers,
 * popovers) keep their own keys and stay usable.
 *
 * Inertness is reference-counted across layers, so a modal opened from a drawer never
 * releases what the drawer made inert. Focus moves run after the DOM has been patched,
 * because focusing an element that is still inert or hidden has no effect.
 */
export function useModalLayer(options: UseModalLayerOptions): void {
  const layer = Symbol("mt-modal-layer");
  let isActivated = false;
  let acquired: Element[] = [];
  let previousFocus: HTMLElement | null = null;

  function onEscape(event: KeyboardEvent) {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    if (activeLayers[activeLayers.length - 1] !== layer) return;

    const panel = options.panel.value;
    const target = event.target;
    const isFocusLost = target === document.body || target === document.documentElement;
    if (!panel || !(isFocusLost || (target instanceof Node && panel.contains(target)))) return;

    event.preventDefault();
    options.onEscape();
  }

  function activate() {
    if (isActivated) return;
    isActivated = true;

    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeLayers.push(layer);
    document.addEventListener("keydown", onEscape);

    for (const element of options.inertTargets?.() ?? []) {
      if (element && acquireInert(element)) acquired.push(element);
    }

    options.panel.value?.focus({ preventScroll: true });
  }

  function deactivate() {
    if (!isActivated) return;
    isActivated = false;

    activeLayers.splice(activeLayers.indexOf(layer), 1);
    document.removeEventListener("keydown", onEscape);
    acquired.forEach(releaseInert);
    acquired = [];

    const target = options.returnFocusTo ? options.returnFocusTo() : previousFocus;
    previousFocus = null;

    if (target?.isConnected) target.focus({ preventScroll: true });
  }

  watch(
    options.active,
    (isActive, wasActive) => {
      if (isActive) activate();
      else if (wasActive) deactivate();
    },
    { flush: "post" },
  );

  onMounted(() => {
    if (options.active.value) activate();
  });

  onScopeDispose(deactivate);

  useEventListener(options.panel, "keydown", (event: KeyboardEvent) => {
    if (event.key === "Tab" && isActivated && options.panel.value) {
      wrapTab(event, options.panel.value);
    }
  });
}
