<script setup lang="ts">
// Having this page makes Docus skip its own `/` route and `landing` collection
// (docus/utils/pages.ts: landingPageExists), so this owns the home route.
import MtThemeProvider from "@shopware-ag/meteor-component-library/MtThemeProvider";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";

definePageMeta({
  layout: "default",
});

const appConfig = useAppConfig();

const githubUrl = appConfig.github?.url ?? "https://github.com/shopware/meteor";
const npmUrl =
  "https://www.npmjs.com/package/@shopware-ag/meteor-component-library";

const title = "Meteor Design System";
const description =
  "Design and ship interfaces faster with solid foundations, tailored components, design tokens, and a complete icon set.";

useSeo({
  title,
  description,
  type: "website",
});

// Homepage shows the product name on its own; drop the global
// "%s - Shopware Meteor" title suffix to avoid doubled branding.
useHead({ titleTemplate: null });

defineOgImage("Landing", {
  title: title.slice(0, 60),
  description: formatOgDescription(title, description),
});

const btnBase =
  "home-btn relative inline-flex min-h-12 cursor-pointer select-none items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-center text-sm font-semibold transition-[transform,color,background-color,border-color] duration-200 ease-out active:scale-[0.98]";

const npmBase = "https://www.npmjs.com/package/@shopware-ag/";

// `icon` is a Meteor icon-kit name, rendered via <mt-icon name="regular-…">.
const benefits = [
  {
    icon: "shopware",
    title: "Built for Shopware",
    text: "Components and patterns shaped for administrative commerce interfaces, not a generic UI kit.",
    detail:
      "From data tables and rule builders to settings layouts, every component maps to a real administration pattern, so you assemble screens instead of rebuilding primitives.",
  },
  {
    icon: "sync",
    title: "Design and code in sync",
    text: "Figma libraries, components, and tokens stay aligned, so decisions are made once and applied everywhere.",
    detail:
      "The same design tokens drive both Figma and code, so a change to a color or spacing value lands in both places at the same time.",
  },
  {
    icon: "universal-access",
    title: "Accessible out of the box",
    text: "Every component ships with keyboard support, ARIA semantics, and light and dark themes.",
    detail:
      "Focus management and WCAG-compliant color contrast are built in and tested, so accessibility is the default rather than a retrofit.",
  },
];

// Which benefit is expanded in the accordion (first one open by default).
const openBenefit = ref<number | null>(0);
function toggleBenefit(index: number) {
  openBenefit.value = openBenefit.value === index ? null : index;
}

const packages = [
  {
    name: "meteor-component-library",
    text: "Vue 3 component set with built-in tokens and icons.",
  },
  {
    name: "meteor-tokens",
    text: "Design tokens as CSS custom properties, usable in any framework.",
  },
  {
    name: "meteor-icon-kit",
    text: "SVG icon set, standalone or as Vue components via mt-icon.",
  },
];

// Cards for the "Explore the docs" arc carousel. The per-card preview art is
// supplied in the template via the carousel's #visual scoped slot (keyed here).
const docCards = [
  {
    key: "getting-started",
    title: "Getting Started",
    description: "Install the packages and ship your first screen.",
    to: "/documentation/getting-started",
  },
  {
    key: "guidelines",
    title: "Guidelines",
    description: "Design principles, accessibility, states and conventions.",
    to: "/documentation/guidelines",
  },
  {
    key: "accessibility",
    title: "Accessibility",
    description: "Keyboard support, ARIA semantics, and focus handling.",
    to: "/documentation/guidelines/accessibility",
  },
  {
    key: "design",
    title: "Design",
    description: "Tokens, theming, and how design decisions are encoded.",
    to: "/documentation/design",
  },
  {
    key: "tokens",
    title: "Design Tokens",
    description: "Color, spacing, and elevation as CSS custom properties.",
    to: "/documentation/design/tokens",
  },
  {
    key: "icons",
    title: "Icons",
    description: "A complete SVG icon set, ready as Vue components.",
    to: "/documentation/design/icons",
  },
  {
    key: "content",
    title: "Content",
    description: "Voice, tone, and wording guidelines for UI copy.",
    to: "/documentation/content",
  },
  {
    key: "components",
    title: "Components",
    description: "Vue components, documented and ready to drop in.",
    to: "/components",
  },
  {
    key: "utilities",
    title: "Utilities",
    description: "Composables, directives, and plugins for common needs.",
    to: "/utilities",
  },
  {
    key: "agents",
    title: "Agents",
    description: "Connect Meteor to AI agents through the MCP server.",
    to: "/documentation/getting-started/agents",
  },
];
</script>

