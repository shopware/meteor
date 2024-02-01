<template>
  <div class="sw-pagination">
    <span class="sw-pagination__info-text">
      {{ firstVisibleItemNumber }}-{{ lastVisibleItemNumber }} {{ $t('sw-pagination.of') }} {{ totalItems }}
    </span>

    <sw-segmented-control
      disable-context
      :actions="segmentedControlActions"
    >
      <sw-icon
        slot="label__pagination-first"
        name="solid-double-chevron-left-xxs"
      />

      <sw-icon
        slot="label__pagination-previous"
        name="solid-chevron-left-xs"
      />

      <sw-number-field
        slot="label__pagination-current"
        class="sw-pagination__current-input"
        :value="currentPage"
        :min="1"
        :max="totalPages"
        number-type="int"
        @change="(event) => $emit('change-current-page', event)"
      />

      <sw-icon
        slot="label__pagination-next"
        name="solid-chevron-right-xs"
      />

      <sw-icon
        slot="label__pagination-last"
        name="solid-double-chevron-right-xxs"
      />
    </sw-segmented-control>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import SwSegmentedControl from '../../navigation/sw-segmented-control/sw-segmented-control.vue'
import SwIcon from '../../icons-media/sw-icon/sw-icon.vue';
import type { SegmentedControlActionsProp } from '../../navigation/sw-segmented-control/sw-segmented-control.vue'
import SwNumberField from '../../form/sw-number-field/sw-number-field.vue';

export default defineComponent({
  components: {
    "sw-segmented-control": SwSegmentedControl,
    "sw-icon": SwIcon,
    'sw-number-field': SwNumberField
},
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    }
  },
  i18n: {
    messages: {
      en: {
        'sw-pagination': {
          of: 'of'
        }
      },
      de: {
        'sw-pagination': {
          of: 'von'
        }
      }
    }
  },
  emits: [
    'change-current-page',
  ],
  setup(props, { emit }) {
    watch(() => props.limit, () => {
      emit('change-current-page', 1)
    })

    const firstVisibleItemNumber = computed(() => ((props.currentPage - 1) * props.limit) + 1);
    const lastVisibleItemNumber = computed(() => {
      const lastItemNumberWithLimitOnly = props.limit * props.currentPage;

      return lastItemNumberWithLimitOnly > props.totalItems ? props.totalItems : lastItemNumberWithLimitOnly;
    });

    const totalPages = computed(() => {
      return Math.ceil(props.totalItems / props.limit);
    })

    const previousPageIsPossible = computed(() => props.currentPage > 1);
    const nextPageIsPossible = computed(() => props.currentPage < totalPages.value);

    const segmentedControlActions = computed<SegmentedControlActionsProp>(() => ([
      {
        id: 'pagination-first',
        onClick: () => emit('change-current-page', 1),
        disabled: !previousPageIsPossible.value,
        minSquare: true,
      },
      {
        id: 'pagination-previous',
        onClick: () => emit('change-current-page', props.currentPage - 1),
        disabled: !previousPageIsPossible.value,
        minSquare: true,
      },
      {
        id: 'pagination-current',
        disabled: totalPages.value <= 1,
        minSquare: true,
      },
      {
        id: 'pagination-next',
        onClick: () => emit('change-current-page', props.currentPage + 1),
        disabled: !nextPageIsPossible.value,
        minSquare: true,
      },
      {
        id: 'pagination-last',
        onClick: () => emit('change-current-page', totalPages.value),
        disabled: !nextPageIsPossible.value,
        minSquare: true,
      },
    ]));

    return {
      firstVisibleItemNumber,
      lastVisibleItemNumber,
      totalPages,
      segmentedControlActions
    };
  }
})
</script>

<style lang="scss">
@import '../../assets/scss/variables.scss';

.sw-pagination {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  .sw-segmented-control__action {
    padding-left: 8px;
    padding-right: 8px;
    color: $color-gray-800;

    &--disabled {
      color: $color-gray-400;
    }

    .sw-segmented-control__action-icon {
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
  .sw-segmented-control__action-id-pagination-current {
    padding: 0;

    .sw-field {
      margin-bottom: 0;
    }

    .sw-field__label, .sw-field__hint, .sw-field--controls {
      display: none;
    }

    .sw-block-field__block {
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
