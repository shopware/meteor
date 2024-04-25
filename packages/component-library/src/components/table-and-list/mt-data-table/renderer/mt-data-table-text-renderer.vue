<template>
  <a
    v-if="columnDefinition.clickable"
    class="mt-data-table-text-renderer"
    href="#"
    @click.prevent="$emit('click', data)"
  >
    {{ renderString }}
  </a>

  <p v-else class="mt-data-table-text-renderer">
    {{ renderString }}
  </p>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import type { BaseColumnDefinition } from "../mt-data-table.vue";
import { get } from "lodash-es";

export interface TextColumnDefinition extends BaseColumnDefinition {
  renderer: "text";
  clickable?: boolean; // you can enable the possibility to click on a column for opening details
}

export default defineComponent({
  name: "MtDataTableTextRenderer",

  props: {
    columnDefinition: {
      type: Object as PropType<TextColumnDefinition>,
      required: true,
    },

    data: {
      type: undefined as unknown as PropType<unknown>,
      required: true,
    },
  },

  setup(props) {
    const renderString = computed(() => {
      return get(props.data, props.columnDefinition.property);
    });

    return {
      renderString,
    };
  },
});
</script>

<style lang="scss" scoped>
a.mt-data-table-text-renderer {
  font-weight: $font-weight-medium;
  text-decoration: none;
  color: $color-darkgray-600;

  &:hover {
    text-decoration: underline;
    color: $color-shopware-brand-900;
  }
}
</style>
