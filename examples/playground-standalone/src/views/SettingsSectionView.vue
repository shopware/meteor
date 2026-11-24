<script setup lang="ts">
import { computed, reactive, useId } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtAvatar,
  MtProgressBar,
  MtSwitch,
  MtText,
} from "@shopware-ag/meteor-component-library";
import { settingsSections } from "../data/settings";

const props = defineProps<{
  /** The id of the section, from the route. */
  section: string;
}>();

const { t } = useI18n();
const headingId = useId();

// The route only matches known sections.
const groups = computed(
  () => settingsSections.find(({ id }) => id === props.section)?.groups ?? [],
);

// The switches the user changed. The others show their example value.
const values = reactive<Record<string, boolean>>({});
</script>

<template>
  <div class="settings-section">
    <section
      v-for="group in groups"
      :key="group.id"
      class="settings-section__group"
      :aria-labelledby="`${headingId}-${group.id}`"
    >
      <mt-text
        :id="`${headingId}-${group.id}`"
        as="h3"
        size="xs"
        weight="semibold"
        color="color-text-secondary-default"
      >
        {{ t(`settings.groups.${group.id}`) }}
      </mt-text>

      <article
        v-for="card in group.cards"
        :key="card.id"
        class="settings-card"
        :aria-labelledby="`${headingId}-${card.id}`"
      >
        <div class="settings-card__header">
          <mt-text
            :id="`${headingId}-${card.id}`"
            as="h4"
            size="xs"
            weight="semibold"
          >
            {{ t(`settings.cards.${card.id}`) }}
          </mt-text>
        </div>

        <!-- Switches with their description, and placeholders shaped like them. -->
        <template v-if="card.layout === 'switches'">
          <template v-for="(row, index) in card.rows" :key="index">
            <div v-if="row" class="settings-card__row settings-switch">
              <mt-switch
                :model-value="values[row.setting] ?? row.on"
                :label="t(`settings.switches.${row.setting}.label`)"
                @update:model-value="
                  (value: boolean) => (values[row.setting] = value)
                "
              />
              <div class="settings-switch__description">
                <mt-text size="xs" color="color-text-secondary-default">
                  {{ t(`settings.switches.${row.setting}.description`) }}
                </mt-text>
              </div>
            </div>

            <div
              v-else
              class="settings-card__row settings-lines settings-lines--switch"
              aria-hidden="true"
            >
              <span class="settings-shape settings-shape--switch" />
              <span class="settings-bar settings-bar--40" />
              <span class="settings-bar settings-bar--72" />
            </div>
          </template>
        </template>

        <!-- Placeholders for form fields: a label above each field. -->
        <div
          v-else-if="card.layout === 'fields'"
          class="settings-card__body settings-fields"
          :class="{ 'settings-fields--inline': card.inline }"
          aria-hidden="true"
        >
          <div v-for="field in card.fields" :key="field" class="settings-field">
            <span class="settings-bar settings-bar--40" />
            <span class="settings-field__input" />
          </div>
        </div>

        <!-- The owner, and placeholders for the other members. -->
        <template v-else-if="card.layout === 'members'">
          <div class="settings-card__row settings-member">
            <mt-avatar
              size="s"
              :first-name="card.owner.firstName"
              :last-name="card.owner.lastName"
            />
            <div class="settings-member__text">
              <mt-text size="xs" weight="semibold">
                {{ card.owner.firstName }} {{ card.owner.lastName }}
              </mt-text>
              <mt-text size="xs" color="color-text-secondary-default">
                {{ card.owner.email }}
              </mt-text>
            </div>
            <mt-text size="xs" color="color-text-secondary-default">
              {{ t("settings.owner") }}
            </mt-text>
          </div>

          <div
            v-for="row in card.placeholders"
            :key="row"
            class="settings-card__row settings-member"
            aria-hidden="true"
          >
            <span class="settings-shape settings-shape--avatar" />
            <span class="settings-member__text settings-lines">
              <span class="settings-bar settings-bar--40" />
              <span class="settings-bar settings-bar--64" />
            </span>
            <span class="settings-shape settings-shape--badge" />
          </div>
        </template>

        <!-- The plan with a placeholder for its price, and the usage. -->
        <div
          v-else-if="card.layout === 'plan'"
          class="settings-card__body settings-plan"
        >
          <div class="settings-plan__summary">
            <mt-text size="s" weight="semibold">{{ card.plan }}</mt-text>
            <span class="settings-bar settings-bar--24" aria-hidden="true" />
          </div>
          <mt-progress-bar
            :model-value="card.runs"
            :max-value="card.limit"
            :label="t('settings.runs')"
          />
        </div>

        <!-- The card with a placeholder for its brand. -->
        <div
          v-else-if="card.layout === 'payment'"
          class="settings-card__body settings-payment"
        >
          <span
            class="settings-shape settings-shape--card"
            aria-hidden="true"
          />
          <div>
            <mt-text size="xs" weight="semibold">
              {{ t("settings.cardNumber") }}
            </mt-text>
            <mt-text size="xs" color="color-text-secondary-default">
              {{ t("settings.cardExpiry") }}
            </mt-text>
          </div>
        </div>

        <!-- The column names, and placeholders for the invoices. -->
        <template v-else-if="card.layout === 'invoices'">
          <div class="settings-card__row settings-invoice">
            <mt-text
              v-for="column in ['date', 'amount', 'status']"
              :key="column"
              size="xs"
              color="color-text-secondary-default"
            >
              {{ t(`settings.invoiceColumns.${column}`) }}
            </mt-text>
          </div>

          <div
            v-for="row in card.rows"
            :key="row"
            class="settings-card__row settings-invoice"
            aria-hidden="true"
          >
            <span class="settings-bar settings-bar--64" />
            <span class="settings-bar settings-bar--40" />
            <span class="settings-shape settings-shape--badge" />
            <span class="settings-shape settings-shape--icon" />
          </div>
        </template>
      </article>
    </section>
  </div>
