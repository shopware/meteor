<template>
  <div class="sw-block-stack">
    <slot />
  </div>
</template>

<style scoped>
.sw-block-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
</style>
