import { expect, test } from 'vitest';
import { Color } from './Color.js';

test('creates a hex color out of an RGB value', () => {
  // GIVEN
  const subject = Color;

  // WHEN
  const result = subject.fromRGB(0, 0, 255);

  // THEN
  expect(result.toHex()).toBe('#0000ff');
});

test('creates a hex color out of an RGBA value', () => {
  const subject = Color;

  // WHEN
  const result = subject.fromRGB(0, 0, 255, 0);

  // THEN
  expect(result.toHex()).toBe('#0000ff00');
});

test('creates a hex color with full opacity out of an RGBA value', () => {
  const subject = Color;

  // WHEN
  const result = subject.fromRGB(0, 0, 255, 1);

  // THEN
  expect(result.toHex()).toBe('#0000ff');
});

test('creates a hex color with some opacity out of an RGBA value', () => {
  const subject = Color;

  // WHEN
  const result = subject.fromRGB(0, 0, 255, 0.5);

  // THEN
  expect(result.toHex()).toBe('#0000ff80');
});
