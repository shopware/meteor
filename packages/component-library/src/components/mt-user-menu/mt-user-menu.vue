<template>
  <div class="mt-user-menu">
    <dropdown-menu-root>
      <dropdown-menu-trigger as-child>
        <button type="button" class="mt-user-menu__trigger">
          <mt-avatar
            class="mt-user-menu__avatar"
            aria-hidden="true"
            size="s"
            :first-name="firstName"
            :last-name="lastName"
            :image-url="imageUrl"
          />

          <div class="mt-user-menu__text">
            <mt-text as="div" size="xs" weight="semibold" class="mt-user-menu__name">
              {{ fullName }}
            </mt-text>
            <mt-text
              v-if="subtitle"
              as="div"
              size="2xs"
              color="color-text-secondary-default"
              class="mt-user-menu__subtitle"
            >
              {{ subtitle }}
            </mt-text>
          </div>

          <div class="mt-user-menu__chevrons">
            <mt-icon name="regular-chevron-up-xs" size="var(--scale-size-8)" decorative />
            <mt-icon name="regular-chevron-down-xs" size="var(--scale-size-8)" decorative />
          </div>
        </button>
      </dropdown-menu-trigger>

      <dropdown-menu-portal>
        <mt-action-menu match-trigger-width side="top">
          <slot />
        </mt-action-menu>
      </dropdown-menu-portal>
    </dropdown-menu-root>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtActionMenu from "../mt-action-menu/mt-action-menu.vue";
import MtAvatar from "../mt-avatar/mt-avatar.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtText from "../mt-text/mt-text.vue";

/**
 * The logged-in user as a button with avatar, name and an optional subtitle, which opens a menu
 * with the entries of the app.
 *
 * @experimental The API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /**
     * First name of the logged-in user. Shown next to the avatar and used for its initials.
     */
    firstName: string;
    /**
     * Last name of the logged-in user.
     */
    lastName?: string;
    /**
     * Second line below the name, for example the role of the user.
     */
    subtitle?: string;
    /**
     * Image shown in the avatar instead of the initials.
     */
    imageUrl?: string;
  }>(),
  {
    lastName: undefined,
    subtitle: undefined,
    imageUrl: undefined,
  },
);

defineSlots<{
  /**
   * The entries of the menu, such as a profile link and the logout. Use mt-action-menu-group and
   * mt-action-menu-item.
   */
  default?: null;
}>();

const fullName = computed(() => [props.firstName, props.lastName].filter(Boolean).join(" "));
</script>

<style scoped>
.mt-user-menu {
  width: 100%;
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

.mt-user-menu__avatar {
  --mt-avatar-size: var(--scale-size-36);

  flex-shrink: 0;
}

.mt-user-menu__text {
  flex: 1 1 auto;
  min-width: 0;
}

.mt-user-menu__name,
.mt-user-menu__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
