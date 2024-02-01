<template>
  <div
    class="sw-banner"
    :class="bannerClasses"
    role="banner"
  >
    <slot name="customIcon">
      <sw-icon
        v-if="!hideIcon"
        class="sw-banner__icon"
        :name="bannerIcon"
        decorative
      />
    </slot>
    <div
      class="sw-banner__body"
      :class="bannerBodyClasses"
    >
      <div
        v-if="title"
        class="sw-banner__title"
      >
        {{ title }}
      </div>
      <div class="sw-banner__message">
        <slot />
      </div>
    </div>
    <button
      v-if="closable"
      class="sw-banner__close"
      aria-label="Schließen"
      title="Schließen"
      @click.prevent="$emit('close', bannerIndex)"
    >
      <sw-icon name="regular-times-s" />
    </button>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';

import Vue from 'vue';
import SwIcon from '../../icons-media/sw-icon/sw-icon.vue'

type CssClasses = (string | Record<string, boolean>)[] | Record<string, boolean>;
type BannerType = 'neutral' | 'info' | 'attention' | 'critical' | 'positive' | 'inherited';

export default Vue.extend({
  name: 'SwBanner',

  components: {
    'sw-icon': SwIcon,
  },

  props: {
    /**
     * Change the variant of the banner
     * @values neutral, info, attention, critical, positive, inherited
     */
    variant: {
        type: String as PropType<BannerType>,
        required: false,
        default: 'neutral',
        validator(value: string): boolean {
            return ['neutral', 'info', 'attention', 'critical', 'positive', 'inherited'].includes(value);
        },
    },
    /**
     * The general title of the banner
     */
    title: {
        type: String,
        required: false,
        default: '',
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
            neutral: 'regular-info-circle',
            info: 'regular-info-circle',
            attention: 'regular-exclamation-triangle',
            critical: 'regular-exclamation-circle',
            positive: 'regular-check-circle',
            inherited: 'regular-link',
        };

        return iconConfig[this.variant] || 'regular-info-circle';
    },

    bannerClasses(): CssClasses {
        return [
            `sw-banner--${this.variant}`,
            {
                'sw-banner--icon': !this.hideIcon,
                'sw-banner--no-icon': this.hideIcon,
                'sw-banner--closable': this.closable,
            },
        ];
    },

    bannerBodyClasses(): CssClasses {
        return {
            'sw-banner__body--icon': !this.hideIcon,
            'sw-banner__body--closable': this.closable,
        };
    },
  }
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$sw-banner-size-close: 40px;

.sw-banner {
    border: 1px solid $color-gray-300;
    border-radius: $border-radius-default;
    color: $color-darkgray-200;
    background-color: $color-white;
    text-align: left;
    position: relative;
    margin: 0 auto 20px;
    font-size: $font-size-default;

    &__body {
        padding: 24px 60px 24px 24px;
        line-height: 1.5625;

        &--icon {
            padding: 24px 60px;
        }

        &--closable {
            padding-right: $sw-banner-size-close;
        }
    }

    &__icon {
        color: $color-gray-300;
        position: absolute;
        display: block;
        left: 26px;
        top: 28px;
        width: 20px;
        height: 20px;
    }

    &__close {
        width: $sw-banner-size-close;
        height: $sw-banner-size-close;
        line-height: $sw-banner-size-close;
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
        font-weight: bold;
    }

    &--info {
        border-color: $color-shopware-brand-500;
        background-color: $color-shopware-brand-50;
        color: $color-shopware-brand-500;

        .sw-banner__icon,
        .sw-banner__close {
            color: $color-shopware-brand-500;
        }
    }

    &--attention {
        border-color: $color-pumpkin-spice-500;
        background-color: $color-pumpkin-spice-50;
        color: $color-pumpkin-spice-900;

        .sw-banner__icon,
        .sw-banner__close {
            color: $color-pumpkin-spice-900;
        }
    }

    &--critical {
        border-color: $color-crimson-500;
        background-color: $color-crimson-50;
        color: $color-crimson-900;

        .sw-banner__icon,
        .sw-banner__close {
            color: $color-crimson-500;
        }
    }

    &--positive {
        border-color: $color-emerald-500;
        background-color: $color-emerald-50;
        color: $color-emerald-900;

        .sw-banner__icon,
        .sw-banner__close {
            color: $color-emerald-500;
        }
    }

    &--inherited {
        border-color: $color-module-purple-900;
        background-color: $color-module-purple-50;
        color: $color-module-purple-900;

        .sw-banner__icon,
        .sw-banner__close {
            color: $color-module-purple-900;
        }
    }

    &--neutral {
        .sw-banner__icon,
        .sw-banner__close {
            color: $color-darkgray-200;
        }
    }

    ul {
        padding: 8px 0 8px 20px;
    }

    .sw-icon.icon--regular-times-s {
      width: 12px;
      height: 12px;
    }

    .sw-icon {
      > svg {
        width: 100% !important;
        height: 100% !important;
      }
    }
}
</style>
