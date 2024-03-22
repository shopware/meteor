<template>
  <div class="mt-skeleton-bar">
    <div class="mt-skeleton-bar__shimmer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MtSkeletonBar",
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$mt-skeleton-bar-color: $color-gray-100;
$mt-skeleton-bar-height: 32px;
$mt-skeleton-shimmer-dark: $color-gray-200;
$mt-skeleton-shimmer-light: $color-gray-100;

.mt-skeleton-bar {
  height: $mt-skeleton-bar-height;
  width: 100%;
  background-color: $mt-skeleton-bar-color;
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: 32px;
  }

  &__shimmer {
    height: 100%;
    background-image: linear-gradient(
      89.17deg,
      $mt-skeleton-shimmer-light 0.8%,
      $mt-skeleton-shimmer-dark 50.09%,
      $mt-skeleton-shimmer-light 96.31%
    );
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
    animation: barShimmer 1800ms infinite;
    animation-timing-function: linear;
    transform: translate(-100%);

    @keyframes barShimmer {
      to {
        transform: translate(120%);
      }
    }
  }
}
</style>
