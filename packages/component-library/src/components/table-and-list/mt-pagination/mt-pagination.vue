<template>
  <div class="mt-pagination">
    <p class="mt-pagination__info-text" data-testid="mt-pagination-info-text">
      {{
        t("infoText", {
          start: firstVisibleItemNumber,
          end: lastVisibleItemNumber,
          totalItems,
        })
      }}
    </p>

    <div class="mt-pagination__controls">
      <button
        type="button"
        class="mt-pagination__button"
        :disabled="isOnFirstPage"
        @click="$emit('change-current-page', 1)"
        data-testid="mt-pagination-first-page-button"
      >
        <span class="visually-hidden">{{ t("firstPage") }}</span>

        <mt-icon name="regular-double-chevron-left-s" size="0.5rem" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="mt-pagination__button"
        :disabled="isOnFirstPage"
        @click="$emit('change-current-page', currentPage - 1)"
        data-testid="mt-pagination-previous-page-button"
      >
        <span class="visually-hidden">{{ t("previousPage") }}</span>

        <mt-icon name="regular-chevron-left-s" size="0.5rem" aria-hidden="true" />
      </button>

      <input
        class="mt-pagination__current-page-input"
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
        type="button"
        class="mt-pagination__button"
        :disabled="isOnLastPage"
        @click="$emit('change-current-page', currentPage + 1)"
        data-testid="mt-pagination-next-page-button"
      >
        <span class="visually-hidden">{{ t("nextPage") }}</span>

        <mt-icon name="regular-chevron-right-s" size="0.5rem" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="mt-pagination__button"
        :disabled="isOnLastPage"
        @click="$emit('change-current-page', totalPages)"
        data-testid="mt-pagination-last-page-button"
      >
        <span class="visually-hidden">{{ t("lastPage") }}</span>

        <mt-icon name="regular-double-chevron-right-s" size="0.5rem" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  currentPage: number;
  limit: number;
  totalItems: number;
}>();

const { t } = useI18n({
  messages: {
    en: {
      infoText: "{start}-{end} of {totalItems}",
      firstPage: "First page",
      previousPage: "Previous page",
      nextPage: "Next page",
      lastPage: "Last page",
    },
    de: {
      infoText: "{start}-{end} von {totalItems}",
      firstPage: "Erste Seite",
      previousPage: "Voherige Seite",
      nextPage: "Nächste Seite",
      lastPage: "Letzte Seite",
    },
  },
});

const emit = defineEmits<{
  (e: "change-current-page", value: number): void;
}>();

watch(
  () => props.limit,
  () => {
    emit("change-current-page", 1);
  },
);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / props.limit));
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
</script>

<style scoped>
.mt-pagination {
  display: flex;
  align-items: baseline;
  gap: var(--scale-size-12);

  & :last-child {
    border-top-right-radius: var(--border-radius-xs);
    border-bottom-right-radius: var(--border-radius-xs);
  }

  & :first-child {
    border-top-left-radius: var(--border-radius-xs);
    border-bottom-left-radius: var(--border-radius-xs);
  }
}

.mt-pagination__controls {
  display: inline-flex;
  border-radius: var(--border-radius-xs);
  border: 1px solid var(--color-border-primary-default);
}

.mt-pagination__info-text {
  color: var(--color-text-tertiary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
}

.mt-pagination__button {
  border-right: 1px solid var(--color-border-primary-default);
  color: var(--color-icon-primary-default);
  height: var(--scale-size-32);
  width: var(--scale-size-40);
  display: grid;
  place-items: center;
  transition: all 0.15s ease-out;

  &:focus-visible {
    outline: 1px solid var(--color-border-brand-selected);
    background-color: var(--color-interaction-secondary-hover);
  }

  &:hover:not(:disabled) {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:last-of-type {
    border-right: none;
  }

  &:disabled {
    background-color: var(--color-interaction-secondary-disabled);
    cursor: not-allowed;
  }
}

.mt-pagination__current-page-input {
  all: unset;
  width: auto;
  border-right: 1px solid var(--color-border-primary-default);
  padding: 0 var(--scale-size-12);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-family: var(--font-family-body);
  font-feature-settings: "tnum";

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
