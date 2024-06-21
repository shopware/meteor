<template>
  <div :class="stylex(styles.root)">
    <p :class="stylex(styles.infoText)" data-testid="mt-pagination-info-text">
      {{
        $t("mt-pagination.infoText", {
          start: firstVisibleItemNumber,
          end: lastVisibleItemNumber,
          totalItems,
        })
      }}
    </p>

    <div :class="stylex(styles.controls)">
      <button
        :class="stylex(styles.button)"
        :disabled="isOnFirstPage"
        @click="$emit('change-current-page', 1)"
        data-testid="mt-pagination-first-page-button"
      >
        <span class="visually-hidden">{{ $t("mt-pagination.firstPage") }}</span>

        <mt-icon
          name="regular-double-chevron-left-s"
          aria-hidden="true"
          :class="stylex(styles.iconFirstPage)"
        />
      </button>

      <button
        :class="stylex(styles.button)"
        :disabled="isOnFirstPage"
        @click="$emit('change-current-page', currentPage - 1)"
        data-testid="mt-pagination-previous-page-button"
      >
        <span class="visually-hidden">{{ $t("mt-pagination.previousPage") }}</span>

        <mt-icon name="regular-chevron-left-s" aria-hidden="true" />
      </button>

      <input
        :class="stylex(styles.pageInput)"
        type="number"
        min="1"
        step="1"
        :style="{ width: inputLength }"
        :value="currentPage"
        @input="onChangeInput"
        :aria-label="`Page ${currentPage}`"
        data-testid="mt-pagination-current-page-input"
      />

      <button
        :class="stylex(styles.button)"
        :disabled="isOnLastPage"
        @click="$emit('change-current-page', currentPage + 1)"
        data-testid="mt-pagination-next-page-button"
      >
        <span class="visually-hidden">{{ $t("mt-pagination.nextPage") }}</span>

        <mt-icon name="regular-chevron-right-s" aria-hidden="true" />
      </button>

      <button
        :class="stylex(styles.button)"
        :disabled="isOnLastPage"
        @click="$emit('change-current-page', totalPages)"
        data-testid="mt-pagination-last-page-button"
      >
        <span class="visually-hidden">{{ $t("mt-pagination.lastPage") }}</span>

        <mt-icon name="regular-double-chevron-right-s" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from "vue";
import stylex from "@stylexjs/stylex";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

type Stylex = (...classes: Record<string, unknown>[]) => string;

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.75rem",
  },
  controls: {
    display: "inline-flex",
    borderRadius: "0.25rem",
    border: "1px solid var(--color-border-primary-default)",
    ":last-child": {
      borderTopRightRadius: "0.25rem",
      borderBottomRightRadius: "0.25rem",
    },
    ":first-child": {
      borderTopLeftRadius: "0.25rem",
      borderBottomLeftRadius: "0.25rem",
    },
  },
  infoText: {
    color: "var(--color-text-tertiary-default)",
    fontSize: "0.875rem",
  },
  button: {
    borderRight: "1px solid var(--color-border-primary-default)",
    color: "var(--color-icon-primary-default)",
    height: "2rem",
    width: "2.5rem",
    display: "grid",
    placeItems: "center",
    transition: "all 0.15s ease-out",
    ":focus-visible": {
      outline: "1px solid var(--color-border-brand-selected)",
      backgroundColor: "var(--color-interaction-secondary-hover)",
    },
    ":hover:not(:disabled)": {
      backgroundColor: "var(--color-interaction-secondary-hover)",
    },
    ":last-of-type": {
      borderRight: "none",
    },
    ":disabled": {
      backgroundColor: "var(--color-interaction-secondary-disabled)",
      cursor: "not-allowed",
    },
  },
  pageInput: {
    border: "none",
    outline: "none",
    width: "auto",
    borderRight: "1px solid var(--color-border-primary-default)",
    paddingInline: "0.75rem",
    color: "var(--color-text-primary-default)",
    fontSize: "0.875rem",
    fontFeatureSettings: "tnum",
    "::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "::-webkit-outer-inner-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  iconFirstPage: {
    width: "0.5rem",
    height: "0.46875rem",
  },
});

export default defineComponent({
  components: {
    "mt-icon": MtIcon,
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
          infoText: "{start}-{end} of {totalItems}",
          firstPage: "First page",
          previousPage: "Previous page",
          nextPage: "Next page",
          lastPage: "Last page",
        },
      },
      de: {
        "mt-pagination": {
          infoText: "{start}-{end} von {totalItems}",
          firstPage: "Erste Seite",
          previousPage: "Voherige Seite",
          nextPage: "Nächste Seite",
          lastPage: "Letzte Seite",
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

    const totalPages = computed(() => {
      return Math.ceil(props.totalItems / props.limit);
    });

    const isOnFirstPage = computed(() => props.currentPage === 1);
    const isOnLastPage = computed(() => props.currentPage === totalPages.value);

    const inputLength = computed(() => {
      const length = props.currentPage.toString().length;
      if (length === 0) return "calc(1ch + 1px)";

      return `calc(${length}ch + 1px)`;
    });

    function onChangeInput(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.value === "") return;

      emit("change-current-page", parseInt(target.value));
    }

    const firstVisibleItemNumber = computed(() => (props.currentPage - 1) * props.limit + 1);
    const lastVisibleItemNumber = computed(() => {
      const lastItemNumberWithLimitOnly = props.limit * props.currentPage;
      return lastItemNumberWithLimitOnly > props.totalItems
        ? props.totalItems
        : lastItemNumberWithLimitOnly;
    });

    return {
      totalPages,
      inputLength,
      isOnLastPage,
      isOnFirstPage,
      onChangeInput,
      firstVisibleItemNumber,
      lastVisibleItemNumber,
      stylex: stylex as unknown as Stylex,
      styles,
    };
  },
});
</script>

<style lang="scss">
.mt-pagination {
  #meteor-icon-kit__regular-chevron-left-s {
    width: 4px !important;
    height: 7.5px !important;
  }

  #meteor-icon-kit__regular-chevron-right-s {
    width: 4px !important;
    height: 7.5px !important;
  }

  #meteor-icon-kit__regular-double-chevron-right-s {
    width: 8px !important;
    height: 7.5px !important;
  }

  &__current-page-input {
    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
}
</style>
