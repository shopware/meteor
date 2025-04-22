<template>
  <!-- @slot This slot is @private and should not be used -->
  <slot name="before-card" />

  <article class="mt-card" :class="cardClasses" :aria-label="title" v-bind="$attrs">
    <header v-if="showHeader" class="mt-card__header">
      <div class="mt-card__avatar">
        <!-- @slot Slot for an avatar or logo -->
        <slot name="avatar" />
      </div>

      <div
        :class="[
          'mt-card__titles',
          {
            'mt-card__titles--has-inheritance-toggle': props.inheritance !== undefined,
          },
        ]"
      >
        <!-- @slot Alternative slot to the title property -->
        <slot name="title">
          <MtText v-if="title" as="h3" weight="semibold" size="m" class="mt-card__title">
            {{ title }}
          </MtText>
        </slot>

        <!-- @slot Alternative slot to the subtitle property -->
        <slot name="subtitle">
          <MtText
            v-if="subtitle"
            color="color-text-tertiary-default"
            size="xs"
            class="mt-card__subtitle"
          >
            {{ subtitle }}
          </MtText>
        </slot>

        <button
          v-if="inheritance !== undefined"
          type="button"
          class="mt-card__inheritance-toggle"
          :aria-label="!!inheritance ? t('disableInheritance') : t('enableInheritance')"
          style="grid-area: inheritance"
          @click="$emit('update:inheritance', !inheritance)"
        >
          <mt-icon
            :name="inheritance ? 'regular-link-horizontal' : 'regular-link-horizontal-slash'"
            size="1.25rem"
          />
        </button>
      </div>

      <div class="mt-card__titles-right-slot">
        <!-- @slot Slot for adding additional things on the right side of the card header -->
        <slot name="headerRight" />
      </div>

      <div v-if="!!$slots['context-actions']" class="mt-card__context-menu">
        <mt-context-button>
          <!-- @slot Slot for adding mt-context-menu-item components for rendering a context menu -->
          <slot name="context-actions" />
        </mt-context-button>
      </div>
    </header>

    <div class="mt-card__tabs">
      <!-- @slot Slot for adding a tab bar. The content need to be changed manually and you can't use the content slot of the tab bar -->
      <slot name="tabs" />
    </div>

    <div class="mt-card__toolbar">
      <!-- @slot Slot for adding toolbar functionality like search-bar, buttons, etc. -->
      <slot name="toolbar" />
    </div>

    <div class="mt-card__content">
      <!-- @slot The default slot which renders the card content -->
      <slot name="default" />

      <!-- @slot The grid slot which allows rendering of a data grid -->
      <slot name="grid" :title="title" />

      <mt-loader v-if="isLoading" />
    </div>

    <footer class="mt-card__footer">
      <!-- @slot The footer slot which allows rendering additional things after the content -->
      <slot name="footer" />
    </footer>
  </article>

  <!-- @slot This slot is @private and should not be used -->
  <slot name="after-card" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtContextButton from "../../context-menu/mt-context-button/mt-context-button.vue";
import MtLoader from "../../feedback-indicator/mt-loader/mt-loader.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtText from "../../content/mt-text/mt-text.vue";
import { useFutureFlags } from "@/composables/useFutureFlags";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    isLoading?: boolean;
    // @deprecated v4.0.0 - will be removed without replacement
    large?: boolean;
    inheritance?: boolean;
  }>(),
  {
    inheritance: undefined,
  },
);

defineEmits<{
  (e: "update:inheritance", value: boolean): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      disableInheritance: "Disable inheritance",
      enableInheritance: "Enable inheritance",
    },
    de: {
      disableInheritance: "Vererbung deaktivieren",
      enableInheritance: "Vererbung aktivieren",
    },
  },
});

const slots = defineSlots<{
  title(): void;
  subtitle(): void;
  avatar(): void;
  grid(): void;
  footer(): void;
  default(): void;
  toolbar(): void;
  tabs(): void;
  "before-card"(): void;
  "after-card"(): void;
  headerRight(): void;
  "context-actions"(): void;
}>();

const showHeader = computed(
  () => !!props.title || !!slots.title || !!props.subtitle || !!slots.subtitle || !!slots.avatar,
);

const futureFlags = useFutureFlags();
const cardClasses = computed(() => ({
  "mt-card--grid": !!slots.grid,
  "mt-card--large": props.large,
  "mt-card--has-footer": !!slots.footer,
  "mt-card--is-inherited": !!props.inheritance,
  "mt-card--future-ignore-max-width": futureFlags.removeCardWidth,
  "mt-card--future-remove-default-margin": futureFlags.removeDefaultMargin,
}));
</script>

