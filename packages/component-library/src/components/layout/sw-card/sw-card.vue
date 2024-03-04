<template>
  <!-- @slot This slot is @private and should not be used -->
  <slot name="before-card" />

  <div class="sw-card" :class="cardClasses()" v-bind="$attrs">
    <div v-if="showHeader" class="sw-card__header">
      <div class="sw-card__avatar">
        <!-- @slot Slot for an avatar or logo -->
        <slot name="avatar" />
      </div>

      <div class="sw-card__titles">
        <!-- @slot Alternative slot to the title property -->
        <slot name="title">
          <div v-if="title" class="sw-card__title">
            {{ title }}
          </div>
        </slot>

        <!-- @slot Alternative slot to the subtitle property -->
        <slot name="subtitle">
          <div v-if="subtitle" class="sw-card__subtitle">
            {{ subtitle }}
          </div>
        </slot>
      </div>

      <div class="sw-card__titles-right-slot">
        <!-- @slot Slot for adding additional things on the right side of the card header -->
        <slot name="headerRight" />
      </div>

      <div
        v-if="!!$slots['context-actions'] || !!$slots['context-actions']"
        class="sw-card__context-menu"
      >
        <sw-context-button>
          <!-- @slot Slot for adding sw-context-menu-item components for rendering a context menu -->
          <slot name="context-actions" />
        </sw-context-button>
      </div>
    </div>

    <div class="sw-card__tabs">
      <!-- @slot Slot for adding a tab bar. The content need to be changed manually and you can't use the content slot of the tab bar -->
      <slot name="tabs" />
    </div>

    <div class="sw-card__toolbar">
      <!-- @slot Slot for adding toolbar functionality like search-bar, buttons, etc. -->
      <slot name="toolbar" />
    </div>

    <div class="sw-card__content">
      <!-- @slot The default slot which renders the card content -->
      <slot name="default" />

      <!-- @slot The grid slot which allows rendering of a data grid -->
      <slot name="grid" :title="title" />

      <sw-loader v-if="isLoading" />
    </div>

    <div class="sw-card__footer">
      <!-- @slot The footer slot which allows rendering additional things after the content -->
      <slot name="footer" />
    </div>
  </div>

  <!-- @slot This slot is @private and should not be used -->
  <slot name="after-card" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwContextButton from "../../context-menu/sw-context-button/sw-context-button.vue";
import SwLoader from "../../feedback-indicator/sw-loader/sw-loader.vue";

export default defineComponent({
  components: {
    "sw-context-button": SwContextButton,
    "sw-loader": SwLoader,
  },

  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
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
  },

  computed: {
    showHeader(): boolean {
      return (
        !!this.title ||
        !!this.$slots.title ||
        !!this.$slots.title ||
        !!this.subtitle ||
        !!this.$slots.subtitle ||
        !!this.$slots.subtitle ||
        !!this.$slots.avatar ||
        !!this.$slots.avatar
      );
    },
  },

  methods: {
    cardClasses() {
      return {
        "sw-card--grid": !!this.$slots.grid || !!this.$slots.grid,
        "sw-card--hero": !!this.hero,
        "sw-card--large": this.large,
        "has--header": !!this.showHeader,
        "has--title": !!this.title || !!this.$slots.title || !!this.$slots.title,
        "has--subtitle": !!this.subtitle || !!this.$slots.subtitle || !!this.$slots.subtitle,
        "has--toolbar": !!this.$slots.toolbar || !!this.$slots.toolbar,
        "has--footer": !!this.$slots.footer || !!this.$slots.footer,
      };
    },
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
    .sw-card {
      transform: translateZ(0);
    }
  }
}

.sw-card {
  max-width: $content-width;
  margin: 0 auto 40px;
  position: relative;
  background: var(--color-elevation-surface-raised);

  &:not(&--hero) {
    @include drop-shadow-default;
    border-radius: $border-radius-lg;
  }

  &.sw-card--grid {
    .sw-card__content {
      display: grid;
      padding: 0;

      .sw-grid {
        border-top: none;
      }
    }
  }

  &.sw-card--hero {
    .sw-card__header,
    .sw-card__tabs,
    .sw-card__toolbar {
      @include drop-shadow-default;
    }

    .sw-card__content {
      background: none;
      border: none;
      text-align: center;

      h3 {
        font-size: 30px;
      }
    }
  }

  &.sw-card--large {
    max-width: 1330px;

    .sw-card__title,
    .sw-card__subtitle {
      width: auto;
      position: relative;
      top: 0;
      left: 0;
      text-align: left;
    }
  }

  .sw-card__header {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 12px;
    padding: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--color-border-primary-default);
  }

  .sw-card__avatar {
    overflow: hidden;
    border-radius: $border-radius-default;
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .sw-card__avatar:empty {
    display: none;
  }

  .sw-card__title {
    color: var(--color-text-primary-default);
    font-size: $font-size-large;
    font-weight: $font-weight-semi-bold;
    line-height: 18px;
  }

  .sw-card__subtitle {
    color: var(--color-text-tertiary-default);
    font-size: $font-size-small;
    line-height: 14px;
  }

  .sw-card__titles {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sw-card__titles-right-slot {
    color: var(--color-text-primary-default);
    margin-left: auto;
  }

  .sw-card__toolbar {
    display: flex;
    flex-basis: auto;
    gap: 8px;
    padding: 20px 24px 16px 24px;

    &:empty {
      display: none;
    }
  }

  &__tabs {
    .sw-tabs {
      margin: 0;
      max-width: none;

      .sw-tabs__custom-content {
        padding: 0;
      }
    }
  }

  &:not(:has(.sw-card__tabs:empty)) .sw-card__header {
    border-bottom: none;
  }

  .sw-card__content {
    display: flow-root;
    flex-basis: 100%;
    padding: 30px;
    background-clip: padding-box;
    position: relative;
    color: var(--color-text-primary-default);

    @media screen and (max-width: $content-width) {
      padding: 15px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: normal;
    }

    h1 {
      font-size: 24px;
    }

    h2 {
      font-size: 22px;
    }

    h3 {
      font-size: 20px;
    }

    h4,
    h5,
    h6 {
      font-size: 18px;
    }

    a.sw-card__quick-link {
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

  .sw-card__footer {
    display: flex;
    padding: 16px 24px;
    border-top: none;
    color: var(--color-text-secondary-default);
  }

  .sw-card__footer:empty {
    display: none;
  }

  &.has--footer {
    .sw-card__content {
      border: none;
      border-radius: 0;
    }
  }
}
</style>
