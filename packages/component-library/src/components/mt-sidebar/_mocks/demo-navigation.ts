export const navigationItems = [
  { label: "Dashboard", icon: "regular-home" },
  { label: "Orders", icon: "regular-shopping-bag" },
  { label: "Products", icon: "regular-box" },
  { label: "Customers", icon: "regular-users" },
  { label: "Marketing", icon: "regular-megaphone" },
  { label: "Content", icon: "regular-file-text" },
  { label: "Media", icon: "regular-image" },
  { label: "Categories", icon: "regular-tag" },
  { label: "Shipping", icon: "regular-truck" },
  { label: "Payments", icon: "regular-credit-card" },
  { label: "Sales channels", icon: "regular-storefront" },
  { label: "Analytics", icon: "regular-chart-line" },
  { label: "Notifications", icon: "regular-bell" },
  { label: "Languages", icon: "regular-globe" },
  { label: "Help", icon: "regular-question-circle" },
  { label: "Settings", icon: "regular-cog" },
];

/**
 * A plain navigation list used to demonstrate the sidebar. Any navigation
 * component can be placed into the default slot instead.
 */
export const demoNavigationTemplate = `
<nav aria-label="Main">
  <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: var(--scale-size-4);">
    <li v-for="(item, index) in items" :key="item.label">
      <a
        href="#"
        :aria-current="index === 0 ? 'page' : undefined"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--scale-size-12)',
          padding: 'var(--scale-size-8) var(--scale-size-12)',
          borderRadius: 'var(--border-radius-xs)',
          textDecoration: 'none',
          color: 'var(--color-text-primary-default)',
          background: index === 0 ? 'var(--color-elevation-surface-selected)' : 'transparent',
        }"
      >
        <mt-icon :name="item.icon" size="var(--scale-size-16)" aria-hidden="true" />
        <mt-text as="span" size="s">{{ item.label }}</mt-text>
      </a>
    </li>
  </ul>
</nav>`;
