<template>
  <!-- The container establishes the query context the banner sizes itself against. -->
  <div v-if="isShowUI" class="mt-grant-permission-service-banner__container">
    <section class="mt-grant-permission-service-banner" :aria-labelledby="titleId">
      <mt-icon
        class="mt-grant-permission-service-banner__icon"
        name="regular-trust"
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
          {{ t("title") }}
        </mt-text>

        <mt-text
          size="2xs"
          color="color-text-secondary-default"
          class="mt-grant-permission-service-banner__description"
        >
          {{ t("description") }}
        </mt-text>
      </div>

      <div class="mt-grant-permission-service-banner__actions">
        <mt-button
          variant="primary"
          class="mt-grant-permission-service-banner__grant"
          :is-loading="isLoading"
          @click="handleGrantPermission"
        >
          <!--
            Both labels are rendered and the container query hides one of them, so that
            the wording can follow the available width without a JavaScript measurement.
            The hidden label is `display: none` and therefore excluded from the
            accessible name.
          -->
          <span class="mt-grant-permission-service-banner__label--short">
            {{ t("grantLabel") }}
          </span>
          <span class="mt-grant-permission-service-banner__label--long">
            {{ t("grantLongLabel") }}
          </span>
        </mt-button>

        <mt-button
          is="a"
          variant="secondary"
          class="mt-grant-permission-service-banner__more-info"
          :href="t('moreInfoUrl')"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t("moreInfo") }}
        </mt-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, useId } from "vue";
import { asyncComputed } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import { grant, isGranted } from "@shopware-ag/meteor-admin-sdk/es/_private/permissions";
import { isService } from "@shopware-ag/meteor-admin-sdk/es/_private/context";

const { t } = useI18n({
  messages: {
    de: {
      title: "Erteilen Sie die Berechtigung, um diesen Dienst zu aktivieren.",
      description: "Es werden nur die für die Funktion erforderlichen Daten abgerufen.",
      grantLabel: "Berechtigung erteilen",
      grantLongLabel :"Berechtigung erteilen und aktivieren",
      moreInfo: "Mehr erfahren",
      moreInfoUrl: "https://docs.shopware.com/de/shopware-6-en/shopware-services",
    },
    en: {
      title: "Grant permission to activate this service.",
      description: "Only the data needed to function will be accessed.",
      grantLabel: "Grant permission",
      grantLongLabel: "Grant permission and activate",
      moreInfo: "More info",
      moreInfoUrl: "https://docs.shopware.com/en/shopware-6-en/shopware-services",
    },
  },
});

const titleId = useId();

const isLoading = ref(false);

const isShowUI = asyncComputed(
  async() => {
    return await isService() && await !isGranted();
  },
  false,
)

async function handleGrantPermission() {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    await grant();
  } catch (error) {
    console.error("Error granting permission:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.mt-grant-permission-service-banner__container {
  container-type: inline-size;
  container-name: mt-grant-permission-service-banner;
}

.mt-grant-permission-service-banner {
  display: grid;
  gap: var(--scale-size-8) var(--scale-size-12);
  padding: var(--scale-size-24);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-card);
  background-color: var(--color-elevation-surface-raised);
  grid-template-areas:
    "icon"
    "body"
    "actions";
  justify-items: center;
  text-align: center;
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
  flex-direction: column;
  justify-self: stretch;
  margin-block-start: var(--scale-size-8);
}

.mt-grant-permission-service-banner__actions .mt-button {
  width: 100%;
}

.mt-grant-permission-service-banner__label--long {
  display: none;
}

@container mt-grant-permission-service-banner (width >= 25rem) {
  .mt-grant-permission-service-banner {
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "icon body"
      ".    actions";
    justify-items: start;
    text-align: start;
  }

  .mt-grant-permission-service-banner__actions {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .mt-grant-permission-service-banner__actions .mt-button {
    width: auto;
  }

  .mt-grant-permission-service-banner__label--short {
    display: none;
  }

  .mt-grant-permission-service-banner__label--long {
    display: revert;
  }
}

@container mt-grant-permission-service-banner (width >= 43rem) {
  .mt-grant-permission-service-banner {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "icon body actions";
    align-items: center;
  }

  .mt-grant-permission-service-banner__actions {
    flex-wrap: nowrap;
    margin-block-start: 0;
  }
}
</style>
