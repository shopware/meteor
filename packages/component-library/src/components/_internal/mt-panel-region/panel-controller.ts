import { readonly, shallowRef, watch, type Ref } from "vue";
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
  /** Reports that a panel is being resized. */
  setResizing(resizing: boolean): void;
}

export interface CreatePanelStateOptions<Place extends PanelPlace> {
  isDrawer: Readonly<Ref<boolean>>;
  /** Whether the place's drawer can open: its slot is filled and no view hides it. */
  canOpenDrawer(place: Place): boolean;
  /** Whether each panel is open next to the content, which the app can bind with `v-model`. */
  inlineOpen: Record<Place, Ref<boolean>>;
}

/**
 * The open state of a layout's panels. Next to the content, each panel has its own state. As
 * drawers, at most one panel is open, and switching layouts closes it. Whether a view hides a panel
 * is a separate state: an open panel that a view hides stays open.
 */
export function createPanelState<Place extends PanelPlace>({
  isDrawer,
  canOpenDrawer,
  inlineOpen,
}: CreatePanelStateOptions<Place>) {
  const drawer = shallowRef<Place | null>(null);

  /** Whether the panel is open in the current layout. */
  function isOpen(place: Place) {
    return isDrawer.value ? drawer.value === place : inlineOpen[place].value;
  }

  function open(place: Place) {
    if (!isDrawer.value) {
      inlineOpen[place].value = true;
      return;
    }

    if (canOpenDrawer(place)) drawer.value = place;
  }

  function close(place: Place) {
    if (!isDrawer.value) {
      inlineOpen[place].value = false;
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

  return { isOpen, open, close, toggle, closeDrawer, drawer: readonly(drawer) };
}
