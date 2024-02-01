import { describe, expect, it as fact } from 'vitest';
import { set, get, isObject } from './object.js';

describe('set', () => {
  fact('adds a new key to an object', () => {
    // GIVEN
    const subject = set;

    // WHEN
    const result = subject({}, 'foo', 'bar');

    // THEN
    expect(result).toStrictEqual({
      foo: 'bar',
    });
  });

  fact('adds a new key to an object with a nested path', () => {
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

  fact('overwrites an existing key', () => {
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

describe('isObject', () => {
  fact.each([
    NaN,
    null,
    undefined,
    1,
    -1,
    true,
    false,
    ['hello', 'world'],
    'hello, world',
  ])('returns false because the provided value is not an object', (value) => {
    // GIVEN
    const subject = isObject;

    // WHEN
    const result = subject(value);

    // THEN
    expect(result).toBe(false);
  });

  fact('returns true because the provide value is an object', () => {
    // GIVEN
    const subject = isObject;

    // WHEN
    const result = subject({});

    // THEN
    expect(result).toBe(true);
  });
});
