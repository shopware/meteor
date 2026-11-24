<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtBadge, MtIcon } from "@shopware-ag/meteor-component-library";
import type { ModuleColumn } from "../modules";
import { useFormat } from "../composables/useFormat";
import MediaThumbnail from "./MediaThumbnail.vue";

export type BadgeVariant =
  | "neutral"
  | "info"
  | "attention"
  | "critical"
  | "positive";

/** One cell of a module list, rendered by the type of its column. */
const props = defineProps<{
  column: ModuleColumn;
  value: unknown;
}>();

const { t } = useI18n();
const format = useFormat();

const text = () => String(props.value ?? "");
</script>

<template>
  <span v-if="column.type === 'link'" class="module-cell__link">
    {{ text() }}
  </span>

  <span v-else-if="column.type === 'media'" class="cell-media">
    <media-thumbnail />
    <span class="module-cell__link">{{ text() }}</span>
  </span>

  <template v-else-if="column.type === 'boolean'">
    <mt-icon
      v-if="value"
      class="module-cell__yes"
      name="regular-checkmark-xs"
      size="var(--scale-size-12)"
      :aria-label="t('common.yes')"
    />
    <mt-icon
      v-else
      class="module-cell__no"
      name="regular-times-s"
      size="var(--scale-size-12)"
      :aria-label="t('common.no')"
    />
  </template>

  <span
    v-else-if="column.type === 'stars'"
    class="module-cell__stars"
    :aria-label="t('common.stars', { n: value })"
  >
    <mt-icon
      v-for="star in 5"
      :key="star"
      :name="star <= Number(value) ? 'solid-star' : 'regular-star'"
      size="var(--scale-size-12)"
      decorative
    />
  </span>

  <template v-else-if="column.type === 'relative'">
    {{ value ? format.relativeTime(text()) : "" }}
  </template>

  <template v-else-if="column.type === 'date'">
    {{ value ? format.date(text()) : "–" }}
  </template>

  <template v-else-if="column.type === 'number'">
    {{ format.number(Number(value)) }}
  </template>

  <mt-badge
    v-else-if="column.type === 'badge'"
    :variant="column.variants?.[text()] ?? 'neutral'"
  >
    {{ text() }}
  </mt-badge>

  <template v-else>{{ text() }}</template>
</template>

<style scoped>
.module-cell__link {
  color: var(--color-text-primary-default);
}

tr:hover .module-cell__link {
  color: var(--color-text-brand-default);
}

.module-cell__yes {
  color: var(--color-icon-positive-default);
}

.module-cell__no {
  color: var(--color-icon-critical-default);
}

.module-cell__stars {
  display: inline-flex;
  gap: var(--scale-size-2);
  color: var(--color-icon-attention-default);
}
</style>
