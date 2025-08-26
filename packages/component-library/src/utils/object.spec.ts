import { deepMergeObjects, get, getPropertyValue } from "./object";

describe("utils/object", () => {
  describe("get", () => {
    it("returns the value at the specified path", () => {
      // ARRANGE
      const object = {
        a: 1,
      };

      const subject = get;

      // ACT
      const result = subject(object, "a");

      // ASSERT
      expect(result).toBe(1);
    });

    it("returns the value of a nested object", () => {
      // ARRANGE
      const object = {
        a: {
          b: 2,
        },
      };

      const subject = get;

      // ACT
      const result = subject(object, "a.b");

      // ASSERT
      expect(result).toBe(2);
    });

    it("returns undefined if the path does not exist", () => {
      // ARRANGE
      const object = {
        a: 1,
      };

      const subject = get;

      // ACT
      const result = subject(object, "b");

      // ASSERT
      expect(result).toBeUndefined();
    });

    it("returns the value of the path when the path is a number", () => {
      // ARRANGE
      const object = {
        1: "some-value",
      };

      const subject = get;

      // ACT
      const result = subject(object, 1);

      // ASSERT
      expect(result).toBe("some-value");
    });
  });

  describe("getPropertyValue", () => {
    it("returns the value at the specified path", () => {
      // ARRANGE
      const object = {
        name: "John Doe",
        age: 30,
      };

      // ACT
      const result = getPropertyValue(object, "name");

      // ASSERT
      expect(result).toBe("John Doe");
    });

    it("returns the value using the first valid path in an array of paths", () => {
      // ARRANGE
      const object = {
        username: "johndoe",
        email: "john@example.com",
      };

      // ACT
      const result = getPropertyValue(object, ["name", "username", "email"]);

      // ASSERT
      expect(result).toBe("johndoe");
    });

    it("skips empty string values when using an array of paths", () => {
      // ARRANGE
      const object = {
        name: "",
        username: "johndoe",
        email: "john@example.com",
      };

      // ACT
      const result = getPropertyValue(object, ["name", "username", "email"]);

      // ASSERT
      expect(result).toBe("johndoe");
    });

    it("skips null values when using an array of paths", () => {
      // ARRANGE
      const object = {
        name: null,
        username: "johndoe",
        email: "john@example.com",
      };

      // ACT
      const result = getPropertyValue(object, ["name", "username", "email"]);

      // ASSERT
      expect(result).toBe("johndoe");
    });

    it("returns the default value if no valid path exists", () => {
      // ARRANGE
      const object = {
        username: "",
        email: "",
      };

      // ACT
      const result = getPropertyValue(object, ["name", "fullName", "username", "email"], "Unknown");

      // ASSERT
      expect(result).toBe("Unknown");
    });

    it("returns the default value when all paths lead to empty values", () => {
      // ARRANGE
      const object = {
        name: "",
        username: null,
        email: "",
      };

      // ACT
      const result = getPropertyValue(object, ["name", "username", "email"], "No value found");

      // ASSERT
      expect(result).toBe("No value found");
    });

    it("handles nested paths correctly", () => {
      // ARRANGE
      const object = {
        user: {
          profile: {
            firstName: "John",
            lastName: "Doe",
          },
        },
      };

      // ACT
      const result = getPropertyValue(object, "user.profile.firstName");

      // ASSERT
      expect(result).toBe("John");
    });

    it("returns the object itself if no path is provided", () => {
      // ARRANGE
      const object = { id: 123 };

      // ACT
      const result = getPropertyValue(object, "");

      // ASSERT
      expect(result).toBe(object);
    });
  });

  describe("deepMergeObjects", () => {
    it("overwrites primitive values in the target with source values", () => {
      // ARRANGE
      const target = { a: 1, b: 2 };
      const source = { a: 3, b: 4 };

      // ACT
      const result = deepMergeObjects<any>(target, source);

      // ASSERT
      expect(result).toEqual({ a: 3, b: 4 });
    });

    it("merges nested objects recursively", () => {
      // ARRANGE
      const target = { a: { b: 1, c: 2 } };
      const source = { a: { c: 3, d: 4 } };

      // ACT
      const result = deepMergeObjects<any>(target, source);

      // ASSERT
      expect(result).toEqual({ a: { b: 1, c: 3, d: 4 } });
    });

    it("adds new properties from the source to the target", () => {
      // ARRANGE
      const target = { a: 1 };
      const source = { b: 2, c: 3 };

      // ACT
      const result = deepMergeObjects<any>(target, source);

      // ASSERT
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("does not modify the target object if the source is empty", () => {
      // ARRANGE
      const target = { a: 1, b: 2 };
      const source = {};

      // ACT
      const result = deepMergeObjects<any>(target, source);

      // ASSERT
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("handles arrays as properties correctly", () => {
      // ARRANGE
      const target = { a: [1, 2], b: { c: 3 } };
      const source = { a: [3, 4], b: { d: 5 } };

      // ACT
      const result = deepMergeObjects<any>(target, source);

      // ASSERT
      expect(result).toEqual({ a: [3, 4], b: { c: 3, d: 5 } });
    });
  });
});
