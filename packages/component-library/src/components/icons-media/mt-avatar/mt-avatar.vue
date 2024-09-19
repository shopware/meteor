<template>
  <span
    ref="avatarRef"
    class="mt-avatar"
    :class="'mt-avatar__' + variant"
    :style="[avatarImage, avatarColor, avatarSize, avatarInitialsSize]"
    role="img"
  >
    <slot>
      <span v-if="showInitials" class="mt-avatar__initials">
        {{ avatarInitials }}
      </span>

      <span v-if="showPlaceholder">
        <mt-icon name="regular-user" />
      </span>
    </slot>
  </span>
</template>

<script setup lang="ts">
import cloneDeep from "lodash-es/cloneDeep";
import MtIcon from "../mt-icon/mt-icon.vue";
import {
  reactive,
  computed,
  onMounted,
  ref,
  watch,
  nextTick,
  type CSSProperties,
  type PropType,
} from "vue";

const colors = [
  "#FFD700",
  "#FFC700",
  "#F88962",
  "#F56C46",
  "#FF85C2",
  "#FF68AC",
  "#6AD6F0",
  "#4DC6E9",
  "#A092F0",
  "#8475E9",
  "#57D9A3",
  "#3CCA88",
];

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "",
  },
  size: {
    type: String,
    required: false,
    default: null,
  },
  firstName: {
    type: String,
    required: false,
    default: "",
  },
  lastName: {
    type: String,
    required: false,
    default: "",
  },
  imageUrl: {
    type: String,
    required: false,
    default: null,
  },
  placeholder: {
    type: Boolean,
    required: false,
    default: false,
  },
  sourceContext: {
    type: Object as PropType<{
      avatarMedia: { url: string; thumbnails: { width: number; url: string }[] } | undefined;
    }>,
    required: false,
    default: null,
  },
  variant: {
    type: String,
    required: false,
    default: "circle",
    validator: (value: string) => ["circle", "square"].includes(value),
  },
});

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

  const avatarMedia = cloneDeep(props.sourceContext.avatarMedia);

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

const avatarColor = computed<CSSProperties>(() => {
  if (props.color.length) {
    return {
      "background-color": props.color,
    };
  }

  const firstNameLength = props.firstName ? props.firstName.length : 0;
  const lastNameLength = props.lastName ? props.lastName.length : 0;

  const nameLength = firstNameLength + lastNameLength;
  const color = colors[nameLength % colors.length];

  return {
    "background-color": color,
  };
});
</script>

<style scoped>
.mt-avatar {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius-round);
  background: #ffc700 no-repeat center center;
  background-size: cover;
  text-align: center;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  color: var(--color-text-static-default);
  user-select: none;
}

.mt-avatar__square {
  border-radius: var(--border-radius-xs);
}
</style>
