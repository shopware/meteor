<template>
  <div class="mt-brand" :title="compact ? title : undefined">
    <!-- @slot Logo next to the title. Replaces the whole default logo, including its box -->
    <slot name="logo">
      <div class="mt-brand__image" :class="`mt-brand__image--${appearance}`">
        <mt-icon :name="productLogos[variant].icon" :size="productLogos[variant].size" decorative />
      </div>
    </slot>

    <div class="mt-brand__text" :class="{ 'visually-hidden': compact }">
      <mt-text as="div" size="s" weight="semibold" class="mt-brand__title" :title="title">
        {{ title }}
      </mt-text>
      <mt-text v-if="subtitle" as="div" size="2xs" class="mt-brand__subtitle">
        {{ subtitle }}
      </mt-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "../mt-icon/mt-icon.vue";
import MtText from "../mt-text/mt-text.vue";

const productLogos = {
  // The share of the box each mark takes in the product logos
  shopware: { icon: "solid-shopware", size: "60%" },
  copilot: { icon: "solid-shopware-copilot", size: "53%" },
  intelligence: { icon: "solid-shopware-intelligence", size: "60%" },
  nexus: { icon: "solid-shopware-nexus", size: "60%" },
  payments: { icon: "solid-shopware-payments", size: "68%" },
} as const;

/**
 * A logo with a title and an optional subtitle, for example the name of the shop in the header of
 * `mt-sidebar`. The default logo is decorative, as the title names the shop.
 *
 * @experimental The API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /**
     * Name next to the logo, for example the name of the shop. Cut off with an ellipsis when too long.
     */
    title?: string;
    /**
     * Second line below the title, for example the name of the product. An empty string hides it.
     */
    subtitle?: string;
    /**
     * The Shopware product whose logo is shown.
     */
    variant?: "shopware" | "copilot" | "intelligence" | "nexus" | "payments";
    /**
     * Colors of the logo. `dark` shows a white mark on a brand box, `light` a brand mark on a white box.
     */
    appearance?: "dark" | "light";
    /**
     * Shows only the logo. The title and subtitle stay available to screen readers, and the title
     * shows on hover.
     */
    compact?: boolean;
  }>(),
  {
    title: "Meteor",
    subtitle: "Shopware",
    variant: "shopware",
    appearance: "dark",
    compact: false,
  },
);

defineSlots<{
  logo?: null;
}>();
</script>

<style scoped>
.mt-brand {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  min-width: 0;
}

.mt-brand__image {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  border-radius: 29%;
}

.mt-brand__image--dark {
  color: var(--color-static-white);
  background: var(--color-icon-brand-default);
}

.mt-brand__image--light {
  color: var(--color-icon-brand-default);
  background: var(--color-static-white);
}

.mt-brand__text {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  margin-block-start: calc(-1 * var(--scale-size-1));
}

.mt-brand__title,
.mt-brand__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.4;
}
</style>
