<script setup lang="ts">
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtUser,
} from "@shopware-ag/meteor-component-library";

/**
 * PROTOTYPE of `mt-user-menu` for the end of the app header: a compact avatar whose menu starts
 * with the user, opens 8px below the avatar and lines up with its end edge. Built from the parts
 * that `mt-user-menu` uses itself, because it doesn't let the menu's position or width change.
 */
defineProps<{
  /** The display name of the logged-in user. */
  name: string;
  /** A second line below the name, such as the email address. */
  subtitle?: string;
  /** An image for the avatar instead of the initials. */
  imageUrl?: string;
}>();

defineSlots<{
  /** The groups of actions below the user, such as `mt-action-menu-group`. */
  default?(): unknown;
}>();
</script>

<template>
  <mt-dropdown-menu-root>
    <mt-dropdown-menu-trigger as-child>
      <button type="button" class="user-menu-prototype__trigger">
        <mt-user
          :name="name"
          :subtitle="subtitle"
          :image-url="imageUrl"
          compact
        />
      </button>
    </mt-dropdown-menu-trigger>

    <mt-dropdown-menu-portal>
      <!-- With the trigger's padding, the menu opens 8px below the avatar. The align offset moves
           the menu's end edge from the trigger's onto the avatar's. -->
      <mt-action-menu
        class="user-menu-prototype__menu"
        side="bottom"
        align="end"
        :side-offset="4"
        :align-offset="4"
      >
        <!-- Who is logged in, above the actions. Not a menu item, so keyboard focus skips it. -->
        <mt-action-menu-group>
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
/* A circle just around the avatar, as hover background and focus ring. */
.user-menu-prototype__trigger {
  display: flex;
  padding: var(--scale-size-4);
  color: inherit;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-round);
  cursor: pointer;
}

.user-menu-prototype__trigger:hover,
.user-menu-prototype__trigger[data-state="open"] {
  background: var(--color-interaction-secondary-hover);
}

.user-menu-prototype__trigger:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

/* The menu renders in a portal outside this component, where scoped styles don't reach. */
:global(.user-menu-prototype__menu) {
  min-width: var(--scale-size-256);
}

/* Lines up with the menu items below it. */
.user-menu-prototype__user {
  padding: var(--scale-size-8);
}
</style>
