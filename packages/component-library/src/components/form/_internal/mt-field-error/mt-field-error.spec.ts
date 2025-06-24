import { render, screen } from "@testing-library/vue";
import { expect, describe, it, vi } from "vitest";
import MtFieldError from "./mt-field-error.vue";

// Mock the i18n composable
vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        "global.error-codes.FRAMEWORK__MISSING_PRIVILEGE_ERROR": "Missing permissions",
        "mt-field-error.FRAMEWORK__MISSING_PRIVILEGE_ERROR": "Missing permissions",
        "mt-field-error.FRAMEWORK__DELETE_RESTRICTED": "Deletion failed",
        "mt-field-error.INVALID_MAIL": "Please enter a valid email address.",
        "mt-field-error.c1051bb4-d103-4f74-8988-acbcafc7fdc3": "This field must not be empty.",
      };

      return translations[key] || key;
    }),
  }),
}));

describe("mt-field-error", () => {
  it("should render translated error message", () => {
    const error = {
      code: "FRAMEWORK__MISSING_PRIVILEGE_ERROR",
      detail: "Fallback error message",
    };

    render(MtFieldError, {
      props: { error },
    });

    expect(screen.getByText("Missing permissions")).toBeInTheDocument();
  });

  it("should fallback to detail when no translation is found", () => {
    const error = {
      code: "UNKNOWN_ERROR_CODE",
      detail: "This is a custom error message",
    };

    render(MtFieldError, {
      props: { error },
    });

    expect(screen.getByText("This is a custom error message")).toBeInTheDocument();
  });
});
