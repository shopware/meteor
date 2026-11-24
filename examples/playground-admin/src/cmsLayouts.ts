export type LayoutType =
  | "page"
  | "landingpage"
  | "product_list"
  | "product_detail";

export interface Layout {
  id: string;
  name: string;
  type: LayoutType;
  updatedAt: string;
  /** The default layouts of Shopware, which can't be deleted. */
  locked?: boolean;
}

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

/** The Shopping Experiences layouts: the defaults of a new shop and a few of its own. */
export const layouts: Layout[] = [
  { id: "home", name: "Homepage", type: "page", updatedAt: daysAgo(2) },
  {
    id: "summer",
    name: "Summer collection",
    type: "landingpage",
    updatedAt: daysAgo(5),
  },
  {
    id: "listing",
    name: "Default listing layout",
    type: "product_list",
    updatedAt: daysAgo(120),
    locked: true,
  },
  {
    id: "listing-sidebar",
    name: "Default listing layout with sidebar",
    type: "product_list",
    updatedAt: daysAgo(120),
    locked: true,
  },
  {
    id: "product",
    name: "Default product page layout",
    type: "product_detail",
    updatedAt: daysAgo(120),
    locked: true,
  },
  {
    id: "contact",
    name: "Default shop page layout with contact form",
    type: "page",
    updatedAt: daysAgo(120),
    locked: true,
  },
  {
    id: "newsletter",
    name: "Default shop page layout with newsletter form",
    type: "page",
    updatedAt: daysAgo(120),
    locked: true,
  },
  {
    id: "coffee",
    name: "Coffee & tea landing page",
    type: "landingpage",
    updatedAt: daysAgo(18),
  },
  {
    id: "lighting",
    name: "Lighting category page",
    type: "product_list",
    updatedAt: daysAgo(31),
  },
];
