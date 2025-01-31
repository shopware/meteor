import { describe, it, expect } from "vitest";
import { defineStory } from "./story-helper";

describe("story-helper", () => {
  describe("defineStory", () => {
    it("should return the same structure it received as input", () => {
      // ARRANGE
      const subject = defineStory;

      // ACT
      const result = subject({
        name: "The name of the test",
        args: {
          disabled: true,
          modelValue: "Foo",
        },
      });

      // ASSERT
      expect(result).toStrictEqual({
        name: "The name of the test",
        args: {
          disabled: true,
          modelValue: "Foo",
        },
      });
    });
  });
});
