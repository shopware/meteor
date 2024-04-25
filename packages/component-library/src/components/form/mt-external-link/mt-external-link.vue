<template>
  <a
    v-if="!!href"
    :href="href"
    v-bind="$attrs"
    target="_blank"
    :rel="rel"
    :aria-disabled="disabled"
    class="mt-external-link"
    :class="classes"
  >
    <slot />
    <mt-icon class="mt-external-link__icon" :name="icon" />
  </a>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
  <span
    v-else
    class="mt-external-link"
    :class="classes"
    role="link"
    :aria-disabled="disabled"
    @click="onClick"
  >
    <slot />
    <mt-icon class="mt-external-link__icon" :name="icon" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

export default defineComponent({
  name: "MtExternalLink",

  components: {
    "mt-icon": MtIcon,
  },

  inheritAttrs: false,

  props: {
    /**
     * Render the external link in small font size
     */
    small: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Make the link unclickable
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Change the "rel" attribute of <a> elements
     */
    rel: {
      type: String,
      required: false,
      default: "noopener",
      validator(value: string) {
        return ["nofollow", "noopener", "noreferrer", "opener"].includes(value);
      },
    },

    href: {
      type: String,
      required: false,
      default: undefined,
    },
  },

  computed: {
    classes() {
      return {
        "mt-external-link--small": this.small,
        "mt-external-link--disabled": this.disabled,
      };
    },

    icon() {
      return "regular-external-link-s";
    },
  },

  methods: {
    onClick(event: MouseEvent) {
      if (this.disabled) {
        return;
      }

      this.$emit("click", event);
    },
  },
});
</script>

<style lang="scss">
.mt-external-link {
  color: $color-shopware-brand-500;
  font-size: $font-size-small;
  text-decoration: underline;
  cursor: pointer;

  &:hover,
  &:focus {
    color: $color-shopware-brand-700;
  }

  &__icon {
    width: 10px;
    margin-left: 4px;

    > svg {
      width: 100% !important;
      height: 100% !important;
    }
  }

  &--disabled {
    pointer-events: none;
    color: $color-shopware-brand-300;

    &:hover,
    &:focus {
      color: $color-shopware-brand-300;
    }
  }

  &--small {
    font-size: $font-size-extra-small;

    .mt-external-link__icon {
      width: 8px;
      margin-left: 2px;
    }
  }
}
</style>
