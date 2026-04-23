import { render, screen } from "@testing-library/vue";
import { expect, describe, it, vi } from "vitest";
import MtFieldError from "./mt-field-error.vue";

// Mock the i18n composable
vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: vi.fn((key: string, params?: Record<string, string | number>) => {
      const translations: Record<string, string> = {
        "global.error-codes.FRAMEWORK__MISSING_PRIVILEGE_ERROR": "This is a global error",
        "mt-field-error.FRAMEWORK__MISSING_PRIVILEGE_ERROR": "This is a mt-field-error error",
        "global.error-codes.GLOBAL_ONLY_ERROR": "This is a global only error",
        "mt-field-error.MT_FIELD_ONLY_ERROR": "This is a mt-field-error only error",
        "global.error-codes.GLOBAL_PARAMETER_ERROR": "This is a global error with {value}",
      };
      const translation = translations[key] || key;

      return translation.replace(/\{(\w+)\}/g, (_, placeholder: string) => {
        const value = params?.[placeholder];

        return value === undefined ? `{${placeholder}}` : String(value);
      });
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

  it("should interpolate meta.parameters when present", () => {
    const error = {
      code: "GLOBAL_PARAMETER_ERROR",
      detail: "Fallback error message",
      meta: {
        parameters: {
          value: "meta parameters",
        },
      },
    };

    render(MtFieldError, {
      props: { error },
    });

    expect(screen.getByText("This is a global error with meta parameters")).toBeInTheDocument();
  });

  it("should interpolate parameters when present", () => {
    const error = {
      code: "GLOBAL_PARAMETER_ERROR",
      detail: "Fallback error message",
      parameters: {
        value: "top-level parameters",
      },
    };

    render(MtFieldError, {
      props: { error },
    });

    expect(screen.getByText("This is a global error with top-level parameters")).toBeInTheDocument();
  });

  it("should prefer top-level parameters over meta.parameters when both are present", () => {
    const error = {
      code: "GLOBAL_PARAMETER_ERROR",
      detail: "Fallback error message",
      meta: {
        parameters: {
          value: "meta parameters",
        },
      },
      parameters: {
        value: "top-level parameters",
      },
    };

    render(MtFieldError, {
      props: { error },
    });

    expect(screen.getByText("This is a global error with top-level parameters")).toBeInTheDocument();
  });
});
