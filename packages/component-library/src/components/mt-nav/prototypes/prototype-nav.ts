import type { NavItem } from "../mt-nav.vue";

/**
 * Prototype only: the rows shared by the animation test stories.
 */

export const items: NavItem[] = [
  { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
  {
    label: "Products",
    icon: "regular-products",
    children: [
      { label: "Overview", to: { name: "product.index" } },
      { label: "Reviews", to: { name: "review.index" } },
      { label: "Categories", to: { name: "category.index" } },
      { label: "Manufacturers", to: { name: "manufacturer.index" } },
      { label: "Properties", to: { name: "property.index" } },
    ],
  },
  { label: "Orders", icon: "regular-shopping-bag", to: { name: "order.index" } },
  {
    label: "Customers",
    icon: "regular-users",
    children: [
      { label: "Overview", to: { name: "customer.index" } },
      { label: "Customer groups", to: { name: "customer-group.index" } },
    ],
  },
  {
    label: "Content",
    icon: "regular-content",
    children: [
      { label: "Shopping Experiences", to: { name: "cms.index" } },
      { label: "Media", to: { name: "media.index" } },
      { label: "Themes", to: { name: "theme.index" } },
    ],
  },
  {
    label: "Marketing",
    icon: "regular-megaphone",
    children: [
      { label: "Promotions", to: { name: "promotion.index" } },
      { label: "Newsletter recipients", to: { name: "newsletter.index" } },
    ],
  },
];

export function routeName(item: NavItem) {
  // Reads the route name of a row, if it links to a route
  return (item.to as { name?: string } | undefined)?.name;
}
