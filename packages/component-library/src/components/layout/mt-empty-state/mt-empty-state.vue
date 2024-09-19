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

    <mt-external-link v-if="linkHref && linkText" class="mt-empty-state__link" :href="linkHref">
      {{ linkText }}
    </mt-external-link>

    <mt-button
      v-if="buttonText"
      class="mt-empty-state__button"
      variant="primary"
      @click="$emit('button-click')"
    >
      <mt-icon name="solid-plus-circle-s" />
      {{ buttonText }}
      <mt-icon name="solid-long-arrow-right" size="16px" />
    </mt-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtExternalLink from "@/components/form/mt-external-link/mt-external-link.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";

export default defineComponent({
  name: "MtEmptyState",

  components: {
    MtIcon,
    MtExternalLink,
    MtButton,
    MtText,
  },

  props: {
    headline: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      required: false,
      default: "solid-content",
    },

    linkHref: {
      type: String,
      required: false,
      default: undefined,
    },

    linkText: {
      type: String,
      required: false,
      default: undefined,
    },

    buttonText: {
      type: String,
      required: false,
      default: undefined,
    },
  },

  emits: ["button-click"],
});
</script>

<style scoped>
.mt-empty-state__icon {
  display: inline-block;
  padding: 0.75rem;
  border-radius: var(--border-radius-xs);
  background-color: var(--color-interaction-secondary-dark);
  margin-block-end: 1.5rem;
}

.mt-empty-state__headline {
  margin-block-end: 0.5rem;
}

.mt-empty-state__link {
  margin-block-start: 0.5rem;
  display: block;
}

.mt-empty-state__button {
  margin-block-start: 1.5rem;
}
</style>
