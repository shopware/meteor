import { expect, it as fact } from "vitest";
import { set } from "./object";

fact("it adds a new key to an object", () => {
  // GIVEN
  const subject = set;

  // WHEN
  const result = subject({}, "foo", "bar");

  // THEN
  expect(result).toStrictEqual({
    foo: "bar",
  });
});

fact("it adds a new key to an object with a nested path", () => {
  // GIVEN
  const subject = set;

  // WHEN
  const result = subject({}, "foo.bar", "baz");

  // THEN
  expect(result).toStrictEqual({
    foo: {
      bar: "baz",
    },
  });
});

fact("it overwrites an existing key", () => {
  // GIVEN
  const subject = set;

  // WHEN
  const result = subject({ foo: "bar" }, "foo", "baz");

  // THEN
  expect(result).toStrictEqual({
    foo: "baz",
  });
});
