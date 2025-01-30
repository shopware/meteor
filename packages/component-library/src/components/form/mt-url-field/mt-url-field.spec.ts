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

  it("updates the domain when the user types and then focuses another element", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "",
        // @ts-expect-error -- Event is not typed, yet
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("www.shopware.com");
  });

  it("can be marked as required", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("is not required to be filled out by default", async () => {
    // ARRANGE
    render(MtUrlField);

    // ASSERT
    expect(screen.getByRole("textbox")).not.toBeRequired();
  });

  it("has the correct placeholder", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        placeholder: "www.example.com",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "www.example.com");
  });

  it("gets focused when the user clicks on the label", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        label: "URL",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("URL"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("can be identified on the server by its name when submitting a form", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        name: "url",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "url");
  });

  it("has a helptext", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        helpText: "This is a helptext",
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
    expect(screen.getByRole("tooltip")).toHaveTextContent("This is a helptext");
  });

  it("updates the domain when the user types and then focuses another element", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "",
        // @ts-expect-error -- Event is not typed, yet
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("www.shopware.com");
  });
});
