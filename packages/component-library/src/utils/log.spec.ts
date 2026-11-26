import { deprecate, logError, resetWarnings, warn } from "./log";

describe("log", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("warn", () => {
    it("starts the message with the library and the source", () => {
      // ACT
      warn("mt-app", "Something is wrong.");

      // ASSERT
      expect(console.warn).toHaveBeenCalledWith("[Meteor] mt-app: Something is wrong.");
    });

    it("shows the same message only once", () => {
      // ACT
      warn("mt-app", "Something is wrong.");
      warn("mt-app", "Something is wrong.");

      // ASSERT
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("shows different messages and the same message from different sources", () => {
      // ACT
      warn("mt-app", "Something is wrong.");
      warn("mt-app", "Something else is wrong.");
      warn("mt-page", "Something is wrong.");

      // ASSERT
      expect(console.warn).toHaveBeenCalledTimes(3);
    });

    it("shows a message again after the warnings are reset", () => {
      // ARRANGE
      warn("mt-app", "Something is wrong.");

      // ACT
      resetWarnings();
      warn("mt-app", "Something is wrong.");

      // ASSERT
      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it("shows nothing in production", () => {
      // ARRANGE
      vi.stubEnv("NODE_ENV", "production");

      // ACT
      warn("mt-app", "Something is wrong.");

      // ASSERT
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe("deprecate", () => {
    it("names the replacement", () => {
      // ACT
      deprecate("mt-checkbox", "The `checked` prop", "`v-model`");

      // ASSERT
      expect(console.warn).toHaveBeenCalledWith(
        "[Meteor] mt-checkbox: The `checked` prop is deprecated and will be removed. Use `v-model` instead.",
      );
    });

    it("says when there is no replacement", () => {
      // ACT
      deprecate("mt-number-field", "The `allowEmpty` prop");

      // ASSERT
      expect(console.warn).toHaveBeenCalledWith(
        "[Meteor] mt-number-field: The `allowEmpty` prop is deprecated and will be removed. There is no replacement.",
      );
    });
  });

  describe("logError", () => {
    it("logs the message with the caught error", () => {
      // ARRANGE
      const error = new Error("Network down");

      // ACT
      logError("mt-entity-select", "Could not load the entities.", error);

      // ASSERT
      expect(console.error).toHaveBeenCalledWith(
        "[Meteor] mt-entity-select: Could not load the entities.",
        error,
      );
    });

    it("logs every time, also in production", () => {
      // ARRANGE
      vi.stubEnv("NODE_ENV", "production");

      // ACT
      logError("mt-icon", "Could not load the icon.");
      logError("mt-icon", "Could not load the icon.");

      // ASSERT
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith("[Meteor] mt-icon: Could not load the icon.");
    });
  });
});
