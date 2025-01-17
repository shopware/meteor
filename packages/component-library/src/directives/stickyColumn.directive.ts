import { throttle } from "@/utils/throttle";
import type { Directive } from "vue";

const getPreviousSibling = function (el: Element | undefined, selector: string) {
  if (!el) return;

  // Get the next sibling element
  let sibling = el.previousElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }
};

const setLeftValue = (el: HTMLElement) => {
  // Calculate the width of all previous sticky column siblings
  let width = 0;
  let sibling = getPreviousSibling(el, "[data-sticky-column]");
  while (sibling) {
    width += sibling.clientWidth;
    sibling = getPreviousSibling(sibling, "[data-sticky-column]");
  }

  // Set the left position of the column to the difference between the table and column x positions
  el.style.left = `${width - 0.5}px`;
  el.dataset.stickyColumnRight = `${width + el.getBoundingClientRect().width - 0.5}`;
};

let mutationObserver: MutationObserver | undefined;

const stickyColumn: Directive = {
  beforeMount(el) {
    el.dataset.stickyColumn = "";
  },
  mounted(el) {
    // Set the left value on load
    setLeftValue(el);

    // Set the left value on mutation
    mutationObserver = new MutationObserver(
      throttle(() => {
        setLeftValue(el);
      }, 60),
    );

    mutationObserver.observe(el.parentElement as Element, {
      childList: true,
      subtree: true,
    });
  },
  unmounted() {
    mutationObserver?.disconnect();
  },
};

export default stickyColumn;
