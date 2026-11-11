<script setup lang="ts">
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtUser,
} from "@shopware-ag/meteor-component-library";

/**
 * PROTOTYPE of `mt-user-menu` for the app header. In the bar it is a compact avatar whose menu
 * starts with the user, opens 8px below the avatar and lines up with its end edge. In the drawer it
 * is a row with the avatar, the name and the subtitle, whose menu opens above it. Built from the
 * parts that `mt-user-menu` uses itself, because it doesn't let the menu's position or width change.
 */
withDefaults(
  defineProps<{
    /** The display name of the logged-in user. */
    name: string;
    /** A second line below the name, such as the email address. */
    subtitle?: string;
    /** An image for the avatar instead of the initials. */
    imageUrl?: string;
    /** `horizontal` for the bar, `vertical` for the bottom of the drawer. */
    orientation?: "horizontal" | "vertical";
  }>(),
  {
    subtitle: undefined,
    imageUrl: undefined,
    orientation: "horizontal",
  },
);

defineSlots<{
  /** The groups of actions below the user, such as `mt-action-menu-group`. */
  default?(): unknown;
}>();
</script>

<template>
  <mt-dropdown-menu-root>
    <mt-dropdown-menu-trigger as-child>
      <button
        type="button"
        class="user-menu-prototype__trigger"
        :class="`user-menu-prototype__trigger--${orientation}`"
      >
        <mt-user
          :name="name"
          :subtitle="subtitle"
          :image-url="imageUrl"
          :compact="orientation === 'horizontal'"
        />
        <span
          v-if="orientation === 'vertical'"
          class="user-menu-prototype__chevrons"
          aria-hidden="true"
        >
          <mt-icon name="solid-chevron-up" size="10" decorative />
          <mt-icon name="solid-chevron-down" size="10" decorative />
        </span>
      </button>
    </mt-dropdown-menu-trigger>

    <!-- Inside the drawer, a modal dialog, the menu has to stay in the dialog to be usable. -->
    <mt-dropdown-menu-portal :disabled="orientation === 'vertical'">
      <!-- In the bar, with the trigger's padding, the menu opens 8px below the avatar, and the
           align offset moves its end edge onto the avatar's. In the drawer it opens above the row
           and as wide as it. -->
      <mt-action-menu
        class="user-menu-prototype__menu"
        :side="orientation === 'vertical' ? 'top' : 'bottom'"
        :align="orientation === 'vertical' ? 'start' : 'end'"
        :side-offset="4"
        :align-offset="orientation === 'vertical' ? 0 : 4"
        :match-trigger-width="orientation === 'vertical'"
      >
        <!-- Who is logged in, above the actions. Not a menu item, so keyboard focus skips it. In
             the drawer the row already shows it. -->
        <mt-action-menu-group v-if="orientation === 'horizontal'">
          <mt-user
            class="user-menu-prototype__user"
            :name="name"
            :subtitle="subtitle"
            :image-url="imageUrl"
          />
        </mt-action-menu-group>

        <slot />
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>

<style scoped>
.user-menu-prototype__trigger {
  display: flex;
  align-items: center;
  color: inherit;
  font-family: inherit;
  text-align: start;
  background: transparent;
  border: none;
  cursor: pointer;
}

.user-menu-prototype__trigger--vertical:hover,
.user-menu-prototype__trigger--vertical[data-state="open"] {
  background: var(--color-interaction-secondary-hover);
}

.user-menu-prototype__trigger:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

/* In the bar, a circle just around the avatar, as focus ring. */
.user-menu-prototype__trigger--horizontal {
  padding: var(--scale-size-4);
  border-radius: var(--border-radius-round);
  transition: opacity 150ms ease-out;
}

/* No background around the avatar on hover, it only fades a little. */
.user-menu-prototype__trigger--horizontal:hover {
  opacity: 0.8;
}

@media (prefers-reduced-motion: reduce) {
  .user-menu-prototype__trigger--horizontal {
    transition: none;
  }
}

.user-menu-prototype__trigger--horizontal :deep(.mt-user__avatar) {
  --mt-avatar-size: var(--scale-size-32);
}

/* In the drawer, a row as wide as the navigation, with the chevrons at its end. */
.user-menu-prototype__trigger--vertical {
  gap: var(--scale-size-12);
  width: 100%;
  min-width: 0;
  padding: var(--scale-size-8) var(--scale-size-12) var(--scale-size-8)
    var(--scale-size-8);
  border-radius: var(--border-radius-m);
}

.user-menu-prototype__trigger--vertical .mt-user {
  flex: 1;
  min-width: 0;
}

.user-menu-prototype__chevrons {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /* The chevrons fill only half of their square icon box. */
  gap: calc(-1 * var(--scale-size-2));
  color: var(--color-icon-secondary-default);
}

/* The menu renders in a portal outside this component in the bar, where scoped styles don't
   reach. */
:global(.user-menu-prototype__menu) {
  min-width: var(--scale-size-256);
}

:global(.user-menu-prototype__menu.mt-action-menu--match-trigger-width) {
  min-width: 0;
}

/* Lines up with the menu items below it. */
.user-menu-prototype__user {
  padding: var(--scale-size-8);
}
</style>
