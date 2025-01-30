import { describe, expect, it } from "vitest";
import MtUrlField from "./mt-url-field.vue";
import { render, screen } from "@testing-library/vue";

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
});
