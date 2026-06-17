<script setup lang="ts">
// Having this page makes Docus skip its own `/` route and `landing` collection
// (docus/utils/pages.ts: landingPageExists), so this owns the home route.
definePageMeta({
  layout: "default",
});

const appConfig = useAppConfig();

const githubUrl = appConfig.github?.url ?? "https://github.com/shopware/meteor";
const npmUrl =
  "https://www.npmjs.com/package/@shopware-ag/meteor-component-library";

const title = "Meteor Design System";
const description =
  "Shopware's open-source design system for administrative interfaces. Ship faster with solid foundations, flexible components, design tokens, and a complete icon set.";

useSeo({
  title,
  description,
  type: "website",
});

defineOgImage("Landing", {
  title: title.slice(0, 60),
  description: formatOgDescription(title, description),
});

const btnBase =
  "relative inline-flex min-h-12 cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-5 py-3 text-center text-sm font-semibold transition-colors duration-100 ease-in-out";

const resources = [
  {
    label: "Changelog",
    description: "What's new across every Meteor package.",
    icon: "i-lucide-history",
    to: "https://github.com/shopware/meteor/releases",
  },
  {
    label: "Shopware docs",
    description: "Documentation for the Shopware platform.",
    icon: "i-lucide-book-open",
    to: "https://developer.shopware.com/",
  },
  {
    label: "Brand assets & guidelines",
    description: "Logos, colors, and downloadable brand assets.",
    icon: "i-lucide-palette",
    to: "https://brand.shopware.com/",
  },
];

// Reveal the cards on scroll; reduced-motion users get them immediately via the
// motion-reduce utilities in the template.
const exploreSection = ref<HTMLElement | null>(null);
const exploreRevealed = ref(false);
let exploreObserver: IntersectionObserver | undefined;

onMounted(() => {
  const el = exploreSection.value;
  if (!el || !("IntersectionObserver" in window)) {
    exploreRevealed.value = true;
    return;
  }

  exploreObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        exploreRevealed.value = true;
        exploreObserver?.disconnect();
      }
    },
    { threshold: 0.15 },
  );
  exploreObserver.observe(el);
});

onBeforeUnmount(() => exploreObserver?.disconnect());
</script>

