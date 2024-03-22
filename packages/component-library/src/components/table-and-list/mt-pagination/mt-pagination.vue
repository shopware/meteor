<template>
  <div class="mt-pagination">
    <span class="mt-pagination__info-text">
      {{ firstVisibleItemNumber }}-{{ lastVisibleItemNumber }} {{ $t("mt-pagination.of") }}
      {{ totalItems }}
    </span>

    <mt-segmented-control disable-context :actions="segmentedControlActions">
      <template #label__pagination-first>
        <mt-icon name="solid-double-chevron-left-xxs" />
      </template>

      <template #label__pagination-previous>
        <mt-icon name="solid-chevron-left-xs" />
      </template>

      <template #label__pagination-current>
        <mt-number-field
          class="mt-pagination__current-input"
          :model-value="currentPage as never"
          :min="1"
          :max="totalPages"
          number-type="int"
          @change="(event) => $emit('change-current-page', event)"
        />
      </template>

      <template #label__pagination-next>
        <mt-icon name="solid-chevron-right-xs" />
      </template>

      <template #label__pagination-last>
        <mt-icon name="solid-double-chevron-right-xxs" />
      </template>
    </mt-segmented-control>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from "vue";
import MtSegmentedControl from "../../navigation/mt-segmented-control/mt-segmented-control.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import type { SegmentedControlActionsProp } from "../../navigation/mt-segmented-control/mt-segmented-control.vue";
import MtNumberField from "../../form/mt-number-field/mt-number-field.vue";

export default defineComponent({
  components: {
    "mt-segmented-control": MtSegmentedControl,
    "mt-icon": MtIcon,
    "mt-number-field": MtNumberField,
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  },
  i18n: {
    messages: {
      en: {
        "mt-pagination": {
          of: "of",
        },
      },
      de: {
        "mt-pagination": {
          of: "von",
        },
      },
    },
  },
  emits: ["change-current-page"],
  setup(props, { emit }) {
    watch(
      () => props.limit,
      () => {
        emit("change-current-page", 1);
      },
    );

    const firstVisibleItemNumber = computed(() => (props.currentPage - 1) * props.limit + 1);
    const lastVisibleItemNumber = computed(() => {
      const lastItemNumberWithLimitOnly = props.limit * props.currentPage;

      return lastItemNumberWithLimitOnly > props.totalItems
        ? props.totalItems
        : lastItemNumberWithLimitOnly;
    });

    const totalPages = computed(() => {
      return Math.ceil(props.totalItems / props.limit);
    });

    const previousPageIsPossible = computed(() => props.currentPage > 1);
    const nextPageIsPossible = computed(() => props.currentPage < totalPages.value);

    const segmentedControlActions = computed<SegmentedControlActionsProp>(() => [
      {
        id: "pagination-first",
        onClick: () => emit("change-current-page", 1),
        disabled: !previousPageIsPossible.value,
        minSquare: true,
      },
      {
        id: "pagination-previous",
        onClick: () => emit("change-current-page", props.currentPage - 1),
        disabled: !previousPageIsPossible.value,
        minSquare: true,
      },
      {
        id: "pagination-current",
        disabled: totalPages.value <= 1,
        minSquare: true,
      },
      {
        id: "pagination-next",
        onClick: () => emit("change-current-page", props.currentPage + 1),
        disabled: !nextPageIsPossible.value,
        minSquare: true,
      },
      {
        id: "pagination-last",
        onClick: () => emit("change-current-page", totalPages.value),
        disabled: !nextPageIsPossible.value,
        minSquare: true,
      },
    ]);

    return {
      firstVisibleItemNumber,
      lastVisibleItemNumber,
      totalPages,
      segmentedControlActions,
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.mt-pagination {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  .mt-segmented-control__action {
    padding-left: 8px;
    padding-right: 8px;
    color: $color-gray-800;

    &--disabled {
      color: $color-gray-400;
    }

    .mt-segmented-control__action-icon {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #meteor-icon-kit__solid-double-chevron-left-xxs {
      width: 8px !important;
      height: 6px !important;
    }

    #meteor-icon-kit__solid-chevron-left-xs {
      width: 5px !important;
      height: 8px !important;
    }

    #meteor-icon-kit__solid-chevron-right-xs {
      width: 5px !important;
      height: 8px !important;
    }

    #meteor-icon-kit__solid-double-chevron-right-xxs {
      width: 8px !important;
      height: 6px !important;
    }
  }

  // change styling of input field
  .mt-segmented-control__action-id-pagination-current {
    padding: 0;

    .mt-field {
      margin-bottom: 0;
    }

    .mt-field__label,
    .mt-field__hint,
    .mt-field--controls {
      display: none;
    }

    .mt-block-field__block {
      width: 32px;
      border-width: 0;
    }

    input {
      font-weight: $font-weight-semi-bold;
      font-size: $font-size-extra-small;
      line-height: $font-size-extra-small;
      text-align: center;
      padding-top: 8px;
      padding-right: 4px;
      padding-bottom: 8px;
      padding-left: 4px;
    }
  }

  &__info-text {
    color: $color-gray-800;
    white-space: nowrap;
    font-size: $font-size-xxs;
    margin-right: 8px;
  }
}
</style>
