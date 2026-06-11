<template>
  <main class="home-hero">
    <section class="home-hero__intro">
      <p class="home-hero__eyebrow">Meteor Design System</p>
      <h1 class="home-hero__title">Build Shopware interfaces with Meteor.</h1>
      <p class="home-hero__description">
        Components, tokens, and guidelines for building consistent commerce
        experiences across Shopware products.
      </p>
      <div class="home-hero__actions">
        <NuxtLink
          class="home-hero__action home-hero__action--primary"
          to="/getting-started/introduction"
        >
          Get started
        </NuxtLink>
        <NuxtLink class="home-hero__action" to="/components/button">
          Browse components
        </NuxtLink>
      </div>
    </section>

    <section class="home-hero__links" aria-label="Documentation shortcuts">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="home-hero__link"
      >
        <span class="home-hero__link-label">{{ link.label }}</span>
        <span class="home-hero__link-text">{{ link.text }}</span>
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const links = [
  {
    label: "Designers",
    text: "Principles, accessibility, wording, and visual foundations.",
    to: "/getting-started/designers",
  },
  {
    label: "Developers",
    text: "Install packages and wire components, tokens, icons, and i18n.",
    to: "/getting-started/developers",
  },
  {
    label: "Tokens",
    text: "Use semantic color, typography, spacing, radius, and elevation tokens.",
    to: "/foundations/tokens/tokens-overview",
  },
];
</script>

<style scoped>
.home-hero {
  min-height: calc(100vh - 64px);
  padding: clamp(48px, 9vw, 112px) clamp(24px, 7vw, 96px);
  background: var(--color-elevation-surface-default);
  color: var(--color-text-primary-default);
}

.home-hero__intro {
  max-width: 760px;
}

.home-hero__eyebrow {
  margin: 0 0 16px;
  color: var(--color-text-brand-default);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0;
  text-transform: uppercase;
}

.home-hero__title {
  margin: 0;
  max-width: 720px;
  color: var(--color-text-primary-default);
  font-size: 72px;
  line-height: 1;
  font-weight: var(--font-weight-bold);
  letter-spacing: 0;
}

.home-hero__description {
  margin: 24px 0 0;
  max-width: 660px;
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-l);
  line-height: var(--font-line-height-l);
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.home-hero__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--color-border-primary-default);
  border-radius: 6px;
  color: var(--color-text-primary-default);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.home-hero__action--primary {
  border-color: var(--color-interaction-primary-default);
  background: var(--color-interaction-primary-default);
  color: var(--color-text-inverse-default);
}

.home-hero__links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: clamp(56px, 8vw, 96px);
  max-width: 1040px;
}

.home-hero__link {
  min-height: 148px;
  padding: 20px;
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
  background: var(--color-elevation-surface-raised);
  color: var(--color-text-primary-default);
  text-decoration: none;
}

.home-hero__link:hover {
  border-color: var(--color-border-brand-default);
}

.home-hero__link-label {
  display: block;
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-bold);
}

.home-hero__link-text {
  display: block;
  margin-top: 8px;
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
}

@media (max-width: 760px) {
  .home-hero {
    padding: 40px 20px;
  }

  .home-hero__title {
    font-size: 42px;
  }

  .home-hero__links {
    grid-template-columns: 1fr;
  }
}
</style>
