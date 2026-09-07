export type BreadcrumbChildKind = "item" | "separator" | "ellipsis";

export interface BreadcrumbChild {
  kind: BreadcrumbChildKind;
  width: number;
}

function widthOf(children: BreadcrumbChild[], hidden: Set<number>, gap: number) {
  const visible = children.filter((_, index) => !hidden.has(index));
  const gaps = Math.max(0, visible.length - 1) * gap;

  return visible.reduce((sum, child) => sum + child.width, 0) + gaps;
}

function nearestItem(children: BreadcrumbChild[], from: number, step: 1 | -1) {
  for (let index = from + step; index >= 0 && index < children.length; index += step) {
    if (children[index].kind === "item") return index;
  }

  return undefined;
}

function withSeparators(children: BreadcrumbChild[], hiddenItems: Set<number>) {
  const hidden = new Set(hiddenItems);

  children.forEach((child, index) => {
    if (child.kind !== "separator") return;

    const previous = nearestItem(children, index, -1);
    const next = nearestItem(children, index, 1);

    if (previous !== undefined && next !== undefined && hidden.has(previous) && hidden.has(next)) {
      hidden.add(index);
    }
  });

  return hidden;
}

/**
 * Returns the indexes of the children that have to be hidden so the breadcrumb fits into
 * `available`. Middle crumbs are hidden first, starting next to the root, then the root
 * itself. The last crumb is never hidden. A separator is hidden when the crumbs on both
 * of its sides are hidden, which leaves one separator before and one after the ellipsis.
 */
export function computeCollapsed(children: BreadcrumbChild[], available: number, gap: number) {
  const ellipsis = children.flatMap((child, index) => (child.kind === "ellipsis" ? [index] : []));
  const items = children.flatMap((child, index) => (child.kind === "item" ? [index] : []));

  const withoutEllipsis = new Set(ellipsis);
  if (items.length < 2 || widthOf(children, withoutEllipsis, gap) <= available) {
    return [...withoutEllipsis];
  }

  const collapseOrder = [...items.slice(1, -1), items[0]];
  const hiddenItems = new Set<number>();

  for (const index of collapseOrder) {
    hiddenItems.add(index);

    const hidden = withSeparators(children, hiddenItems);
    if (widthOf(children, hidden, gap) <= available) {
      return [...hidden];
    }
  }

  return [...withSeparators(children, hiddenItems)];
}
