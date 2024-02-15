import { expect, test } from 'vitest';
import { kebabCase } from './string.js';

test.each([
  'Slate / 50',
  ' Slate / 50 ',
  'Slate     /     50 ',
  'slate.50',
  'slate / 50',
])("turns %s into 'slate.50'", (input) => {
  // GIVEN
  const subject = kebabCase;

  // WHEN
  const result = subject(input);

  // THEN
  expect(result).toBe('slate.50');
});
