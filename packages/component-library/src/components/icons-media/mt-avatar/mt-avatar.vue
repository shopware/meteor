<template>
  <span
    ref="avatarRef"
    :class="[
      'mt-avatar',
      `mt-avatar--color-${color}`,
      {
        'mt-avatar--square': props.variant === 'square',
      },
    ]"
    :style="[avatarImage, avatarSize, avatarInitialsSize]"
    role="img"
    alt=""
  >
    <slot>
      <span v-if="showInitials" data-testid="mt-avatar-initials">
        {{ avatarInitials }}
      </span>

      <mt-icon
        v-if="showPlaceholder"
        aria-hidden
        name="regular-user"
        data-testid="mt-avatar-placeholder"
      />
    </slot>
  </span>
</template>

<script setup lang="ts">
import MtIcon from "../mt-icon/mt-icon.vue";
import { reactive, computed, onMounted, ref, watch, nextTick, type CSSProperties } from "vue";

const colors = ["orange", "pink", "yellow", "purple", "red", "blue", "emerald"] as const;

const props = defineProps<{
  size?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  placeholder?: boolean;
  sourceContext?: { avatarMedia: { url: string; thumbnails: { width: number; url: string }[] } };
  variant?: "circle" | "square";
}>();

const sizes = reactive({
  fontSize: 16,
  lineHeight: 16,
});

const avatarSize = computed(() => ({
  width: props.size,
  height: props.size,
}));

const avatarInitials = computed(() => {
  const firstNameLetter = props.firstName ? props.firstName[0] : "";
  const lastNameLetter = props.lastName ? props.lastName[0] : "";

  return firstNameLetter + lastNameLetter;
});

const avatarInitialsSize = computed(() => ({
  "font-size": `${sizes.fontSize / 16}rem`,
  "line-height": `${sizes.lineHeight / 16}rem`,
}));

const avatarRef = ref<HTMLElement | null>(null);
function generateAvatarInitialsSize() {
  if (!avatarRef.value) return;

  const avatarSize = avatarRef.value.offsetHeight;

  sizes.fontSize = Math.round(avatarSize * 0.4);
  sizes.lineHeight = Math.round(avatarSize * 0.98);
}

onMounted(() => {
  generateAvatarInitialsSize();
});

watch(
  () => props.size,
  () => {
    nextTick(() => {
      generateAvatarInitialsSize();
    });
  },
);

const avatarImage = computed<CSSProperties>(() => {
  if (props.imageUrl) {
    return { "background-image": `url('${props.imageUrl}')` };
  }

  if (!props.sourceContext?.avatarMedia?.url) {
    return {};
  }

  const avatarMedia = structuredClone(props.sourceContext.avatarMedia);

  const thumbnailImage = avatarMedia.thumbnails.sort((a, b) => a.width - b.width)[0];
  const previewImageUrl = thumbnailImage ? thumbnailImage.url : avatarMedia.url;

  return { "background-image": `url('${previewImageUrl}')` };
});

const hasAvatarImage = computed(() => {
  return !!avatarImage.value && !!avatarImage.value["background-image"];
});

const showPlaceholder = computed(() => {
  return props.placeholder && !hasAvatarImage.value;
});

const showInitials = computed(() => {
  return !props.placeholder && !hasAvatarImage.value;
});

const color = computed(() => {
  const firstNameLength = props.firstName ? props.firstName.length : 0;
  const lastNameLength = props.lastName ? props.lastName.length : 0;

  const nameLength = firstNameLength + lastNameLength;

  return colors[nameLength % colors.length];
});
</script>

<style scoped>
.mt-avatar {
  display: inline-block;
  width: var(--scale-size-40);
  height: var(--scale-size-40);
  border-radius: var(--border-radius-round);
  background-size: cover;
  text-align: center;
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
