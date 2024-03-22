<template>
  <div class="mt-banner" :class="bannerClasses" role="banner">
    <slot name="customIcon">
      <mt-icon v-if="!hideIcon" class="mt-banner__icon" :name="bannerIcon" decorative />
    </slot>

    <div class="mt-banner__body" :class="bannerBodyClasses">
      <div v-if="title" class="mt-banner__title">
        {{ title }}
      </div>

      <div class="mt-banner__message">
        <slot />
      </div>
    </div>

    <button
      v-if="closable"
      class="mt-banner__close"
      aria-label="Schließen"
      title="Schließen"
      @click.prevent="$emit('close', bannerIndex)"
    >
      <mt-icon name="solid-times-s" />
    </button>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

type CssClasses = (string | Record<string, boolean>)[] | Record<string, boolean>;
type BannerType = "neutral" | "info" | "attention" | "critical" | "positive" | "inherited";

export default defineComponent({
  name: "MtBanner",

  components: {
    "mt-icon": MtIcon,
  },

  props: {
    /**
     * Change the variant of the banner
     * @values neutral, info, attention, critical, positive, inherited
     */
    variant: {
      type: String as PropType<BannerType>,
      required: false,
      default: "neutral",
      validator(value: string): boolean {
        return ["neutral", "info", "attention", "critical", "positive", "inherited"].includes(
          value,
        );
      },
    },
    /**
     * The general title of the banner
     */
    title: {
      type: String,
      required: false,
      default: "",
    },
    /**
     * Hide the icon if needed
     */
    hideIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * If set to true then you can close the banner directly
     */
    closable: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * This index will get emitted when a user closes the banner.
     * It is needed for removing the correct banner
     */
    bannerIndex: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * Change the default icon for the banner
     */
    icon: {
      type: String,
      required: false,
      default: null,
    },
  },

  computed: {
    bannerIcon(): string {
      if (this.icon) {
        return this.icon;
      }

      const iconConfig: Record<string, string> = {
        neutral: "solid-info-circle",
        info: "solid-info-circle",
        attention: "solid-exclamation-triangle",
        critical: "solid-exclamation-circle",
        positive: "solid-check-circle",
        inherited: "solid-link",
      };

      return iconConfig[this.variant] || "solid-info-circle";
    },

    bannerClasses(): CssClasses {
      return [
        `mt-banner--${this.variant}`,
        {
          "mt-banner--icon": !this.hideIcon,
          "mt-banner--no-icon": this.hideIcon,
          "mt-banner--closable": this.closable,
        },
      ];
    },

    bannerBodyClasses(): CssClasses {
      return {
        "mt-banner__body--icon": !this.hideIcon,
        "mt-banner__body--closable": this.closable,
      };
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$mt-banner-size-close: 40px;

.mt-banner {
  border-width: 1px;
  border-style: solid;
  border-radius: $border-radius-default;
  text-align: left;
  position: relative;
  margin: 0 auto 20px;
  font-size: $font-size-default;
  color: var(--color-text-primary-default);

  &__body {
    padding: 24px 60px 24px 24px;
    line-height: 1.5625;

    &--icon {
      padding: 24px 60px;
    }

    &--closable {
      padding-right: $mt-banner-size-close;
    }
  }

  &__icon {
    position: absolute;
    display: block;
    left: 26px;
    top: 28px;
    width: 20px;
    height: 20px;
  }

  &__close {
    width: $mt-banner-size-close;
    height: $mt-banner-size-close;
    line-height: $mt-banner-size-close;
    position: absolute;
    display: block;
    top: 12px;
    right: 12px;
    padding: 0;
    margin: 0;
    text-align: center;
    background: none;
    border: 0 none;
    outline: none;
    cursor: pointer;
  }

  &__title {
    margin-top: 1px;
    margin-bottom: 3px;
    display: block;
    font-weight: $font-weight-semi-bold;
  }

  &--info {
    border-color: var(--color-border-brand-selected);
    background-color: var(--color-background-brand-default);

    .mt-banner__icon,
    .mt-banner__close {
      color: var(--color-icon-brand-default);
    }
  }

  &--attention {
    border-color: var(--color-border-attention-default);
    background-color: var(--color-background-attention-default);

    .mt-banner__icon,
    .mt-banner__close {
      color: var(--color-icon-attention-default);
    }
  }

  &--critical {
    border-color: var(--color-border-critical-default);
    background-color: var(--color-background-critical-default);

    .mt-banner__icon,
    .mt-banner__close {
      color: var(--color-icon-critical-default);
    }
  }

  &--positive {
    border-color: var(--color-border-positive-default);
    background-color: var(--color-background-positive-default);

    .mt-banner__icon,
    .mt-banner__close {
      color: var(--color-icon-positive-default);
    }
  }

  &--inherited {
    border-color: var(--color-border-accent-default);
    background-color: var(--color-background-accent-default);

    .mt-banner__icon,
    .mt-banner__close {
      color: var(--color-icon-accent-default);
    }
  }

  &--neutral {
    border-color: var(--color-border-primary-default);
    background-color: var(--color-elevation-surface-overlay);

    .mt-banner__icon,
    .mt-banner__close {
      color: var(--color-icon-primary-default);
    }
  }

  ul {
    padding: 8px 0 8px 20px;
  }

  .mt-icon.icon--solid-times-s {
    width: 12px;
    height: 12px;
  }

  .mt-icon {
    > svg {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
