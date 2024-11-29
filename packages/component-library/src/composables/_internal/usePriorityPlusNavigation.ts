import { reactiveComputed, unrefElement, useElementSize, type MaybeElementRef } from "@vueuse/core";
import { computed, onMounted, ref, toRefs, watch } from "vue";

export function usePriorityPlusNavigation<
  T extends {
    id: string;
  },
>(
  items: T[],
  { container, overflowButton }: { container: MaybeElementRef; overflowButton: MaybeElementRef },
) {
  const containerSize = useElementSize(container);
  const overflowButtonSize = useElementSize(overflowButton);

  // We need to wait for the fonts to load. Otherwise, we measure the width
  // of elements, the fonts loads and the elements change size.
  const areFontsLoaded = ref(false);
  onMounted(() => {
    document.fonts.ready.then(() => {
      areFontsLoaded.value = true;
    });
  });

  const widthsOfItems = computed<number[]>(() => {
    const containerElement = unrefElement(container);
    if (!containerElement || !areFontsLoaded.value) return [];

    const items = Array.from(containerElement.querySelectorAll("[data-priority-plus]"));
    const result = items.reduce<{
      accumulatedWidth: number;
      widthsOfItems: number[];
    }>(
      (accumulated, item) => ({
        accumulatedWidth: accumulated.accumulatedWidth + item.clientWidth,
        widthsOfItems: [
          ...accumulated.widthsOfItems,
          accumulated.accumulatedWidth + item.clientWidth,
        ],
      }),
      { accumulatedWidth: 0, widthsOfItems: [] },
    );

    return result.widthsOfItems;
  });

  const prioritizedItems = reactiveComputed<{
    priorityItems: T[];
    overflowItems: T[];
  }>(() => {
    const hasOverflow = widthsOfItems.value.some((width) => width > containerSize.width.value);
    if (!hasOverflow) {
      return {
        priorityItems: items,
        overflowItems: [],
      };
    }

    const priorityItems = items.filter((_, index) => {
      const overflows =
        widthsOfItems.value[index] > containerSize.width.value - overflowButtonSize.width.value;

      return !overflows;
    });

    const overflowItems = items.filter((_, index) => {
      const overflows =
        widthsOfItems.value[index] > containerSize.width.value - overflowButtonSize.width.value;

      return overflows;
    });

    return {
      priorityItems,
      overflowItems,
    };
  });

  const hasOverflow = computed(() => prioritizedItems.overflowItems.length > 0);
  watch(hasOverflow, () => {
    const overflowButtonElement = unrefElement(overflowButton);
    if (!overflowButtonElement) return;

    if (!hasOverflow.value) {
      overflowButtonElement.style.visibility = "hidden";
    }
  });

  const showNavigation = computed(() => areFontsLoaded.value && widthsOfItems.value.length > 0);

  return {
    showNavigation,
    ...toRefs(prioritizedItems),
  };
}
