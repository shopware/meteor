<template>
  <div class="mt-empty-state">
    <div class="mt-empty-state__icon">
      <mt-icon :name="icon" />
    </div>

    <h2 class="mt-empty-state__headline">
      {{ headline }}
    </h2>

    <p class="mt-empty-state__description">
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { TranslateResult } from "vue-i18n";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

export default defineComponent({
  name: "MtEmptyState",

  components: {
    "mt-icon": MtIcon,
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

.mt-empty-state {
  &__icon {
    display: inline-block;
    padding: 12px;
    border-radius: $border-radius-default;
    background-color: $color-gray-100;

    svg {
      color: $color-gray-800;
    }
  }

  h2.mt-empty-state__headline {
    color: $color-darkgray-800;
    font-weight: $font-weight-bold;
    font-size: $font-size-l;
    line-height: $line-height-lg;
    margin-top: 24px;
  }

  p.mt-empty-state__description {
    color: $color-darkgray-200;
    font-size: $font-size-xs;
    line-height: $line-height-sm;
    margin-top: 8px;
  }
}
</style>
