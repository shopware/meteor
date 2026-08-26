import { expect } from "@storybook/test";

/**
 * Hint text that is long enough to wrap onto multiple lines inside the narrow
 * wrapper the "multi line prop hint" visual tests render the fields in.
 */
export const multiLinePropHint =
  "This hint is long enough to wrap onto multiple lines so the info icon has to stay aligned with the first line of the text.";

/**
 * Selectors of the shared `mt-field-hint` markup. Fields that render their own
 * hint, like the datepicker's time zone hint, pass their own selectors.
 */
type HintSelectors = { iconSelector?: string; textSelector?: string };

function getHintParts(canvasElement: HTMLElement, iconSelector: string, textSelector: string) {
  const icon = canvasElement.querySelector<HTMLElement>(iconSelector);
  const text = canvasElement.querySelector<HTMLElement>(textSelector);

  if (!icon || !text) {
    throw new Error("Expected the field hint to render both an icon and a text element");
  }

  return { icon, text };
}

/**
 * Asserts that the hint icon keeps its size instead of being squeezed by hint
 * text that does not fit on one line. The icon is square, so comparing its
 * width against its height catches a horizontally shrunken icon without
 * hardcoding the icon size.
 */
export function expectHintIconKeepsItsSize(
  canvasElement: HTMLElement,
  {
    iconSelector = ".mt-field-hint__icon",
    textSelector = ".mt-field-hint__text",
  }: HintSelectors = {},
) {
  const { icon } = getHintParts(canvasElement, iconSelector, textSelector);
  const iconRect = icon.getBoundingClientRect();

  expect(iconRect.height).toBeGreaterThan(0);
  expect(iconRect.width).toBeCloseTo(iconRect.height, 0);
}

/**
 * Asserts that the hint inside `canvasElement` wraps onto multiple lines and
 * that its icon keeps its size and sits on the first line of the hint text
 * instead of being centered on the whole block.
 */
export function expectHintIconAlignedWithFirstLine(
  canvasElement: HTMLElement,
  {
    iconSelector = ".mt-field-hint__icon",
    textSelector = ".mt-field-hint__text",
  }: HintSelectors = {},
) {
  const { icon, text } = getHintParts(canvasElement, iconSelector, textSelector);

  const iconRect = icon.getBoundingClientRect();
  const textRect = text.getBoundingClientRect();
  const lineHeight = parseFloat(window.getComputedStyle(text).lineHeight);

  // the alignment assertion below only means something while the hint wraps
  expect(textRect.height).toBeGreaterThan(lineHeight * 1.5);

  expectHintIconKeepsItsSize(canvasElement, { iconSelector, textSelector });

  const iconCenter = iconRect.top + iconRect.height / 2;
  const firstLineCenter = textRect.top + lineHeight / 2;

  expect(Math.abs(iconCenter - firstLineCenter)).toBeLessThanOrEqual(1);
}
