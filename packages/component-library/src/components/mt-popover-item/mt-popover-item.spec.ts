import { render, screen, waitFor } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MtPopoverItem from "./mt-popover-item.vue";

function renderPopoverItem(props: Record<string, unknown> = {}) {
  return render(MtPopoverItem, {
    props: {
      label: "Test label",
      ...props,
    },
  });
}

describe("mt-popover-item", () => {
  it("should render the component", () => {
    renderPopoverItem();

    expect(screen.getByRole("menuitem")).toBeInTheDocument();
  });

  it("should render the component with default styling", () => {
    const { container } = renderPopoverItem();

    expect(container.firstElementChild).toHaveClass("mt-popover-item--default");
    expect(container.firstElementChild).not.toHaveClass("mt-popover-item--critical");
  });

  it("should render the component with critical styling", () => {
    const { container } = renderPopoverItem({
      type: "critical",
    });

    expect(container.firstElementChild).not.toHaveClass("mt-popover-item--default");
    expect(container.firstElementChild).toHaveClass("mt-popover-item--critical");
  });

  it("should show the checkbox", () => {
    renderPopoverItem({
      showCheckbox: true,
    });

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should show the checkbox with checked value", () => {
    renderPopoverItem({
      showCheckbox: true,
      checkboxChecked: true,
    });

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("should show the checkbox with no checked value", () => {
    renderPopoverItem({
      showCheckbox: true,
      checkboxChecked: false,
    });

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should show the checkbox with partial checked value", () => {
    renderPopoverItem({
      showCheckbox: true,
      checkboxPartial: true,
    });

    expect(screen.getByRole("checkbox")).toBePartiallyChecked();

    expect(screen.getByTestId("mt-icon__solid-minus-xs")).toBeInTheDocument();
    expect(screen.queryByTestId("mt-icon__solid-checkmark-xs")).not.toBeInTheDocument();
  });

  it("should show the checkbox with full checked value", () => {
    renderPopoverItem({
      showCheckbox: true,
      checkboxPartial: false,
    });

    expect(screen.queryByTestId("mt-icon__solid-minus-xs")).not.toBeInTheDocument();
    expect(screen.getByTestId("mt-icon__solid-checkmark-xs")).toBeInTheDocument();
  });

  it("should emit change-checkbox with true value when clicking on the checkbox", async () => {
    const { emitted } = renderPopoverItem({
      showCheckbox: true,
      checkboxChecked: false,
    });

    await userEvent.click(screen.getByRole("checkbox"));

    await waitFor(() => expect(emitted()["change-checkbox"]).toStrictEqual([[true]]));
  });

  it("should emit change-checkbox with false value when clicking on the checkbox", async () => {
    const { emitted } = renderPopoverItem({
      showCheckbox: true,
      checkboxChecked: true,
    });

    await userEvent.click(screen.getByRole("checkbox"));

    await waitFor(() => expect(emitted()["change-checkbox"]).toStrictEqual([[false]]));
  });

  it("should render no icon", () => {
    renderPopoverItem();

    expect(screen.queryByTestId(/^mt-icon__/)).not.toBeInTheDocument();
  });

  it("should render the icon", () => {
    renderPopoverItem({
      icon: "solid-sidebar-overlay",
    });

    expect(screen.getByTestId("mt-icon__solid-sidebar-overlay")).toBeInTheDocument();
  });

  it("should render the label", () => {
    renderPopoverItem();

    expect(screen.getByRole("menuitem", { name: "Test label" })).toBeInTheDocument();
  });

  it("should render the label with different text", async () => {
    const { rerender } = renderPopoverItem();

    await rerender({
      label: "Another test label",
    });

    expect(screen.getByRole("menuitem", { name: "Another test label" })).toBeInTheDocument();
  });

  it("should execute the method in property onLabelClick when user clicks on label", async () => {
    const onLabelClick = vi.fn();

    renderPopoverItem({
      onLabelClick,
    });

    await userEvent.click(screen.getByRole("menuitem", { name: "Test label" }));

    await waitFor(() => expect(onLabelClick).toHaveBeenCalled());
  });

  it("should render the metaCopy", () => {
    renderPopoverItem({
      metaCopy: "Test metaCopy",
    });

    expect(screen.getByText("Test metaCopy")).toBeInTheDocument();
  });

  it("should render the metaCopy with different text", () => {
    renderPopoverItem({
      metaCopy: "Another test metaCopy",
    });

    expect(screen.getByText("Another test metaCopy")).toBeInTheDocument();
  });

  it("should render the contextual detail", () => {
    renderPopoverItem({
      contextualDetail: "Test contextualDetail",
    });

    expect(screen.getByText("Test contextualDetail")).toBeInTheDocument();
  });

  it("should render the contextual detail with different text", () => {
    renderPopoverItem({
      contextualDetail: "Another test contextualDetail",
    });

    expect(screen.getByText("Another test contextualDetail")).toBeInTheDocument();
  });

  it("should render the shortcut text", () => {
    renderPopoverItem({
      shortcut: "Test shortcut",
    });

    expect(screen.getByText("Test shortcut")).toBeInTheDocument();
  });

  it("should show the switch", () => {
    renderPopoverItem({
      showSwitch: true,
    });

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should show the switch with checked value", () => {
    renderPopoverItem({
      showSwitch: true,
      switchValue: true,
    });

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("should show the switch with no checked value", () => {
    renderPopoverItem({
      showSwitch: true,
      switchValue: false,
    });

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should not show a switch field", () => {
    renderPopoverItem();

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("should emit change-switch with true value when clicking on the switch input", async () => {
    const { emitted } = renderPopoverItem({
      showSwitch: true,
      switchValue: false,
    });

    await userEvent.click(screen.getByRole("checkbox"));

    await waitFor(() => expect(emitted()["change-switch"]).toStrictEqual([[true]]));
  });

  it("should emit change-switch with false value when clicking on the switch input", async () => {
    const { emitted } = renderPopoverItem({
      showSwitch: true,
      switchValue: true,
    });

    await userEvent.click(screen.getByRole("checkbox"));

    await waitFor(() => expect(emitted()["change-switch"]).toStrictEqual([[false]]));
  });

  it("should show visibility", () => {
    renderPopoverItem({
      showVisibility: true,
    });

    expect(screen.getByTestId(/^mt-icon__solid-eye/)).toBeInTheDocument();
  });

  it("should not show visibility", () => {
    renderPopoverItem({
      showVisibility: false,
    });

    expect(screen.queryByTestId(/^mt-icon__solid-eye/)).not.toBeInTheDocument();
  });

  it("should show visibility with visible status", () => {
    renderPopoverItem({
      showVisibility: true,
      visible: true,
    });

    expect(screen.getByTestId("mt-icon__solid-eye")).toBeInTheDocument();
    expect(screen.queryByTestId("mt-icon__solid-eye-slash")).not.toBeInTheDocument();
  });

  it("should show visibility with invisible status", () => {
    renderPopoverItem({
      showVisibility: true,
      visible: false,
    });

    expect(screen.queryByTestId("mt-icon__solid-eye")).not.toBeInTheDocument();
    expect(screen.getByTestId("mt-icon__solid-eye-slash")).toBeInTheDocument();
  });

  it("should emit change-visibility with true value when clicking on the visibility", async () => {
    const { emitted } = renderPopoverItem({
      showVisibility: true,
      visible: false,
    });

    await userEvent.click(screen.getByTestId("mt-icon__solid-eye-slash"));

    expect(emitted()["change-visibility"]).toStrictEqual([[true]]);
  });

  it("should emit change-visibility with false value when clicking on the visibility", async () => {
    const { emitted } = renderPopoverItem({
      showVisibility: true,
      visible: true,
    });

    await userEvent.click(screen.getByTestId("mt-icon__solid-eye"));

    expect(emitted()["change-visibility"]).toStrictEqual([[false]]);
  });

  it("should show options", () => {
    renderPopoverItem({
      showOptions: true,
    });

    expect(screen.getByTestId("mt-icon__solid-chevron-right-s")).toBeInTheDocument();
  });

  it("should not show options", () => {
    renderPopoverItem({
      showOptions: false,
    });

    expect(screen.queryByTestId("mt-icon__solid-chevron-right-s")).not.toBeInTheDocument();
  });

  it("should show no options count", () => {
    renderPopoverItem({
      showOptions: true,
    });

    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it("should show the correct options count", () => {
    renderPopoverItem({
      showOptions: true,
      optionsCount: 5,
    });

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should show the correct options count with different value", () => {
    renderPopoverItem({
      showOptions: true,
      optionsCount: 42,
    });

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("should emit click-options when clicking on the options", async () => {
    const { emitted } = renderPopoverItem({
      showOptions: true,
    });

    await userEvent.click(screen.getByTestId("mt-icon__solid-chevron-right-s"));

    expect(emitted()["click-options"]).toBeTruthy();
  });

  it("should show the borderTop", () => {
    const { container } = renderPopoverItem({
      borderTop: true,
    });

    expect(container.firstElementChild).toHaveClass("mt-popover-item--border-top");
    expect(container.firstElementChild).not.toHaveClass("mt-popover-item--border-bottom");
  });

  it("should show the borderBottom", () => {
    const { container } = renderPopoverItem({
      borderBottom: true,
    });

    expect(container.firstElementChild).not.toHaveClass("mt-popover-item--border-top");
    expect(container.firstElementChild).toHaveClass("mt-popover-item--border-bottom");
  });

  it("should show both borders", () => {
    const { container } = renderPopoverItem({
      borderTop: true,
      borderBottom: true,
    });

    expect(container.firstElementChild).toHaveClass("mt-popover-item--border-top");
    expect(container.firstElementChild).toHaveClass("mt-popover-item--border-bottom");
  });

  it("should show no borders", () => {
    const { container } = renderPopoverItem();

    expect(container.firstElementChild).not.toHaveClass("mt-popover-item--border-top");
    expect(container.firstElementChild).not.toHaveClass("mt-popover-item--border-bottom");
  });
});
