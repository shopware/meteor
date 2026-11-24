<template>
  <span
    :class="['mt-file-icon', `mt-file-icon--${variant}`]"
    :style="size === 'fluid' ? undefined : { '--mt-file-icon-size': `var(--scale-size-${size})` }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg class="mt-file-icon__page" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <clipPath :id="clipPathId">
          <path :d="pagePath" />
        </clipPath>
      </defs>
      <path class="mt-file-icon__paper" :d="pagePath" />
      <g class="mt-file-icon__lines" :clip-path="`url(#${clipPathId})`">
        <path :d="pagePath" class="mt-file-icon__outline" />
        <path d="M30.5 4V11.5C30.5 12.0523 30.9477 12.5 31.5 12.5H39" />
      </g>
    </svg>

    <span
      v-if="iconName"
      ref="iconWrapper"
      :class="['mt-file-icon__icon', { 'mt-file-icon__icon--top': isIconTopAligned }]"
    >
      <mt-icon :name="iconName" :style="iconStyle" decorative />
    </span>

    <span
      v-if="variant === 'format'"
      :class="['mt-file-icon__format', resolved.brand && `mt-file-icon__format--${resolved.brand}`]"
    >
      {{ resolved.format }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useId, useTemplateRef } from "vue";
import { useMutationObserver } from "@vueuse/core";
import MtIcon from "../mt-icon/mt-icon.vue";
import { resolveIconName } from "@/utils/icon";
import { categoryIcons, resolveFileIcon, type MtFileIconCategory } from "./mt-file-icon-formats";

const props = withDefaults(
  defineProps<{
    /** The name of the file, such as `invoice.pdf`. Its extension sets the category and format. */
    fileName?: string;
    /** The MIME type of the file, used when the file name has no known extension. */
    mimeType?: string;
    /** The format label, such as `pdf`. Overrides the format from `fileName` and `mimeType`. */
    format?: string;
    /** The category of the file. Overrides the category from the format. */
    category?: MtFileIconCategory;
    /** An icon from the icon kit, always in the regular style. Overrides the category icon. */
    icon?: string;
    /** Shows the format label below the icon. Labels need a width of 40 pixels or more. */
    showFormat?: boolean;
    /** Shows the broken preview for a file that failed to load. */
    broken?: boolean;
    /**
     * The width and height of the icon, as a step of the `--scale-size-*` token scale. With `fluid`,
     * the icon fills the width of its parent and everything inside scales with it.
     *
     * @values 24, 32, 40, 48, 56, 64, 72, 80, 96, fluid
     */
    size?: 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96 | "fluid";
    /** The accessible name, such as `PDF file`. Without it, the icon is decorative. */
    label?: string;
  }>(),
  {
    fileName: undefined,
    mimeType: undefined,
    format: undefined,
    category: undefined,
    icon: undefined,
    showFormat: true,
    broken: false,
    size: 48,
    label: undefined,
  },
);

const pagePath =
  "M30.5 4C32 4 33.5 5 34.5 6L37 8.5C38 9.5 39 11 39 12.5V41C39 42.6569 37.6569 44 36 44H12C10.3431 44 9 42.6569 9 41V7C9 5.34315 10.3431 4 12 4H30.5Z";

const clipPathId = `mt-file-icon-${useId()}`;

const resolved = computed(() =>
  resolveFileIcon({
    fileName: props.fileName,
    mimeType: props.mimeType,
    format: props.format,
    category: props.category,
  }),
);

const hasIcon = computed(() => !!props.icon || !!resolved.value.category);

// Falls back from icon and format, to the icon alone, to the empty page
const variant = computed<"broken" | "format" | "icon" | "empty">(() => {
  if (props.broken) return "broken";
  if (!hasIcon.value) return "empty";
  // A container query hides a label that gets too small, whatever sets the width of the icon
  if (props.showFormat && resolved.value.format) return "format";

  return "icon";
});

const categoryIcon = computed(() =>
  props.icon || !resolved.value.category ? undefined : categoryIcons[resolved.value.category],
);

const isIconTopAligned = computed(
  () => categoryIcon.value?.align === "top" && ["format", "icon"].includes(variant.value),
);

const iconName = computed(() => {
  if (variant.value === "broken") return "regular-times";
  if (variant.value === "empty") return undefined;
  if (props.icon) return resolveIconName(props.icon, "regular");

  return `regular-${categoryIcon.value!.icon}`;
});

/*
 * Icons are drawn on a 24 pixel grid and cropped to their shape, so each one has its own size. Sizing
 * the icon from the dimensions of its viewBox keeps the proportions between icons, so a narrow icon
 * stays narrow instead of being stretched to fill a square.
 */
const iconWrapper = useTemplateRef("iconWrapper");
const iconViewBox = ref<{ width: number; height: number }>();

function readIconViewBox() {
  const viewBox = iconWrapper.value?.querySelector("svg")?.getAttribute("viewBox");
  const [, , width, height] = viewBox?.split(/[\s,]+/).map(Number) ?? [];

  iconViewBox.value = width && height ? { width, height } : undefined;
}

