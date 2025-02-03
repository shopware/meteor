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

  it("does not change the value when the field is disabled and the user types", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "www.example.com",
        disabled: true,
        // @ts-expect-error -- Event is not typed, yet
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");

    // Is needed to emit the "onUpdate:modelValue" event
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");
    expect(screen.getByRole("textbox")).toBeDisabled();

    // Event is called once when mounting the component
    // this means the event is not called when the user types
    expect(handler).toHaveBeenCalledOnce();
  });

  it("cannot be switched to the http protocol when the field is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com",
        disabled: true,
        // @ts-expect-error -- Event is not typed, yet
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ARRANGE
    // TODO: enable assertion once I migrated this to a button element
    // expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("https://");

    // Event is called once when mounting the component
    // this means the event is not called when the mode changes
    expect(handler).toHaveBeenCalledOnce();
  });

  it("can be changed to the http protocol when the user clicks on the https protocol button", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com",
        // @ts-expect-error -- Event is not typed, yet
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("http://");

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(2, "http://www.example.com");
  });

  it("can be changed to the https protocol when the user clicks on the http protocol button", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtUrlField, {
      props: {
        modelValue: "http://www.example.com",
        // @ts-expect-error -- Event is not typed, yet
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("https://");

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(2, "https://www.example.com");
  });

  it("displays the http protocol when the url is a unsecure url", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        modelValue: "http://www.example.com",
      },
    });

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("http://");
  });

  it("shows the https protocol when the url is a secure url", async () => {
    // ARRANGE
    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com",
      },
    });

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("https://");
  });

<<<<<<< HEAD
  it("updates the domain when the user types and then focuses another element", async () => {
=======
  it("emits an inheritance-remove event when unlinking the inheritance", async () => {
>>>>>>> fcf19494 (test(component-library): emits an inheritance-remove event when unlinking inheritance)
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
<<<<<<< HEAD
        modelValue: "",
        // @ts-expect-error -- Event is not typed, yet
        onChange: handler,
=======
        isInheritanceField: true,
        isInherited: true,
        // @ts-expect-error
        "onInheritance-remove": handler,
>>>>>>> fcf19494 (test(component-library): emits an inheritance-remove event when unlinking inheritance)
      },
    });

    // ACT
<<<<<<< HEAD
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("www.shopware.com");
=======
    await userEvent.click(screen.getByTestId("mt-inheritance-switch-icon"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
>>>>>>> fcf19494 (test(component-library): emits an inheritance-remove event when unlinking inheritance)
  });

  it("emits an inheritance-restore event when linking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        isInheritanceField: true,
        isInherited: false,
        // @ts-expect-error
        "onInheritance-restore": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByTestId("mt-icon__regular-link-horizontal-slash"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not update the value when inheritance is linked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        isInheritanceField: true,
        isInherited: true,
        modelValue: "www.example.com",
        // @ts-expect-error
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();

    // Event is called once when mounting the component,
    // meaning that the event is not called when the user types
    expect(handler).toHaveBeenCalledOnce();
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");
  });
});
