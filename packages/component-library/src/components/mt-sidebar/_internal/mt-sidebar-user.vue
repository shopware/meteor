<template>
  <mt-loader v-if="isLoading" size="32px" />

  <mt-avatar
    class="mt-sidebar__avatar"
    size="s"
    :image-url="user?.avatarUrl"
    :first-name="user?.firstName"
    :last-name="user?.lastName"
  />

  <div
    class="mt-sidebar__user-custom-fields mt-sidebar__collapsible-text mt-sidebar__hide-on-collapse"
  >
    <mt-text as="div" class="mt-sidebar__user-name" size="xs" weight="semibold">
      {{ userName }}
    </mt-text>
    <mt-text as="div" class="mt-sidebar__user-type" size="2xs" color="color-text-secondary-default">
      {{ user?.title }}
    </mt-text>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import MtAvatar from "@/components/mt-avatar/mt-avatar.vue";
import MtLoader from "@/components/mt-loader/mt-loader.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import type { SidebarUser } from "../mt-sidebar.types";

/**
 * The default footer content of `mt-sidebar`: avatar, name and title of the current user.
 * Styled by the parent stylesheet.
 */
const props = defineProps({
  user: {
    type: Object as PropType<SidebarUser>,
    default: undefined,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const userName = computed(() =>
  [props.user?.firstName, props.user?.lastName].filter(Boolean).join(" "),
);
</script>