<template>
  <div class="landing bg-default dark:bg-muted">
    <section class="hero relative isolate overflow-hidden">
      <!-- All hero background layers live in one element so a single bottom
           mask can fade the whole backdrop out over the showcase below. -->
      <div aria-hidden="true" class="hero-bg absolute inset-0 -z-10">
        <LandingStarfield class="hidden dark:block" />
      </div>
      <LandingUfo />

      <!-- On phones the showcase below is hidden, so the hero carries its own
           bottom padding there; from sm up the showcase provides the spacing. -->
      <UContainer
        class="mx-auto flex flex-col items-center pt-16 pb-20 text-center sm:pt-24 sm:pb-0 lg:pt-28"
      >
        <h1 class="hero-rise type-heading-2xl max-w-4xl text-highlighted">
          Build outstanding Shopware experiences with
          <span class="italic">Meteor</span>
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
            to="/documentation/getting-started"
            :class="[
              btnBase,
              'bg-interaction-primary-default text-static-white hover:bg-interaction-primary-hover',
            ]"
          >
            Get started
          </NuxtLink>
          <NuxtLink
            to="/components"
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

      <!-- Live component showcase, nested in the hero so the backdrop bleeds
           down behind the cards and fades out midway through them. -->
      <LandingComponentShowcase />
    </section>

    <!-- Why Meteor: value proposition as an interactive accordion. Titles stay
         scannable; expanding a row reveals the detail. -->
    <!-- Top padding is smaller from sm up: the showcase above ends in its own
         fade, so the section gap needs less breathing room than the others.
         On phones the showcase is hidden and the hero provides the spacing. -->
    <section class="why-section relative pt-20 pb-20 sm:pt-16 sm:pb-28">
      <!-- Light-mode only: a white-to-transparent fade at the top blends the
           dot-grid background out of the showcase above. -->
      <div aria-hidden="true" class="why-fade" />
      <UContainer class="relative">
        <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <header class="lg:col-span-5">
            <h2
              class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
            >
              Why teams build on Meteor
            </h2>
            <p class="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              More than a component library, Meteor is the shared foundation
              that Shopware and its community design and build on together.
            </p>
          </header>

          <div class="flex flex-col gap-3 lg:col-span-7">
            <div
              v-for="(benefit, index) in benefits"
              :key="benefit.title"
              class="acc-item"
            >
              <button
                type="button"
                class="acc-trigger"
                :aria-expanded="openBenefit === index"
                @click="toggleBenefit(index)"
              >
                <span class="acc-icon">
                  <mt-icon
                    :name="`regular-${benefit.icon}`"
                    size="20"
                    color="var(--ui-primary)"
                  />
                </span>
                <span class="acc-title">{{ benefit.title }}</span>
                <span
                  aria-hidden="true"
                  class="acc-toggle"
                  :class="{ 'acc-toggle--open': openBenefit === index }"
                >
                  <span class="acc-toggle__bar" />
                  <span class="acc-toggle__bar acc-toggle__bar--v" />
                </span>
              </button>
              <div
                class="acc-panel"
                :class="{ 'acc-panel--open': openBenefit === index }"
              >
                <div class="acc-panel-inner">
                  <div class="acc-panel-content">
                    <p class="text-base leading-relaxed text-muted">
                      {{ benefit.text }}
                    </p>
                    <p class="mt-3 text-base leading-relaxed text-muted">
                      {{ benefit.detail }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-20 sm:py-28">
      <UContainer>
        <header class="mb-12 max-w-2xl">
          <h2
            class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
          >
            Explore the docs
          </h2>
          <p class="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Guides and references for every part of Meteor, from guidelines and
            design tokens to components, content, and agents.
          </p>
        </header>
      </UContainer>

      <LandingDocsCarousel :items="docCards">
        <template #visual="{ item }">
          <template v-if="item.key === 'getting-started'">
            <div class="absolute inset-0 flex items-center justify-center p-4">
              <div
                class="w-full max-w-xs rounded-lg border border-default bg-elevated p-3 font-mono text-[10px]"
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

          <template v-else-if="item.key === 'guidelines'">
            <div
              class="absolute inset-0 flex flex-wrap items-center justify-center gap-1.5 p-4 text-[11px]"
            >
              <span
                class="rounded-md border border-default bg-elevated px-2 py-1 text-muted"
              >
                Default
              </span>
              <span
                class="rounded-md border border-default bg-default px-2 py-1 text-highlighted outline-2 outline-offset-2 outline-primary"
              >
                Focus
              </span>
              <span class="rounded-md bg-primary px-2 py-1 text-static-white">
                Active
              </span>
              <span
                class="rounded-md border border-default bg-elevated px-2 py-1 text-dimmed opacity-60"
              >
                Disabled
              </span>
            </div>
          </template>

          <template v-else-if="item.key === 'design'">
            <div
              class="absolute inset-0 flex items-center justify-center gap-3 p-5"
            >
              <!-- Same UI rendered with the light and dark token sets.
                       Built from theme-independent primitives so both panels
                       stay fixed regardless of the page's color mode. -->
              <div
                class="flex w-28 flex-col gap-2 rounded-lg border border-[var(--color-zinc-200)] bg-[var(--color-zinc-0)] p-3"
              >
                <UIcon
                  name="i-lucide-sun"
                  class="size-3.5 text-[var(--color-pumpkin-500)]"
                />
                <span
                  class="h-1.5 w-full rounded-full bg-[var(--color-zinc-200)]"
                />
                <span
                  class="h-1.5 w-2/3 rounded-full bg-[var(--color-zinc-200)]"
                />
                <span class="mt-1 h-4 rounded bg-[var(--color-brand-500)]" />
              </div>
              <div
                class="flex w-28 flex-col gap-2 rounded-lg border border-[var(--color-zinc-850)] bg-[var(--color-zinc-975)] p-3"
              >
                <UIcon
                  name="i-lucide-moon"
                  class="size-3.5 text-[var(--color-zinc-300)]"
                />
                <span
                  class="h-1.5 w-full rounded-full bg-[var(--color-zinc-700)]"
                />
                <span
                  class="h-1.5 w-2/3 rounded-full bg-[var(--color-zinc-700)]"
                />
                <span class="mt-1 h-4 rounded bg-[var(--color-brand-500)]" />
              </div>
            </div>
          </template>

          <template v-else-if="item.key === 'content'">
            <div
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 text-xs"
            >
              <div
                class="flex w-full max-w-44 items-center gap-2 rounded-md border border-default bg-elevated px-2.5 py-2"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-4 shrink-0 text-success"
                />
                <span class="text-highlighted">Save changes</span>
              </div>
              <div
                class="flex w-full max-w-44 items-center gap-2 rounded-md border border-default bg-elevated px-2.5 py-2 opacity-70"
              >
                <UIcon name="i-lucide-x" class="size-4 shrink-0 text-error" />
                <span class="text-muted line-through">
                  Submit the form data
                </span>
              </div>
            </div>
          </template>

          <template v-else-if="item.key === 'agents'">
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

          <template v-else-if="item.key === 'components'">
            <div class="absolute inset-0 flex items-center justify-center p-5">
              <!-- Real Meteor components. Client-only: they wrap interactive
                   state that isn't worth server-rendering for a preview.
                   removeDefaultMargin drops the fields' reserved hint spacing so
                   the preview stays compact and centered. -->
              <ClientOnly>
                <MtThemeProvider :future="{ removeDefaultMargin: true }">
                  <div class="flex items-center gap-3">
                    <mt-button variant="secondary" size="default">
                      Cancel
                    </mt-button>
                    <mt-button variant="primary" size="default">Save</mt-button>
                  </div>
                </MtThemeProvider>
              </ClientOnly>
            </div>
          </template>

          <template v-else-if="item.key === 'accessibility'">
            <div
              class="absolute inset-0 flex items-center justify-center gap-3 p-5 text-xs"
            >
              <span
                class="rounded-md bg-primary px-3 py-1.5 font-semibold text-static-white outline-2 outline-offset-2 outline-primary"
              >
                Button
              </span>
              <span
                class="rounded border border-default bg-elevated px-2 py-1 font-mono text-[11px] text-muted"
              >
                Tab
              </span>
            </div>
          </template>

          <template v-else-if="item.key === 'tokens'">
            <div
              class="absolute inset-0 flex items-center justify-center gap-2.5 p-5"
            >
              <span class="size-10 rounded-lg bg-[var(--color-brand-500)]" />
              <span class="size-10 rounded-lg bg-[var(--color-brand-300)]" />
              <span class="size-10 rounded-lg bg-[var(--color-emerald-600)]" />
              <span class="size-10 rounded-lg bg-[var(--color-pumpkin-500)]" />
              <span class="size-10 rounded-lg bg-[var(--color-red-500)]" />
            </div>
          </template>

          <template v-else-if="item.key === 'icons'">
            <div
              class="absolute inset-0 grid grid-cols-4 place-content-center place-items-center gap-x-7 gap-y-6 p-7"
            >
              <mt-icon
                v-for="icon in [
                  'regular-home',
                  'regular-cog',
                  'regular-bell',
                  'regular-search',
                  'regular-heart',
                  'regular-star',
                  'regular-user',
                  'regular-envelope',
                ]"
                :key="icon"
                :name="icon"
                size="24"
                color="var(--ui-text-muted)"
              />
            </div>
          </template>

          <template v-else-if="item.key === 'utilities'">
            <div class="absolute inset-0 flex items-center justify-center p-4">
              <div
                class="w-full max-w-xs rounded-lg border border-default bg-elevated p-3 font-mono text-[10px] leading-relaxed"
              >
                <span class="text-primary">const</span>
                <span class="text-highlighted"> { copy } </span>=
                <span class="text-highlighted">useCopyToClipboard</span>()
              </div>
            </div>
          </template>
        </template>
      </LandingDocsCarousel>
    </section>

    <!-- The packages -->
    <section class="py-20 sm:py-28">
      <UContainer>
        <header class="max-w-2xl">
          <h2
            class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
          >
            Install only what you need
          </h2>
          <p class="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Meteor ships as three independent npm packages. Pull in the full
            component library, or just the tokens or icons.
          </p>
          <NuxtLink
            to="/documentation/getting-started"
            class="group mt-5 inline-flex items-center gap-1.5 text-base font-medium text-primary"
          >
            Read the developer setup guide
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </NuxtLink>
        </header>

        <div class="mt-12">
          <div
            v-for="pkg in packages"
            :key="pkg.name"
            class="grid grid-cols-1 gap-5 border-b border-default py-8 last:border-b-0 sm:grid-cols-2 sm:items-center sm:gap-10"
          >
            <div>
              <div class="flex items-center gap-2.5">
                <UIcon
                  name="i-simple-icons-npm"
                  class="size-5 shrink-0 text-primary"
                />
                <p
                  class="font-mono text-base font-bold break-all text-highlighted"
                >
                  @shopware-ag/{{ pkg.name }}
                </p>
              </div>
              <p class="mt-3 text-base leading-relaxed text-muted">
                {{ pkg.text }}
              </p>
              <NuxtLink
                :to="npmBase + pkg.name"
                target="_blank"
                class="group mt-2 inline-flex items-center gap-1.5 text-base font-medium text-primary"
              >
                View on npm
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </NuxtLink>
            </div>
            <LandingCopyCommand :command="`npm i @shopware-ag/${pkg.name}`" />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Contribute: prominent card with an animated LED gradient border. -->
    <section class="pt-10 pb-32 sm:pt-12 sm:pb-44">
      <UContainer>
        <div class="contribute">
          <div class="contribute__card">
            <div class="contribute__body">
              <UIcon
                name="i-simple-icons-github"
                class="contribute__logo size-12"
              />
              <h2
                class="mt-6 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
              >
                Build Meteor with us
              </h2>
              <p
                class="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
              >
                Meteor is open source. Open an issue, request a feature, or send
                a pull request on GitHub.
              </p>
              <NuxtLink
                :to="githubUrl"
                target="_blank"
                :class="[
                  btnBase,
                  'mt-8 bg-interaction-primary-default text-static-white hover:bg-interaction-primary-hover',
                ]"
              >
                <UIcon name="i-simple-icons-github" class="size-4" />
                View on GitHub
              </NuxtLink>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
