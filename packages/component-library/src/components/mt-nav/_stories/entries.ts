/**
 * Sample navigation resembling a shop administration. The stories render it with
 * `StoryNavItems`, which nests one `mt-nav-item` per entry.
 */
export interface StoryNavItem {
  label: string;
  icon?: string;
  to?: { name: string };
  href?: string;
  target?: string;
  children?: StoryNavItem[];
}

export const shopItems: StoryNavItem[] = [
  { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
  {
    label: "Catalogues",
    icon: "regular-products",
    children: [
      {
        label: "Products",
        to: { name: "product.index" },
        children: [{ label: "Reviews", to: { name: "review.index" } }],
      },
      { label: "Categories", to: { name: "category.index" } },
      { label: "Manufacturers", to: { name: "manufacturer.index" } },
    ],
  },
  { label: "Orders", icon: "regular-shopping-bag", to: { name: "order.index" } },
  { label: "Customers", icon: "regular-users", to: { name: "customer.index" } },
  {
    label: "Content",
    icon: "regular-content",
    children: [
      { label: "Shopping Experiences", to: { name: "cms.index" } },
      { label: "Media", to: { name: "media.index" } },
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

export const systemItems: StoryNavItem[] = [
  {
    label: "Extensions",
    icon: "regular-plug",
    children: [
      { label: "My extensions", to: { name: "extension.my-extensions" } },
      { label: "Store", to: { name: "extension.store" } },
    ],
  },
  { label: "Settings", icon: "regular-cog", to: { name: "settings.index" } },
];

/**
 * Everything in one list, for a single section without a header.
 */
export const items: StoryNavItem[] = [...shopItems, ...systemItems];
