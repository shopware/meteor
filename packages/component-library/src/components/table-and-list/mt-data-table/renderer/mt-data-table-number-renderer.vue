<template>
  <a
    v-if="columnDefinition.clickable"
    class="mt-data-table-number-renderer"
    href="#"
    @click.prevent="$emit('click', data)"
  >
    {{ renderString }}
  </a>

  <p v-else class="mt-data-table-number-renderer">
    {{ renderString }}
  </p>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import type { BaseColumnDefinition } from "../mt-data-table.vue";
import { get } from "@/utils/object";

export interface NumberColumnDefinition extends BaseColumnDefinition {
  renderer: "number";
  clickable?: boolean; // you can enable the possibility to click on a column for opening details
}

export default defineComponent({
  name: "MtDataTableNumberRenderer",

  props: {
    columnDefinition: {
      type: Object as PropType<NumberColumnDefinition>,
      required: true,
    },

    data: {
      type: undefined as unknown as PropType<unknown>,
      required: true,
    },
  },

  setup(props) {
    const renderString = computed(() => {
      // @ts-expect-error
      return String(Number(get(props.data, props.columnDefinition.property)));
    });

    return {
      renderString,
    };
  },
});
</script>

<style>
.mt-data-table__table-head-inner-wrapper-number-renderer {
  justify-content: flex-end;
}

.mt-data-table-number-renderer {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
