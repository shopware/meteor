import { expect } from "@storybook/test";

/**
 * Hint text that is long enough to wrap onto multiple lines inside the narrow
 * wrapper the "multi line prop hint" visual tests render the fields in.
 */
export const multiLinePropHint =
  "This hint is long enough to wrap onto multiple lines so the info icon has to stay aligned with the first line of the text.";

/**
 * Asserts that the hint inside `canvasElement` wraps onto multiple lines and
 * that its icon sits on the first line of the hint text instead of being
 * centered on the whole block.
 */
export function expectHintIconAlignedWithFirstLine(canvasElement: HTMLElement) {
  const icon = canvasElement.querySelector<HTMLElement>(".mt-field-hint__icon");
  const text = canvasElement.querySelector<HTMLElement>(".mt-field-hint__text");

  if (!icon || !text) {
    throw new Error("Expected the field hint to render both an icon and a text element");
  }

  const iconRect = icon.getBoundingClientRect();
  const textRect = text.getBoundingClientRect();
  const lineHeight = parseFloat(window.getComputedStyle(text).lineHeight);

  // the alignment assertion below only means something while the hint wraps
  expect(textRect.height).toBeGreaterThan(lineHeight * 1.5);

  const iconCenter = iconRect.top + iconRect.height / 2;
  const firstLineCenter = textRect.top + lineHeight / 2;

  expect(Math.abs(iconCenter - firstLineCenter)).toBeLessThanOrEqual(1);
}
