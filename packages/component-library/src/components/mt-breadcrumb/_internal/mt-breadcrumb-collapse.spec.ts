import { computeCollapsed, type BreadcrumbChild } from "./mt-breadcrumb-collapse";

const ELLIPSIS = 0;
const HOME = 1;
const SEPARATOR_1 = 2;
const PRODUCTS = 3;
const SEPARATOR_2 = 4;
const SHOES = 5;
const SEPARATOR_3 = 6;
const SNEAKERS = 7;

const GAP = 8;

/**
 * Ellipsis 20px, crumbs 100px, separators 10px, gaps 8px:
 * - everything without the ellipsis: 478px
 * - Home / … / Shoes / Sneakers: 398px
 * - Home / … / Sneakers: 272px
 * - … / Sneakers: 146px
 */
function trail(): BreadcrumbChild[] {
  return [
    { kind: "ellipsis", width: 20 },
    { kind: "item", width: 100 },
    { kind: "separator", width: 10 },
    { kind: "item", width: 100 },
    { kind: "separator", width: 10 },
    { kind: "item", width: 100 },
    { kind: "separator", width: 10 },
    { kind: "item", width: 100 },
  ];
}

describe("computeCollapsed", () => {
  it("hides only the ellipsis when every crumb fits", () => {
    // ACT
    const hidden = computeCollapsed(trail(), 478, GAP);

    // ASSERT
    expect(hidden).toEqual([ELLIPSIS]);
  });

  it("hides the crumb next to the root first and keeps the separators around the ellipsis", () => {
    // ACT
    const hidden = computeCollapsed(trail(), 400, GAP);

    // ASSERT
    expect(hidden).toEqual([PRODUCTS]);
  });

  it("keeps hiding middle crumbs from the root side until the trail fits", () => {
    // ACT
    const hidden = computeCollapsed(trail(), 300, GAP);

    // ASSERT
    expect(hidden.sort()).toEqual([PRODUCTS, SEPARATOR_2, SHOES].sort());
  });

  it("hides the root only after every middle crumb is hidden", () => {
    // ACT
    const hidden = computeCollapsed(trail(), 150, GAP);

    // ASSERT
    expect(hidden.sort()).toEqual([HOME, SEPARATOR_1, PRODUCTS, SEPARATOR_2, SHOES].sort());
  });

  it("never hides the last crumb, its separator, or the ellipsis, even when nothing fits", () => {
    // ACT
    const hidden = computeCollapsed(trail(), 10, GAP);

    // ASSERT
    expect(hidden).not.toContain(SNEAKERS);
    expect(hidden).not.toContain(SEPARATOR_3);
    expect(hidden).not.toContain(ELLIPSIS);
  });

  it("does not collapse a trail with a single crumb", () => {
    // ARRANGE
    const children: BreadcrumbChild[] = [
      { kind: "ellipsis", width: 20 },
      { kind: "item", width: 500 },
    ];

    // ACT
    const hidden = computeCollapsed(children, 100, GAP);

    // ASSERT
    expect(hidden).toEqual([ELLIPSIS]);
  });
});
