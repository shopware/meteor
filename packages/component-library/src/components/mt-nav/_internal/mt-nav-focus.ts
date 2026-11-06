import { getTabbables } from "@/utils/focus";

export function focusableLinks(container: HTMLElement): HTMLElement[] {
  // Lists the visible links in the container; label-only rows render as a span and can't take focus
  return Array.from(container.querySelectorAll<HTMLElement>(".mt-nav__link")).filter(
    (link) => link.tabIndex >= 0 && !link.closest("[hidden]"),
  );
}

export function moveLinkFocus(
  container: HTMLElement,
  event: KeyboardEvent,
  keys: { next: string; previous: string },
): void {
  // Moves focus between the visible links in the container with the given keys, Home and End, without wrapping
  const target = event.target;

  // Keys pressed inside slotted content, e.g. a button in a suffix, keep their meaning
  if (!(target instanceof HTMLElement) || !target.matches(".mt-nav__link")) {
    return;
  }

  const links = focusableLinks(container);
  const currentIndex = links.indexOf(target);
  let nextIndex: number;

  switch (event.key) {
    case keys.next:
      nextIndex = Math.min(currentIndex + 1, links.length - 1);
      break;
    case keys.previous:
      nextIndex = Math.max(currentIndex - 1, 0);
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = links.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  links[nextIndex]?.focus();
}

/**
 * The element Tab reaches after the trigger of a floating panel, as if the panel followed its
 * trigger in the page instead of sitting at the end of the body.
 */
export function tabbableAfterTrigger(trigger: HTMLElement, panel: HTMLElement) {
  const tabbables = getTabbables(document.body).filter((element) => !panel.contains(element));
  const index = tabbables.indexOf(trigger);

  return index === -1 ? undefined : tabbables[index + 1];
}
