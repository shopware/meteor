<template>
  <span class="mt-user" :title="compact ? name : undefined">
    <mt-avatar
      class="mt-user__avatar"
      :first-name="nameParts.first"
      :last-name="nameParts.last"
      :image-url="imageUrl"
      aria-hidden="true"
    />

    <span class="mt-user__text" :class="{ 'visually-hidden': compact }">
      <mt-text as="span" class="mt-user__name" size="xs" weight="semibold">
        {{ name }}
      </mt-text>

      <mt-text
        v-if="subtitle"
        as="span"
        class="mt-user__subtitle"
        size="2xs"
        color="color-text-secondary-default"
      >
        {{ subtitle }}
      </mt-text>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtAvatar from "@/components/mt-avatar/mt-avatar.vue";
import MtText from "@/components/mt-text/mt-text.vue";

/**
 * A user shown as avatar, name and an optional secondary line, for example in a
 * sidebar footer or a user menu.
 *
 * @experimental The API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The display name. The avatar shows the initials of its first and last word. */
    name: string;
    /** A secondary line below the name, such as a role, an email address or a workspace. */
    subtitle?: string;
    /** An image for the avatar instead of the initials. */
    imageUrl?: string;
    /**
     * Shows only the avatar. The name and the subtitle stay available to assistive technology, and
     * the name shows on hover.
     */
    compact?: boolean;
  }>(),
  {
    subtitle: undefined,
    imageUrl: undefined,
    compact: false,
  },
);

const nameParts = computed(() => {
  const words = props.name.trim().split(/\s+/).filter(Boolean);

  return { first: words[0], last: words.length > 1 ? words[words.length - 1] : undefined };
});
</script>

<style scoped>
.mt-user {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  min-width: 0;
}

/* Between the sizes of mt-avatar, as high as the name and the subtitle together. */
.mt-user .mt-user__avatar {
  --mt-avatar-size: var(--scale-size-36);

  flex: none;
}

.mt-user__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.mt-user__name,
.mt-user__subtitle {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
