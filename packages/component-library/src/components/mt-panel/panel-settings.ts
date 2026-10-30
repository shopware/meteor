import type { InjectionKey, Ref, VNode, VNodeChild } from "vue";
import { findSlotComponent, hasRenderedContent } from "@/utils/slot";

/** A slot that holds a panel: the shell's navigation and sidebar, and a page's start and end. */
export type PanelPlace = "navigation" | "sidebar" | "start" | "end";

/** How a panel is set off from the content: `bordered` draws a border, `plain` none. */
export type PanelAppearance = "bordered" | "plain";

/** The options of an `MtPanel` that its layout uses for the trigger, the drawer and the border. */
export interface PanelOptions {
  label?: string;
  icon?: string;
  closable?: boolean;
  appearance?: PanelAppearance;
}

/** The options of a panel with the defaults of its place filled in. */
export interface PanelSettings {
  label: string;
  icon: string;
  closable: boolean;
  appearance: PanelAppearance;
}

/** What a layout learns from rendering one of its panel slots. */
export interface PanelSlot {
  /** Whether the slot shows anything. */
  isFilled: boolean;
  /** The options of the `MtPanel` at the top of the slot, if there is one. */
  options: PanelOptions | undefined;
}

/** What a layout tells the `MtPanel` in one of its slots. */
export interface PanelContext {
  place: PanelPlace;
  /** Whether the layout shows the panel as a drawer. */
  isDrawer: Readonly<Ref<boolean>>;
  /** The label of the panel, with the default of its place. */
  label(): string;
  /** The width of the layout next to the panel, which half of is the largest panel width. */
  layoutWidth(): number;
  /** Reports the options of the `MtPanel` until the returned function is called. */
  registerOptions(options: () => PanelOptions): () => void;
  /** Reports that the panel is being resized, so layouts can wait with switching layouts. */
  setResizing(resizing: boolean): void;
  /** Whether the panel is open in the current layout. */
  isOpen(): boolean;
  /** Pushes the panel out over its outer edge by `offset` pixels during a drag, without animation. */
  slideOut(offset: number): void;
  /** Ends a drag that pushed the panel out: closes it from where it is, or slides it back. */
  release(close: boolean): void;
}

/** The marker on `MtPanel`'s definition, by which layouts find it in their slots. */
export const PANEL_MARKER = "__MT_PANEL__";

/** The length of a panel's slide and of its return to its starting width, in milliseconds. */
export const PANEL_SLIDE_DURATION = 250;

export const PANEL_SLIDE_EASING = "cubic-bezier(0.3, 0, 0, 1)";

export const panelContextKey = Symbol("mt-panel") as InjectionKey<PanelContext>;

const defaultIcons: Record<PanelPlace, string> = {
  navigation: "regular-bars",
  sidebar: "regular-panel-right",
  start: "regular-panel-left",
  end: "regular-panel-right",
};

// The navigation blends into the shell's background, the other panels are set off by a border.
const defaultAppearances: Record<PanelPlace, PanelAppearance> = {
  navigation: "plain",
  sidebar: "bordered",
  start: "bordered",
  end: "bordered",
};

/**
 * Reads a panel slot's rendered content once for both: whether it is filled, and the options of the
 * `MtPanel` at its top. The options come from its props as written, before anything inside the slot
 * renders, so the layout knows them in the same render, also on the server.
 */
export function readPanelSlot(nodes: VNodeChild): PanelSlot {
  const panel = findSlotComponent(nodes, PANEL_MARKER);

  return { isFilled: hasRenderedContent(nodes), options: panel && optionsFromProps(panel) };
}

function optionsFromProps(panel: VNode): PanelOptions {
  const props = panel.props ?? {};

  // A boolean attribute without a value, such as `closable`, comes as an empty string.
  return {
    label: props.label ?? undefined,
    icon: props.icon ?? undefined,
    closable: props.closable === "" || props.closable === true,
    appearance: props.appearance ?? undefined,
  };
}

/** Fills in the defaults of the panel's place. The default label is translated by the layout. */
export function resolvePanelSettings(
  place: PanelPlace,
  options: PanelOptions | undefined,
  defaultLabel: string,
): PanelSettings {
  return {
    label: options?.label || defaultLabel,
    icon: options?.icon || defaultIcons[place],
    closable: options?.closable ?? false,
    appearance: options?.appearance ?? defaultAppearances[place],
  };
}

/**
 * The key under which a resizable panel remembers its width. The shell's navigation and sidebar
 * exist once per app, so their place names them. A page's panels are named by their place on that
 * page, so each page keeps its own widths.
 */
export function panelWidthStorageKey(place: PanelPlace, page: string) {
  return place === "start" || place === "end"
    ? `mt-panel-width:${page}:${place}`
    : `mt-panel-width:${place}`;
}
