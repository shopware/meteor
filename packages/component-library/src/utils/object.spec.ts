import { get, getPropertyValue } from "./object";

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
        age: 30
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
        email: "john@example.com"
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
        email: "john@example.com"
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
        email: "john@example.com"
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
        email: ""
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
        email: ""
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
            lastName: "Doe"
          }
        }
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
});
