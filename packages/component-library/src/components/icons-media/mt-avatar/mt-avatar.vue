<template>
  <span
    :class="[
      'mt-avatar',
      `mt-avatar--size-${props.size}`,
      `mt-avatar--color-${color}`,
      {
        'mt-avatar--square': props.variant === 'square',
      },
    ]"
    :style="{
      'background-image': props.imageUrl ? `url('${props.imageUrl}')` : undefined,
    }"
    role="img"
    alt=""
  >
    <slot>
      <span v-if="!props.imageUrl" data-testid="mt-avatar-initials">
        {{ avatarInitials }}
      </span>
    </slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const colors = ["orange", "pink", "yellow", "purple", "red", "blue", "green"] as const;

const props = withDefaults(
  defineProps<{
    size?: "2xs" | "xs" | "s" | "m" | "l";
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    variant?: "circle" | "square";
  }>(),
  {
    size: "m",
    firstName: undefined,
    lastName: undefined,
    imageUrl: undefined,
    variant: "circle",
  },
);

const avatarInitials = computed(() => {
  return (props.firstName?.[0] ?? "") + (props.lastName?.[0] ?? "");
});

const color = computed(() => {
  const nameLength = (props.firstName?.length ?? 0) + (props.lastName?.length ?? 0);
  return colors[nameLength % colors.length];
});
</script>

<style scoped>
.mt-avatar {
  display: inline-grid;
  place-items: center;
  width: var(--mt-avatar-size);
  height: var(--mt-avatar-size);
  border-radius: var(--border-radius-round);
  background-size: cover;
  font-size: calc(var(--mt-avatar-size) * 0.4);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  user-select: none;

  color: var(--mt-avatar--color-primary);
  background-color: var(--mt-avatar--color-secondary);
}

.mt-avatar--size-2xs {
  --mt-avatar-size: var(--scale-size-16);
}

.mt-avatar--size-xs {
  --mt-avatar-size: var(--scale-size-24);
}

.mt-avatar--size-s {
  --mt-avatar-size: var(--scale-size-32);
}

.mt-avatar--size-m {
  --mt-avatar-size: var(--scale-size-40);
}

.mt-avatar--size-l {
  --mt-avatar-size: var(--scale-size-48);
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

.mt-avatar--color-green {
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
