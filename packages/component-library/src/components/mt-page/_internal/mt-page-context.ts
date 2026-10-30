import type { InjectionKey } from "vue";

/** What `mt-page` shares with the content inside of it. */
export interface PageContext {
  /**
   * Registers the heading of a content header, so the page header hides its current crumb while
   * the heading is on screen. Returns a function that unregisters it.
   */
  registerHeading(element: HTMLElement): () => void;
}

export const pageContextKey = Symbol("mt-page") as InjectionKey<PageContext>;
