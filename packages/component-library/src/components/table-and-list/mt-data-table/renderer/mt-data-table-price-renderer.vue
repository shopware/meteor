<template>
  <a
    v-if="columnDefinition.clickable"
    class="mt-data-table-price-renderer"
    href="#"
    @click.prevent="$emit('click', data)"
  >
    {{ renderString }}
  </a>

  <p v-else class="mt-data-table-price-renderer">
    {{ renderString }}
  </p>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import { get } from "@/utils/object";
import { currency } from "../../../../utils/format";
import type { BaseColumnDefinition } from "../mt-data-table.vue";

export interface PriceColumnDefinition extends BaseColumnDefinition {
  renderer: "price";
  rendererOptions: {
    currencyISOCode: string;
  };
  clickable?: boolean; // you can enable the possibility to click on a column for opening details
}

export default defineComponent({
  name: "MtDataTablePriceRenderer",

  props: {
    columnDefinition: {
      type: Object as PropType<PriceColumnDefinition>,
      required: true,
    },

    data: {
      type: undefined as unknown as PropType<unknown>,
      required: true,
    },
  },

  setup(props) {
    const renderString = computed(() => {
      if (props.columnDefinition.renderer !== "price") {
        return "Wrong renderer for price renderer";
      }

      const currencyISOCode = props.columnDefinition?.rendererOptions?.currencyISOCode;

      if (!currencyISOCode) {
        return "No iso code found";
      }

      // @ts-expect-error
      const value = get(props.data, props.columnDefinition.property) ?? 0;

      return currency(value, currencyISOCode);
    });

    return {
      renderString,
    };
  },
});
</script>

<style>
.mt-data-table__table-head-inner-wrapper-price-renderer {
  justify-content: flex-end;
}

.mt-data-table-price-renderer {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