/* Squircle corners on the custom home-page buttons (border-radius set via the
 * rounded-[16px] utility). corner-shape is kept here because Tailwind's CSS
 * engine strips it from arbitrary-property utilities. */
.home-btn {
  corner-shape: squircle;
}

/* Why-section accordion. Each item is its own surface card with a gap between;
 * the panel uses the grid 0fr/1fr trick for a smooth, measurement-free height
 * transition (with a slight overshoot for bounce). */
.acc-item {
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
  background: var(--ui-bg);
  box-shadow: var(--landing-elev);
  overflow: hidden;
  transition: transform 0.15s var(--ease-out);
}
.acc-item:active {
  transform: scale(0.985);
}
.acc-trigger {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  text-align: left;
}
.acc-icon {
  display: inline-flex;
  flex-shrink: 0;
}
.acc-title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
/* Plus/minus toggle: two bars form a plus; opening rotates the vertical bar
 * flat so only the minus remains. */
.acc-toggle {
  position: relative;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
}
.acc-toggle__bar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.875rem;
  height: 2px;
  border-radius: 1px;
  color: var(--ui-text-dimmed);
  background: currentColor;
  transform: translate(-50%, -50%);
  transition:
    transform 0.4s var(--ease-out),
    color 0.25s ease;
}
.acc-toggle__bar--v {
  transform: translate(-50%, -50%) rotate(90deg);
}
.acc-toggle--open .acc-toggle__bar {
  color: var(--ui-text-highlighted);
}
.acc-toggle--open .acc-toggle__bar--v {
  transform: translate(-50%, -50%) rotate(0deg);
}
@media (hover: hover) and (pointer: fine) {
  .acc-trigger:hover .acc-toggle__bar {
    color: var(--ui-text-highlighted);
  }
}
.acc-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.33, 1.15, 0.35, 1);
}
.acc-panel--open {
  grid-template-rows: 1fr;
}
.acc-panel-inner {
  min-height: 0;
  overflow: hidden;
}
.acc-panel-content {
  padding: 0 1.5rem 1.5rem;
  opacity: 0;
  filter: blur(6px);
  transition:
    opacity 0.4s ease,
    filter 0.4s ease;
}
.acc-panel--open .acc-panel-content {
  opacity: 1;
  filter: none;
}
@media (prefers-reduced-motion: reduce) {
  .acc-panel,
  .acc-toggle__bar,
  .acc-panel-content,
  .acc-item {
    transition: none;
  }
  .acc-item:active {
    transform: none;
  }
}

