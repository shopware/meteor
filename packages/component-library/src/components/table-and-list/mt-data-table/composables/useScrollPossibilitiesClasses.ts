import type { Ref } from "vue";
import { onUpdated, nextTick, onBeforeUnmount, onMounted } from "vue";
import { throttle } from "@/utils/throttle";

/**
 * This composable expect a Vue reference to an HTML element. It sets
 * automatically the data attributes "data-scroll-(top|right|bottom|left)"
 * when the element is scrollable into this direction.
 */

export default function useScrollPossibilitiesClasses(refElement: Ref) {
  const setScrollPossibilitiesClasses = (elementOrEvent: Event | HTMLElement | undefined) => {
    // @ts-expect-error - check if event or not
    const element = (elementOrEvent?.target ? elementOrEvent.target : elementOrEvent) as
      | HTMLElement
      | undefined;

    if (!element) return;

    const pufferPx = 5;

    // check if vertical scrolling exists
    if (element.scrollHeight > element.clientHeight) {
      // check if scrolling downwards is possible
      if (element.scrollHeight - element.clientHeight - pufferPx > element.scrollTop) {
        element.dataset.scrollBottom = "";
      } else {
        delete element.dataset.scrollBottom;
      }

      // check if scrolling upwards is possible
      if (element.scrollTop - pufferPx > 0) {
        element.dataset.scrollTop = "";
      } else {
        delete element.dataset.scrollTop;
      }

      // save scrollbar width in parent element as css variable
      element.parentElement?.style.setProperty(
        "--scrollbar-width",
        `${element.offsetWidth - element.clientWidth}px`,
      );
    } else {
      // cleanup previous values
      element.parentElement?.style.removeProperty("--scrollbar-width");
      delete element.dataset.scrollTop;
      delete element.dataset.scrollBottom;
    }

    // check if horizontal scrolling exists
    if (element.scrollWidth > element.clientWidth) {
      // check if scrolling rightwards is possible
      if (element.scrollWidth - element.clientWidth - pufferPx > element.scrollLeft) {
        element.dataset.scrollRight = "";
      } else {
        delete element.dataset.scrollRight;
      }

      // check if scrolling leftwards is possible
      if (element.scrollLeft - pufferPx > 0) {
        element.dataset.scrollLeft = "";
      } else {
        delete element.dataset.scrollLeft;
      }

      // save scrollbar height in parent element as css variable
      element.parentElement?.style.setProperty(
        "--scrollbar-height",
        `${element.offsetHeight - element.clientHeight}px`,
      );
    } else {
      // cleanup previous values
      delete element.dataset.scrollRight;
      delete element.dataset.scrollLeft;
      element.parentElement?.style.removeProperty("--scrollbar-height");
    }
  };

  const updateSetScrollPossibiltiesClasses = throttle(function () {
    setScrollPossibilitiesClasses(refElement.value);
  }, 15);

  const refElementResizeObserver = new ResizeObserver(() => {
    nextTick().then(updateSetScrollPossibiltiesClasses);
  });

  onUpdated(() => {
    nextTick().then(updateSetScrollPossibiltiesClasses);
  });

  onMounted(() => {
    window.addEventListener("resize", updateSetScrollPossibiltiesClasses);

    if (!refElement.value) {
      return;
    }

    refElement.value.addEventListener("scroll", updateSetScrollPossibiltiesClasses);
    refElementResizeObserver.observe(refElement.value);

    nextTick().then(() => {
      updateSetScrollPossibiltiesClasses();
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateSetScrollPossibiltiesClasses);

    if (!refElement.value) {
      return;
    }

    refElement.value.removeEventListener("scroll", updateSetScrollPossibiltiesClasses);
    refElementResizeObserver.unobserve(refElement.value);
  });

  return {};
}
