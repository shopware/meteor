<template>
  <div :class="bannerClasses" role="banner">
    <slot name="customIcon">
      <mt-icon
        v-if="!hideIcon"
        :class="
          stylex(
            styles.icon,
            // @ts-expect-error
            styles[`iconColor${firstLetterUppercase(variant)}`],
          )
        "
        :name="bannerIcon"
        size="1.25rem"
        decorative
      />
    </slot>

    <div>
      <div v-if="title" :class="stylex(styles.title)">
        {{ title }}
      </div>

      <div class="mt-banner__message">
        <slot />
      </div>
    </div>

    <button
      v-if="closable"
      :class="
        stylex(
          styles.close,
          // @ts-expect-error
          styles[`iconColor${firstLetterUppercase(variant)}`],
        )
      "
      aria-label="Schließen"
      title="Schließen"
      @click.prevent="$emit('close', bannerIndex)"
    >
      <mt-icon name="solid-times-s" size="0.75rem" />
    </button>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import stylex from "@stylexjs/stylex";

import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

type Stylex = (...classes: Record<string, unknown>[]) => string;

const styles = stylex.create({
  banner: {
    display: "flex",
    columnGap: "1rem",
    padding: "1.5rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: "0.25rem",
    fontSize: "1rem",
  },
  bannerVariantInfo: {
    borderColor: "var(--color-border-brand-selected)",
    backgroundColor: "var(--color-background-brand-default)",
  },
  bannerVariantInherited: {
    borderColor: "var(--color-border-accent-default)",
    backgroundColor: "var(--color-background-accent-default)",
  },
  bannerVariantNeutral: {
    borderColor: "var(--color-border-primary-default)",
    backgroundColor: "var(--color-elevation-surface-overlay)",
  },
  bannerVariantPositive: {
    borderColor: "var(--color-border-positive-default)",
    backgroundColor: "var(--color-background-positive-default)",
  },
  bannerVariantCritical: {
    borderColor: "var(--color-border-critical-default)",
    backgroundColor: "var(--color-background-critical-default)",
  },
  bannerVariantAttention: {
    borderColor: "var(--color-border-attention-default)",
    backgroundColor: "var(--color-background-attention-default)",
  },
  icon: {
    display: "block",
  },
  // determines the color of the icon and the close button
  iconColorInfo: {
    color: "var(--color-icon-brand-default)",
  },
  iconColorAttention: {
    color: "var(--color-icon-attention-default)",
  },
  iconColorCritical: {
    color: "var(--color-icon-critical-default)",
  },
  iconColorInherited: {
    color: "var(--color-icon-accent-default)",
  },
  iconColorPositive: {
    color: "var(--color-icon-positive-default)",
  },
  iconColorNeutral: {
    color: "var(--color-icon-primary-default)",
  },
  title: {
    fontWeight: 600,
  },
  close: {
    marginInlineStart: "auto",
    width: "2rem",
    height: "2rem",
    borderRadius: "0.25rem",
    ":focus-visible": {
      outline: "2px solid var(--color-border-brand-selected)",
    },
  },
});

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

  setup() {
    function firstLetterUppercase(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
      styles,
      stylex: stylex as unknown as Stylex,
      firstLetterUppercase,
    };
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

    bannerClasses() {
      function firstLetterUppercase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      // @ts-expect-error
      return stylex(styles.banner, styles[`bannerVariant${firstLetterUppercase(this.variant)}`]);
    },
  },
});
</script>
