import { readonly, shallowReactive, shallowRef, watch, type Ref } from "vue";
import type { PanelOptions, PanelPlace } from "@/components/mt-panel/panel-settings";

/** What a panel region needs from the layout it belongs to: the shell or a page. */
export interface PanelController<Place extends PanelPlace = PanelPlace> {
  /** Whether the layout shows its panels as drawers. */
  isDrawer: Readonly<Ref<boolean>>;
  isOpen(place: Place): boolean;
  open(place: Place): void;
  close(place: Place): void;
  /** Moves the focus to the layout's content, for example when the focused panel disappears. */
  focusContent(): void;
  /** Reports the options of the `MtPanel` in the place until the returned function is called. */
  registerPanelOptions(place: Place, options: () => PanelOptions): () => void;
  /** Reports the open state of the `MtPanel` in the place until the returned function is called. */
  registerPanelOpen(place: Place, open: Ref<boolean>): () => void;
  /** Forgets whether the layout opened or closed the place, when its content goes away. */
  forgetPanelOpen(place: Place): void;
  /** Reports that a panel is being resized. */
  setResizing(resizing: boolean): void;
}

export interface CreatePanelStateOptions<Place extends PanelPlace> {
  isDrawer: Readonly<Ref<boolean>>;
  /** Whether the place's slot shows anything. */
  hasContent(place: Place): boolean;
  /** Whether the place's drawer can open: its slot is filled and no view hides it. */
  canOpenDrawer(place: Place): boolean;
  /** Whether the `MtPanel` at the top of the place's slot starts open, when the slot holds one. */
  startsOpen(place: Place): boolean | undefined;
}

/**
 * The open state of a layout's panels. Next to the content, each panel has its own state: the
 * `MtPanel` in the slot holds it, and the layout for content without one. As drawers, at most one
 * panel is open, and switching layouts closes it. Whether a view hides a panel is a separate state:
 * an open panel that a view hides stays open.
 */
export function createPanelState<Place extends PanelPlace>({
  isDrawer,
  hasContent,
  canOpenDrawer,
  startsOpen,
}: CreatePanelStateOptions<Place>) {
  const drawer = shallowRef<Place | null>(null);
  const panelOpen = shallowReactive(new Map<Place, Ref<boolean>>());
  const layoutOpen = shallowReactive(new Map<Place, boolean>());

  /** Whether the panel is open next to the content, which doesn't depend on the layout. */
  function isInlineOpen(place: Place) {
    return panelOpen.get(place)?.value ?? layoutOpen.get(place) ?? startsOpen(place) ?? true;
  }

  function setInlineOpen(place: Place, open: boolean) {
    const panel = panelOpen.get(place);

    if (panel) panel.value = open;
    else if (hasContent(place)) layoutOpen.set(place, open);
  }

  function registerPanelOpen(place: Place, open: Ref<boolean>) {
    // The `MtPanel` takes over whether the layout opened or closed the panel before it set up.
    const opened = layoutOpen.get(place);

    if (opened !== undefined) {
      layoutOpen.delete(place);
      open.value = opened;
    }

    panelOpen.set(place, open);

    return () => {
      if (panelOpen.get(place) === open) panelOpen.delete(place);
    };
  }

  function forgetPanelOpen(place: Place) {
    layoutOpen.delete(place);
  }

  /** Whether the panel is open in the current layout. */
  function isOpen(place: Place) {
    return isDrawer.value ? drawer.value === place : isInlineOpen(place);
  }

  function open(place: Place) {
    if (!isDrawer.value) {
      setInlineOpen(place, true);
      return;
    }

    if (canOpenDrawer(place)) drawer.value = place;
  }

  function close(place: Place) {
    if (!isDrawer.value) {
      setInlineOpen(place, false);
      return;
    }

    if (drawer.value === place) drawer.value = null;
  }

  function toggle(place: Place) {
    if (isOpen(place)) close(place);
    else open(place);
  }

  function closeDrawer() {
    drawer.value = null;
  }

  watch(isDrawer, closeDrawer);

  return {
    isOpen,
    isInlineOpen,
    open,
    close,
    toggle,
    closeDrawer,
    registerPanelOpen,
    forgetPanelOpen,
    drawer: readonly(drawer),
  };
}
