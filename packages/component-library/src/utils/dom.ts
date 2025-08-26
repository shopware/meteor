/**
 * Returns the scrollbar height of an HTML element.
 */
export function getScrollbarHeight(element: HTMLElement): number {
  if (!(element instanceof HTMLElement)) {
    console.warn(
      "DOM Utilities",
      'The provided element needs to be an instance of "HTMLElement".',
      element,
    );
    return 0;
  }
  return element.offsetHeight - element.clientHeight;
}

/**
 * Returns the scrollbar width of an HTML element.
 */
export function getScrollbarWidth(element: HTMLElement): number {
  if (!(element instanceof HTMLElement)) {
    console.warn(
      "DOM Utilities",
      'The provided element needs to be an instance of "HTMLElement".',
      element,
    );
    return 0;
  }
  return element.offsetWidth - element.clientWidth;
}

/**
 * uses the browser's copy function to copy a string
 */
export function copyToClipboard(stringToCopy: string): void {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = stringToCopy;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}

export default {
  getScrollbarHeight,
  getScrollbarWidth,
  copyToClipboard,
};
