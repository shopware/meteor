import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import { waitFor } from "@testing-library/vue";
import MtCollapsible from "./mt-collapsible.vue";
import MtCollapsibleContent from "./mt-collapsible-content.vue";
import MtCollapsibleTrigger from "./mt-collapsible-trigger.vue";

function renderCollapsible(rootProps: Record<string, unknown> = {}) {
  return render(MtCollapsible, {
    props: rootProps,
    slots: {
      default: `
        <mt-collapsible-trigger>Toggle</mt-collapsible-trigger>
        <mt-collapsible-content>Collapsible content</mt-collapsible-content>
      `,
    },
    global: {
      components: {
        MtCollapsibleTrigger,
        MtCollapsibleContent,
      },
    },
  });
}

describe("mt-collapsible", () => {
  it("is open by default when `defaultOpen` is true", async () => {
    // ARRANGE
    renderCollapsible({ defaultOpen: true });

    // ASSERT
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });
    expect(screen.getByText("Collapsible content")).toBeVisible();
  });

  it("does not open when disabled", async () => {
    // ARRANGE
    renderCollapsible({ disabled: true });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));

    // ASSERT
    expect(screen.getByRole("button", { name: "Toggle" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("Collapsible content")).not.toBeVisible();
  });

  it("can be controlled externally with `v-model:open`", async () => {
    // ARRANGE
    render({
      components: {
        MtCollapsible,
        MtCollapsibleTrigger,
        MtCollapsibleContent,
      },
      data() {
        return {
          open: false,
        };
      },
      template: `
        <mt-collapsible :open="open" @update:open="(value) => (open = value)">
          <mt-collapsible-trigger>Toggle</mt-collapsible-trigger>
          <mt-collapsible-content>Collapsible content</mt-collapsible-content>
        </mt-collapsible>
      `,
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));

    // ASSERT
    expect(screen.getByText("Collapsible content")).toBeVisible();

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));

    // ASSERT
    expect(screen.getByText("Collapsible content")).not.toBeVisible();
  });

  it("keeps content mounted when `keepMounted` is true", () => {
    // ARRANGE
    const { container } = renderCollapsible();

    // ASSERT
    const content = container.querySelector(".mt-collapsible-content");
    expect(content).toBeInTheDocument();
  });

  it("unmounts content when `keepMounted` is false", () => {
    // ARRANGE
    const { container } = renderCollapsible({ keepMounted: false });
    const content = container.querySelector(".mt-collapsible-content");

    // ASSERT
    expect(content).toHaveAttribute("hidden", "");
    expect(screen.queryByText("Collapsible content")).not.toBeInTheDocument();
  });
});
