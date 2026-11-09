import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { h, nextTick, type FunctionalComponent } from "vue";
import MtSelect from "./mt-select.vue";

async function renderSelect({ props = {}, slots = {}, attrs = {} } = {}) {
  const result = render(MtSelect, {
    props: {
      modelValue: "becky",
      options: [
        {
          id: 1,
          label: "Option Alfred",
          value: "alfred",
        },
        {
          id: 2,
          label: "Option Becky",
          value: "becky",
        },
        {
          id: 3,
          label: "Option C",
          value: "c",
        },
      ],
      ...props,
    },
    slots,
    attrs,
  });

  await nextTick();

  return result;
}

// mock debounce from '@/utils/debounce'
vi.mock("@/utils/debounce", () => ({
  debounce: (fn: (...args: any[]) => void) => fn,
}));

describe("mt-select", () => {
  it("moves the focus to the previous element on Shift+Tab without clicking it", async () => {
    // ARRANGE
    const onClick = vi.fn();
    render(() =>
      h("div", [
        h("button", { onClick }, "Before"),
        h("div", { inert: true }, [h("button", { onClick }, "Inert")]),
        h(MtSelect, {
          label: "Select",
          options: [{ id: 1, label: "Option Alfred", value: "alfred" }],
        }),
      ]),
    );
    await userEvent.click(screen.getByRole("textbox"));

    // ACT
    await userEvent.tab({ shift: true });

    // ASSERT
    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should render the select component", async () => {
    await renderSelect();

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render only one single select result with type string", async () => {
    await renderSelect();

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("Option Becky");
  });

  it("should render only one single select result with type number", async () => {
    const { rerender } = await renderSelect();
    await rerender({
      modelValue: 25,
      options: [
        { id: 5, label: "5", value: 5 },
        { id: 10, label: "10", value: 10 },
        { id: 25, label: "25", value: 25 },
        { id: 50, label: "50", value: 50 },
      ],
    });

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("25");
  });

  it("should render a label for option with id 0", async () => {
    const { rerender } = await renderSelect();
    await rerender({
      modelValue: 0,
      options: [
        { id: 0, label: "Id 0", value: 0 },
        { id: 10, label: "Id 10", value: 10 },
      ],
    });

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("Id 0");
  });

  it("should select an object value by id", async () => {
    const { rerender } = await renderSelect();
    await rerender({
      modelValue: { id: 2, label: "Option Becky", value: "becky" },
      options: [
        { id: 1, label: "Option Alfred", value: "alfred" },
        { id: 2, label: "Option Becky", value: "becky" },
        { id: 3, label: "Option C", value: "c" },
      ],
    });

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("Option Becky");
  });

  it("should select an object value by value property prop", async () => {
    const { rerender } = await renderSelect();
    await rerender({
      modelValue: { id: 2, label: "Option Becky", value: "becky" },
      valueProperty: "label",
      options: [
        { id: 1, label: "Option Alfred", value: "alfred" },
        { id: 2, label: "Option Becky", value: "becky" },
        { id: 3, label: "Option C", value: "c" },
      ],
    });

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("Option Becky");
  });

  it("should use fallback property from an array of label properties", async () => {
    const { rerender } = await renderSelect();
    await rerender({
      modelValue: "user1",
      labelProperty: ["name", "username", "email"],
      options: [
        { id: 1, username: "User 1", email: "user1@example.com", value: "user1" },
        { id: 2, name: "User Two", username: "user2", value: "user2" },
        { id: 3, name: "", username: "", email: "user3@example.com", value: "user3" },
      ],
    });

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("User 1");
  });

  it("should search in all properties of the labelProperty array", async () => {
    const { rerender } = await renderSelect();
    await rerender({
      labelProperty: ["name", "username", "email"],
      options: [
        { id: 1, username: "user1", email: "user1@example.com", value: "user1" },
        { id: 2, name: "User Two", username: "user2", value: "user2" },
        { id: 3, name: "", username: "", email: "test@example.com", value: "user3" },
      ],
    });

    // Simulate a search
    await userEvent.type(screen.getByRole("textbox"), "test");

    // Check that the search found the item with 'test' in the email field
    expect(screen.getAllByTestId(/^mt-select-option--/)).toHaveLength(1);
    expect(screen.getByTestId("mt-select-option--user3")).toBeVisible();
  });

  it("displays a hint passed via the hint prop", async () => {
    await renderSelect({ props: { hint: "Hint from prop" } });

    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", async () => {
    await renderSelect({
      slots: { hint: '<span data-testid="custom-hint">Hint from slot</span>' },
    });

    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", async () => {
    const { container } = await renderSelect();

    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("should select the active item with the enter key", async () => {
    const { emitted } = render(MtSelect, {
      props: {
        modelValue: null,
        options: [
          { id: 1, label: "Option Alfred", value: "alfred" },
          { id: 2, label: "Option Becky", value: "becky" },
        ],
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(emitted("update:modelValue")[0]).toEqual(["becky"]);
    expect(screen.queryAllByTestId(/^mt-select-option--/)).toHaveLength(0);
  });

  it("should show the selected value as input value on focus and only filter after the user edits it", async () => {
    await renderSelect();
    const input = screen.getByRole("textbox");

    await userEvent.click(input);

    expect(input).toHaveValue("Option Becky");
    expect(input).not.toHaveAttribute("placeholder", "Option Becky");
    expect(screen.getAllByTestId(/^mt-select-option--/)).toHaveLength(3);

    await userEvent.keyboard("{Backspace}");

    expect(input).toHaveValue("Option Beck");
    expect(screen.getAllByTestId(/^mt-select-option--/)).toHaveLength(1);
    expect(screen.getByTestId("mt-select-option--becky")).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await userEvent.click(input);

    expect(input).toHaveValue("Option Becky");
    expect(screen.getAllByTestId(/^mt-select-option--/)).toHaveLength(3);
  });

  it("should render a searchable input that opts out of autofill", async () => {
    await renderSelect();

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("data-1p-ignore");
    expect(input).toHaveAttribute("data-lpignore", "true");
    expect(input).toHaveAttribute("data-bwignore");
    expect(input).not.toHaveAttribute("readonly");
  });

  it("should render a readonly input when search is disabled", async () => {
    await renderSelect({
      props: {
        enableSearch: false,
      },
    });

    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("associates the label with the input via the name attribute", async () => {
    await renderSelect({
      props: { label: "Date range" },
      attrs: { name: "date-range" },
    });

    expect(screen.getByRole("textbox", { name: "Date range" })).toHaveAttribute("id", "date-range");
  });

  it("associates the label with the input via a generated id when no name is given", async () => {
    await renderSelect({ props: { label: "Date range" } });

    expect(screen.getByRole("textbox", { name: "Date range" })).toHaveAttribute(
      "id",
      expect.stringMatching(/^mt-field--/),
    );
  });
});

describe("mt-select conditional hint", () => {
  const Host: FunctionalComponent<{ showHint?: boolean; hint?: string }> = (props) =>
    h(
      MtSelect,
      { options: [], hint: props.hint },
      props.showHint
        ? { hint: () => h("span", { "data-testid": "custom-hint" }, "Original value") }
        : undefined,
    );

  it("renders a hint slot added after mounting and removes it again", async () => {
    const { container, rerender } = render(Host);

    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("removes a hint slot that was present when mounting", async () => {
    const { container, rerender } = render(Host, { props: { showHint: true } });

    expect(screen.getByTestId("custom-hint")).toBeVisible();

    await rerender({ showHint: false });
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("falls back to the hint prop when the slot is removed", async () => {
    const { rerender } = render(Host, { props: { hint: "Hint from prop" } });

    expect(screen.getByText("Hint from prop")).toBeVisible();

    await rerender({ showHint: true });
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.queryByText("Hint from prop")).not.toBeInTheDocument();

    await rerender({ showHint: false });
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });
});
