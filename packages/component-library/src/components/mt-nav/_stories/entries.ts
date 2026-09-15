import type { NavItem, NavRoute } from "../mt-nav.types";

/**
 * Sample navigation resembling a shop administration, nested via `children`.
 */
export const shopItems: NavItem[] = [
  { id: "dashboard", path: "dashboard.index", label: "Dashboard", icon: "regular-home" },
  {
    id: "catalogue",
    label: "Catalogues",
    icon: "regular-products",
    children: [
      {
        id: "product",
        path: "product.index",
        label: "Products",
        children: [{ id: "review", path: "review.index", label: "Reviews" }],
      },
      { id: "category", path: "category.index", label: "Categories" },
      { id: "manufacturer", path: "manufacturer.index", label: "Manufacturers" },
    ],
  },
  { id: "order", path: "order.index", label: "Orders", icon: "regular-shopping-bag" },
  { id: "customer", path: "customer.index", label: "Customers", icon: "regular-users" },
  {
    id: "content",
    label: "Content",
    icon: "regular-content",
    children: [
      { id: "cms", path: "cms.index", label: "Shopping Experiences" },
      { id: "media", path: "media.index", label: "Media" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "regular-megaphone",
    children: [
      { id: "promotion", path: "promotion.index", label: "Promotions" },
      { id: "newsletter", path: "newsletter.index", label: "Newsletter recipients" },
    ],
  },
];

export const systemItems: NavItem[] = [
  {
    id: "extension",
    label: "Extensions",
    icon: "regular-plug",
    children: [
      { id: "my-extensions", path: "extension.my-extensions", label: "My extensions" },
      { id: "store", path: "extension.store", label: "Store" },
    ],
  },
  { id: "settings", path: "settings.index", label: "Settings", icon: "regular-cog" },
];

/**
 * Everything in one list, for a single section without a header.
 */
export const items: NavItem[] = [...shopItems, ...systemItems];

/**
 * A minimal route object for the given route name, as Vue Router would resolve it.
 */
export function routeFor(name: string): NavRoute {
  return { name, path: `/${name.replace(/\./g, "/")}`, matched: [{ name }], params: {} };
}
