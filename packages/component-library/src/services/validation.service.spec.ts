import { describe, it } from "vitest";
import { required } from "./validation.service";

describe("validation-service", () => {
  describe("required", () => {
    it("is marked as required when providing true", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject(true);

      // ASSERT
      expect(result).toBeTruthy();
    });

    it("is not marked as required when providing false", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject(false);

      // ASSERT
      expect(result).toBeFalsy();
    });

    it("is marked as required when providing an non-empty string", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject("test");

      // ASSERT
      expect(result).toBeTruthy();
    });

    it("is not marked as required when providing an empty string", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject("");

      // ASSERT
      expect(result).toBeFalsy();
    });

    it("is not marked as required when providing undefined", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject(undefined);

      // ASSERT
      expect(result).toBeFalsy();
    });

    it("is not marked as required when providing null", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject(null);

      // ASSERT
      expect(result).toBeFalsy();
    });

    it("is marked as required when providing an object with keys", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject({ key: "value" });

      // ASSERT
      expect(result).toBeTruthy();
    });

    it("is not marked as required when providing an empty object", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject({});

      // ASSERT
      expect(result).toBeFalsy();
    });

    it("is not marked as required when passing a function", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject(() => {});

      // ASSERT
      expect(result).toBeFalsy();
    });

    it("is marked as required when passing a number", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject(1);

      // ASSERT
      expect(result).toBeTruthy();
    });

    it("is is marked as required when passing an empty array", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject([]);

      // ASSERT
      expect(result).toBeFalsy();
    });

    it("is marked as required when passing an array with values", () => {
      // ARRANGE
      const subject = required;

      // ACT
      const result = subject([1]);

      // ASSERT
      expect(result).toBeTruthy();
    });
  });
});
