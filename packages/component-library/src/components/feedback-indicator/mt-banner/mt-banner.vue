<template>
  <div class="mt-banner" :class="bannerClasses" role="banner">
    <slot name="customIcon">
      <mt-icon
        v-if="!hideIcon"
        size="1.25rem"
        class="mt-banner__icon"
        :name="bannerIcon"
        decorative
      />
    </slot>

    <div class="mt-banner__body" :class="bannerBodyClasses">
      <mt-text v-if="title" as="h3" weight="bold" size="xs" class="mt-banner__title">
        {{ title }}
      </mt-text>

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
import MtText from "@/components/content/mt-text/mt-text.vue";

type CssClasses = (string | Record<string, boolean>)[] | Record<string, boolean>;
type BannerType = "neutral" | "info" | "attention" | "critical" | "positive" | "inherited";

export default defineComponent({
  name: "MtBanner",

  components: {
    MtIcon,
    MtText,
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

<style scoped>
.mt-banner {
  --mt-banner-close-button-size: 2.5rem;

  border-width: 1px;
  border-style: solid;
  border-radius: var(--border-radius-xs);
  position: relative;
  margin: 0 auto 1.25rem;

  & ul {
    padding: 0.5rem 0 0.5rem 1.25rem;
  }
}

.mt-banner__title {
  margin-block-end: 0;
}

.mt-banner__body {
  padding: 1.5rem 3.75rem 1.5rem 1.5rem;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.mt-banner__body--icon {
  padding: 1.5rem 3.75rem;
}

.mt-banner__body--closable {
  padding-right: var(--mt-banner-close-button-size);
}

.mt-banner__icon {
  position: absolute;
  display: block;
  left: 1.625rem;
  top: 1.75rem;
  width: 1.25rem;
  height: 1.25rem;
}

.mt-banner__close {
  width: var(--mt-banner-close-button-size);
  height: var(--mt-banner-close-button-size);
  line-height: var(--mt-banner-close-button-size);
  position: absolute;
  display: block;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0;
  margin: 0;
  text-align: center;
  background: none;
  border: 0 none;
  outline: none;
  cursor: pointer;
}

.mt-banner--info {
  border-color: var(--color-border-brand-selected);
  background-color: var(--color-background-brand-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-brand-default);
  }
}

.mt-banner--attention {
  border-color: var(--color-border-attention-default);
  background-color: var(--color-background-attention-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-attention-default);
  }
}

.mt-banner--critical {
  border-color: var(--color-border-critical-default);
  background-color: var(--color-background-critical-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-critical-default);
  }
}

.mt-banner--positive {
  border-color: var(--color-border-positive-default);
  background-color: var(--color-background-positive-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-positive-default);
  }
}

.mt-banner--inherited {
  border-color: var(--color-border-accent-default);
  background-color: var(--color-background-accent-default);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-accent-default);
  }
}

.mt-banner--neutral {
  border-color: var(--color-border-primary-default);
  background-color: var(--color-elevation-surface-overlay);

  & :is(.mt-banner__icon, .mt-banner__close) {
    color: var(--color-icon-primary-default);
  }
}
</style>
