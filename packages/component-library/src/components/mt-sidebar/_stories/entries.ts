import type { SidebarEntry, SidebarRoute } from "../mt-sidebar.types";

/**
 * Sample navigation resembling a shop administration. Nested via `parent`, sorted via `position`.
 */
export const entries: SidebarEntry[] = [
  {
    id: "dashboard",
    path: "dashboard.index",
    label: "Dashboard",
    icon: "regular-home",
    color: "#6ad6f0",
    position: 10,
  },
  {
    id: "catalogue",
    label: "Catalogues",
    icon: "regular-products",
    color: "#57d9a3",
    position: 20,
  },
  { id: "product", path: "product.index", label: "Products", parent: "catalogue", position: 10 },
  { id: "review", path: "review.index", label: "Reviews", parent: "product", position: 10 },
  {
    id: "category",
    path: "category.index",
    label: "Categories",
    parent: "catalogue",
    position: 20,
  },
  {
    id: "manufacturer",
    path: "manufacturer.index",
    label: "Manufacturers",
    parent: "catalogue",
    position: 30,
  },
  {
    id: "order",
    path: "order.index",
    label: "Orders",
    icon: "regular-shopping-bag",
    color: "#a092f0",
    position: 30,
  },
  {
    id: "customer",
    path: "customer.index",
    label: "Customers",
    icon: "regular-users",
    color: "#f88962",
    position: 40,
  },
  { id: "content", label: "Content", icon: "regular-content", color: "#ff85c2", position: 50 },
  {
    id: "cms",
    path: "cms.index",
    label: "Shopping Experiences",
    parent: "content",
    position: 10,
  },
  { id: "media", path: "media.index", label: "Media", parent: "content", position: 20 },
  {
    id: "marketing",
    label: "Marketing",
    icon: "regular-megaphone",
    color: "#ffd700",
    position: 60,
  },
  {
    id: "promotion",
    path: "promotion.index",
    label: "Promotions",
    parent: "marketing",
    position: 10,
  },
  {
    id: "newsletter",
    path: "newsletter.index",
    label: "Newsletter recipients",
    parent: "marketing",
    position: 20,
  },
  { id: "extension", label: "Extensions", icon: "regular-plug", position: 70 },
  {
    id: "my-extensions",
    path: "extension.my-extensions",
    label: "My extensions",
    parent: "extension",
    position: 10,
  },
  { id: "store", path: "extension.store", label: "Store", parent: "extension", position: 20 },
  { id: "settings", path: "settings.index", label: "Settings", icon: "regular-cog", position: 80 },
];

export interface StoryUser {
  firstName: string;
  lastName: string;
  title?: string;
  avatarUrl?: string;
}

export const user: StoryUser = { firstName: "Max", lastName: "Mustermann", title: "Administrator" };

/**
 * A minimal route object for the given route name, as Vue Router would resolve it.
 */
export function routeFor(name: string): SidebarRoute {
  return { name, path: `/${name.replace(/\./g, "/")}`, matched: [{ name }], params: {} };
}
