<template>
  <div class="mt-sidebar-footer">
    <dropdown-menu-root>
      <dropdown-menu-trigger as-child>
        <button type="button" class="mt-sidebar-footer__trigger" :aria-label="triggerLabel">
          <mt-avatar
            class="mt-sidebar-footer__avatar"
            size="s"
            :first-name="firstName"
            :last-name="lastName"
            :image-url="imageUrl"
          />

          <div class="mt-sidebar-footer__text">
            <mt-text as="div" size="xs" weight="semibold" class="mt-sidebar-footer__name">
              {{ fullName }}
            </mt-text>
            <mt-text
              v-if="role"
              as="div"
              size="2xs"
              color="color-text-secondary-default"
              class="mt-sidebar-footer__role"
            >
              {{ role }}
            </mt-text>
          </div>

          <div class="mt-sidebar-footer__chevrons">
            <mt-icon name="regular-chevron-up-xs" size="var(--scale-size-8)" decorative />
            <mt-icon name="regular-chevron-down-xs" size="var(--scale-size-8)" decorative />
          </div>
        </button>
      </dropdown-menu-trigger>

      <dropdown-menu-portal>
        <mt-action-menu match-trigger-width side="top">
          <mt-action-menu-group v-if="$slots.default">
            <!-- @slot Further entries of the user menu, placed above the logout entry. Use mt-action-menu-item -->
            <slot />
          </mt-action-menu-group>

          <mt-action-menu-group>
            <mt-action-menu-item
              icon="regular-sign-out"
              variant="critical"
              @select="emit('logout')"
            >
              {{ logoutLabel ?? t("logoutLabel") }}
            </mt-action-menu-item>
          </mt-action-menu-group>

          <mt-action-menu-group v-if="version">
            <mt-text
              as="div"
              size="2xs"
              color="color-text-secondary-default"
              class="mt-sidebar-footer__version"
            >
              {{ t("version", { version }) }}
            </mt-text>
          </mt-action-menu-group>
        </mt-action-menu>
      </dropdown-menu-portal>
    </dropdown-menu-root>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtActionMenu from "../mt-action-menu/mt-action-menu.vue";
import MtActionMenuGroup from "../mt-action-menu-group/mt-action-menu-group.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";
import MtAvatar from "../mt-avatar/mt-avatar.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtText from "../mt-text/mt-text.vue";

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
    role?: string;
    /**
     * Image shown in the avatar instead of the initials.
     */
    imageUrl?: string;
    /**
     * Version shown at the bottom of the user menu, for example "6.7.0.0".
     */
    version?: string;
    /**
     * Accessible name of the button that opens the user menu. Defaults to the translated "User menu: <name>".
     */
    menuLabel?: string;
    /**
     * Label of the logout entry. Defaults to the translated "Log out".
     */
    logoutLabel?: string;
  }>(),
  {
    lastName: undefined,
    role: undefined,
    imageUrl: undefined,
    version: undefined,
    menuLabel: undefined,
    logoutLabel: undefined,
  },
);

const emit = defineEmits<{
  /**
   * Emitted when the logout entry of the user menu is chosen.
   */
  (e: "logout"): void;
}>();

defineSlots<{
  default?: null;
}>();

const { t } = useI18n({
  messages: {
    en: {
      menuLabel: "User menu: {name}",
      logoutLabel: "Log out",
      version: "Version {version}",
    },
    de: {
      menuLabel: "Benutzermenü: {name}",
      logoutLabel: "Abmelden",
      version: "Version {version}",
    },
  },
});

const fullName = computed(() => [props.firstName, props.lastName].filter(Boolean).join(" "));

const triggerLabel = computed(() => props.menuLabel ?? t("menuLabel", { name: fullName.value }));
</script>

<style scoped>
.mt-sidebar-footer {
  width: 100%;
}

.mt-sidebar-footer__trigger {
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

.mt-sidebar-footer__trigger:hover,
.mt-sidebar-footer__trigger[data-state="open"] {
  background: var(--color-interaction-secondary-hover);
}

.mt-sidebar-footer__trigger:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.mt-sidebar-footer__avatar {
  --mt-avatar-size: var(--scale-size-36);

  flex-shrink: 0;
}

.mt-sidebar-footer__text {
  flex: 1 1 auto;
  min-width: 0;
}

.mt-sidebar-footer__name,
.mt-sidebar-footer__role {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mt-sidebar-footer__chevrons {
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

.mt-sidebar-footer__version {
  margin: var(--scale-size-8);
}
</style>
