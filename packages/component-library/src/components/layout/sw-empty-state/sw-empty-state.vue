<template>
  <div class="sw-empty-state">
    <div class="sw-empty-state__icon">
      <sw-icon :name="icon" />
    </div>

    <h2 class="sw-empty-state__headline">
      {{ headline }}
    </h2>

    <p class="sw-empty-state__description">
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { TranslateResult } from "vue-i18n";
import SwIcon from "../../icons-media/sw-icon/sw-icon.vue";

export default defineComponent({
  name: "SwEmptyState",

  components: {
    "sw-icon": SwIcon,
  },

  props: {
    headline: {
      type: String as PropType<string | TranslateResult>,
      required: true,
    },

    description: {
      type: String as PropType<string | TranslateResult>,
      required: true,
    },

    icon: {
      type: String,
      required: false,
      default: "solid-content",
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.sw-empty-state {
  &__icon {
    display: inline-block;
    padding: 12px;
    border-radius: $border-radius-default;
    background-color: $color-gray-100;

    svg {
      color: $color-gray-800;
    }
  }

  h2.sw-empty-state__headline {
    color: $color-darkgray-800;
    font-weight: $font-weight-bold;
    font-size: $font-size-l;
    line-height: $line-height-lg;
    margin-top: 24px;
  }

  p.sw-empty-state__description {
    color: $color-darkgray-200;
    font-size: $font-size-xs;
    line-height: $line-height-sm;
    margin-top: 8px;
  }
}
</style>
