<template>
  <div class="mt-inset">
    <slot></slot>
  </div>
</template>

<style scoped>
.mt-inset {
  margin-block-start: calc(var(--mt-inset-block-start, --mt-inset-top) * -1);
  margin-inline-end: calc(var(--mt-inset-inline-end, --mt-inset-right) * -1);
  margin-block-end: calc(var(--mt-inset-block-end, --mt-inset-bottom) * -1);
  margin-inline-start: calc(var(--mt-inset-inline-start, --mt-inset-left) * -1);
}
</style>