/* Contribute card: an LED-style light runs around the border via an animated
 * conic gradient painted into the border box, plus an ambient blue glow. */
@property --contribute-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.contribute__card {
  position: relative;
  border-radius: 1.5rem;
  border: 1.5px solid transparent;
  background:
    linear-gradient(var(--ui-bg), var(--ui-bg)) padding-box,
    conic-gradient(
        from var(--contribute-angle),
        transparent 0deg,
        color-mix(in oklab, var(--ui-primary) 35%, transparent) 45deg,
        var(--ui-primary) 72deg,
        #8ab4ff 90deg,
        var(--ui-primary) 108deg,
        color-mix(in oklab, var(--ui-primary) 35%, transparent) 135deg,
        transparent 180deg,
        transparent 360deg
      )
      border-box;
  box-shadow:
    0 0 60px -14px color-mix(in oklab, var(--ui-primary) 50%, transparent),
    0 0 22px -8px color-mix(in oklab, var(--ui-primary) 40%, transparent);
  animation: contribute-spin 6s linear infinite;
}

@keyframes contribute-spin {
  to {
    --contribute-angle: 360deg;
  }
}

.contribute__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3.5rem 1.5rem;
}

.contribute__logo {
  color: var(--ui-text-highlighted);
  filter: drop-shadow(
    0 0 18px color-mix(in oklab, var(--ui-primary) 45%, transparent)
  );
}

