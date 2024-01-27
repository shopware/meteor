import { describe, expect, it as fact } from 'vitest';
import { set, get } from './object';

describe('set', () => {
  fact('it adds a new key to an object', () => {
    // GIVEN
    const subject = set;

    // WHEN
    const result = subject({}, 'foo', 'bar');

    // THEN
    expect(result).toStrictEqual({
      foo: 'bar',
    });
  });

  fact('it adds a new key to an object with a nested path', () => {
    // GIVEN
    const subject = set;

    // WHEN
    const result = subject({}, 'foo.bar', 'baz');

    // THEN
    expect(result).toStrictEqual({
      foo: {
        bar: 'baz',
      },
    });
  });

  fact('it overwrites an existing key', () => {
    // GIVEN
    const subject = set;

    // WHEN
    const result = subject({ foo: 'bar' }, 'foo', 'baz');

    // THEN
    expect(result).toStrictEqual({
      foo: 'baz',
    });
  });
});

describe('get', () => {
  fact('returns the value of a key', () => {
    // GIVEN
    const subject = get;

    // WHEN
    const result = subject({ foo: 'bar' }, 'foo');

    // THEN
    expect(result).toBe('bar');
  });

  fact('returns the value of a nested key', () => {
    // GIVEN
    const subject = get;

    // WHEN
    const result = subject({ foo: { bar: 'baz' } }, 'foo.bar');

    // THEN
    expect(result).toBe('baz');
  });
});
