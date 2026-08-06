<template>
  <section class="mt-grant-permission-service-banner" :class="classes" :aria-labelledby="titleId">
    <!-- @slot Slot for replacing the default icon, for example with an illustration. -->
    <slot name="icon">
      <mt-icon
        v-if="!hideIcon"
        class="mt-grant-permission-service-banner__icon"
        :name="icon"
        :size="layout === 'vertical' ? 'var(--scale-size-32)' : 'var(--scale-size-24)'"
        decorative
      />
    </slot>

    <div class="mt-grant-permission-service-banner__body">
      <mt-text
        :id="titleId"
        as="h3"
        weight="bold"
        size="s"
        class="mt-grant-permission-service-banner__title"
      >
        {{ title }}
      </mt-text>

      <mt-text
        v-if="description"
        size="xs"
        color="color-text-secondary-default"
        class="mt-grant-permission-service-banner__description"
      >
        {{ description }}
      </mt-text>
    </div>

    <div class="mt-grant-permission-service-banner__actions">
      <mt-button
        variant="primary"
        class="mt-grant-permission-service-banner__grant"
        :is-loading="isLoading"
        :disabled="disabled"
        :block="layout === 'vertical'"
        @click="$emit('grant')"
      >
        {{ grantLabel ?? t("grant") }}
      </mt-button>

      <mt-button
        is="a"
        v-if="moreInfoUrl"
        variant="secondary"
        class="mt-grant-permission-service-banner__more-info"
        :href="moreInfoUrl"
        target="_blank"
        rel="noopener noreferrer"
        :block="layout === 'vertical'"
        @click="$emit('more-info')"
      >
        {{ moreInfoLabel ?? t("moreInfo") }}
      </mt-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import { useI18n } from "vue-i18n";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import MtButton from "@/components/mt-button/mt-button.vue";

const props = withDefaults(
  defineProps<{
    /**
     * Headline of the banner.
     */
    title: string;
    /**
     * Supporting text below the headline.
     */
    description?: string;
    /**
     * Arrangement of the banner content.
     *
     * "vertical" stacks icon, text and actions for narrow containers.
     * "compact" renders the actions below the text.
     * "wide" renders the actions next to the text.
     */
    layout?: "vertical" | "compact" | "wide";
    /**
     * Meteor icon which is shown next to the text.
     */
    icon?: string;
    hideIcon?: boolean;
    /**
     * Label of the button which starts the consent request.
     */
    grantLabel?: string;
    /**
     * Label of the secondary button which links to further information.
     */
    moreInfoLabel?: string;
    /**
     * Target of the secondary button. The button is only rendered when a target is given.
     */
    moreInfoUrl?: string;
    /**
     * Shows a loading state on the primary button while the consent request runs.
     */
    isLoading?: boolean;
    disabled?: boolean;
  }>(),
  {
    description: undefined,
    layout: "compact",
    icon: "regular-trust",
    hideIcon: false,
    grantLabel: undefined,
    moreInfoLabel: undefined,
    moreInfoUrl: undefined,
    isLoading: false,
    disabled: false,
  },
);

defineEmits<{
  grant: [];
  "more-info": [];
}>();

const { t } = useI18n({
  messages: {
    de: {
      grant: "Berechtigung erteilen",
      moreInfo: "Mehr erfahren",
    },
    en: {
      grant: "Grant permission",
      moreInfo: "More info",
    },
  },
});

const titleId = useId();

const classes = computed(() => `mt-grant-permission-service-banner--${props.layout}`);
</script>

<style scoped>
.mt-grant-permission-service-banner {
  display: grid;
  gap: var(--scale-size-8) var(--scale-size-12);
  padding: var(--scale-size-24);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-card);
  background-color: var(--color-elevation-surface-raised);
}

.mt-grant-permission-service-banner__icon {
  grid-area: icon;
  color: var(--color-icon-primary-default);
}

.mt-grant-permission-service-banner__body {
  grid-area: body;
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-2);
  min-width: 0;
}

.mt-grant-permission-service-banner__title {
  margin-block-end: 0;
}

.mt-grant-permission-service-banner__description {
  text-wrap: pretty;
}

.mt-grant-permission-service-banner__actions {
  grid-area: actions;
  display: flex;
  gap: var(--scale-size-8);
}

.mt-grant-permission-service-banner--vertical {
  grid-template-areas:
    "icon"
    "body"
    "actions";
  justify-items: center;
  text-align: center;
}

.mt-grant-permission-service-banner--vertical .mt-grant-permission-service-banner__actions {
  flex-direction: column;
  justify-self: stretch;
  margin-block-start: var(--scale-size-8);
}

.mt-grant-permission-service-banner--compact {
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "icon body"
    ".    actions";
}

.mt-grant-permission-service-banner--compact .mt-grant-permission-service-banner__actions {
  flex-wrap: wrap;
  margin-block-start: var(--scale-size-8);
}

.mt-grant-permission-service-banner--wide {
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "icon body actions";
  align-items: center;
}
</style>
