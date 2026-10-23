<template>
  <div class="mt-logo">
    <!-- @slot Logo next to the title. Replaces the whole default Shopware logo -->
    <slot name="logo">
      <div class="mt-logo__image">
        <mt-icon
          name="solid-shopware"
          size="var(--scale-size-26)"
          color="var(--color-static-white)"
          :role="logoLabel ? 'img' : undefined"
          :aria-label="logoLabel"
          :decorative="!logoLabel"
        />
      </div>
    </slot>

    <div class="mt-logo__text">
      <mt-text as="div" size="s" weight="semibold" class="mt-logo__title" :title="title">
        {{ title }}
      </mt-text>
      <mt-text
        v-if="subtitle"
        as="div"
        size="2xs"
        color="color-text-secondary-default"
        class="mt-logo__subtitle"
      >
        {{ subtitle }}
      </mt-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "../mt-icon/mt-icon.vue";
import MtText from "../mt-text/mt-text.vue";

withDefaults(
  defineProps<{
    /**
     * Name next to the logo, for example the name of the shop. Cut off with an ellipsis when too long.
     */
    title: string;
    /**
     * Second line below the title, for example the name of the product.
     */
    subtitle?: string;
    /**
     * Accessible name of the default Shopware logo. Without it, the logo is decorative and hidden
     * from screen readers, as the title and subtitle next to it already name the shop.
     */
    logoLabel?: string;
  }>(),
  {
    subtitle: undefined,
    logoLabel: undefined,
  },
);

defineSlots<{
  logo?: null;
}>();
</script>

<style scoped>
.mt-logo {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  min-width: 0;
}

.mt-logo__image {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  background: var(--color-icon-brand-default);
  border-radius: var(--border-radius-m);
}

.mt-logo__text {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  margin-block-start: calc(-1 * var(--scale-size-1));
}

.mt-logo__title,
.mt-logo__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.4;
}
</style>
