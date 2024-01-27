import { expect, test as fact } from 'vitest';
import { Color } from './Color.js';

fact('creates a hex color out of an RGB value', () => {
  // GIVEN
  const subject = Color;

  // WHEN
  const result = subject.fromRGB(0, 0, 255);

  // THEN
  expect(result.toHex()).toBe('#0000ff');
});

fact('creates a hex color out of an RGBA value', () => {
  const subject = Color;

  // WHEN
  const result = subject.fromRGB(0, 0, 255, 0);

  // THEN
  expect(result.toHex()).toBe('#0000ff00');
});
