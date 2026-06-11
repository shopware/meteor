<template>
  <div class="do-dont">
    <div class="do-dont__card do-dont__card--do">
      <span class="do-dont__label do-dont__label--do">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM7.56066 10.9393L10.5 13.8787L16.4393 7.93934C17.0251 7.35355 17.9749 7.35355 18.5607 7.93934C19.1464 8.52513 19.1464 9.47487 18.5607 10.0607L11.5607 17.0607C10.9749 17.6464 10.0251 17.6464 9.43934 17.0607L5.43934 13.0607C4.85355 12.4749 4.85355 11.5251 5.43934 10.9393C6.02513 10.3536 6.97487 10.3536 7.56066 10.9393Z"
          />
        </svg>
        Do
      </span>
      <p class="do-dont__text">
        <slot name="do">{{ doText }}</slot>
      </p>
    </div>
    <div class="do-dont__card do-dont__card--dont">
      <span class="do-dont__label do-dont__label--dont">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12 9.87596L8.81394 6.6899C8.2274 6.10337 7.27644 6.10337 6.6899 6.6899C6.10337 7.27644 6.10337 8.2274 6.6899 8.81394L9.87596 12L6.6899 15.1861C6.10337 15.7726 6.10337 16.7236 6.6899 17.3101C7.27644 17.8966 8.2274 17.8966 8.81394 17.3101L12 14.124L15.1861 17.3101C15.7726 17.8966 16.7236 17.8966 17.3101 17.3101C17.8966 16.7236 17.8966 15.7726 17.3101 15.1861L14.124 12L17.3101 8.81394C17.8966 8.2274 17.8966 7.27644 17.3101 6.6899C16.7236 6.10337 15.7726 6.10337 15.1861 6.6899L12 9.87596Z"
          />
        </svg>
        Don't
      </span>
      <p class="do-dont__text">
        <slot name="dont">{{ dont }}</slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Short text for the Do card. Use the #do slot for rich content. */
  doText?: string;
  /** Short text for the Don't card. Use the #dont slot for rich content. */
  dont?: string;
}>();
</script>

<style scoped>
.do-dont {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 0;
}

.do-dont__card {
  border-radius: 4px;
  padding: 10px 16px;
}

.do-dont__card--do {
  background-color: var(--color-background-positive-default);
}

.do-dont__card--dont {
  background-color: var(--color-background-critical-default);
}

.do-dont__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  line-height: 22px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.do-dont__label--do {
  color: var(--color-text-positive-default);
}

.do-dont__label--dont {
  color: var(--color-text-critical-default);
}

.do-dont__text {
  font-size: 16px;
  line-height: 26px;
  color: var(--color-text-primary-default);
  margin: 0;
}
</style>
