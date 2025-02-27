import { get } from "./object";

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
});
