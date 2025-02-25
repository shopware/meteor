import { render, screen } from "@testing-library/vue";
import MtSearch from "./mt-search.vue";
import { userEvent } from "@testing-library/user-event";

describe("mt-search", () => {
  it("changes the value when typing in the search", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSearch, {
      props: {
        modelValue: "",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("searchbox"), "Hello");

    // ASSERT
    expect(screen.getByRole("searchbox")).toHaveValue("Hello");
    expect(handler).toHaveBeenCalledWith("Hello");
  });

  it("emits a change event when typing in the search and then removing the focus from the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSearch, {
      props: {
        modelValue: "",
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("searchbox"), "Hello");
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("searchbox")).toHaveValue("Hello");

    expect(handler).toHaveBeenCalledWith("Hello");
  });

  it("emits an empty string when clearing the search and then removing focus from the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSearch, {
      props: {
        modelValue: "Hello",
        onChange: handler,
      },
    });

    // ACT
    await userEvent.clear(screen.getByRole("searchbox"));
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(handler).toHaveBeenCalledWith("");
  });

  it("has a default placeholder of search", async () => {
    // ARRANGE
    render(MtSearch);

    // ASSERT
    expect(screen.getByRole("searchbox")).toHaveAttribute("placeholder", "Search");
  });

  it("has the specified placeholder", async () => {
    // ARRANGE
    render(MtSearch, {
      props: {
        placeholder: "Find me",
      },
    });

    // ASSERT
    expect(screen.getByRole("searchbox")).toHaveAttribute("placeholder", "Find me");
  });

  it("disables the search", async () => {
    // ARRANGE
    render(MtSearch, {
      props: {
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("searchbox")).toBeDisabled();
  });

  it("does not change the value when the search is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtSearch, {
      props: {
        modelValue: "Hello",
        disabled: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("searchbox"), "World");

    // ASSERT
    expect(screen.getByRole("searchbox")).toHaveValue("Hello");
    expect(handler).not.toHaveBeenCalled();
  });
});