onMounted(readIconViewBox);
useMutationObserver(iconWrapper, readIconViewBox, { childList: true, subtree: true });

const iconStyle = computed(() => {
  if (!iconViewBox.value) return { visibility: "hidden" as const };

  return {
    width: `calc(var(--mt-file-icon-icon-unit) * ${iconViewBox.value.width})`,
    height: `calc(var(--mt-file-icon-icon-unit) * ${iconViewBox.value.height})`,
  };
});
</script>

<style scoped>
.mt-file-icon {
  /* stylelint-disable meteor/no-primitive-token -- brand colors of the formats, which no semantic token covers */
  --mt-file-icon--color-format-pdf: var(--color-red-600);
  --mt-file-icon--color-format-word: var(--color-blue-700);
  --mt-file-icon--color-format-excel: var(--color-green-700);
  /* stylelint-enable meteor/no-primitive-token */

  position: relative;
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
  aspect-ratio: 1;
  /* Everything inside is sized in container query units of the icon's own width */
  container: mt-file-icon / inline-size;
}

/* Without specificity, so a width set by the parent wins, for example in container query units */
:where(.mt-file-icon) {
  width: var(--mt-file-icon-size, 100%);
}

[data-theme="dark"] .mt-file-icon {
  /* stylelint-disable meteor/no-primitive-token -- brand colors of the formats, which no semantic token covers */
  --mt-file-icon--color-format-pdf: var(--color-red-300);
  --mt-file-icon--color-format-word: var(--color-blue-500);
  --mt-file-icon--color-format-excel: var(--color-green-500);
  /* stylelint-enable meteor/no-primitive-token */
}

.mt-file-icon__page {
  display: block;
  width: 100%;
  height: 100%;
}

.mt-file-icon__paper {
  fill: var(--color-background-secondary-default);
}

.mt-file-icon__lines {
  fill: none;
  stroke: var(--color-border-primary-default);
  stroke-width: 1px;
}

/* Lets the lines stay 1px wide at every size instead of scaling with the 48 viewBox units */
.mt-file-icon__lines > path {
  vector-effect: non-scaling-stroke;
}

/* Twice as wide and clipped to the page, so the outline is drawn on the inside of the edge */
.mt-file-icon__lines > .mt-file-icon__outline {
  stroke-width: 2px;
}

/* Positions the icon by its center, or by its top edge, at a point of the 48 by 48 design */
.mt-file-icon__icon {
  /* The size of the 24 pixel icon grid in the design, and where the icon sits as a share of the height */
  --mt-file-icon-icon-box: 15;
  --mt-file-icon-icon-top: 56.25%;
  /* One pixel of the icon grid, which the icon size is multiplied with */
  --mt-file-icon-icon-unit: calc(100cqw * var(--mt-file-icon-icon-box) / 1152);

  position: absolute;
  top: var(--mt-file-icon-icon-top);
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0;
  height: 0;
  color: var(--color-icon-secondary-default);

  > .mt-icon {
    flex-shrink: 0;
  }
}

.mt-file-icon--format .mt-file-icon__icon {
  --mt-file-icon-icon-box: 13;
  --mt-file-icon-icon-top: 45.83%;
}

.mt-file-icon--broken .mt-file-icon__icon {
  --mt-file-icon-icon-box: 18;
  --mt-file-icon-icon-top: 58.33%;

  color: var(--color-icon-critical-default);
}

/*
 * Starts right below the outline at the top of the page, with or without a format label, and sits 3
 * of 48 pixels left of the center to keep its distance from the folded corner
 */
.mt-file-icon .mt-file-icon__icon--top {
  --mt-file-icon-icon-box: 17;
  --mt-file-icon-icon-top: 10.42%;

  left: 43.75%;
  align-items: flex-start;
}

.mt-file-icon__format {
  position: absolute;
  top: 75%;
  left: 50%;
  overflow: hidden;
  /* Leaves 2 of 48 pixels between the label and the outline on each side */
  width: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-icon-secondary-default);
  font-family: var(--font-family-body);
  /* stylelint-disable-next-line meteor/prefer-font-token -- scales with the icon, which no fixed token can */
  font-size: calc(100cqw / 6);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-user-select: none;
  user-select: none;
}

.mt-file-icon__format--pdf {
  color: var(--mt-file-icon--color-format-pdf);
}

.mt-file-icon__format--word {
  color: var(--mt-file-icon--color-format-word);
}

.mt-file-icon__format--excel {
  color: var(--mt-file-icon--color-format-excel);
}

/* A label this small can't be read, so the icon moves back to the position it has without one */
@container mt-file-icon (width < 40px) {
  .mt-file-icon__format {
    display: none;
  }

  .mt-file-icon--format .mt-file-icon__icon:not(.mt-file-icon__icon--top) {
    --mt-file-icon-icon-box: 15;
    --mt-file-icon-icon-top: 56.25%;

    align-items: center;
  }
}
</style>
