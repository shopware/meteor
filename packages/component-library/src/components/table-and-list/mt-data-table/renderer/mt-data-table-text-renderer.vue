<template>
  <div class="mt-data-table-text-renderer-cell">
    <div v-if="columnDefinition.previewImage" class="mt-data-table-preview-image-renderer">
      <img
        v-if="columnDefinition.previewImage"
        class="mt-data-table-preview-image-renderer-item"
        :src="renderPreviewImage"
        :alt="renderString"
      />
    </div>

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
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import type { BaseColumnDefinition } from "../mt-data-table.vue";
import { get } from "@/utils/object";

export interface TextColumnDefinition extends BaseColumnDefinition {
  renderer: "text";
  clickable?: boolean; // you can enable the possibility to click on a column for opening details
  previewImage?: string; // you can enable the possibility to show a preview image
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
    const renderPreviewImage = computed(() => {
      // @ts-expect-error
      return get(props.data, props.columnDefinition.previewImage || "");
    });

    const renderString = computed(() => {
      // @ts-expect-error
      return get(props.data, props.columnDefinition.property);
    });

    return {
      renderString,
      renderPreviewImage,
    };
  },
});
</script>

<style scoped>
.mt-data-table-text-renderer-cell {
  display: flex;
  align-items: center;
}

.mt-data-table-preview-image-renderer {
  position: relative;
  width: 34px;
  height: var(--scale-size-24);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  margin-right: 15px;
  flex-shrink: 0;
}

img.mt-data-table-preview-image-renderer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: calc(100% - 5px);
  max-height: calc(100% - 5px);
}

a.mt-data-table-text-renderer {
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  color: var(--color-text-primary-default);

  &:hover {
    text-decoration: underline;
    color: var(--color-text-brand-default);
  }
}
</style>
