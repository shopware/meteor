<template>
  <div class="mt-empty-state">
    <div class="mt-empty-state__icon">
      <mt-icon :name="icon" />
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
import { defineComponent, type PropType } from "vue";
import type { TranslateResult } from "vue-i18n";
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
      type: String as PropType<string | TranslateResult>,
      required: true,
    },

    description: {
      type: String as PropType<string | TranslateResult>,
      required: true,
    },

    icon: {
      type: String,
      required: false,
      default: "solid-content",
    },

    linkHref: {
      type: String as PropType<string | TranslateResult>,
      required: false,
      default: undefined,
    },

    linkText: {
      type: String as PropType<string | TranslateResult>,
      required: false,
      default: undefined,
    },

    buttonText: {
      type: String as PropType<string | TranslateResult>,
      required: false,
      default: undefined,
    },
  },

  emits: ["button-click"],
});
</script>

<style lang="scss">
.mt-empty-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &__icon {
    display: inline-block;
    padding: 12px;
    border-radius: var(--border-radius-xs);
    background-color: var(--color-interaction-secondary-dark);

    svg {
      color: var(--color-icon-primary-default);
    }
  }

  &__headline {
    margin: 16px 0 0;
  }

  &__description {
    margin-top: 8px;
  }

  &__link {
    margin-top: 8px;
  }

  &__button {
    margin-top: 16px;
  }
}
</style>
