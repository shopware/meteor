<template>
  <div class="mt-user-menu" :class="{ 'mt-user-menu--compact': compact }">
    <dropdown-menu-root>
      <dropdown-menu-trigger as-child>
        <button type="button" class="mt-user-menu__trigger">
          <mt-user
            class="mt-user-menu__user"
            :name="name"
            :subtitle="subtitle"
            :image-url="imageUrl"
            :compact="compact"
          />

          <span v-if="!compact" class="mt-user-menu__chevrons">
            <mt-icon name="regular-chevron-up-xs" size="var(--scale-size-8)" decorative />
            <mt-icon name="regular-chevron-down-xs" size="var(--scale-size-8)" decorative />
          </span>
        </button>
      </dropdown-menu-trigger>

      <dropdown-menu-portal>
        <mt-action-menu :match-trigger-width="!compact" side="top">
          <slot />
        </mt-action-menu>
      </dropdown-menu-portal>
    </dropdown-menu-root>
  </div>
</template>

<script setup lang="ts">
import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtActionMenu from "@/components/mt-action-menu/mt-action-menu.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtUser from "@/components/mt-user/mt-user.vue";

/**
 * The logged-in user as a button with avatar, name and an optional subtitle, which opens a menu
 * with the entries of the app.
 *
 * @experimental The API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The display name of the logged-in user. The avatar shows the initials of its first and last word. */
    name: string;
    /** A second line below the name, for example the role of the user. */
    subtitle?: string;
    /** An image for the avatar instead of the initials. */
    imageUrl?: string;
    /**
     * Shows only the avatar. The name and the subtitle stay available to assistive technology, and
     * the name shows on hover.
     */
    compact?: boolean;
  }>(),
  {
    subtitle: undefined,
    imageUrl: undefined,
    compact: false,
  },
);

defineSlots<{
  /**
   * The entries of the menu, such as a profile link and the logout. Use `mt-action-menu-group` and
   * `mt-action-menu-item`.
   */
  default?(): unknown;
}>();
</script>

<style scoped>
.mt-user-menu {
  width: 100%;
}

.mt-user-menu--compact {
  width: fit-content;
}

.mt-user-menu__trigger {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  width: 100%;
  padding: var(--scale-size-8);
  border: none;
  border-radius: var(--border-radius-s);
  background: transparent;
  color: inherit;
  text-align: start;
  cursor: pointer;
}

.mt-user-menu__trigger:hover,
.mt-user-menu__trigger[data-state="open"] {
  background: var(--color-interaction-secondary-hover);
}

.mt-user-menu__trigger:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.mt-user-menu__user {
  flex: 1 1 auto;
}

.mt-user-menu__chevrons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--scale-size-6);
  flex-shrink: 0;
  width: var(--scale-size-20);
  height: var(--scale-size-20);
  color: var(--color-icon-primary-default);
}
</style>