</template>

<style scoped>
.settings-section {
  display: grid;
  gap: var(--scale-size-32);
}

.settings-section__group {
  display: grid;
  gap: var(--scale-size-12);
}

.settings-card {
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-card);
  background: var(--color-elevation-surface-raised);
}

.settings-card__header,
.settings-card__row,
.settings-card__body {
  padding: var(--scale-size-16);
}

.settings-card__row,
.settings-card__body {
  border-block-start: var(--scale-size-1) solid
    var(--color-border-secondary-default);
}

.settings-switch {
  display: grid;
  gap: var(--scale-size-4);
}

/* In line with the label, after the switch and its gap. */
.settings-switch__description {
  padding-inline-start: calc(var(--scale-size-24) + var(--scale-size-8));
}

/*
 * Custom, because mt-skeleton-bar shimmers like content that is loading. Each placeholder line is
 * as high as a line of text, so placeholders take the room of the content they stand in for.
 */
.settings-lines {
  display: grid;
  grid-auto-rows: var(--font-line-height-xs);
  align-items: center;
  row-gap: var(--scale-size-4);
}

.settings-lines--switch {
  grid-template-columns: var(--scale-size-24) minmax(0, 1fr);
  column-gap: var(--scale-size-8);
}

.settings-lines--switch > .settings-bar {
  grid-column: 2;
}

.settings-bar,
.settings-shape,
.settings-field__input {
  background: var(--color-background-tertiary-default);
}

.settings-bar {
  height: var(--scale-size-8);
  border-radius: var(--border-radius-round);
}

.settings-bar--24 {
  width: 24%;
}

.settings-bar--40 {
  width: 40%;
}

.settings-bar--64 {
  width: 64%;
}

.settings-bar--72 {
  width: 72%;
}

.settings-shape {
  flex-shrink: 0;
  border-radius: var(--border-radius-round);
}

/* As big as mt-switch. */
.settings-shape--switch {
  width: var(--scale-size-24);
  height: var(--scale-size-16);
}

/* As big as the small mt-avatar. */
.settings-shape--avatar {
  width: var(--scale-size-32);
  height: var(--scale-size-32);
}

.settings-shape--badge {
  width: var(--scale-size-48);
  height: var(--scale-size-20);
}

.settings-shape--card {
  width: var(--scale-size-40);
  height: var(--scale-size-28);
  border-radius: var(--border-radius-xs);
}

.settings-shape--icon {
  width: var(--scale-size-16);
  height: var(--scale-size-16);
  border-radius: var(--border-radius-xs);
}

.settings-fields {
  display: grid;
  gap: var(--scale-size-16);
}

.settings-fields--inline {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.settings-field {
  display: grid;
  gap: var(--scale-size-8);
}

.settings-field__input {
  height: var(--scale-size-40);
  border-radius: var(--border-radius-xs);
}

.settings-member,
.settings-payment {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
}

.settings-member__text {
  flex: 1 1 auto;
  min-width: 0;
}

.settings-plan {
  display: grid;
  gap: var(--scale-size-16);
}

.settings-plan__summary {
  display: grid;
  gap: var(--scale-size-8);
}

.settings-invoice {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr var(--scale-size-16);
  align-items: center;
  gap: var(--scale-size-16);
}
</style>
