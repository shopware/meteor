import { describe, expect, it } from "vitest";
import MtUrlField from "./mt-url-field.vue";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("mt-url-field", async () => {
  it("shows the domain to the user", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        modelValue: "www.example.com",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");
  });

  it("shows the domain without the protocol to the user", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");
  });

  it("updates the domain when the use types", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtUrlField, {
      props: {
        modelValue: "",
        // @ts-expect-error -- Event is not typed, yet
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.shopware.com");
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
