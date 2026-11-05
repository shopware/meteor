<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink, useRouter } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBrand,
  MtButton,
  MtIcon,
  MtText,
  MtUserMenu,
} from "@shopware-ag/meteor-component-library";
import AppHeaderMenu, { type HeaderLink } from "./AppHeaderMenu.vue";

defineProps<{
  /** Whether the shell shows its mobile layout, from the header slot of `mt-app`. */
  isMobile: boolean;
}>();

const { t } = useI18n();
const router = useRouter();

// A placeholder until the horizontal navigation component is merged.
const links: HeaderLink[] = [
  { to: "/", label: "nav.home", icon: "regular-home" },
  { to: "/editor", label: "nav.editor", icon: "regular-image-text" },
  { to: "/pages/getting-started", label: "nav.docs", icon: "regular-books" },
  {
    to: "/pages/release-notes",
    label: "nav.releaseNotes",
    icon: "regular-megaphone",
  },
  { to: "/settings", label: "nav.settings", icon: "regular-cog" },
];

const header = useTemplateRef("header");
const brand = useTemplateRef("brand");
const nav = useTemplateRef("nav");
const user = useTemplateRef("user");

/** Whether the links don't fit next to the brand and the user menu, so they move to the menu. */
const isCollapsed = ref(false);
const isMenuOpen = ref(false);

/**
 * Compares the width the header has with the width the brand, the links and the user menu need
 * side by side. The links stay measurable while collapsed, so they expand again once they fit.
 */
function updateCollapsed() {
  const brandElement = brand.value?.$el as HTMLElement | undefined;
  const userElement = user.value?.$el as HTMLElement | undefined;
  if (!header.value || !brandElement || !nav.value || !userElement) return;

  const gap = parseFloat(getComputedStyle(header.value).columnGap) || 0;
  const needed =
    brandElement.offsetWidth +
    nav.value.offsetWidth +
    userElement.offsetWidth +
    2 * gap;

  isCollapsed.value = needed > header.value.clientWidth;
  if (!isCollapsed.value) isMenuOpen.value = false;
}

let observer: ResizeObserver | undefined;

onMounted(() => {
  observer = new ResizeObserver(updateCollapsed);
  for (const element of [
    header.value,
    brand.value?.$el,
    nav.value,
    user.value?.$el,
  ]) {
    if (element instanceof Element) observer.observe(element);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div
    ref="header"
    class="app-header"
    :class="{ 'app-header--collapsed': isCollapsed }"
  >
    <div class="app-header__start">
      <mt-button
        v-if="isCollapsed"
        variant="tertiary"
        square
        :aria-label="t('menu.open')"
        aria-haspopup="dialog"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = true"
      >
        <mt-icon name="regular-bars" size="var(--scale-size-16)" decorative />
      </mt-button>

      <mt-brand
        ref="brand"
        title="Playground"
        subtitle="Shopware"
        :compact="isMobile"
      />
    </div>

    <nav
      ref="nav"
      class="app-header__nav"
      :aria-label="t('nav.label')"
      :inert="isCollapsed || undefined"
    >
      <RouterLink
        v-for="link in links"
        v-slot="{ isExactActive }"
        :key="link.to"
        :to="link.to"
        class="app-header__link"
      >
        <mt-text
          as="span"
          size="xs"
          weight="medium"
          :color="
            isExactActive
              ? 'color-text-primary-default'
              : 'color-text-secondary-default'
          "
        >
          {{ t(link.label) }}
        </mt-text>
      </RouterLink>
    </nav>

    <mt-user-menu
      ref="user"
      class="app-header__user"
      name="Jane Doe"
      subtitle="jane.doe@example.com"
      :compact="isMobile"
    >
      <mt-action-menu-group>
        <mt-action-menu-item
          icon="regular-cog"
          @select="router.push('/settings')"
        >
          {{ t("nav.settings") }}
        </mt-action-menu-item>
      </mt-action-menu-group>

      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-sign-out" variant="critical">
          {{ t("nav.logout") }}
        </mt-action-menu-item>
      </mt-action-menu-group>
    </mt-user-menu>

    <AppHeaderMenu v-model:open="isMenuOpen" :links="links" />
  </div>
</template>

<style scoped>
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--scale-size-24);
  min-width: 0;
  padding-block: var(--scale-size-8);
}

.app-header__start {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--scale-size-8);
}

.app-header__nav {
  display: flex;
  flex-shrink: 0;
  gap: var(--scale-size-4);
}

/* Out of the flow and invisible, but still measured to know when the links fit again. */
.app-header--collapsed .app-header__nav {
  position: absolute;
  visibility: hidden;
}

.app-header__link {
  padding: var(--scale-size-6) var(--scale-size-12);
  text-decoration: none;
  border-radius: var(--border-radius-s);
}

.app-header__link:hover,
.app-header__link[aria-current="page"] {
  background-color: var(--color-background-secondary-default);
}

/* The user menu fills the width of a sidebar footer by default. */
.app-header .app-header__user {
  flex-shrink: 0;
  width: auto;
  margin-inline-start: auto;
}
</style>
