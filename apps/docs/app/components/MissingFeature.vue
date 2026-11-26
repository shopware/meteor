<script setup lang="ts">
import { computed, useSlots } from "vue";
import { MtIcon, MtText } from "@shopware-ag/meteor-component-library";

/**
 * Marks a place in a prototype block where Meteor lacks a component, a slot or a prop. The
 * `stand-in` slot holds hand-built markup that fills the gap until it is closed, so every piece
 * of UI that is not a Meteor component stays visibly framed.
 */
const props = withDefaults(
  defineProps<{
    /** What is missing, such as "Icon rail". */
    title: string;
    /** Whether a whole component, a slot or a prop is missing. */
    kind?: "component" | "slot" | "prop";
    /** A one-line chip for header rows, tab rows and toolbars. The explanation becomes its tooltip. */
    inline?: boolean;
  }>(),
  {
    kind: "component",
    inline: false,
  },
);

defineSlots<{
  /** One sentence on what is missing. */
  default?(): unknown;
  /** Hand-built markup that stands in for the missing part. */
  "stand-in"?(): unknown;
}>();

const slots = useSlots();

const label = computed(() => `Missing ${props.kind}: ${props.title}`);

// The chip shows only its label, so its explanation moves into the tooltip.
const tooltip = computed(() => {
  if (!props.inline) return undefined;

  const text = slots
    .default?.()
    .map((node) => (typeof node.children === "string" ? node.children : ""))
    .join("")
    .trim();

  return text || undefined;
});
</script>

<template>
  <div
    class="missing-feature"
    :class="{ 'missing-feature--inline': inline }"
    role="note"
    :aria-label="label"
    :title="tooltip"
  >
    <div class="missing-feature__note">
      <mt-icon
        name="regular-puzzle-piece"
        size="var(--scale-size-16)"
        color="var(--color-icon-attention-default)"
        decorative
      />

      <div class="missing-feature__text">
        <mt-text size="xs" weight="semibold" as="span">{{ label }}</mt-text>
        <mt-text
          v-if="!inline && $slots.default"
          size="xs"
          color="color-text-secondary-default"
          as="span"
        >
          <slot />
        </mt-text>
      </div>
    </div>

    <div v-if="$slots['stand-in']" class="missing-feature__stand-in">
      <slot name="stand-in" />
    </div>
  </div>
</template>

<style scoped>
.missing-feature {
  display: grid;
  gap: var(--scale-size-8);
  box-sizing: border-box;
  min-width: 0;
  padding: var(--scale-size-8) var(--scale-size-12);
  background-color: var(--color-background-attention-default);
  border: 1px dashed var(--color-border-attention-default);
  border-radius: var(--border-radius-m);
  /* Navigation rows set nowrap, which a note inside them must not take over. */
  white-space: normal;
  overflow-wrap: anywhere;
}

.missing-feature__note {
  display: flex;
  align-items: flex-start;
  gap: var(--scale-size-8);
}

.missing-feature__note > :first-child {
  flex-shrink: 0;
}

.missing-feature__text {
  display: grid;
  gap: var(--scale-size-2);
  min-width: 0;
}

/* The stand-in sits on the regular surface, so it reads as the UI it stands in for. */
.missing-feature__stand-in {
  min-width: 0;
  padding: var(--scale-size-8);
  background-color: var(--color-elevation-surface-default);
  border-radius: var(--border-radius-s);
}

.missing-feature--inline {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: var(--scale-size-2) var(--scale-size-8);
  white-space: nowrap;
  vertical-align: middle;
}

/* In a chip, the stand-in follows the label on the same line. */
.missing-feature--inline .missing-feature__stand-in {
  display: flex;
  align-items: center;
  padding: 0;
  background-color: transparent;
}

.missing-feature--inline .missing-feature__note {
  align-items: center;
  min-width: 0;
}

/* A chip in a narrow column cuts its label off instead of overflowing it. */
.missing-feature--inline .missing-feature__text > * {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
