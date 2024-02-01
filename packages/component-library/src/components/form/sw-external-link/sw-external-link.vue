<template>
  <a
    v-if="$attrs.hasOwnProperty('href') && !!$attrs.href"
    v-bind="$attrs"
    target="_blank"
    :rel="rel"
    :aria-disabled="disabled"
    class="sw-external-link"
    :class="classes"
  >
    <slot />
    <sw-icon
      class="sw-external-link__icon"
      :name="icon"
    />
  </a>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
  <span
    v-else
    class="sw-external-link"
    :class="classes"
    role="link"
    :aria-disabled="disabled"
    @click="onClick"
  >
    <slot />
    <sw-icon
      class="sw-external-link__icon"
      :name="icon"
    />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import SwIcon from '../../icons-media/sw-icon/sw-icon.vue';

export default Vue.extend({
  name: 'SwExternalLink',

  components: {
    'sw-icon': SwIcon,
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
      default: 'noopener',
      validator(value: string) {
        return [
          'nofollow',
          'noopener',
          'noreferrer',
          'opener',
        ].includes(value)
      }
    },
  },

  computed: {
    classes() {
      return {
        'sw-external-link--small': this.small,
        'sw-external-link--disabled': this.disabled,
      };
    },

    icon() {
      return 'regular-external-link-s';
    }
  },

  methods: {
    onClick(event: MouseEvent) {
      if (this.disabled) {
        return;
      }

      this.$emit('click', event);
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.sw-external-link {
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

    .sw-external-link__icon {
      width: 8px;
      margin-left: 2px;
    }
  }
}
</style>
