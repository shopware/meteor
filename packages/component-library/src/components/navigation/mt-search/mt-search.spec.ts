import { render, screen } from "@testing-library/vue";
import MtSearch from "./mt-search.vue";
import { userEvent } from "@storybook/test";

describe("mt-search", () => {
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
