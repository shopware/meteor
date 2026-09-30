import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtSidebar from "../mt-sidebar.vue";
import MtText from "../../mt-text/mt-text.vue";
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtAvatar from "../../mt-avatar/mt-avatar.vue";
import MtButton from "../../mt-button/mt-button.vue";
import MtActionMenu from "../../mt-action-menu/mt-action-menu.vue";
import MtActionMenuGroup from "../../mt-action-menu-group/mt-action-menu-group.vue";
import MtActionMenuItem from "../../mt-action-menu-item/mt-action-menu-item.vue";

/**
 * Everything the demo templates below need to render.
 */
export const demoComponents = {
  MtDropdownMenuPortal: DropdownMenuPortal,
  MtDropdownMenuRoot: DropdownMenuRoot,
  MtDropdownMenuTrigger: DropdownMenuTrigger,
  MtSidebar,
  MtText,
  MtIcon,
  MtAvatar,
  MtButton,
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
};

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

/**
 * Header as used by the Shopware administration: logo box, shop name,
 * product name and a button to collapse the sidebar.
 */
export const demoHeaderTemplate = `
<div
  style="
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--scale-size-40);
    height: var(--scale-size-40);
    background: var(--color-icon-brand-default);
    border-radius: var(--border-radius-m);
  "
>
  <mt-icon
    name="solid-shopware"
    size="var(--scale-size-26)"
    color="var(--color-static-white)"
    aria-label="Shopware"
  />
</div>

<div style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
  <mt-text
    as="div"
    size="s"
    weight="semibold"
    style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 1.4;"
    title="Demo shop"
  >
    Demo shop
  </mt-text>
  <mt-text
    as="div"
    size="2xs"
    color="color-text-secondary-default"
    style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 1.4;"
  >
    Shopware
  </mt-text>
</div>

<mt-button variant="tertiary" size="default" square aria-label="Minimize menu" style="flex-shrink: 0;">
  <template #iconFront>
    <mt-icon name="regular-panel-left" size="var(--scale-size-16)" aria-hidden="true" />
  </template>
</mt-button>`;

/**
 * Footer as used by the Shopware administration: a user menu toggle with
 * avatar, name and role that opens an action menu with the logout action.
 */
export const demoFooterTemplate = `
<mt-dropdown-menu-root>
  <mt-dropdown-menu-trigger as-child>
    <button
      type="button"
      aria-label="User menu: Max Mustermann"
      style="
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--scale-size-12);
        padding: var(--scale-size-8);
        border: none;
        border-radius: var(--border-radius-s);
        background: transparent;
        color: inherit;
        cursor: pointer;
        text-align: left;
      "
    >
      <mt-avatar
        size="s"
        first-name="Max"
        last-name="Mustermann"
        style="--mt-avatar-size: var(--scale-size-36); flex-shrink: 0;"
      />

      <div style="flex: 1 1 auto; min-width: 0; overflow: hidden; white-space: nowrap;">
        <mt-text
          as="div"
          size="xs"
          weight="semibold"
          style="overflow: hidden; text-overflow: ellipsis;"
        >
          Max Mustermann
        </mt-text>
        <mt-text
          as="div"
          size="2xs"
          color="color-text-secondary-default"
          style="overflow: hidden; text-overflow: ellipsis;"
        >
          Administrator
        </mt-text>
      </div>

      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--scale-size-6);
          flex-shrink: 0;
          width: var(--scale-size-20);
          height: var(--scale-size-20);
          color: var(--color-icon-primary-default);
        "
      >
        <mt-icon name="regular-chevron-up-xs" size="var(--scale-size-8)" aria-hidden="true" />
        <mt-icon name="regular-chevron-down-xs" size="var(--scale-size-8)" aria-hidden="true" />
      </div>
    </button>
  </mt-dropdown-menu-trigger>

  <mt-dropdown-menu-portal>
    <mt-action-menu match-trigger-width side="top">
      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-sign-out" variant="critical">Log out</mt-action-menu-item>
      </mt-action-menu-group>
      <mt-action-menu-group>
        <mt-text
          as="div"
          size="2xs"
          color="color-text-secondary-default"
          style="margin: var(--scale-size-8);"
        >
          Version 6.7.0.0
        </mt-text>
      </mt-action-menu-group>
    </mt-action-menu>
  </mt-dropdown-menu-portal>
</mt-dropdown-menu-root>`;
