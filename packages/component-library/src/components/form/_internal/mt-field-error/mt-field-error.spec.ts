import { render, screen } from "@testing-library/vue";
import { expect, describe, it, vi } from "vitest";
import MtFieldError from "./mt-field-error.vue";

// Mock the i18n composable
vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        "global.error-codes.FRAMEWORK__MISSING_PRIVILEGE_ERROR": "This is a global error",
        "mt-field-error.FRAMEWORK__MISSING_PRIVILEGE_ERROR": "This is a mt-field-error error",
        "global.error-codes.GLOBAL_ONLY_ERROR": "This is a global only error",
        "mt-field-error.MT_FIELD_ONLY_ERROR": "This is a mt-field-error only error",
      };

      return translations[key] || key;
    }),
  }),
}));

describe("mt-field-error", () => {
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

  it("should prefer global.error-codes over mt-field-errors", () => {
    const error = {
      code: "GLOBAL_ONLY_ERROR",
      detail: "Fallback error message",
    };

    render(MtFieldError, {
      props: { error },
    });

    expect(screen.getByText("This is a global only error")).toBeInTheDocument();
  });

  it("should show mt-field-error when global.error-codes is not available", () => {
    const error = {
      code: "MT_FIELD_ONLY_ERROR",
      detail: "Fallback error message",
    };

    render(MtFieldError, {
      props: { error },
    });

    expect(screen.getByText("This is a mt-field-error only error")).toBeInTheDocument();
  });
});