@media (prefers-reduced-motion: reduce) {
  .contribute__card {
    animation: none;
  }
}

/* Light-mode fade at the top of the Why section: continues the showcase's fade
 * to the page background, so the dot grid eases in instead of appearing abruptly.
 * Dark mode has no dot grid, so it isn't needed. */
.why-fade {
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 15rem;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--ui-bg), transparent);
}
.dark .why-fade {
  display: none;
}

/* Light mode: a subtle dot grid across the whole page. Dark mode drops the grid
 * and uses the night-sky gradient + starfield instead. */
.landing {
  --ui-container: var(--ui-container-small);
  --hero-gradient: none;
  --dot-color: color-mix(in oklab, var(--ui-text) 7%, transparent);
  /* Slightly lighter borders, just on the landing page (light mode). */
  --ui-border: var(--color-zinc-75);
  /* Shared card elevation so the copy line, accordion and slider cards match. */
  --landing-elev: 0 10px 28px -24px
    color-mix(in oklab, var(--ui-primary) 20%, transparent);
  background-image: radial-gradient(var(--dot-color) 1px, transparent 1.5px);
  background-repeat: repeat;
  background-size: 24px 24px;
  background-position: center top;
}

.dark .landing {
  /* Night sky: a faint blue base at the bottom (by the planet's atmosphere)
   * fading smoothly to pure black space well before the top. The dot grid stays
   * (kept faint); the night-sky gradient covers it across the hero, so it only
   * reads on the sections below. */
  --hero-gradient: linear-gradient(0deg, #0b1c3a 0%, #03060e 60%, #000000 100%);
  --dot-color: color-mix(in oklab, var(--ui-text) 5%, transparent);
  /* Keep the default dark border. */
  --ui-border: var(--color-zinc-850);
  /* Same elevation, a touch less blue (mixed toward grey) for dark mode. */
  --landing-elev: 0 10px 28px -22px
    color-mix(
      in oklab,
      color-mix(in oklab, var(--ui-primary) 55%, var(--color-zinc-500)) 26%,
      transparent
    );
}

/* The full-height backdrop. The dark-mode night-sky gradient lives here (not on
   .hero) so the bottom mask fades the gradient and starfield out together, with
   the fade landing partway down the showcase. Tune the two stops via
   --hero-fade-start / --hero-fade-end (distance from the top of the hero). */
.hero-bg {
  background: var(--hero-gradient);
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0,
    #000 var(--hero-fade-start, 900px),
    transparent var(--hero-fade-end, 1700px)
  );
  mask-image: linear-gradient(
    to bottom,
    #000 0,
    #000 var(--hero-fade-start, 900px),
    transparent var(--hero-fade-end, 1700px)
  );
}

/* Smartphones hide the showcase (see LandingComponentShowcase), so the hero is
   much shorter; switch the fade stops to percentages so the backdrop still
   fades out within the hero instead of ending in a hard edge. */
@media (max-width: 639.98px) {
  .hero-bg {
    --hero-fade-start: 55%;
    --hero-fade-end: 100%;
  }
}

.type-heading-2xl {
  /* 36px on phones, growing to the unchanged 56px on desktop. */
  font-size: clamp(2.25rem, 1.2rem + 4vw, 3.5rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Default body size on phones, stepping up alongside the heading from sm. */
.type-body-lg {
  font-size: 1rem;
  line-height: 1.6;
}
@media (min-width: 640px) {
  .type-body-lg {
    font-size: 1.25rem;
  }
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
