import { expect, test } from 'vitest';
import { kebabCase } from './string.js';

test.each([
  ['Slate / 50', 'slate.50'],
  [' Slate / 50 ', 'slate.50'],
  ['Slate     /     50 ', 'slate.50'],
  ['slate.50', 'slate.50'],
  ['slate / 50', 'slate.50'],
  ['border radius / 50', 'border-radius.50'],
])("turns %s into '%s'", (input, output) => {
  // GIVEN
  const subject = kebabCase;

  // WHEN
  const result = subject(input);

  // THEN
  expect(result).toBe(output);
});
