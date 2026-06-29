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
  "home-btn relative inline-flex min-h-12 cursor-pointer select-none items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-center text-sm font-semibold transition-colors duration-100 ease-in-out";

// Light-mode hero: a darker dot layer revealed through a circular mask that
// follows the cursor (a "spotlight"), fading in/out on enter/leave.
const dotsReveal = ref<HTMLElement | null>(null);
const spotActive = ref(false);

function onHeroMove(e: PointerEvent) {
  const el = dotsReveal.value;
  if (!el) return;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

const tickerItems = [
  { icon: "i-lucide-accessibility", label: "Accessible" },
  { icon: "i-simple-icons-typescript", label: "TypeScript" },
  { icon: "i-lucide-swatch-book", label: "Design tokens" },
  { icon: "i-lucide-contrast", label: "Light & dark mode" },
  { icon: "i-lucide-blocks", label: "45+ components" },
  { icon: "i-lucide-shapes", label: "900+ icons" },
  { icon: "i-simple-icons-vuedotjs", label: "Vue 3" },
  { icon: "i-lucide-bot", label: "MCP server" },
  { icon: "i-lucide-git-pull-request", label: "Open source" },
];

const npmBase = "https://www.npmjs.com/package/@shopware-ag/";

const benefits = [
  {
    icon: "i-custom:shopware-signet",
    title: "Built for Shopware",
    text: "Components and patterns shaped for administrative commerce interfaces, not a generic UI kit.",
  },
  {
    icon: "i-lucide-person-standing",
    title: "Accessible out of the box",
    text: "Every component ships with keyboard support, ARIA semantics, and light and dark themes.",
  },
  {
    icon: "i-lucide-refresh-cw",
    title: "Design and code in sync",
    text: "Figma libraries, components, and tokens stay aligned, so decisions are made once and applied everywhere.",
  },
];

const packages = [
  {
    name: "meteor-component-library",
    text: "Vue 3 component set with built-in tokens, icons, and the Inter font.",
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

const faqItems = [
  {
    label: "Is Meteor free to use?",
    content:
      "Yes. Meteor is completely free and open source under the MIT license. You can use it for personal, commercial, or any other projects without restrictions.",
  },
  {
    label: "Which frameworks does Meteor support?",
    content:
      "Meteor components are built specifically for Vue.js 3 and above. The design tokens and icon kit are framework-agnostic and work with any framework or with vanilla JavaScript and CSS.",
  },
  {
    label: "Which browsers does Meteor support?",
    content:
      "Meteor supports all modern evergreen browsers, including the latest versions of Chrome, Firefox, Safari, and Edge.",
  },
  {
    label: "Do I need to credit Shopware?",
    content:
      "Attribution is not required, but it is appreciated. You can link to meteor.shopware.com or mention that you are using Shopware's Meteor Design System.",
  },
  {
    label: "Where can I get support?",
    slot: "support",
  },
];
</script>

<template>
  <div class="landing">
    <section
      class="hero relative isolate overflow-hidden"
      @pointermove="onHeroMove"
      @pointerenter="spotActive = true"
      @pointerleave="spotActive = false"
    >
      <!-- Light mode: gray dot grid fading out toward the bottom. -->
      <div
        aria-hidden="true"
        class="hero-dots absolute inset-0 -z-10 dark:hidden"
      />
      <!-- Darker dots revealed in a circle around the cursor. -->
      <div
        ref="dotsReveal"
        aria-hidden="true"
        class="hero-dots-reveal absolute inset-0 -z-10 dark:hidden"
        :class="{ 'is-spot': spotActive }"
      />
      <LandingStarfield class="-z-10 hidden dark:block" />
      <div
        aria-hidden="true"
        class="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-[linear-gradient(to_bottom,transparent,var(--hero-edge))]"
      />
      <!-- Dark mode: a large planet curving up from the bottom edge, with the
           starfield above it reading as the surrounding space/atmosphere. -->
      <div
        aria-hidden="true"
        class="hero-earth absolute inset-x-0 bottom-0 -z-10 hidden dark:block"
      />
      <LandingUfo />

      <UContainer
        class="mx-auto flex flex-col items-center pt-16 pb-16 text-center sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28"
      >
        <h1 class="hero-rise type-heading-2xl max-w-4xl text-highlighted">
          Build outstanding Shopware experiences with
          <span class="italic">Meteor</span>.
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
    </section>

    <!-- Feature ticker, sitting flush below the gradient hero section. -->
    <div
      class="hero-rise marquee-mask relative border-y border-default py-4"
      :style="{ animationDelay: '320ms' }"
    >
      <UMarquee :overlay="false" class="[--duration:40s] [--gap:3rem]">
        <div
          v-for="item in tickerItems"
          :key="item.label"
          class="flex items-center gap-2 text-sm font-medium text-muted"
        >
          <UIcon :name="item.icon" class="size-4 shrink-0 text-muted" />
          <span class="whitespace-nowrap">{{ item.label }}</span>
        </div>
      </UMarquee>
    </div>

    <!-- Why Meteor: value proposition -->
    <section
      class="hero-rise bg-muted py-20 sm:py-28"
      :style="{ animationDelay: '400ms' }"
    >
      <UContainer>
        <header class="mx-auto mb-16 max-w-2xl text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
          >
            Why teams build on Meteor
          </h2>
          <p class="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            More than a component library, Meteor is the shared foundation that
            Shopware and its community design and build on together.
          </p>
        </header>

        <div
          class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 mx-auto max-w-280"
        >
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="mx-auto flex max-w-72 flex-col items-center text-center"
          >
            <div
              class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <UIcon :name="benefit.icon" class="size-5" />
            </div>
            <h3 class="mt-4 font-semibold text-highlighted">
              {{ benefit.title }}
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-muted">
              {{ benefit.text }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-20 sm:py-28">
      <UContainer>
        <div class="bg-default">
          <header class="mx-auto mb-12 max-w-2xl text-center">
            <h2
              class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
            >
              Explore the docs
            </h2>
            <p class="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              Guides and references for every part of Meteor, from guidelines
              and design tokens to components, content, and agents.
            </p>
          </header>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <LandingSectionCard
              title="Getting Started"
              description="Install the packages and ship your first screen."
              to="/documentation/getting-started"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex items-center justify-center p-4"
                >
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
            </LandingSectionCard>

            <LandingSectionCard
              title="Guidelines"
              description="Design principles, accessibility, states and conventions."
              to="/documentation/guidelines"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex items-center justify-center gap-1.5 p-4 text-[11px]"
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
                  <span
                    class="rounded-md bg-primary px-2 py-1 text-static-white"
                  >
                    Active
                  </span>
                  <span
                    class="rounded-md border border-default bg-elevated px-2 py-1 text-dimmed opacity-60"
                  >
                    Disabled
                  </span>
                </div>
              </template>
            </LandingSectionCard>

            <LandingSectionCard
              title="Design"
              description="Tokens, theming, and how design decisions are encoded."
              to="/documentation/design"
            >
              <template #visual>
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
                    <span
                      class="mt-1 h-4 rounded bg-[var(--color-brand-500)]"
                    />
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
                    <span
                      class="mt-1 h-4 rounded bg-[var(--color-brand-500)]"
                    />
                  </div>
                </div>
              </template>
            </LandingSectionCard>

            <LandingSectionCard
              title="Content"
              description="Voice, tone, and wording guidelines for UI copy."
              to="/documentation/content"
            >
              <template #visual>
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
              to="/documentation/getting-started/agents"
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

            <LandingSectionCard
              title="Components"
              description="Vue components, documented and ready to drop in."
              to="/components"
            >
              <template #visual>
                <div
                  class="absolute inset-0 flex items-center justify-center gap-3 p-4"
                >
                  <span
                    class="rounded bg-interaction-primary-default px-3.5 py-1.5 text-[13px] font-semibold text-static-white"
                  >
                    Button
                  </span>
                  <span class="flex items-center gap-2 text-xs text-muted">
                    <span
                      class="relative h-4 w-7 rounded-full bg-interaction-primary-default"
                    >
                      <span
                        class="absolute top-0.5 right-0.5 size-3 rounded-full bg-static-white"
                      />
                    </span>
                    Switch
                  </span>
                  <span class="flex items-center gap-2 text-xs text-muted">
                    <span
                      class="flex size-4 items-center justify-center rounded-[3px] bg-interaction-primary-default text-static-white"
                    >
                      <UIcon name="i-lucide-check" class="size-3" />
                    </span>
                    Checkbox
                  </span>
                </div>
              </template>
            </LandingSectionCard>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- The packages -->
    <section class="bg-muted py-20 sm:py-28">
      <UContainer>
        <header class="mx-auto mb-12 max-w-2xl text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
          >
            Install only what you need
          </h2>
          <p class="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            Meteor ships as three independent npm packages. Pull in the full
            component library, or just the tokens or icons.
          </p>
        </header>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="pkg in packages"
            :key="pkg.name"
            :to="npmBase + pkg.name"
            target="_blank"
            class="group flex flex-col rounded-2xl border border-default bg-default p-6 transition-colors hover:border-accented"
          >
            <div
              class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <UIcon name="i-simple-icons-npm" class="size-5" />
            </div>
            <p
              class="mt-4 font-mono text-sm font-medium break-all text-highlighted"
            >
              @shopware-ag/{{ pkg.name }}
            </p>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              {{ pkg.text }}
            </p>
            <span
              class="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary"
            >
              View on npm
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </NuxtLink>
        </div>

        <div class="mt-10 text-center">
          <NuxtLink
            to="/documentation/getting-started"
            class="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            Read the developer setup guide
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- FAQ -->
    <section class="py-20 sm:py-28">
      <UContainer>
        <header class="mx-auto mb-10 max-w-2xl text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
          >
            Frequently asked questions
          </h2>
        </header>
        <div class="mx-auto max-w-3xl">
          <UAccordion :items="faqItems">
            <template #support-body>
              Open an issue on
              <NuxtLink
                to="https://github.com/shopware/meteor/issues"
                target="_blank"
                class="font-medium text-primary hover:underline"
                >GitHub</NuxtLink
              >
              for bugs and feature requests, or start a discussion to ask the
              community.
            </template>
          </UAccordion>
        </div>
      </UContainer>
    </section>

    <!-- Closing CTA banner -->
    <section class="pb-16 sm:pb-20">
      <UContainer>
        <div
          class="flex flex-col items-center gap-6 rounded-2xl border border-default bg-muted px-6 py-8 text-center sm:flex-row sm:justify-between sm:gap-8 sm:px-10 sm:text-left"
        >
          <div>
            <h2 class="text-lg font-semibold text-highlighted sm:text-xl">
              Want to contribute or report an issue?
            </h2>
            <p class="mt-1 text-sm leading-relaxed text-muted sm:text-base">
              Meteor is open source. Open an issue, request a feature, or send a
              pull request on GitHub.
            </p>
          </div>
          <NuxtLink
            :to="githubUrl"
            target="_blank"
            :class="[
              btnBase,
              'shrink-0 border border-default bg-interaction-secondary-default text-default hover:bg-interaction-secondary-hover',
            ]"
          >
            <UIcon name="i-simple-icons-github" class="size-4" />
            View on GitHub
          </NuxtLink>
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

/* Dark mode gets a night-sky gradient + starfield with a planet rising from the
 * bottom; light mode gets a gray dot grid (.hero-dots). --hero-edge (the hero's
 * bottom color) is shared with the hero fade and the section transition so the
 * blend stays seamless. */
.landing {
  --ui-container: var(--ui-container-small);
  --hero-gradient: none;
  --hero-edge: var(--ui-bg);
}

.dark .landing {
  /* Night sky: a faint blue base at the bottom (by the planet's atmosphere)
   * fading smoothly to pure black space well before the top. */
  --hero-gradient: linear-gradient(0deg, #0b1c3a 0%, #03060e 60%, #000000 100%);
}

.hero {
  background: var(--hero-gradient);
}

/* The planet: a large, bright atmospheric rim over a dark body, rising from the
 * bottom edge of the hero. Shown in dark mode via the dark:block utility. */
.hero-earth {
  height: 88%;
  background:
    /* atmospheric halo — a faint blue glow bleeding off the limb into space */
    radial-gradient(
      90% 90% at 50% 142%,
      rgba(86, 158, 245, 0.14) 46%,
      rgba(56, 132, 240, 0.06) 58%,
      transparent 70%
    ),
    /* planet — dark body with a soft cool limb forming the horizon */
      radial-gradient(
        78% 82% at 50% 142%,
        #123f73 0%,
        #0a2244 50%,
        rgba(130, 188, 255, 0.32) 64%,
        rgba(110, 175, 250, 0.1) 68%,
        transparent 75%
      );
}

/* On narrow viewports the headline wraps and the hero grows tall. Since the
 * planet's center (142%) and radii are percentages of the element height, that
 * would stretch it into an oversized vertical glow reaching past the viewport.
 * Shrink the box on mobile so it stays a shallow horizon arc along the bottom. */
@media (max-width: 640px) {
  .hero-earth {
    height: 55%;
  }
}

.hero-dots {
  background-image: radial-gradient(
    circle,
    var(--color-zinc-100) 1px,
    transparent 1.5px
  );
  background-size: 22px 22px;
}

.hero-dots-reveal {
  --mx: 50%;
  --my: 30%;
  background-image: radial-gradient(
    circle,
    var(--color-zinc-200) 1px,
    transparent 1.5px
  );
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(
    circle 220px at var(--mx) var(--my),
    #000 0%,
    #000 30%,
    transparent 70%
  );
  mask-image: radial-gradient(
    circle 220px at var(--mx) var(--my),
    #000 0%,
    #000 30%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.hero-dots-reveal.is-spot {
  opacity: 1;
}

.marquee-mask {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 6rem,
    #000 calc(100% - 6rem),
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 6rem,
    #000 calc(100% - 6rem),
    transparent
  );
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
