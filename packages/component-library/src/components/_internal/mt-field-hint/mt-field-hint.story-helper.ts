import { expect } from "@storybook/test";

export const multiLinePropHint =
  "This hint is long enough to wrap onto multiple lines so the info icon has to stay aligned with the first line of the text.";

type HintSelectors = { iconSelector?: string; textSelector?: string };

function getHintParts(canvasElement: HTMLElement, iconSelector: string, textSelector: string) {
  const icon = canvasElement.querySelector<HTMLElement>(iconSelector);
  const text = canvasElement.querySelector<HTMLElement>(textSelector);

  if (!icon || !text) {
    throw new Error("Expected the field hint to render both an icon and a text element");
  }

  return { icon, text };
}

export function expectHintIconKeepsItsSize(
  canvasElement: HTMLElement,
  {
    iconSelector = ".mt-field-hint__icon",
    textSelector = ".mt-field-hint__text",
  }: HintSelectors = {},
) {
  const { icon } = getHintParts(canvasElement, iconSelector, textSelector);
  const iconRect = icon.getBoundingClientRect();

  // the icon should not have been squashed
  expect(iconRect.height).toBeGreaterThan(0);
  expect(iconRect.width).toBeCloseTo(iconRect.height, 0);
}

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
