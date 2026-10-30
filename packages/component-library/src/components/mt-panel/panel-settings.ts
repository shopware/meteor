import type { InjectionKey, Ref, VNode, VNodeChild } from "vue";
import { findSlotComponent, hasRenderedContent } from "@/utils/slot";

/** A slot that holds a panel: the shell's navigation and sidebar, and a page's start and end. */
export type PanelPlace = "navigation" | "sidebar" | "start" | "end";

/** The marker on `MtPanel`'s definition, by which layouts find it in their slots. */
export const PANEL_MARKER = "__MT_PANEL__";

/** How a panel is set off from the content: `bordered` draws a border, `plain` none. */
export type PanelAppearance = "bordered" | "plain";

/** The options of an `MtPanel` that its layout uses for the trigger, the drawer and the border. */
export interface PanelOptions {
  label?: string;
  icon?: string;
  closable?: boolean;
  appearance?: PanelAppearance;
}

/** What a layout learns from rendering one of its panel slots. */
export interface PanelSlot {
  /** Whether the slot shows anything. */
  isFilled: boolean;
  /** The options of the `MtPanel` at the top of the slot, if there is one. */
  options: PanelOptions | undefined;
}

/** Reads a panel slot's rendered content once for both: whether it is filled, and its options. */
export function readPanelSlot(nodes: VNodeChild): PanelSlot {
  return { isFilled: hasRenderedContent(nodes), options: readPanelOptions(nodes) };
}

/** The options of a panel with the defaults of its place filled in. */
export interface PanelSettings {
  label: string;
  icon: string;
  closable: boolean;
  appearance: PanelAppearance;
}

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
 * The options of the `MtPanel` in rendered slot content, read from its props as written: before
 * anything inside the slot renders, so the layout knows them in the same render, also on the
 * server. `undefined` when the slot has no `MtPanel` at its top.
 */
export function readPanelOptions(nodes: VNodeChild): PanelOptions | undefined {
  const panel = findSlotComponent(nodes, PANEL_MARKER);

  return panel ? optionsFromProps(panel) : undefined;
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

/** What a layout tells the `MtPanel` in one of its slots. */
export interface PanelContext {
  place: PanelPlace;
  /** Whether the layout shows the panel as a drawer. */
  isMobile: Readonly<Ref<boolean>>;
  /** The label of the panel, with the default of its place. */
  label(): string;
  /** Whether the layout found the `MtPanel` at the top of its slot. */
  isFoundInSlot(): boolean;
  /** Reports the options of an `MtPanel` that the layout didn't find in its slot. */
  registerOptions(options: () => PanelOptions): () => void;
  /** Reports that the panel is being resized, so layouts can wait with switching layouts. */
  setResizing(resizing: boolean): void;
}

export const panelContextKey = Symbol("mt-panel") as InjectionKey<PanelContext>;
