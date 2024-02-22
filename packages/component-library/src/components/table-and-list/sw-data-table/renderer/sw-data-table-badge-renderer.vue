<template>
  <sw-color-badge class="sw-data-table-badge-renderer" has-text :variant="badgeProps.variant">
    {{ badgeProps.label }}
  </sw-color-badge>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import type { BaseColumnDefinition, ColumnDefinition } from "../sw-data-table.vue";
import type { SwColorBadgeVariant } from "../../../feedback-indicator/sw-color-badge/sw-color-badge.vue";
import SwColorBadge from "../../../feedback-indicator/sw-color-badge/sw-color-badge.vue";

export interface BadgeColumnDefinition extends BaseColumnDefinition {
  renderer: "badge";
  rendererOptions: {
    renderItemBadge(
      data: unknown,
      columnDefinition: BadgeColumnDefinition,
    ): {
      label: string;
      variant: SwColorBadgeVariant;
    };
  };
}

export default defineComponent({
  name: "SwDataTablBadgeRenderer",

  components: {
    "sw-color-badge": SwColorBadge,
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
    const badgeProps = computed(() => {
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

      const result = props.columnDefinition.rendererOptions.renderItemBadge(
        props.data,
        props.columnDefinition,
      );

      return result;
    });

    return {
      badgeProps,
    };
  },
});
</script>
