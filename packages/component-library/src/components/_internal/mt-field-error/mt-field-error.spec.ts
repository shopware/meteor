import { render, screen } from "@testing-library/vue";
import { expect, describe, it } from "vitest";
import { ref } from "vue";
import MtFieldError from "./mt-field-error.vue";
import { createMeteorI18nPlugin } from "@/i18n/plugin";
import type { MeteorI18nAdapter } from "@/i18n/types";

// A host adapter supplies the `global.error-codes.*` snippets (as the Shopware Admin does),
// while `mt.field-error.*` snippets are Meteor's own bundled fallbacks. It returns `undefined`
// on a miss and interpolates `{named}` placeholders like a real vue-i18n host would.
const hostMessages: Record<string, string> = {
  "global.error-codes.FRAMEWORK__MISSING_PRIVILEGE_ERROR": "This is a global error",
  "global.error-codes.GLOBAL_ONLY_ERROR": "This is a global only error",
  "global.error-codes.GLOBAL_PARAMETER_ERROR": "This is a global error with {value}",
};

const hostAdapter: MeteorI18nAdapter = {
  locale: ref("en-GB"),
  t: (key, params) => {
    const message = hostMessages[key];
    if (message === undefined) return undefined;
    return message.replace(/\{(\w+)\}/g, (match, name: string) =>
      params?.[name] != null ? String(params[name]) : match,
    );
  },
};

function renderError(error: Record<string, unknown>) {
  return render(MtFieldError, {
    props: { error },
    global: { plugins: [createMeteorI18nPlugin({ adapter: hostAdapter })] },
  });
}

describe("mt-field-error", () => {
  it("should fallback to detail when no translation is found", () => {
    renderError({
      code: "UNKNOWN_ERROR_CODE",
      detail: "This is a custom error message",
    });

    expect(screen.getByText("This is a custom error message")).toBeInTheDocument();
  });

  it("should prefer global.error-codes over the bundled mt-field-error snippet", () => {
    // This code exists both in the host's global.error-codes and in Meteor's bundled
    // mt-field-error snippets ("Missing permissions"); the host translation must win.
    renderError({
      code: "FRAMEWORK__MISSING_PRIVILEGE_ERROR",
      detail: "Fallback error message",
    });

    expect(screen.getByText("This is a global error")).toBeInTheDocument();
  });

  it("should show the bundled mt-field-error snippet when global.error-codes is not available", () => {
    renderError({
      code: "INVALID_MAIL",
      detail: "Fallback error message",
    });

    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
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

    renderError(error);

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

    renderError(error);

    expect(
      screen.getByText("This is a global error with top-level parameters"),
    ).toBeInTheDocument();
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

    renderError(error);

    expect(
      screen.getByText("This is a global error with top-level parameters"),
    ).toBeInTheDocument();
  });
});
