<template>
  <div class="mt-inset">
    <slot />
  </div>
</template>

<style scoped>
.mt-inset {
  margin: calc(var(--inset-top) * -1) calc(var(--inset-right) * -1) calc(var(--inset-bottom) * -1)
    calc(var(--inset-left) * -1);
}
</style>