<style scoped>
/**
 * @hotfix fixes a bug in safari which leads to disappearing cards
 */
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .mt-card {
      transform: translateZ(0);
    }
  }
}

.mt-card {
  max-width: 60rem;
  margin: 0 auto var(--scale-size-40);
  position: relative;
  background: var(--color-elevation-surface-raised);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-card); /* Added here */
  overflow: hidden;

  &:not(:has(.mt-card__tabs:empty)) .mt-card__header {
    border-bottom: none;
  }
}

.mt-card--future-remove-default-margin {
  margin-block-end: 0;
}

.mt-card__content {
  display: flow-root;
  flex-basis: 100%;
  padding: var(--scale-size-24);
  background-clip: padding-box;
  position: relative;
  color: var(--color-text-primary-default);

  & > :where(h1, h2, h3, h4, h5, h6) {
    font-weight: normal;
  }

  & > h1 {
    font-size: 1.5rem;
  }

  & > h2 {
    font-size: 1.375rem;
  }

  & > h3 {
    font-size: 1.25rem;
  }

  & > :where(h4, h5, h6) {
    font-size: 1.125rem;
  }

  & a.mt-card__quick-link {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 0.375rem;
    align-items: center;
    text-decoration: none;
    color: var(--color-text-brand-default);
    font-size: 0.875rem;

    &:hover {
      color: var(--color-text-brand-hover);
    }
  }
}

.mt-card--has-footer {
  & .mt-card__content {
    border: none;
    border-radius: var(--border-radius-none);
  }
}

/* @depracated v4.0.0 - will be removed without replacement */
.mt-card--large {
  max-width: 83.125rem;

  & .mt-card__title,
  & .mt-card__subtitle {
    width: auto;
    position: relative;
    top: 0;
    left: 0;
    text-align: left;
  }
}

.mt-card--future-ignore-max-width {
  max-width: none;
  margin-inline: 0;
}

.mt-card__titles {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mt-card__titles--has-inheritance-toggle {
  display: grid;
  grid-template-columns: min-content 1fr;
  column-gap: var(--scale-size-4);
  grid-template-areas:
    "inheritance title"
    "subtitle subtitle";

  & .mt-card__subtitle {
    grid-column: 1 / -1;
  }
}

.mt-card--is-inherited {
  border-color: var(--color-border-accent-default);

  & .mt-card__title {
    color: var(--color-text-accent-default);
  }

  & .mt-card__inheritance-toggle {
    color: var(--color-icon-accent-default);
  }
}

.mt-card--grid {
  & .mt-card__content {
    display: grid;
    padding: 0;

    & .mt-grid {
      border-top: none;
    }
  }
}

.mt-card__header {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--scale-size-12);
  padding: var(--scale-size-24);
  border-bottom: 1px solid var(--color-border-primary-default);
}

.mt-card__title {
  margin: 0;
}

.mt-card__toolbar {
  display: flex;
  flex-basis: auto;
  gap: var(--scale-size-8);
  padding: var(--scale-size-20) var(--scale-size-24) var(--scale-size-16) var(--scale-size-24);

  &:empty {
    display: none;
  }
}

.mt-card__avatar {
  overflow: hidden;
  border-radius: var(--border-radius-xs);
  width: var(--scale-size-40);
  height: var(--scale-size-40);

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:empty {
    display: none;
  }
}

.mt-card__inheritance-toggle {
  cursor: pointer;
  outline-offset: 2px;
  outline-color: var(--color-border-brand-selected);
  color: var(--color-icon-primary-default);

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 2px;
    border-radius: var(--border-radius-button);
  }
}

.mt-card__titles-right-slot {
  color: var(--color-text-primary-default);
  margin-left: auto;
}

.mt-card__footer {
  --mt-card-footer-padding: 1.5rem;

  --mt-inset-block-start: var(--mt-card-footer-padding);
  --mt-inset-block-end: var(--mt-card-footer-padding);
  --mt-inset-inline-start: var(--mt-card-footer-padding);
  --mt-inset-inline-end: var(--mt-card-footer-padding);

  display: flex;
  padding: var(--mt-card-footer-padding);
  border-top: 1px solid var(--color-border-primary-default);
  color: var(--color-text-secondary-default);

  &:empty {
    display: none;
  }
}
</style>
