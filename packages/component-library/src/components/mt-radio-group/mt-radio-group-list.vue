<template>
  <div class="mt-radio-group-list">
    <slot />
  </div>
</template>

<style scoped>
.mt-radio-group-list {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-8);
}
</style>
