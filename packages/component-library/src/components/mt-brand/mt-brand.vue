<template>
  <div class="mt-brand">
    <!-- @slot Logo next to the title. Replaces the whole default Shopware logo -->
    <slot name="logo">
      <div class="mt-brand__image">
        <mt-icon
          name="solid-shopware"
          size="var(--scale-size-26)"
          color="var(--color-static-white)"
          decorative
        />
      </div>
    </slot>

    <div class="mt-brand__text">
      <mt-text as="div" size="s" weight="semibold" class="mt-brand__title" :title="title">
        {{ title }}
      </mt-text>
      <mt-text
        v-if="subtitle"
        as="div"
        size="2xs"
        color="color-text-secondary-default"
        class="mt-brand__subtitle"
      >
        {{ subtitle }}
      </mt-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "../mt-icon/mt-icon.vue";
import MtText from "../mt-text/mt-text.vue";

/**
 * A logo with a title and an optional subtitle, for example the name of the shop in the header of
 * `mt-sidebar`. The default Shopware logo is decorative, as the title names the shop.
 *
 * @experimental The API may still change in a future release.
 */
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
  }>(),
  {
    subtitle: undefined,
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
  background: var(--color-icon-brand-default);
  border-radius: var(--border-radius-m);
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
