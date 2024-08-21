<template>
  <!-- @slot This slot is @private and should not be used -->
  <slot name="before-card" />

  <div class="mt-card" :class="cardClasses" v-bind="$attrs">
    <div v-if="showHeader" class="mt-card__header">
      <div class="mt-card__avatar">
        <!-- @slot Slot for an avatar or logo -->
        <slot name="avatar" />
      </div>

      <div :class="titleWrapperClasses">
        <button
          v-if="inheritance !== undefined"
          class="mt-card__inheritance-toggle"
          :aria-label="
            !!inheritance
              ? $t('mt-card.inheritanceToggle.disableInheritance')
              : $t('mt-card.inheritanceToggle.enableInheritance')
          "
          @click="$emit('update:inheritance', !inheritance)"
        >
          <mt-icon :name="inheritanceToggleIcon" size="20" />
        </button>

        <!-- @slot Alternative slot to the title property -->
        <slot name="title">
          <MtText v-if="title" weight="medium" size="s" class="mt-card__title">
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
    </div>

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

    <div class="mt-card__footer">
      <!-- @slot The footer slot which allows rendering additional things after the content -->
      <slot name="footer" />
    </div>
  </div>

  <!-- @slot This slot is @private and should not be used -->
  <slot name="after-card" />
</template>

<script lang="ts">
import { computed, defineComponent, useSlots, type PropType } from "vue";
import MtContextButton from "../../context-menu/mt-context-button/mt-context-button.vue";
import MtLoader from "../../feedback-indicator/mt-loader/mt-loader.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
// TODO: this file needs to be one level lower
import MtText from "../../content/mt-text/mt-text.vue";

export default defineComponent({
  name: "MtCard",

  components: {
    MtContextButton,
    MtLoader,
    MtIcon,
    MtText,
  },

  props: {
    /**
     * The title of the card
     */
    title: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * The subtitle of the card
     */
    subtitle: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * Renders the card as a hero card without styling
     */
    hero: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Show a loading spinner overlay over the whole card.
     */
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Render the card in a large size
     */
    large: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Render a inheritance toggle
     */
    inheritance: {
      type: Boolean as PropType<boolean | undefined>,
      required: false,
      default: undefined,
    },
  },

  emits: ["update:inheritance"],

  i18n: {
    messages: {
      en: {
        "mt-card": {
          inheritanceToggle: {
            disableInheritance: "Disable inheritance",
            enableInheritance: "Enable inheritance",
          },
        },
      },
      de: {
        "mt-card": {
          inheritanceToggle: {
            disableInheritance: "Vererbung deaktivieren",
            enableInheritance: "Vererbung aktivieren",
          },
        },
      },
    },
  },

  setup(props) {
    const slots = useSlots();

    const showHeader = computed(
      () =>
        !!props.title || !!slots.title || !!props.subtitle || !!slots.subtitle || !!slots.avatar,
    );

    const cardClasses = computed(() => ({
      "mt-card--grid": !!slots.grid,
      "mt-card--hero": !!props.hero,
      "mt-card--large": props.large,
      "mt-card--has-footer": !!slots.footer,
      "mt-card--is-inherited": !!props.inheritance,
    }));

    const titleWrapperClasses = computed(() => ({
      "mt-card__titles": true,
      "mt-card__titles--has-inheritance-toggle": props.inheritance !== undefined,
    }));

    const inheritanceToggleIcon = computed(() =>
      props.inheritance ? "regular-link-horizontal" : "regular-link-horizontal-slash",
    );

    return {
      showHeader,
      cardClasses,
      titleWrapperClasses,
      inheritanceToggleIcon,
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables";
@import "../../assets/scss/mixins";

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
  max-width: $content-width;
  margin: 0 auto 40px;
  position: relative;
  background: var(--color-elevation-surface-raised);
  border: 1px solid var(--color-border-primary-default);
  overflow: hidden;

  &:not(&--hero) {
    border-radius: var(--border-radius-m);
  }

  &.mt-card--is-inherited {
    border-color: var(--color-border-accent-default);

    // TODO: handle case
    .mt-card__title {
      color: var(--color-text-accent-default);
    }

    .mt-card__inheritance-toggle {
      color: var(--color-icon-accent-default);
    }
  }

  &.mt-card--grid {
    .mt-card__content {
      display: grid;
      padding: 0;

      .mt-grid {
        border-top: none;
      }
    }
  }

  &.mt-card--hero {
    .mt-card__content {
      background: none;
      border: none;
      text-align: center;

      h3 {
        font-size: 30px;
      }
    }
  }

  &.mt-card--large {
    max-width: 1330px;

    .mt-card__title,
    .mt-card__subtitle {
      width: auto;
      position: relative;
      top: 0;
      left: 0;
      text-align: left;
    }
  }

  .mt-card__header {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 12px;
    padding: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--color-border-primary-default);
  }

  .mt-card__avatar {
    overflow: hidden;
    border-radius: var(--border-radius-xs);
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .mt-card__avatar:empty {
    display: none;
  }

  .mt-card__titles {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &--has-inheritance-toggle {
      display: grid;
      grid-template-columns: min-content 1fr;
      column-gap: 4px;
    }

    .mt-card__subtitle {
      grid-column: 1 / -1;
    }
  }

  .mt-card__titles-right-slot {
    color: var(--color-text-primary-default);
    margin-left: auto;
  }

  .mt-card__inheritance-toggle {
    cursor: pointer;
    outline-offset: 2px;
    outline-color: var(--color-border-brand-selected);
    color: var(--color-icon-primary-default);
  }

  .mt-card__toolbar {
    display: flex;
    flex-basis: auto;
    gap: 8px;
    padding: 20px 24px 16px 24px;

    &:empty {
      display: none;
    }
  }

  &__tabs {
    .mt-tabs {
      margin: 0;
      max-width: none;
      padding-left: 8px;

      .mt-tabs__custom-content {
        padding: 0;
      }
    }
  }

  &:not(:has(.mt-card__tabs:empty)) .mt-card__header {
    border-bottom: none;
  }

  .mt-card__content {
    display: flow-root;
    flex-basis: 100%;
    padding: 24px;
    background-clip: padding-box;
    position: relative;
    color: var(--color-text-primary-default);

    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      font-weight: normal;
    }

    > h1 {
      font-size: 24px;
    }

    > h2 {
      font-size: 22px;
    }

    > h3 {
      font-size: 20px;
    }

    > h4,
    > h5,
    > h6 {
      font-size: 18px;
    }

    a.mt-card__quick-link {
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: 6px;
      align-items: center;
      text-decoration: none;
      color: var(--color-text-brand-default);
      font-size: 14px;

      &:hover {
        color: var(--color-text-brand-hover);
      }
    }
  }

  .mt-card__footer {
    display: flex;
    padding: 16px 24px;
    border-top: none;
    color: var(--color-text-secondary-default);
  }

  .mt-card__footer:empty {
    display: none;
  }

  &.mt-card--has-footer {
    .mt-card__content {
      border: none;
      border-radius: 0;
    }
  }
}
</style>
