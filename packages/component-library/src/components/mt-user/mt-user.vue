<template>
  <div class="mt-user" :class="{ 'mt-user--avatar-only': avatarOnly }">
    <mt-avatar
      class="mt-user__avatar"
      size="s"
      :first-name="initials.first"
      :last-name="initials.last"
      :image-url="imageUrl"
      aria-hidden="true"
    />

    <span class="mt-user__text">
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

    <span v-if="hasSlotContent(slots.suffix)" class="mt-user__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtAvatar from "@/components/mt-avatar/mt-avatar.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { hasSlotContent } from "@/utils/slot";

/**
 * A user shown as avatar, name and an optional secondary line, for example in a
 * sidebar footer or a user menu.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
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
     * Hides the name and the subtitle visually, for example in a collapsed sidebar. They stay
     * available to assistive technology, and the `suffix` slot stays visible.
     */
    avatarOnly?: boolean;
  }>(),
  {
    subtitle: undefined,
    imageUrl: undefined,
    avatarOnly: false,
  },
);

const slots = defineSlots<{
  /** Trailing content, such as a menu trigger or an action. */
  suffix?(): unknown;
}>();

const initials = computed(() => {
  const words = props.name.trim().split(/\s+/).filter(Boolean);

  return { first: words[0], last: words.length > 1 ? words[words.length - 1] : undefined };
});
</script>

<style scoped>
.mt-user {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  min-width: 0;
}

.mt-user__avatar {
  flex: none;
}

.mt-user .mt-user__avatar {
  --mt-avatar-size: var(--scale-size-36);
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

.mt-user__suffix {
  display: flex;
  flex: none;
  align-items: center;
}

.mt-user--avatar-only .mt-user__text {
  position: absolute;
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
