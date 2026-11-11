<template>
  <span
    :class="['mt-extension-icon', { 'mt-extension-icon--placeholder': !showImage }]"
    :style="{ '--mt-extension-icon-size': `var(--scale-size-${size})` }"
    :role="placeholderLabel ? 'img' : undefined"
    :aria-label="placeholderLabel"
  >
    <img
      v-if="showImage"
      ref="image"
      class="mt-extension-icon__image"
      :src="src"
      :alt="alt"
      @error="onError"
    />

    <svg
      v-else
      class="mt-extension-icon__placeholder"
      viewBox="0 0 512 512"
      aria-hidden="true"
      data-testid="mt-extension-icon-placeholder"
    >
      <rect class="mt-extension-icon__placeholder-background" width="512" height="512" />
      <g class="mt-extension-icon__placeholder-lines">
        <path
          d="M68 0V512M444 0V512M0 68H512M0 444H512M256 0V512M0 256H512M0 0L512 512M512 0L0 512"
        />
        <circle cx="256" cy="256" r="188" />
        <circle cx="256" cy="256" r="135" />
      </g>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /**
     * The URL of the extension icon. When omitted, or when the image fails to load,
     * a placeholder is shown instead.
     */
    src?: string;
    /**
     * A text alternative for the icon, usually the extension name. When empty, the
     * icon is treated as decorative and hidden from assistive technology.
     */
    alt?: string;
    /**
     * The width and height of the icon, as a step of the `--scale-size-*` token scale.
     *
     * @values 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96
     */
    size?: 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96;
  }>(),
  {
    src: undefined,
    alt: "",
    size: 40,
  },
);

const image = useTemplateRef("image");
const hasError = ref(false);

// In SSR the error event can fire before hydration attaches the listener,
// so a broken image that already finished loading is checked once on mount
onMounted(() => {
  if (image.value?.complete && image.value.naturalWidth === 0) {
    hasError.value = true;
  }
});

watch(
  () => props.src,
  () => {
    hasError.value = false;
  },
);

const showImage = computed(() => !!props.src && !hasError.value);

const placeholderLabel = computed(() => (showImage.value || !props.alt ? undefined : props.alt));

function onError() {
  hasError.value = true;
}
</script>

<style scoped>
.mt-extension-icon {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: var(--mt-extension-icon-size);
  height: var(--mt-extension-icon-size);
  border-radius: 10%;
  overflow: hidden;
  vertical-align: middle;
}

.mt-extension-icon::after {
  content: "";
  position: absolute;
  inset: 0;
  /* stylelint-disable-next-line meteor/prefer-border-token -- translucent so it darkens the image's own edge colour, which no opaque token can do */
  border: 1px solid rgb(0 0 0 / 10%);
  border-radius: inherit;
  pointer-events: none;
}

.mt-extension-icon--placeholder::after {
  border-color: var(--color-border-secondary-default);
}

.mt-extension-icon__image,
.mt-extension-icon__placeholder {
  display: block;
  width: 100%;
  height: 100%;
}

.mt-extension-icon__image {
  object-fit: cover;
}

.mt-extension-icon__placeholder-background {
  fill: var(--color-elevation-surface-default);
}

.mt-extension-icon__placeholder-lines {
  fill: none;
  stroke: var(--color-border-secondary-default);
  /* 1/64 of the icon size (8 of 512 viewBox units), clamped so lines stay visible when small and crisp when large */
  stroke-width: clamp(0.5px, calc(var(--mt-extension-icon-size) / 64), 1px);
}

/* Lets stroke-width be set in screen pixels instead of 512 viewBox units */
.mt-extension-icon__placeholder-lines > * {
  vector-effect: non-scaling-stroke;
}
</style>
