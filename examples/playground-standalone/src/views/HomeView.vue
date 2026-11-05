<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtCard,
  MtLayout,
  MtPage,
  MtText,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

// Placeholder content: a marketing overview without real data behind it.
const stats = [
  { label: "Visitors", value: "12,480", change: "+8% compared to last month" },
  { label: "Conversion rate", value: "3.2%", change: "+0.4 points" },
  { label: "Revenue", value: "€24,310", change: "+12% compared to last month" },
];

const campaigns = [
  { name: "Spring sale", channel: "Email and storefront", status: "Running" },
  { name: "New arrivals", channel: "Social media", status: "Scheduled" },
  { name: "Loyalty points", channel: "Email", status: "Draft" },
  { name: "Winter clearance", channel: "Storefront", status: "Ended" },
];

const ideas = [
  "Remind customers about items left in their cart.",
  "Offer free shipping above a minimum order value.",
  "Ask happy customers for a product review.",
];
</script>

<template>
  <mt-page width="m" :breadcrumb="[{ label: t('home.title'), icon: 'home' }]">
    <mt-layout>
      <mt-card title="Spring sale" subtitle="Running until 31 May">
        <div class="home-card">
          <mt-text size="s">
            Seasonal offers on garden and outdoor products, announced by email
            and on the storefront.
          </mt-text>
          <div class="home-card__actions">
            <mt-button variant="secondary">Edit campaign</mt-button>
            <mt-button variant="secondary">View report</mt-button>
          </div>
        </div>
      </mt-card>

      <mt-card title="This month">
        <dl class="home-stats">
          <div v-for="stat in stats" :key="stat.label" class="home-stats__item">
            <mt-text as="dt" size="xs" color="color-text-secondary-default">
              {{ stat.label }}
            </mt-text>
            <mt-text as="dd" size="xl" weight="semibold">
              {{ stat.value }}
            </mt-text>
            <mt-text as="dd" size="xs" color="color-text-secondary-default">
              {{ stat.change }}
            </mt-text>
          </div>
        </dl>
      </mt-card>

      <mt-card title="Campaigns">
        <ul class="home-list">
          <li
            v-for="campaign in campaigns"
            :key="campaign.name"
            class="home-list__item"
          >
            <div>
              <mt-text size="s" weight="medium">{{ campaign.name }}</mt-text>
              <mt-text size="xs" color="color-text-secondary-default">
                {{ campaign.channel }}
              </mt-text>
            </div>
            <mt-text size="xs" color="color-text-secondary-default">
              {{ campaign.status }}
            </mt-text>
          </li>
        </ul>
      </mt-card>

      <!-- The side column sits directly on the page, without cards. -->
      <template #end>
        <section class="home-aside">
          <div>
            <mt-text as="h2" size="s" weight="semibold">Newsletter</mt-text>
            <mt-text size="xs" color="color-text-secondary-default">
              2,340 subscribers
            </mt-text>
          </div>
          <mt-text size="s">
            The next issue goes out on Friday. Add a product highlight before
            Thursday.
          </mt-text>
          <div class="home-card__actions">
            <mt-button variant="secondary">Open draft</mt-button>
          </div>
        </section>

        <section class="home-aside">
          <mt-text as="h2" size="s" weight="semibold">Ideas</mt-text>
          <ul class="home-ideas">
            <li v-for="idea in ideas" :key="idea">
              <mt-text size="s">{{ idea }}</mt-text>
            </li>
          </ul>
        </section>
      </template>
    </mt-layout>
  </mt-page>
</template>

<style scoped>
.home-card {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}

.home-aside {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
  padding-block-end: var(--scale-size-24);
  border-block-end: var(--scale-size-1) solid
    var(--color-border-secondary-default);
}

.home-aside:last-child {
  padding-block-end: 0;
  border-block-end: none;
}

.home-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-8);
}

.home-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: var(--scale-size-16);
  margin: 0;
}

.home-stats__item {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
}

.home-stats__item dd {
  margin: 0;
}

.home-list,
.home-ideas {
  margin: 0;
  padding: 0;
  list-style: none;
}

.home-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-16);
  padding-block: var(--scale-size-12);
  border-block-end: var(--scale-size-1) solid
    var(--color-border-secondary-default);
}

.home-list__item:first-child {
  padding-block-start: 0;
}

.home-list__item:last-child {
  padding-block-end: 0;
  border-block-end: none;
}

.home-ideas {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
}
</style>