<template>
  <div class="landing">
    <section class="hero relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 hidden bg-[radial-gradient(120%_75%_at_50%_0%,color-mix(in_oklab,var(--color-brand-500)_16%,transparent),transparent_60%)] dark:block"
      />
      <LandingStarfield class="-z-10 hidden dark:block" />
      <div
        aria-hidden="true"
        class="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-[linear-gradient(to_bottom,transparent,var(--hero-edge))]"
      />

      <UContainer
        class="mx-auto flex flex-col items-center py-16 text-center sm:py-24 lg:py-28"
      >
        <h1 class="hero-rise type-heading-2xl max-w-4xl text-highlighted">
          Build Shopware experiences consistently, fast.
        </h1>

        <p
          class="hero-rise type-body-lg mt-4 max-w-2xl text-muted sm:mt-6"
          :style="{ animationDelay: '80ms' }"
        >
          {{ description }}
        </p>

        <div
          class="hero-rise mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-9 lg:mt-10"
          :style="{ animationDelay: '160ms' }"
        >
          <NuxtLink
            to="/getting-started/introduction"
            :class="[
              btnBase,
              'bg-interaction-primary-default text-static-white hover:bg-interaction-primary-hover',
            ]"
          >
            Get started
          </NuxtLink>
          <NuxtLink
            to="/components/action-menu"
            :class="[
              btnBase,
              'border border-default bg-interaction-secondary-default text-default hover:bg-interaction-secondary-hover',
            ]"
          >
            Explore components
          </NuxtLink>
        </div>

        <div
          class="hero-rise mt-6 flex items-center justify-center gap-2 text-muted"
          :style="{ animationDelay: '240ms' }"
        >
          <UButton
            :to="githubUrl"
            target="_blank"
            color="neutral"
            variant="link"
            icon="i-simple-icons-github"
          >
            GitHub
          </UButton>
          <span
            aria-hidden="true"
            class="h-4 w-px bg-[var(--ui-border-accented)]"
          />
          <UButton
            :to="npmUrl"
            target="_blank"
            color="neutral"
            variant="link"
            icon="i-simple-icons-npm"
          >
            npm
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- Top gradient blends the dark hero smoothly into the muted surface. -->
    <section
      class="relative bg-[linear-gradient(to_bottom,var(--hero-edge)_0px,var(--ui-bg-muted)_72px)] pt-16 pb-16 sm:pt-20 sm:pb-20"
    >
      <UContainer>
        <div
          ref="exploreSection"
          class="transition-all duration-[1100ms] ease-[var(--ease-out)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-[0px] motion-reduce:transition-none"
          :class="
            exploreRevealed
              ? 'translate-y-0 opacity-100 blur-[0px]'
              : 'translate-y-4 opacity-0 blur-[12px]'
          "
        >
          <header class="mx-auto mb-10 max-w-2xl text-center">
            <h2
              class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
            >
              Everything you need to build
            </h2>
          </header>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <LandingSectionCard
              title="Getting started"
              description="Install the packages and ship your first screen."
              icon="i-lucide-rocket"
              to="/getting-started/introduction"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex items-center justify-center p-5"
                >
                  <div
                    class="w-full max-w-64 rounded-lg border border-default bg-elevated p-3 font-mono text-[11px]"
                  >
                    <div class="mb-2 flex gap-1.5">
                      <span class="size-2 rounded-full bg-error/70" />
                      <span class="size-2 rounded-full bg-warning/70" />
                      <span class="size-2 rounded-full bg-success/70" />
                    </div>
                    <p class="leading-relaxed text-muted">
                      <span class="text-success">$</span> npm i
                      <span class="text-highlighted break-all"
                        >@shopware-ag/meteor-component-library</span
                      >
                    </p>
                  </div>
                </div>
              </template>
            </LandingSectionCard>

            <LandingSectionCard
              title="Foundations"
              description="Design principles, accessibility, interaction states, and component conventions."
              icon="i-lucide-shapes"
              to="/foundations/design-principles"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 text-xs"
                >
                  <div class="flex gap-2">
                    <span
                      class="rounded-md border border-default bg-elevated px-3 py-1.5 text-muted"
                    >
                      Default
                    </span>
                    <span
                      class="rounded-md border border-primary bg-default px-3 py-1.5 text-highlighted ring-2 ring-primary/30"
                    >
                      Focus
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <span
                      class="rounded-md bg-primary px-3 py-1.5 text-static-white"
                    >
                      Active
                    </span>
                    <span
                      class="rounded-md border border-default bg-elevated px-3 py-1.5 text-dimmed opacity-60"
                    >
                      Disabled
                    </span>
                  </div>
                </div>
              </template>
            </LandingSectionCard>

            <LandingSectionCard
              title="Design"
              description="Tokens, theming, and how design decisions are encoded."
              icon="i-lucide-palette"
              to="/design/tokens"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex flex-col justify-center gap-2 p-5"
                >
                  <div
                    class="flex items-center gap-2 rounded-md border border-default bg-elevated px-2.5 py-1.5 text-[11px]"
                  >
                    <span
                      class="size-4 shrink-0 rounded bg-interaction-primary-default"
                    />
                    <span class="font-mono text-muted">
                      color.interaction.primary.default
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-2 rounded-md border border-default bg-elevated px-2.5 py-1.5 text-[11px]"
                  >
                    <span
                      class="size-4 shrink-0 rounded bg-text-primary-default"
                    />
                    <span class="font-mono text-muted">
                      color.text.primary.default
                    </span>
                  </div>
                </div>
              </template>
            </LandingSectionCard>

            <LandingSectionCard
              title="Components"
              description="Accessible Vue 3 components, documented and ready to drop in."
              icon="i-lucide-blocks"
              to="/components/action-menu"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-5"
                >
                  <span
                    class="rounded bg-interaction-primary-default px-3.5 py-1.5 text-[13px] font-semibold text-static-white"
                  >
                    Button
                  </span>
                  <div class="flex items-center gap-4 text-[11px] text-muted">
                    <span class="flex items-center gap-1.5">
                      <span
                        class="relative h-4 w-7 rounded-full bg-interaction-primary-default"
                      >
                        <span
                          class="absolute top-0.5 right-0.5 size-3 rounded-full bg-static-white"
                        />
                      </span>
                      Switch
                    </span>
                    <span class="flex items-center gap-1.5">
                      <span
                        class="flex size-4 items-center justify-center rounded-[3px] bg-interaction-primary-default text-static-white"
                      >
                        <UIcon name="i-lucide-check" class="size-3" />
                      </span>
                      Checkbox
                    </span>
                  </div>
                </div>
              </template>
            </LandingSectionCard>

            <LandingSectionCard
              title="Content"
              description="Voice, tone, and wording guidelines for UI copy."
              icon="i-lucide-pen-line"
              to="/content/wording"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex flex-col justify-center gap-2 p-5 text-xs"
                >
                  <div
                    class="flex items-center gap-2 rounded-md border border-default bg-elevated px-2.5 py-2"
                  >
                    <UIcon
                      name="i-lucide-check"
                      class="size-4 shrink-0 text-success"
                    />
                    <span class="text-highlighted">Save changes</span>
                  </div>
                  <div
                    class="flex items-center gap-2 rounded-md border border-default bg-elevated px-2.5 py-2 opacity-70"
                  >
                    <UIcon
                      name="i-lucide-x"
                      class="size-4 shrink-0 text-error"
                    />
                    <span class="text-muted line-through">
                      Submit the form data
                    </span>
                  </div>
                </div>
              </template>
            </LandingSectionCard>

            <LandingSectionCard
              title="Agents"
              description="Connect Meteor to AI agents through the MCP server."
              icon="i-lucide-bot"
              to="/agents/mcp"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex flex-col justify-center gap-2 p-5 text-[11px]"
                >
                  <div
                    class="max-w-[85%] self-end rounded-xl rounded-br-sm bg-primary px-3 py-2 text-static-white"
                  >
                    Scaffold a settings page with Meteor
                  </div>
                  <div
                    class="flex max-w-[85%] items-center gap-1.5 self-start rounded-xl rounded-bl-sm border border-default bg-elevated px-3 py-2 text-muted"
                  >
                    <UIcon
                      name="i-lucide-bot"
                      class="size-3.5 shrink-0 text-primary"
                    />
                    Using mt-card, mt-text-field...
                  </div>
                </div>
              </template>
            </LandingSectionCard>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="bg-muted py-12 sm:py-16">
      <UContainer>
        <header class="mx-auto mb-10 max-w-2xl text-center">
          <h2
            class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl"
          >
            Useful resources
          </h2>
        </header>

        <div class="grid gap-6 sm:grid-cols-3">
          <NuxtLink
            v-for="link in resources"
            :key="link.to"
            :to="link.to"
            target="_blank"
            class="group flex flex-col gap-3 rounded-2xl border border-default bg-default p-6 transition-colors hover:border-accented"
          >
            <span
              class="flex size-10 items-center justify-center rounded-lg bg-primary/10"
            >
              <UIcon :name="link.icon" class="size-5 text-primary" />
            </span>
            <span class="flex items-center gap-1.5">
              <span class="font-semibold text-highlighted">
                {{ link.label }}
              </span>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4 text-dimmed transition-colors group-hover:text-primary"
              />
            </span>
            <span class="text-sm leading-relaxed text-muted">
              {{ link.description }}
            </span>
          </NuxtLink>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
/* Dark mode gets a dark-blue night sky; light mode stays plain (no gradient or
 * stars). --hero-edge (the hero's bottom color) is shared with the hero fade
 * and the section transition so the blend stays seamless. */
.landing {
  --hero-gradient: none;
  --hero-edge: var(--ui-bg);
}

.dark .landing {
  --hero-gradient: linear-gradient(
    180deg,
    #0d1d42 0%,
    #0a1430 55%,
    #060a18 100%
  );
  --hero-edge: #060a18;
}

.hero {
  background: var(--hero-gradient);
}

.type-heading-2xl {
  font-size: clamp(2.5rem, 1.8rem + 3vw, 3.5rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.type-body-lg {
  font-size: 1.25rem;
  line-height: 1.6;
}

.hero-rise {
  animation: rise 1.1s var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1)) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
    filter: blur(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise {
    animation: none;
  }
}
</style>
