<template>
  <span
    :class="[
      'mt-avatar',
      `mt-avatar--color-${color}`,
      {
        'mt-avatar--square': variant === 'square',
      },
    ]"
    :style="{
      '--avatar-size': size,
      'background-image': imageUrl ? `url('${imageUrl}')` : undefined,
    }"
    role="img"
    alt=""
  >
    <slot>
      <span v-if="!placeholder && !imageUrl" data-testid="mt-avatar-initials">
        {{ avatarInitials }}
      </span>

      <mt-icon
        v-if="placeholder && !imageUrl"
        aria-hidden
        name="regular-user"
        data-testid="mt-avatar-placeholder"
      />
    </slot>
  </span>
</template>

<script setup lang="ts">
import MtIcon from "../mt-icon/mt-icon.vue";
import { computed } from "vue";

const colors = ["orange", "pink", "yellow", "purple", "red", "blue", "emerald"] as const;

const { size, firstName, lastName, imageUrl, placeholder, variant } = defineProps<{
  size?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  placeholder?: boolean;
  variant?: "circle" | "square";
}>();

const avatarInitials = computed(() => {
  return (firstName?.[0] ?? "") + (lastName?.[0] ?? "");
});

const color = computed(() => {
  const nameLength = (firstName?.length ?? 0) + (lastName?.length ?? 0);
  return colors[nameLength % colors.length];
});
</script>

<style scoped>
.mt-avatar {
  --avatar-size: var(--scale-size-40);

  display: inline-grid;
  place-items: center;
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: var(--border-radius-round);
  background-size: cover;
  font-size: calc(var(--avatar-size) * 0.4);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  user-select: none;

  color: var(--mt-avatar--color-primary);
  background-color: var(--mt-avatar--color-secondary);
}

[data-theme="dark"] .mt-avatar {
  color: var(--mt-avatar--color-secondary);
  background-color: var(--mt-avatar--color-primary);
}

.mt-avatar--square {
  border-radius: var(--border-radius-xs);
}

.mt-avatar--color-orange {
  --mt-avatar--color-primary: #974200;
  --mt-avatar--color-secondary: #fff2ec;
}

.mt-avatar--color-emerald {
  --mt-avatar--color-primary: #007e4e;
  --mt-avatar--color-secondary: #ddffea;
}

.mt-avatar--color-pink {
  --mt-avatar--color-primary: #a8005c;
  --mt-avatar--color-secondary: #fff1f5;
}

.mt-avatar--color-yellow {
  --mt-avatar--color-primary: #4f4100;
  --mt-avatar--color-secondary: #fff7d6;
}

.mt-avatar--color-purple {
  --mt-avatar--color-primary: #633bc6;
  --mt-avatar--color-secondary: #f5f4ff;
}

.mt-avatar--color-red {
  --mt-avatar--color-primary: #90000e;
  --mt-avatar--color-secondary: #fff2f0;
}

.mt-avatar--color-blue {
  --mt-avatar--color-primary: #005b99;
  --mt-avatar--color-secondary: #eef6ff;
}
</style>
