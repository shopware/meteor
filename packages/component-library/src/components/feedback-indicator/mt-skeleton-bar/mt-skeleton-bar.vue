<template>
  <div class="mt-skeleton-bar">
    <div class="mt-skeleton-bar__shimmer" />
  </div>
</template>

<style scoped>
.mt-skeleton-bar {
  height: var(--scale-size-32);
  width: 100%;
  background-color: var(--color-background-primary-disabled);
  overflow: hidden;
  border-radius: var(--border-radius-xs);

  &:not(:last-child) {
    margin-bottom: var(--scale-size-32);
  }
}

.mt-skeleton-bar__shimmer {
  height: 100%;
  background-image: linear-gradient(
    89.17deg,
    var(--color-background-primary-disabled) 0.8%,
    var(--color-elevation-surface-sunken) 50.09%,
    var(--color-background-primary-disabled) 96.31%
  );
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  animation: barShimmer 1.8s infinite;
  animation-timing-function: linear;
  transform: translate(-100%);
}

@keyframes barShimmer {
  to {
    transform: translate(120%);
  }
}
</style>
