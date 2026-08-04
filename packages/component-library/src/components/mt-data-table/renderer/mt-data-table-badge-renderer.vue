<template>
  <mt-badge class="mt-data-table-badge-renderer" size="s" :variant="badgeVariant">
    {{ badgeProps.label }}
  </mt-badge>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import type { BaseColumnDefinition, ColumnDefinition } from "../mt-data-table.vue";
import MtBadge from "../../mt-badge/mt-badge.vue";

/**
 * The variant values a badge column may return. Kept as a stable public-facing
 * union (previously provided by the now-removed mt-color-badge) so existing
 * `renderItemBadge` implementations keep working and type-checking unchanged.
 */
export type MtColorBadgeVariant = "default" | "warning" | "critical" | "positive" | "info";

type MtBadgeVariant = "neutral" | "info" | "attention" | "critical" | "positive";

/**
 * Maps the badge column's variants onto mt-badge's variants. The names differ
 * ("default" -> "neutral", "warning" -> "attention") but the intent is
 * preserved, so consumers keep passing the same values they always have.
 */
const VARIANT_MAP: Record<MtColorBadgeVariant, MtBadgeVariant> = {
  default: "neutral",
  warning: "attention",
  critical: "critical",
  positive: "positive",
  info: "info",
};

export interface BadgeColumnDefinition extends BaseColumnDefinition {
  renderer: "badge";
  rendererOptions: {
    renderItemBadge(
      data: unknown,
      columnDefinition: BadgeColumnDefinition,
    ): {
      label: string;
      variant: MtColorBadgeVariant;
    };
  };
}

export default defineComponent({
  name: "MtDataTableBadgeRenderer",

  components: {
    "mt-badge": MtBadge,
  },

  props: {
    columnDefinition: {
      type: Object as PropType<ColumnDefinition>,
      required: true,
    },

    data: {
      type: undefined as unknown as PropType<unknown>,
      required: true,
    },
  },

  setup(props) {
    const badgeProps = computed<{ label: string; variant: MtColorBadgeVariant }>(() => {
      if (props.columnDefinition?.renderer !== "badge") {
        return {
          label: "Renderer is not badge",
          variant: "critical",
        };
      }

      if (!props.columnDefinition?.rendererOptions?.renderItemBadge) {
        return {
          label: '"renderItemBadge" method is not defined',
          variant: "critical",
        };
      }

      return props.columnDefinition.rendererOptions.renderItemBadge(
        props.data,
        props.columnDefinition,
      );
    });

    const badgeVariant = computed<MtBadgeVariant>(
      () => VARIANT_MAP[badgeProps.value.variant] ?? "neutral",
    );

    return {
      badgeProps,
      badgeVariant,
    };
  },
});
</script>
