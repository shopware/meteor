<template>
  <div class="mt-empty-state">
    <div class="mt-empty-state__icon">
      <mt-icon :name="icon" color="var(--color-icon-primary-default)" aria-hidden="true" />
    </div>

    <mt-text as="h2" size="l" weight="bold" class="mt-empty-state__headline">
      {{ headline }}
    </mt-text>

    <mt-text size="xs" color="color-text-secondary-default" class="mt-empty-state__description">
      {{ description }}
    </mt-text>

    <mt-link
      v-if="linkHref && linkText"
      :href="linkHref"
      class="mt-empty-state__link"
      :type="linkType"
      :target="linkType === 'external' ? '_blank' : '_self'"
      as="a"
    >
      {{ linkText }}
    </mt-link>

    <div v-if="buttonText || $slots.button" class="mt-empty-state__button">
      <!-- @slot Slot for replacing default button. -->
      <slot name="button">
        <mt-button variant="primary" @click="$emit('button-click')">
          <mt-icon name="solid-plus-circle-s" />
          {{ buttonText }}
          <mt-icon name="solid-long-arrow-right" size="16px" />
        </mt-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import MtLink from "@/components/navigation/mt-link/mt-link.vue";

withDefaults(
  defineProps<{
    headline: string;
    description: string;
    icon: string;
    linkHref?: string;
    linkText?: string;
    linkType?: "external" | "internal";
    buttonText?: string;
  }>(),
  {
    linkType: "internal",
  },
);

defineEmits(["button-click"]);
</script>

<style scoped>
.mt-empty-state {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.mt-empty-state__icon {
  width: var(--scale-size-48);
  height: var(--scale-size-48);
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-xs);
  background-color: var(--color-background-tertiary-default);
}

.mt-empty-state__headline {
  margin-top: var(--scale-size-24);
  margin-bottom: 0;
}

.mt-empty-state__description {
  margin-top: var(--scale-size-8);
  text-wrap: pretty;
}

.mt-empty-state__link {
  margin-top: var(--scale-size-8);
}

.mt-empty-state__button {
  margin-top: var(--scale-size-24);
}
</style>
