import { describe, expect, it } from "vitest";
import MtUrlField from "./mt-url-field.vue";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("mt-url-field", () => {
  it("hides the protcol in the input when re-rendering", async () => {
    // ARRANGE
    const { rerender } = render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com",
      },
    });

    // ACT
    await rerender({
      modelValue: "http://www.example.com",
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");
  });

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

  it("updates the domain when the user types", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtUrlField, {
      props: {
        modelValue: "",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.shopware.com");

    expect(handler).toHaveBeenCalledTimes(16);
    expect(handler).toHaveBeenNthCalledWith(1, "https://w");
    expect(handler).toHaveBeenNthCalledWith(16, "https://www.shopware.com");
  });

  it("updates the domain when the user types and then focuses another element", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "",
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
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");
    expect(screen.getByRole("textbox")).toBeDisabled();

    expect(handler).not.toHaveBeenCalled();
  });

  it("does not emit an onUpdate:modelValue event when removing focus from the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "www.example.com",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.tab();

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("cannot be switched to the http protocol when the field is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com",
        disabled: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ARRANGE
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("https://");

    expect(handler).not.toHaveBeenCalled();
  });

  it("can be changed to the http protocol when the user clicks on the https protocol button", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("http://");

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenNthCalledWith(1, "http://www.example.com");
  });

  it("can be changed to the https protocol when the user clicks on the http protocol button", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtUrlField, {
      props: {
        modelValue: "http://www.example.com",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("https://");

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenNthCalledWith(1, "https://www.example.com");
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

  it("emits an inheritance-remove event when linking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        label: "URL",
        isInheritanceField: true,
        isInherited: true,
        "onInheritance-remove": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Unlink inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an inheritance-restore event when linking the inheritance", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        label: "URL",
        isInheritanceField: true,
        isInherited: false,
        "onInheritance-restore": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Link inheritance" }));

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
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");

    expect(handler).not.toHaveBeenCalled();
  });

  it("does update the value when inheritance is unlinked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        isInheritanceField: true,
        isInherited: false,
        modelValue: "",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "www.shopware.com");

    // ASSERT
    expect(screen.getByRole("textbox")).not.toBeDisabled();

    expect(handler).toHaveBeenCalledTimes(16);
    expect(handler).toHaveBeenNthCalledWith(1, "https://w");
    expect(handler).toHaveBeenNthCalledWith(16, "https://www.shopware.com");
  });

  it("does not change the http protocol when the field's inheritance is linked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        isInheritanceField: true,
        isInherited: true,
        modelValue: "http://www.example.com",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(screen.getByRole("button")).toHaveTextContent("http://");
    expect(screen.getByRole("button")).toBeDisabled();

    expect(handler).not.toHaveBeenCalled();
  });

  it("removes the URL search parameters", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com?foo=bar",
        omitUrlSearch: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");

    expect(handler).not.toHaveBeenCalled();
  });

  it("does not remove the URL search parameters by default", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com?foo=bar",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com/?foo=bar");

    expect(handler).not.toHaveBeenCalled();
  });

  it("omits the URL hash", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com#foo",
        omitUrlHash: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");

    expect(handler).not.toHaveBeenCalled();
  });

  it("does not remove the URL hash by default", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "https://www.example.com#foo",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com/#foo");

    expect(handler).not.toHaveBeenCalled();
  });

  it("trims trailing whitespace of the URL", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "www.example.com  ",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("www.example.com");

    expect(handler).not.toHaveBeenCalled();
  });

  it("handles umlaute", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtUrlField, {
      props: {
        modelValue: "localhost/h%C3%A4ndler",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("localhost/händler");

    expect(handler).not.toHaveBeenCalled();
  });
});
