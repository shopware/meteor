<template>
  <section class="mt-grant-permission-service-banner" :class="classes" :aria-labelledby="titleId">
      <mt-icon
        class="mt-grant-permission-service-banner__icon"
        name="regular-3d"
        size="32"
        decorative
      />

    <div class="mt-grant-permission-service-banner__body">
      <mt-text
        :id="titleId"
        as="h3"
        weight="bold"
        size="xs"
        class="mt-grant-permission-service-banner__title"
      >
        {{ t('title') }}
      </mt-text>

      <mt-text
        size="2xs"
        color="color-text-secondary-default"
        class="mt-grant-permission-service-banner__description"
      >
        {{ t('description') }}
      </mt-text>
    </div>

    <div class="mt-grant-permission-service-banner__actions">
      <mt-button
        variant="primary"
        class="mt-grant-permission-service-banner__grant"
        :is-loading="isLoading"
        :disabled="disabled"
        :block="layout === 'vertical'"
        @click="handleGrantPermission"
      >
        {{ layout === 'vertical' ? t("grantLabel") : t("grantLongLabel") }}
      </mt-button>

      <mt-button
        is="a"
        variant="secondary"
        class="mt-grant-permission-service-banner__more-info"
        :href="t('moreInfoUrl')"
        target="_blank"
        rel="noopener noreferrer"
        :block="layout === 'vertical'"
      >
        {{ t("moreInfo") }}
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
     * Arrangement of the banner content.
     *
     * "vertical" stacks icon, text and actions for narrow containers.
     * "compact" renders the actions below the text.
     * "wide" renders the actions next to the text.
     */
    layout?: "vertical" | "compact" | "wide";
  }>(),
  {
    layout: "compact",
  },
);

const { t } = useI18n({
  messages: {
    de: {
      title: "Erteilen Sie die Berechtigung, um diesen Dienst zu aktivieren.",
      description: "Es werden nur die für die Funktion erforderlichen Daten abgerufen.",
      grantLabel: "Berechtigung erteilen",
      grantLongLabel :"Berechtigung erteilen und aktivieren",
      moreInfo: "Mehr erfahren",
      moreInfoUrl: "https://www.shopware.com/de/",
    },
    en: {
      title: "Grant permission to activate this service.",
      description: "Only the data needed to function will be accessed.",
      grantLabel: "Grant permission",
      grantLongLabel: "Grant permission and activate",
      moreInfo: "More info",
      moreInfoUrl: "https://www.shopware.com/en/",
    },
  },
});

const titleId = useId();

const classes = computed(() => `mt-grant-permission-service-banner--${props.layout}`);

function handleGrantPermission() {
  // TODO: Implement the logic to handle granting permission

}
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
  width: fit-content;
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
